import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/api";
import { ImageIcon, Calendar, User, Package, Hash } from "lucide-react";

interface OrderDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: any[] | null; // Order array from Google Sheets
  product: any[] | null; // Product array from Google Sheets
}

export function OrderDetailModal({ isOpen, onClose, order, product }: OrderDetailModalProps) {
  if (!order || !product) return null;

  // Order structure: [order_id, user_id, seller_id, product_id, quantity, total_price, order_status, created_at, updated_at]
  const [orderId, buyerId, sellerId, productId, quantity, totalPrice, orderStatus, createdAt] = order;
  
  // Product structure: [product_id, user_id, product_name, image_url, description, price, stock, category, status, created_at, updated_at]
  const [, , productName, imageUrl, description, price] = product;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatStatus = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Menunggu';
      case 'confirmed':
        return 'Dikonfirmasi';
      case 'cancelled':
        return 'Dibatalkan';
      default:
        return status;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Detail Pesanan</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Info */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Hash className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">ID Pesanan:</span>
              <span className="font-mono text-sm">{orderId}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">Pembeli:</span>
              <span className="text-sm">{buyerId}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">Tanggal:</span>
              <span className="text-sm">{new Date(createdAt).toLocaleDateString('id-ID', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Package className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">Status:</span>
              <Badge className={getStatusColor(orderStatus)}>
                {formatStatus(orderStatus)}
              </Badge>
            </div>
          </div>

          {/* Product Info */}
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-3">Detail Produk</h3>
            <div className="flex space-x-4">
              <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                {imageUrl ? (
                  <img 
                    src={imageUrl.includes('drive.google.com/uc?') 
                      ? imageUrl.replace('uc?export=view&id=', 'thumbnail?id=').concat('&sz=w400-h400')
                      : imageUrl
                    } 
                    alt={productName} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                ) : null}
                <div className={`w-full h-full flex items-center justify-center ${imageUrl ? 'hidden' : ''}`}>
                  <ImageIcon className="h-6 w-6 text-gray-400" />
                </div>
              </div>
              
              <div className="flex-1">
                <h4 className="font-medium">{productName}</h4>
                <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                  {description || "Tidak ada deskripsi"}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Harga satuan: {formatPrice(price)}
                </p>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-3">Ringkasan Pesanan</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Jumlah</span>
                <span className="text-sm">{quantity} item</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Harga satuan</span>
                <span className="text-sm">{formatPrice(price)}</span>
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between">
                  <span className="font-semibold">Total</span>
                  <span className="font-semibold text-lg text-primary">{formatPrice(totalPrice)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Tutup
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}