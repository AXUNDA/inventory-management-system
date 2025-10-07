import { Injectable } from '@nestjs/common';
import { PrismaService } from '@app/prisma';
import { Prisma } from 'generated/prisma';

@Injectable()
export class SupplierRepoService {
  constructor(private readonly prisma: PrismaService) {}
  async findOne(dto: Prisma.SupplierWhereUniqueInput) {
    return await this.prisma.supplier.findUnique({ where: dto });
  }
  async findAll(dto: Prisma.SupplierWhereInput, skip?: number, take?: number) {
    return await this.prisma.supplier.findMany({ where: dto, skip, take });
  }
  async create(dto: Prisma.SupplierCreateInput) {
    return await this.prisma.supplier.create({ data: dto });
  }
  async update(
    dto: Prisma.SupplierWhereUniqueInput,
    data: Prisma.SupplierUpdateInput,
  ) {
    return await this.prisma.supplier.update({ where: dto, data });
  }
  async delete(dto: Prisma.SupplierWhereUniqueInput) {
    return await this.prisma.supplier.delete({ where: dto });
  }
}
