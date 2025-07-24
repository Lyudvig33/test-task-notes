import { Module } from '@nestjs/common';
import { SharedLinksService } from './shared-links.service';
import { SharedLinksController } from './shared-links.controller';

@Module({
  controllers: [SharedLinksController],
  providers: [SharedLinksService],
})
export class SharedLinksModule {}
