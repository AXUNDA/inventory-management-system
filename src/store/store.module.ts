import { Module } from '@nestjs/common';
import { StoreService } from './store.service';
import { StoreController } from './store.controller';
import { ReposModule } from '@app/repos';
import { BullModule } from '@nestjs/bullmq';
import { CreatePurchaseOrderProcessor } from './purchase-order.proccessor';

@Module({
  providers: [StoreService, CreatePurchaseOrderProcessor],
  controllers: [StoreController],
  imports: [
    ReposModule,
    BullModule.registerQueue({
      name: 'purchase-order',
    }),
  ],
})
export class StoreModule {}
