import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import type { AuthenticatedRequest } from '../common/types';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const token = this.extractToken(request);

    if (!token) {
      throw new UnauthorizedException('No authentication token provided');
    }

    try {
      const payload = await this.authService.verifyToken(token);
      request.user = {
        id: payload.sub,
        email: payload.email,
        plan: payload.plan,
        creditsRemaining: 0,
        byokOpenaiKey: null,
        byokAnthropicKey: null,
        name: '',
      };
      return true;
    } catch (err) {
      if (err instanceof UnauthorizedException) throw err;
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  private extractToken(request: AuthenticatedRequest): string | undefined {
    const authHeader = request.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
      return authHeader.slice(7);
    }

    const cookie = request.headers.cookie;
    if (cookie) {
      const match = cookie.match(/access_token=([^;]+)/);
      if (match) return match[1];
    }

    return undefined;
  }
}
