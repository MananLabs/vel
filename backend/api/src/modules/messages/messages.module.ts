import { Module, forwardRef } from '@nestjs/common';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { MessagesRepository } from './messages.repository';
import { TilesModule } from '../tiles/tiles.module';
import { WorkspaceModule } from '../workspace/workspace.module';

@Module({
  imports: [forwardRef(() => TilesModule), WorkspaceModule],
  controllers: [MessagesController],
  providers: [MessagesService, MessagesRepository],
  exports: [MessagesService, MessagesRepository],
})
export class MessagesModule {}
