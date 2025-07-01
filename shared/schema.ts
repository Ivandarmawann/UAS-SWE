import { z } from "zod";

// User schemas based on Google Spreadsheet structure
export const insertUserSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
  fullName: z.string().min(1, "Nama lengkap wajib diisi"),
  nomorHp: z.string().optional(),
  jurusan: z.string().optional(),
  role: z.enum(["buyer", "seller"], {
    required_error: "Role wajib dipilih",
  }),
});

export const loginUserSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(1, "Password wajib diisi"),
});

// Product schemas based on Google Spreadsheet structure
export const insertProductSchema = z.object({
  product_name: z.string().min(1, "Nama produk wajib diisi"),
  description: z.string().optional(),
  price: z.number().min(0, "Harga harus lebih dari 0"),
  stock: z.number().min(0, "Stok tidak boleh negatif"),
  category: z.string().min(1, "Kategori wajib diisi"),
  status: z.number().default(1),
  imageData: z.string().optional(),
  mimeType: z.string().optional(),
  fileName: z.string().optional(),
});

// Order schemas based on Google Spreadsheet structure
export const insertOrderSchema = z.object({
  product_id: z.string().min(1, "Product ID wajib"),
  seller_id: z.string().min(1, "Seller ID wajib"),
  quantity: z.number().min(1, "Quantity minimal 1"),
  total_price: z.number().min(0, "Total price tidak boleh negatif"),
});

// Type definitions
export type InsertUser = z.infer<typeof insertUserSchema>;
export type LoginUser = z.infer<typeof loginUserSchema>;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type InsertOrder = z.infer<typeof insertOrderSchema>;

// User type based on spreadsheet columns: [user_id, email, password, full_name, nomor_hp, jurusan, role, created_at, updated_at]
export interface User {
  userId: string;
  email: string;
  fullName: string;
  nomorHp?: string;
  jurusan?: string;
  role: "buyer" | "seller";
  createdAt: string;
  updatedAt: string;
}

// Product type based on spreadsheet columns: [product_id, user_id, product_name, image_url, description, price, stock, category, status, created_at, updated_at]
export interface Product {
  productId: string;
  userId: string;
  productName: string;
  imageUrl?: string;
  description?: string;
  price: number;
  stock: number;
  category: string;
  status: number;
  createdAt: string;
  updatedAt: string;
}

// Order type based on spreadsheet columns: [order_id, user_id, seller_id, product_id, quantity, total_price, order_status, created_at, updated_at]
export interface Order {
  orderId: string;
  userId: string;
  sellerId: string;
  productId: string;
  quantity: number;
  totalPrice: number;
  orderStatus: string;
  createdAt: string;
  updatedAt: string;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  userId?: string;
  role?: string;
  redirect?: string;
  product_id?: string;
  order_id?: string;
}
