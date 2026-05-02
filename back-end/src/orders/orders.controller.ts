import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { Roles } from '../common/decorators/roles.decorator';
import { CreateOrderInput, OrdersService, UpdateCartOrderInput } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Roles('patient', 'frontdesk')
  @Post()
  createOrder(@Body() body: Partial<CreateOrderInput>) {
    return this.ordersService.createOrder({
      userId: body.userId?.trim() ?? '',
      medicineId: body.medicineId?.trim() ?? '',
      quantity: Number(body.quantity ?? 1),
    });
  }

  @Roles('patient', 'frontdesk')
  @Get('cart/:userId')
  getCartOrdersByUserId(@Param('userId') userId: string) {
    return this.ordersService.getCartOrdersByUserId(userId);
  }

  @Roles('patient', 'frontdesk')
  @Post('place/:userId')
  placeCartOrdersByUserId(@Param('userId') userId: string) {
    return this.ordersService.placeCartOrdersByUserId(userId);
  }

  @Roles('patient', 'frontdesk')
  @Get('history/:userId')
  getPlacedOrdersByUserId(@Param('userId') userId: string) {
    return this.ordersService.getPlacedOrdersByUserId(userId);
  }

  @Roles('patient', 'frontdesk')
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

  @Roles('patient', 'frontdesk')
  @Delete('cart/:orderId')
  removeCartOrder(@Param('orderId') orderId: string) {
    return this.ordersService.removeCartOrder(orderId);
  }
}
