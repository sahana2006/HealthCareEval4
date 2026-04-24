import { BadRequestException, Injectable } from '@nestjs/common';
import { MedicinesService } from '../medicines/medicines.service';

export type OrderStatus = 'cart' | 'placed';

export type Order = {
  id: string;
  userId: string;
  medicineId: string;
  quantity: number;
  status: OrderStatus;
};

export type CreateOrderInput = {
  userId: string;
  medicineId: string;
  quantity: number;
};

export type UpdateCartOrderInput = {
  orderId: string;
  quantity: number;
};

@Injectable()
export class OrdersService {
  private readonly orders: Order[] = [];

  constructor(private readonly medicinesService: MedicinesService) {}

  createOrder(input: CreateOrderInput) {
    if (!input.userId || !input.medicineId || input.quantity <= 0) {
      throw new BadRequestException('userId, medicineId and quantity are required');
    }

    const medicine = this.medicinesService.findById(input.medicineId);
    if (!medicine) {
      throw new BadRequestException('Medicine not found');
    }

    const existingOrder = this.orders.find(
      (item) =>
        item.userId === input.userId &&
        item.medicineId === input.medicineId &&
        item.status === 'cart',
    );

    if (existingOrder) {
      existingOrder.quantity += input.quantity;
      return this.toOrderDetails(existingOrder);
    }

    const order: Order = {
      id: `ORD${Date.now()}`,
      userId: input.userId,
      medicineId: input.medicineId,
      quantity: input.quantity,
      status: 'cart',
    };

    this.orders.unshift(order);
    return this.toOrderDetails(order);
  }

  getCartOrdersByUserId(userId: string) {
    return this.orders
      .filter((item) => item.userId === userId && item.status === 'cart')
      .map((item) => this.toOrderDetails(item));
  }

  placeCartOrdersByUserId(userId: string) {
    const cartOrders = this.orders.filter(
      (item) => item.userId === userId && item.status === 'cart',
    );

    cartOrders.forEach((item) => {
      item.status = 'placed';
    });

    return cartOrders.map((item) => this.toOrderDetails(item));
  }

  getPlacedOrdersByUserId(userId: string) {
    return this.orders
      .filter((item) => item.userId === userId && item.status === 'placed')
      .map((item) => this.toOrderDetails(item));
  }

  updateCartOrder(input: UpdateCartOrderInput) {
    if (!input.orderId || input.quantity <= 0) {
      throw new BadRequestException('orderId and a positive quantity are required');
    }

    const order = this.orders.find(
      (item) => item.id === input.orderId && item.status === 'cart',
    );
    if (!order) {
      throw new BadRequestException('Cart item not found');
    }

    order.quantity = input.quantity;
    return this.toOrderDetails(order);
  }

  removeCartOrder(orderId: string) {
    const orderIndex = this.orders.findIndex(
      (item) => item.id === orderId && item.status === 'cart',
    );
    if (orderIndex === -1) {
      throw new BadRequestException('Cart item not found');
    }

    const [removedOrder] = this.orders.splice(orderIndex, 1);
    return this.toOrderDetails(removedOrder);
  }

  private toOrderDetails(order: Order) {
    const medicine = this.medicinesService.findById(order.medicineId);
    if (!medicine) {
      throw new BadRequestException('Medicine not found');
    }

    return {
      ...order,
      medicine,
      totalPrice: Number((medicine.price * order.quantity).toFixed(2)),
    };
  }
}
