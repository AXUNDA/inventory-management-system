import { Injectable } from '@nestjs/common';
import { PrismaService } from '@app/prisma';
import { Prisma } from '@prisma/client';

@Injectable()
export class PurchaseOrderRepoService {
  constructor(private readonly prisma: PrismaService) {}
  async findOne(dto: Prisma.PurchaseOrderWhereUniqueInput) {
    return await this.prisma.purchaseOrder.findUnique({ where: dto });
  }
  async findAll(
    dto: Prisma.PurchaseOrderWhereInput,
    skip?: number,
    take?: number,
  ) {
    return await this.prisma.purchaseOrder.findMany({ where: dto, skip, take });
  }
  async create(dto: Prisma.PurchaseOrderUncheckedCreateInput) {
    return await this.prisma.purchaseOrder.create({ data: dto });
  }
  async update(
    dto: Prisma.PurchaseOrderWhereUniqueInput,
    data: Prisma.PurchaseOrderUpdateInput,
  ) {
    return await this.prisma.purchaseOrder.update({ where: dto, data });
  }
  async delete(dto: Prisma.PurchaseOrderWhereUniqueInput) {
    return await this.prisma.purchaseOrder.delete({ where: dto });
  }
}
