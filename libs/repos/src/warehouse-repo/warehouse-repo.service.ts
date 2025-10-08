import { Injectable } from '@nestjs/common';
import { PrismaService } from '@app/prisma';
import { Prisma } from '@prisma/client';

@Injectable()
export class WarehouseRepoService {
  constructor(private readonly prisma: PrismaService) {}
  async findOne(dto: Prisma.WareHouseWhereUniqueInput) {
    return await this.prisma.wareHouse.findUnique({ where: dto });
  }
  async findAll(dto: Prisma.WareHouseWhereInput, skip?: number, take?: number) {
    return await this.prisma.wareHouse.findMany({ where: dto, skip, take });
  }
  async create(dto: Prisma.WareHouseCreateInput) {
    return await this.prisma.wareHouse.create({ data: dto });
  }
  async update(
    dto: Prisma.WareHouseWhereUniqueInput,
    data: Prisma.WareHouseUpdateInput,
  ) {
    return await this.prisma.wareHouse.update({ where: dto, data });
  }
  async delete(dto: Prisma.WareHouseWhereUniqueInput) {
    return await this.prisma.wareHouse.delete({ where: dto });
  }
}
