import { BadRequestException, Injectable } from '@nestjs/common';
import {
  ProductRepoService,
  WarehouseRepoService,
  PurchaseOrderRepoService,
} from '@app/repos';
import { Prisma, User } from '@prisma/client';

import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';

@Injectable()
export class StoreService {
  constructor(
    private readonly productService: ProductRepoService,
    private readonly warehouseService: WarehouseRepoService,
    private readonly purchaseOrderService: PurchaseOrderRepoService,
    @InjectQueue('purchase-order') private purchaseOrderQueue: Queue,
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
  async markOrderAsDelivered(id: string, user: User) {
    const order = await this.purchaseOrderService.findOne({
      id,
      userId: user.id,
    });
    if (!order) {
      throw new Error('Purchase Order not found');
    }
    if (order?.status === 'DELIVERED') {
      throw new BadRequestException(
        'Purchase Order is already marked as delivered',
      );
    }

    const update = await this.purchaseOrderService.update(
      { id, userId: user.id },
      {
        status: 'DELIVERED',
      },
    );

    await this.productService.update(
      { id: order.productId, ownerId: user.id },
      {
        quantityInStock: {
          increment: order.quantity,
        },
      },
    );

    console.log({ update });
    return update;
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

    const update = await this.productService.update(
      { id, ownerId: user.id },
      {
        quantityInStock: {
          decrement: quantityChange,
        },
      },
    );
    if (update.quantityInStock <= update.reorderThreshold) {
      await this.purchaseOrderQueue.add('create-purchase-order', {
        productId: id,
        wareHouseId: update.wareHouseId,
        quantity: 200,
        userId: user.id,
        supplierId: product.supplierId,
      });
    }

    return update;

    // run queue job
  }
  async getPurchaseOrders(user: User) {
    return await this.purchaseOrderService.findAll({ userId: user.id });
  }
}
