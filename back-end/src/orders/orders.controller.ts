import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CreateOrderInput, OrdersService, UpdateCartOrderInput } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  createOrder(@Body() body: Partial<CreateOrderInput>) {
    return this.ordersService.createOrder({
      userId: body.userId?.trim() ?? '',
      medicineId: body.medicineId?.trim() ?? '',
      quantity: Number(body.quantity ?? 1),
    });
  }

  @Get('cart/:userId')
  getCartOrdersByUserId(@Param('userId') userId: string) {
    return this.ordersService.getCartOrdersByUserId(userId);
  }

  @Post('place/:userId')
  placeCartOrdersByUserId(@Param('userId') userId: string) {
    return this.ordersService.placeCartOrdersByUserId(userId);
  }

  @Get('history/:userId')
  getPlacedOrdersByUserId(@Param('userId') userId: string) {
    return this.ordersService.getPlacedOrdersByUserId(userId);
  }

  @Put('cart/:orderId')
  updateCartOrder(
    @Param('orderId') orderId: string,
    @Body() body: Partial<UpdateCartOrderInput>,
  ) {
    return this.ordersService.updateCartOrder({
      orderId,
      quantity: Number(body.quantity ?? 1),
    });
  }

  @Delete('cart/:orderId')
  removeCartOrder(@Param('orderId') orderId: string) {
    return this.ordersService.removeCartOrder(orderId);
  }
}
