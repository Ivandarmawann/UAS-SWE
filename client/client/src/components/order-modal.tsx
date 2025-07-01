"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/auth"
import { makeAPICall, formatPrice } from "@/lib/api"
import { ImageIcon, ShoppingCart, Minus, Plus, Loader2, Star } from "lucide-react"
import { z } from "zod"

interface OrderModalProps {
  isOpen: boolean
  onClose: () => void
  product: any[] | null
}

const orderFormSchema = z.object({
  quantity: z.number().min(1, "Jumlah minimal 1"),
})

type OrderForm = z.infer<typeof orderFormSchema>

export function OrderModal({ isOpen, onClose, product }: OrderModalProps) {
  const { toast } = useToast()
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [totalPrice, setTotalPrice] = useState(0)

  const form = useForm<OrderForm>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      quantity: 1,
    },
  })

  const quantity = form.watch("quantity")

  useEffect(() => {
    if (product && quantity) {
      setTotalPrice(product[5] * quantity)
    }
  }, [product, quantity])

  const orderMutation = useMutation({
    mutationFn: async (data: OrderForm) => {
      if (!product || !user) throw new Error("Missing required data")

      const orderData = {
        product_id: product[0],
        seller_id: product[1],
        quantity: data.quantity,
        total_price: product[5] * data.quantity,
      }

      return makeAPICall(
        {
          email: user.email,
          action: "create",
          data: orderData,
        },
        "orders",
      )
    },
    onSuccess: (response) => {
      if (response.success) {
        toast({
          title: "Pesanan berhasil dibuat",
          description: "Pesanan Anda telah diterima",
        })
        queryClient.invalidateQueries({ queryKey: ["/api/products"] })
        onClose()
      } else {
        toast({
          title: "Gagal membuat pesanan",
          description: response.error || "Terjadi kesalahan",
          variant: "destructive",
        })
      }
    },
    onError: () => {
      toast({
        title: "Gagal membuat pesanan",
        description: "Terjadi kesalahan saat membuat pesanan",
        variant: "destructive",
      })
    },
  })

  const onSubmit = form.handleSubmit((data) => {
    orderMutation.mutate(data)
  })

  const handleClose = () => {
    form.reset({ quantity: 1 })
    onClose()
  }

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= stock) {
      form.setValue("quantity", newQuantity)
    }
  }

  if (!product) return null

  const [productId, userId, productName, imageUrl, description, price, stock] = product

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md mx-4 p-0 bg-white border border-gray-200 shadow-lg rounded-xl">
        {/* Header */}
        <DialogHeader className="px-6 py-4 border-b border-gray-100 bg-gray-50 rounded-t-xl">
          <DialogTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-blue-600" />
            Pesan Produk
          </DialogTitle>
        </DialogHeader>

        <div className="p-6">
          {/* Product Section */}
          <div className="mb-6">
            <div className="flex gap-4 mb-4">
              {/* Product Image */}
              <div className="relative flex-shrink-0">
                <div className="w-20 h-20 bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
                  {imageUrl ? (
                    <img
                      src={
                        imageUrl.includes("drive.google.com/uc?")
                          ? imageUrl.replace("uc?export=view&id=", "thumbnail?id=").concat("&sz=w400-h400")
                          : imageUrl
                      }
                      alt={productName}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = "none"
                        e.currentTarget.nextElementSibling?.classList.remove("hidden")
                      }}
                    />
                  ) : null}
                  <div
                    className={`w-full h-full flex items-center justify-center ${imageUrl ? "hidden" : ""} bg-gray-100`}
                  >
                    <ImageIcon className="h-8 w-8 text-gray-400" />
                  </div>
                </div>
                <Badge className="absolute -top-2 -right-2 bg-green-600 text-white text-xs px-2 py-1 rounded-full">
                  {stock} tersedia
                </Badge>
              </div>

              {/* Product Info */}
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-gray-900 mb-2">{productName}</h3>

                <div className="flex items-center gap-1 mb-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500 ml-1">(4.9) • 127 reviews</span>
                </div>

                <p className="text-sm text-gray-600 mb-3">{description || "Tidak ada deskripsi"}</p>
              </div>
            </div>

            {/* Price Section */}
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-blue-600">{formatPrice(price)}</span>
                  <span className="text-sm text-gray-400 line-through">{formatPrice(price * 1.2)}</span>
                </div>
                <Badge className="bg-red-500 text-white">HEMAT 20%</Badge>
              </div>
              <p className="text-xs text-gray-600 mt-1">Harga per unit</p>
            </div>
          </div>

          {/* Quantity Section */}
          <div className="mb-6">
            <Label className="text-sm font-medium text-gray-900 mb-3 block">Jumlah</Label>

            <div className="flex items-center justify-center gap-3">
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-10 w-10 border-gray-300 hover:border-blue-500 hover:bg-blue-50"
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>

              <Input
                type="number"
                min="1"
                max={stock}
                className="w-20 text-center text-lg font-semibold border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                {...form.register("quantity", { valueAsNumber: true })}
              />

              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-10 w-10 border-gray-300 hover:border-blue-500 hover:bg-blue-50"
                onClick={() => handleQuantityChange(quantity + 1)}
                disabled={quantity >= stock}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {form.formState.errors.quantity && (
              <p className="text-sm text-red-600 mt-2 text-center">{form.formState.errors.quantity.message}</p>
            )}
          </div>

          {/* Total Section */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total ({quantity} item)</span>
              <span className="text-2xl font-bold text-blue-600">{formatPrice(totalPrice)}</span>
            </div>
          </div>

          {/* Checkout Button */}
          <form onSubmit={onSubmit}>
            <Button
              type="submit"
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg rounded-lg"
              disabled={orderMutation.isPending || stock === 0}
            >
              {orderMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Memproses...
                </>
              ) : stock === 0 ? (
                "Stok Habis"
              ) : (
                "Beli Sekarang"
              )}
            </Button>
          </form>

          <p className="text-xs text-gray-500 text-center mt-4">
            Dengan melakukan pembelian, Anda menyetujui syarat dan ketentuan
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
