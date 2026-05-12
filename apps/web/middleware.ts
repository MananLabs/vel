import { NextResponse, type NextRequest } from 'next/server';

const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
const hasValidClerkKey = clerkKey && clerkKey.startsWith('pk_');

async function middleware(req: NextRequest) {
  // If no valid Clerk key, skip auth and pass through all requests
  if (!hasValidClerkKey) {
    return NextResponse.next();
  }

  // Dynamically import Clerk middleware only when key is available
  const { clerkMiddleware, createRouteMatcher } = await import(
    '@clerk/nextjs/server'
  );

  const isPublicRoute = createRouteMatcher([
    '/',
    '/sign-in(.*)',
    '/sign-up(.*)',
    '/api/webhooks(.*)',
  ]);

  return clerkMiddleware(async (auth, request) => {
    if (!isPublicRoute(request)) {
      await auth.protect();
    }
  })(req, {} as any);
}

export default middleware;

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
