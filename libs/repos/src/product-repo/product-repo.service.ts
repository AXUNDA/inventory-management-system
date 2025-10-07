import { Injectable } from '@nestjs/common';
import { PrismaService } from '@app/prisma';
import { Prisma } from 'generated/prisma';

@Injectable()
export class ProductRepoService {
  constructor(private readonly prisma: PrismaService) {}
  async findOne(dto: Prisma.ProductWhereUniqueInput) {
    return await this.prisma.product.findUnique({ where: dto });
  }
  async findAll(dto: Prisma.ProductWhereInput, skip?: number, take?: number) {
    return await this.prisma.product.findMany({ where: dto, skip, take });
  }
  async create(dto: Prisma.ProductCreateInput) {
    return await this.prisma.product.create({ data: dto });
  }
  async update(
    dto: Prisma.ProductWhereUniqueInput,
    data: Prisma.ProductUpdateInput,
  ) {
    return await this.prisma.product.update({ where: dto, data });
  }
}
