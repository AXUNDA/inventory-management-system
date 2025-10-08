import { Module } from '@nestjs/common';
import { StoreService } from './store.service';
import { StoreController } from './store.controller';
import { ReposModule } from '@app/repos';

@Module({
  providers: [StoreService],
  controllers: [StoreController],
  imports: [ReposModule],
})
export class StoreModule {}
