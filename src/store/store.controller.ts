import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { StoreService } from './store.service';
import { GetCurrentUser } from 'src/auth/decorators/getUser.decorator';
import { Prisma, User } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AdjustQuantityDto } from './dto/adjust-quantity-dto';
@UseGuards(JwtAuthGuard)
@Controller('store')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}
  @Get('products')
  async getProducts(
    @GetCurrentUser() user: User,
    @Query() query: Prisma.ProductWhereInput,
  ) {
    return this.storeService.getProducts(user, query);
  }
  @Get('warehouses')
  async getWarehouses(@GetCurrentUser() user: User) {
    return this.storeService.getWarehouses(user);
  }
  @Get('products/:productId')
  async getProductById(
    @GetCurrentUser() user: User,
    @Param('productId') productId: string,
  ) {
    return this.storeService.getProductById(productId, user);
  }
  @Patch('products/:productId/adjustQuantity')
  async adjustProductQuantity(
    @GetCurrentUser() user: User,
    @Param('productId') productId: string,
    @Body() body: AdjustQuantityDto,
  ) {
    return this.storeService.adjustProductQuantity(
      productId,
      body.quantityChange,
      user,
    );
  }
  @Get('purchase-orders')
  async getPurchaseOrders(@GetCurrentUser() user: User) {
    return this.storeService.getPurchaseOrders(user);
  }
  @Patch('purchase-orders/:orderId')
  async markOrderAsDelivered(
    @GetCurrentUser() user: User,
    @Param('orderId') orderId: string,
  ) {
    await this.storeService.markOrderAsDelivered(orderId, user);
  }
}
