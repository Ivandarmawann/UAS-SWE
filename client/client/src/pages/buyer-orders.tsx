import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useAuth } from "@/lib/auth";
import { makeAPICall, formatPrice } from "@/lib/api";
import { ArrowLeft, Package, Eye } from "lucide-react";
import { Link } from "wouter";
import { OrderDetailModal } from "@/components/order-detail-modal";

export default function BuyerOrders() {
  const { user } = useAuth();
  const [selectedOrder, setSelectedOrder] = useState<any[] | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<any[] | null>(null);

  const { data: ordersResponse, isLoading: ordersLoading, refetch: refetchOrders } = useQuery({
    queryKey: ['/api/orders', user?.email],
    queryFn: async () => {
      if (!user) return { success: false, data: [] };
      return makeAPICall({
        email: user.email,
        action: 'read'
      }, 'orders');
    },
    enabled: !!user,
  });

  const { data: productsResponse, isLoading: productsLoading } = useQuery({
    queryKey: ['/api/products'],
    queryFn: async () => {
      if (!user) return { success: false, data: [] };
      return makeAPICall({
        email: user.email,
        action: 'read'
      }, 'products');
    },
    enabled: !!user,
  });

  const orders = ordersResponse?.success ? ordersResponse.data : [];
  const products = productsResponse?.success ? productsResponse.data : [];

  // Filter orders for current buyer
  const buyerOrders = orders.filter((order: any[]) => order[1] === user?.email);

  const getOrderStatus = (status: string) => {
    switch (status) {
      case 'pending':
        return { text: 'Menunggu Konfirmasi', variant: 'default' as const };
      case 'confirmed':
        return { text: 'Dikonfirmasi', variant: 'default' as const };
      case 'rejected':
        return { text: 'Ditolak', variant: 'destructive' as const };
      case 'completed':
        return { text: 'Selesai', variant: 'default' as const };
      default:
        return { text: 'Menunggu Konfirmasi', variant: 'default' as const };
    }
  };

  const getProductById = (productId: string) => {
    return products.find((product: any[]) => product[0] === productId);
  };

  const handleViewDetail = (order: any[]) => {
    const product = getProductById(order[3]);
    setSelectedOrder(order);
    setSelectedProduct(product || null);
  };

  if (ordersLoading || productsLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/buyer">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Pesanan Saya</h1>
      </div>

      {/* Orders List */}
      {buyerOrders.length === 0 ? (
        <div className="text-center py-12">
          <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Belum Ada Pesanan
          </h3>
          <p className="text-gray-600 mb-4">
            Anda belum melakukan pemesanan apapun
          </p>
          <Link href="/buyer">
            <Button>
              Mulai Belanja
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {buyerOrders.map((order: any[]) => {
            const product = getProductById(order[3]);
            const status = getOrderStatus(order[6]);
            
            return (
              <Card key={order[0]} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">
                        Order #{order[0].slice(0, 8)}...
                      </CardTitle>
                      <p className="text-sm text-gray-600 mt-1">
                        {new Date(order[7]).toLocaleDateString('id-ID', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <Badge variant={status.variant}>
                      {status.text}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      {product ? (
                        <div className="flex items-center gap-4">
                          {product[3] && (
                            <img
                              src={product[3].replace('/uc?export=view&id=', '/thumbnail?id=').replace(/&.+/, '&sz=w80-h80')}
                              alt={product[2]}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                          )}
                          <div>
                            <h4 className="font-medium text-gray-900">{product[2]}</h4>
                            <p className="text-sm text-gray-600">
                              {order[4]} x {formatPrice(product[5])}
                            </p>
                            <p className="text-lg font-semibold text-green-600">
                              Total: {formatPrice(order[5])}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <h4 className="font-medium text-gray-900">Produk tidak ditemukan</h4>
                          <p className="text-sm text-gray-600">
                            Qty: {order[4]} | Total: {formatPrice(order[5])}
                          </p>
                        </div>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDetail(order)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Detail
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Order Detail Modal */}
      <OrderDetailModal
        isOpen={!!selectedOrder}
        onClose={() => {
          setSelectedOrder(null);
          setSelectedProduct(null);
        }}
        order={selectedOrder}
        product={selectedProduct}
      />
    </div>
  );
}