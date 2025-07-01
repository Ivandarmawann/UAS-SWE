import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import { makeAPICall } from "@/lib/api";
import { Badge } from "@/components/ui/badge";

interface OrderStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: any[] | null; // Order array from Google Sheets
}

const orderStatusOptions = [
  { value: "pending", label: "Pending", color: "bg-yellow-500" },
  { value: "confirmed", label: "Confirmed", color: "bg-blue-500" },
  { value: "processing", label: "Processing", color: "bg-purple-500" },
  { value: "shipped", label: "Shipped", color: "bg-orange-500" },
  { value: "delivered", label: "Delivered", color: "bg-green-500" },
  { value: "cancelled", label: "Cancelled", color: "bg-red-500" },
];

export function OrderStatusModal({ isOpen, onClose, order }: OrderStatusModalProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedStatus, setSelectedStatus] = useState<string>(order?.[6] || "pending");

  if (!order) return null;

  const orderId = order[0];
  const buyerEmail = order[1];
  const sellerId = order[2];
  const productId = order[3];
  const quantity = order[4];
  const totalPrice = order[5];
  const currentStatus = order[6];
  const createdAt = order[7];

  const updateOrderMutation = useMutation({
    mutationFn: async (newStatus: string) => {
      const apiData = {
        email: user?.email,
        action: 'update',
        order_id: orderId,
        data: {
          order_status: newStatus,
        },
      };

      return makeAPICall(apiData, 'orders');
    },
    onSuccess: (response) => {
      if (response.success) {
        toast({
          title: "Status pesanan berhasil diupdate!",
          description: `Status pesanan diubah menjadi ${selectedStatus}`,
        });
        
        // Invalidate and refetch orders
        queryClient.invalidateQueries({ queryKey: ['/api/orders'] });
        onClose();
      } else {
        toast({
          title: "Gagal mengupdate status pesanan",
          description: response.error || "Terjadi kesalahan",
          variant: "destructive",
        });
      }
    },
    onError: () => {
      toast({
        title: "Gagal mengupdate status pesanan",
        description: "Terjadi kesalahan koneksi",
        variant: "destructive",
      });
    },
  });

  const handleUpdateStatus = () => {
    if (selectedStatus === currentStatus) {
      toast({
        title: "Status tidak berubah",
        description: "Pilih status yang berbeda untuk mengupdate",
        variant: "destructive",
      });
      return;
    }

    updateOrderMutation.mutate(selectedStatus);
  };

  const getCurrentStatusBadge = (status: string) => {
    const statusOption = orderStatusOptions.find(opt => opt.value === status);
    return (
      <Badge className={`${statusOption?.color || 'bg-gray-500'} text-white`}>
        {statusOption?.label || status}
      </Badge>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update Status Pesanan</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-600">Order ID:</span>
              <p className="font-mono text-xs break-all">{orderId}</p>
            </div>
            <div>
              <span className="font-medium text-gray-600">Pembeli:</span>
              <p>{buyerEmail}</p>
            </div>
            <div>
              <span className="font-medium text-gray-600">Jumlah:</span>
              <p>{quantity} item</p>
            </div>
            <div>
              <span className="font-medium text-gray-600">Total:</span>
              <p>Rp {totalPrice?.toLocaleString('id-ID')}</p>
            </div>
          </div>

          <div>
            <span className="font-medium text-gray-600">Status Saat Ini:</span>
            <div className="mt-1">
              {getCurrentStatusBadge(currentStatus)}
            </div>
          </div>

          <div>
            <span className="font-medium text-gray-600">Status Baru:</span>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Pilih status baru" />
              </SelectTrigger>
              <SelectContent>
                {orderStatusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${option.color}`}></div>
                      {option.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 pt-4">
            <Button 
              onClick={handleUpdateStatus}
              disabled={updateOrderMutation.isPending}
              className="flex-1"
            >
              {updateOrderMutation.isPending ? "Mengupdate..." : "Update Status"}
            </Button>
            <Button 
              variant="outline" 
              onClick={onClose}
              disabled={updateOrderMutation.isPending}
            >
              Batal
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}