import { Injectable } from '@nestjs/common';
import { PrismaService } from '@app/prisma';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserRepoService {
  constructor(private readonly prisma: PrismaService) {}
  async findOne(dto: Prisma.UserWhereUniqueInput) {
    return await this.prisma.user.findUnique({ where: dto });
  }
}
