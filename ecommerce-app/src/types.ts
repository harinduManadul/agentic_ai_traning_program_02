export interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  description: string;
}

export interface Offer {
  id: number;
  productId: number;
  productName: string;
  originalPrice: number;
  discountPercentage: number;
  startDate: string;
  endDate: string;
}

export interface CartItemData {
  id: number;
  productId: number;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: number;
  totalAmount: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered';
  createdAt: string;
}

export interface AdminOrder extends Order {
  userId: number;
  userName: string;
  userEmail: string;
}

export interface User {
  id: number;
  email: string;
  name: string;
  role: 'admin' | 'customer';
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface OrderConfirmation {
  orderId: number;
  message: string;
}
