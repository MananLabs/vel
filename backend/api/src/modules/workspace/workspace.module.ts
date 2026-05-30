import { Module } from '@nestjs/common';
import { WorkspaceController } from './workspace.controller';
import { WorkspaceService } from './workspace.service';
import { WorkspacesRepository } from './workspaces.repository';

@Module({
  controllers: [WorkspaceController],
  providers: [WorkspaceService, WorkspacesRepository],
  exports: [WorkspaceService, WorkspacesRepository],
})
export class WorkspaceModule {}
