import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import {
  PurchaseOrderRepoService,
  ProductRepoService,
  WarehouseRepoService,
} from '@app/repos';

@Processor('purchase-order')
export class CreatePurchaseOrderProcessor extends WorkerHost {
  constructor(
    private readonly purchaseOrderService: PurchaseOrderRepoService,
    private readonly productService: ProductRepoService,
    private readonly warehouseService: WarehouseRepoService,
  ) {
    super();
  }
  async process(job: Job<any, any, string>): Promise<any> {
    try {
      switch (job.name) {
        case 'create-purchase-order':
          const threeDaysFromNow = new Date();
          threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
          const [wareHouse, numberOfProductsInWarehouse] = await Promise.all([
            this.warehouseService.findOne({ id: job.data.wareHouseId }),
            this.productService.sumProductsInWarehouse({
              wareHouseId: job.data.wareHouseId,
            }),
          ]);
          await this.purchaseOrderService.create({
            productId: job.data.productId,
            wareHouseId: job.data.wareHouseId,
            quantity:
              wareHouse.capacity <
              numberOfProductsInWarehouse._sum.quantityInStock +
                job.data.quantity
                ? wareHouse.capacity -
                  numberOfProductsInWarehouse._sum.quantityInStock
                : job.data.quantity,
            userId: job.data.userId,
            supplierId: job.data.supplierId,
            expectedArrivalDate: threeDaysFromNow,
          });

          break;

        default:
          break;
      }
    } catch (error) {
      console.log(error);
    }
  }
}
