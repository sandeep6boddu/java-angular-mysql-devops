import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface OrderRequestDto {
    customerName: string;
    customerEmail: string;
    shippingAddress: string;
    items: { productId: number; quantity: number }[];
}

export interface OrderResponse {
    id: number;
    customerName: string;
    customerEmail: string;
    shippingAddress: string;
    totalAmount: number;
    orderDate: string;
    items: any[];
}

@Injectable({
    providedIn: 'root'
})
export class OrderService {
    private apiUrl = 'http://localhost:8080/api/orders';

    constructor(private http: HttpClient) { }

    createOrder(order: OrderRequestDto): Observable<OrderResponse> {
        return this.http.post<OrderResponse>(this.apiUrl, order);
    }

    getAllOrders(): Observable<OrderResponse[]> {
        return this.http.get<OrderResponse[]>(this.apiUrl);
    }

    deleteOrder(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
