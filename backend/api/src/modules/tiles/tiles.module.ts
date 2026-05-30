import { Module, forwardRef } from '@nestjs/common';
import { TilesController } from './tiles.controller';
import { TilesService } from './tiles.service';
import { TilesRepository } from './tiles.repository';
import { MessagesModule } from '../messages/messages.module';
import { WorkspaceModule } from '../workspace/workspace.module';

@Module({
  imports: [forwardRef(() => MessagesModule), WorkspaceModule],
  controllers: [TilesController],
  providers: [TilesService, TilesRepository],
  exports: [TilesService, TilesRepository],
})
export class TilesModule {}
