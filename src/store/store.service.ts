import { BadRequestException, Injectable } from '@nestjs/common';
import {
  ProductRepoService,
  WarehouseRepoService,
  PurchaseOrderRepoService,
} from '@app/repos';
import { Prisma, User } from '@prisma/client';

@Injectable()
export class StoreService {
  constructor(
    private readonly productService: ProductRepoService,
    private readonly warehouseService: WarehouseRepoService,
    private readonly purchaseOrderService: PurchaseOrderRepoService,
  ) {}

  async getProducts(user: User, where: Prisma.ProductWhereInput) {
    return await this.productService.findAll({ ownerId: user.id, ...where });
  }
  async getWarehouses(user: User) {
    return this.warehouseService.findAll({ userId: user.id });
  }

  async getProductById(productId: string, user: User) {
    return this.productService.findOne({ id: productId, ownerId: user.id });
  }
  async adjustProductQuantity(id: string, quantityChange: number, user: User) {
    const product = await this.productService.findOne({ id, ownerId: user.id });
    if (!product) {
      throw new Error('Product not found');
    }
    const updatedQuantity = product.quantityInStock - quantityChange;
    if (updatedQuantity < 0) {
      throw new BadRequestException('Cannot adjust quantity below zero');
    }
    await this.productService.update(
      { id, ownerId: user.id },
      {
        quantityInStock: {
          decrement: quantityChange,
        },
      },
    );

    // run queue job
  }
  async getPurchaseOrders(user: User) {
    return await this.purchaseOrderService.findAll({ userId: user.id });
  }
  async markOrderAsDelivered(id: string, user: User) {
    const order = await this.purchaseOrderService.findOne({
      id,
      userId: user.id,
    });
    if (!order) {
      throw new Error('Purchase Order not found');
    }
    await this.purchaseOrderService.update(
      { id, userId: user.id },
      {
        status: 'DELIVERED',
      },
    );

    // run queue job
  }
}
