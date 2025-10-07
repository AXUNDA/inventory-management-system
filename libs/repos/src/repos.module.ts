import { Module } from '@nestjs/common';

import { UserRepoService } from './user-repo/user-repo.service';
import { WarehouseRepoService } from './warehouse-repo/warehouse-repo.service';
import { SupplierRepoService } from './supplier-repo/supplier-repo.service';
import { ProductRepoService } from './product-repo/product-repo.service';
import { PurchaseOrderRepoService } from './purchase-order-repo/purchase-order-repo.service';
import { PrismaModule } from '@app/prisma';

@Module({
  providers: [
    UserRepoService,
    WarehouseRepoService,
    SupplierRepoService,
    ProductRepoService,
    PurchaseOrderRepoService,
  ],
  exports: [
    UserRepoService,
    WarehouseRepoService,
    SupplierRepoService,
    ProductRepoService,
    PurchaseOrderRepoService,
  ],
  imports: [PrismaModule],
})
export class ReposModule {}
