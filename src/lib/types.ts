export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  discountPrice: number | null;
  stock: number;
  images: string[];
  categoryName: string;
  vendorShopName: string;
  vendorId: number;
  isFeatured: boolean;
  isActive: boolean;
  totalSold: number;
  rating: number;
  createdAt: string;
  productType: "VENDOR" | "AFFILIATE";
  affiliateUrl: string | null;
  affiliateSource: string | null;
}

export interface CartItem {
  cartItemId: number;
  productId: number;
  productName: string;
  productImage: string | null;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface Cart {
  cartId: number;
  items: CartItem[];
  totalAmount: number;
  totalItems: number;
}

export interface OrderItem {
  productId: number;
  productName: string;
  vendorShopName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  commissionAmount: number;
  vendorEarning: number;
}

export interface Order {
  id: number;
  orderNumber: string;
  buyerName: string;
  buyerEmail: string;
  items: OrderItem[];
  totalAmount: number;
  platformCommission: number;
  vendorPayout: number;
  status: string;
  paymentStatus: string;
  shippingAddress: string;
  createdAt: string;
}

export interface VendorDashboard {
  shopName: string;
  plan: string;
  vendorStatus: string;
  totalEarnings: number;
  platformCommissionPaid: number;
  totalProducts: number;
  totalOrders: number;
  pendingOrders: number;
  thisMonthEarnings: number;
  recentOrders: {
    orderNumber: string;
    buyerName: string;
    amount: number;
    status: string;
    date: string;
  }[];
  topProducts: {
    productName: string;
    totalSold: number;
    revenue: number;
  }[];
}

export interface AdminDashboard {
  totalPlatformRevenue: number;
  thisMonthRevenue: number;
  subscriptionRevenue: number;
  commissionRevenue: number;
  totalVendors: number;
  activeVendors: number;
  pendingVendors: number;
  totalBuyers: number;
  totalOrders: number;
  totalProducts: number;
  totalGMV: number;
  topVendors: {
    shopName: string;
    plan: string;
    totalSales: number;
    commissionPaid: number;
    totalOrders: number;
  }[];
}

export interface Category {
  id: number;
  name: string;
  description: string;
  image: string | null;
}