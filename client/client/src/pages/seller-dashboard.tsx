"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ProductCard } from "@/components/product-card"
import { ProductModal } from "@/components/product-modal"
import { OrderDetailModal } from "@/components/order-detail-modal"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { useAuth } from "@/lib/auth"
import { makeAPICall, formatPrice } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import {
  Plus,
  Package,
  ShoppingCart,
  Star,
  DollarSign,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  Eye,
  MapPin,
  Crown,
} from "lucide-react"

export default function SellerDashboard() {
  const { user } = useAuth()
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [isProductModalOpen, setIsProductModalOpen] = useState(false)
  const [editProduct, setEditProduct] = useState<any[] | null>(null)
  const [isOrderDetailModalOpen, setIsOrderDetailModalOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<any[] | null>(null)

  const { data: productsResponse, isLoading } = useQuery({
    queryKey: ["/api/products"],
    queryFn: async () => {
      if (!user) return { success: false, data: [] }
      return makeAPICall(
        {
          email: user.email,
          action: "read",
        },
        "products",
      )
    },
    enabled: !!user,
  })

  const { data: ordersResponse, isLoading: ordersLoading } = useQuery({
    queryKey: ["/api/orders"],
    queryFn: async () => {
      if (!user) return { success: false, data: [] }
      return makeAPICall(
        {
          email: user.email,
          action: "read",
        },
        "orders",
      )
    },
    enabled: !!user,
  })

  const deleteMutation = useMutation({
    mutationFn: async (productId: string) => {
      return makeAPICall(
        {
          email: user?.email,
          action: "delete",
          product_id: productId,
        },
        "products",
      )
    },
    onSuccess: (response) => {
      if (response.success) {
        toast({
          title: "Produk berhasil dihapus!",
          description: "Produk telah dihapus dari katalog",
        })
        queryClient.invalidateQueries({ queryKey: ["/api/products"] })
      } else {
        toast({
          title: "Gagal menghapus produk",
          description: response.error || "Terjadi kesalahan",
          variant: "destructive",
        })
      }
    },
    onError: () => {
      toast({
        title: "Gagal menghapus produk",
        description: "Terjadi kesalahan saat menghapus produk",
        variant: "destructive",
      })
    },
  })

  const processOrderMutation = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: string }) => {
      const payload = {
        email: user?.email,
        action: "update",
        order_id: orderId,
        order_status: status,
      }

      const response = await makeAPICall(payload, "orders")

      if (!response.success) {
        throw new Error(response.error || "Failed to update order status")
      }

      return { ...response, requestedStatus: status }
    },
    onSuccess: (response) => {
      const statusText = response.requestedStatus === "confirmed" ? "dikonfirmasi" : "ditolak"
      toast({
        title: "Pesanan berhasil diproses!",
        description: `Status pesanan berhasil diubah menjadi ${statusText}`,
      })
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] })
    },
    onError: (error: any) => {
      toast({
        title: "Gagal memproses pesanan",
        description: error.message || "Terjadi kesalahan saat memproses pesanan",
        variant: "destructive",
      })
    },
  })

  const products = productsResponse?.success ? productsResponse.data : []
  const orders = ordersResponse?.success ? ordersResponse.data : []

  const currentEmail = user?.email

  const sellerProducts = products.filter((product: any[]) => {
    const productUserId = product[1]
    const legacyUserMapping: { [email: string]: string } = {
      "test@gmail.com": "287799bf-9621-4ef9-ad24-3f8e77cf1461",
      "trollpristel@gmail.com": "287799bf-9621-4e9f-ad24-3f8e77cf1461",
    }
    const isOwner = productUserId === currentEmail || productUserId === legacyUserMapping[currentEmail || ""]
    return isOwner
  })

  const sellerOrders = orders.filter((order: any[]) => {
    const sellerId = order[2]
    const legacyUserMapping: { [email: string]: string } = {
      "test@gmail.com": "287799bf-9621-4ef9-ad24-3f8e77cf1461",
      "trollpristel@gmail.com": "287799bf-9621-4e9f-ad24-3f8e77cf1461",
    }
    const isForThisSeller = sellerId === currentEmail || sellerId === legacyUserMapping[currentEmail || ""]
    return isForThisSeller
  })

  const stats = {
    totalProducts: sellerProducts.length,
    activeProducts: sellerProducts.filter((p: any[]) => p[8] === 1).length,
    outOfStock: sellerProducts.filter((p: any[]) => p[6] === 0).length,
    totalValue: sellerProducts.reduce((sum: number, p: any[]) => sum + p[5] * p[6], 0),
    totalOrders: sellerOrders.length,
    pendingOrders: sellerOrders.filter((o: any[]) => o[6] === "pending").length,
    completedOrders: sellerOrders.filter((o: any[]) => o[6] === "completed").length,
  }

  const handleAddProduct = () => {
    setEditProduct(null)
    setIsProductModalOpen(true)
  }

  const handleEditProduct = (product: any[]) => {
    setEditProduct(product)
    setIsProductModalOpen(true)
  }

  const handleDeleteProduct = (productId: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus produk ini?")) {
      deleteMutation.mutate(productId)
    }
  }

  const handleProcessOrder = (orderId: string, status: string) => {
    if (
      window.confirm(`Apakah Anda yakin ingin ${status === "confirmed" ? "mengkonfirmasi" : "menolak"} pesanan ini?`)
    ) {
      processOrderMutation.mutate({ orderId, status })
    }
  }

  const handleViewOrderDetail = (order: any[]) => {
    setSelectedOrder(order)
    setIsOrderDetailModalOpen(true)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  const dashboardStats = [
    {
      title: "Total Produk",
      value: stats.totalProducts,
      icon: Package,
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
      borderColor: "border-blue-200",
    },
    {
      title: "Produk Aktif",
      value: stats.activeProducts,
      icon: CheckCircle,
      bgColor: "bg-green-50",
      textColor: "text-green-600",
      borderColor: "border-green-200",
    },
    {
      title: "Total Pesanan",
      value: stats.totalOrders,
      icon: ShoppingCart,
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
      borderColor: "border-purple-200",
    },
    {
      title: "Nilai Inventory",
      value: `Rp ${new Intl.NumberFormat("id-ID").format(stats.totalValue)}`,
      icon: DollarSign,
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-600",
      borderColor: "border-yellow-200",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 space-y-8">
      {/* Modern Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-green-600 to-emerald-600 rounded-3xl mx-4 sm:mx-6 lg:mx-8 mt-6">
        <div className="absolute inset-0 bg-black/10"></div>

        {/* Simple Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 25px 25px, rgba(255,255,255,0.3) 2px, transparent 0)`,
              backgroundSize: "50px 50px",
            }}
          />
        </div>

        <div className="relative p-8 lg:p-12">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
            <div className="space-y-6 flex-1">
              <div className="space-y-4">
                <Badge className="bg-white/20 text-white border-white/30 px-4 py-2 text-sm font-semibold backdrop-blur-sm">
                  <Crown className="h-4 w-4 mr-2" />
                  Dashboard Penjual
                </Badge>

                <div className="space-y-3">
                  <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
                    Selamat Datang, {user?.fullName?.split(" ")[0] || "Penjual"}! 👋
                  </h1>
                  <p className="text-white/90 text-lg lg:text-xl max-w-2xl font-medium">
                    Kelola toko Produk Anda dengan mudah dan tingkatkan penjualan
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-white/80">
                <div className="flex items-center gap-2 bg-white/10 rounded-full px-3 py-1 backdrop-blur-sm">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm font-medium">{user?.jurusan || "Universitas"}</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 rounded-full px-3 py-1 backdrop-blur-sm">
                  <Users className="w-4 h-4" />
                  <span className="text-sm font-medium">Penjual Aktif</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={handleAddProduct}
                className="bg-white/20 text-white border-white/30 hover:bg-white/30 transition-all duration-300 shadow-lg hover:shadow-xl group px-6 py-3 backdrop-blur-sm rounded-xl"
              >
                <Plus className="h-5 w-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                Tambah Produk
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 px-4 sm:px-6 lg:px-8">
        {dashboardStats.map((stat, index) => (
          <div
            key={index}
            className={`bg-white rounded-2xl p-6 shadow-sm border ${stat.borderColor} hover:shadow-lg transition-all duration-300 group`}
          >
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-600 group-hover:text-gray-900 transition-colors">
                  {stat.title}
                </p>
                <p className="text-2xl lg:text-3xl font-bold text-gray-900">
                  {typeof stat.value === "string" ? stat.value : stat.value}
                </p>
              </div>
              <div
                className={`w-12 h-12 ${stat.bgColor} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
              >
                <stat.icon className={`h-6 w-6 ${stat.textColor}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Products Section */}
      <div className="space-y-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-gray-900 flex items-center">
              <Package className="h-8 w-8 mr-3 text-blue-600" />
              Produk Saya
            </h2>
            <p className="text-gray-600">Kelola semua produk Produk Anda</p>
          </div>
          <Button
            onClick={handleAddProduct}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
          >
            <Plus className="h-4 w-4 mr-2" />
            Tambah Produk Baru
          </Button>
        </div>

        {sellerProducts.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-white rounded-3xl p-12 shadow-sm max-w-md mx-auto border border-gray-100">
              <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Package className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Belum ada produk</h3>
              <p className="text-gray-600 mb-6">Mulai dengan menambahkan produk Produk pertama Anda</p>
              <Button
                onClick={handleAddProduct}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
              >
                <Plus className="h-4 w-4 mr-2" />
                Tambah Produk Pertama
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sellerProducts.map((product: any[], index) => (
              <div key={product[0]}>
                <ProductCard
                  product={product}
                  onEdit={handleEditProduct}
                  onDelete={handleDeleteProduct}
                  viewMode="grid"
                  isOwner={true}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Orders Section */}
      <div className="space-y-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-gray-900 flex items-center">
              <ShoppingCart className="h-8 w-8 mr-3 text-blue-600" />
              Pesanan Masuk
            </h2>
            <p className="text-gray-600">Kelola pesanan dari pembeli</p>
          </div>
          <div className="bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm">
            <span className="text-sm font-medium text-gray-900">{stats.pendingOrders} pesanan menunggu</span>
          </div>
        </div>

        {ordersLoading ? (
          <div className="flex justify-center items-center py-20">
            <LoadingSpinner size="lg" />
          </div>
        ) : sellerOrders.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-white rounded-3xl p-12 shadow-sm max-w-md mx-auto border border-gray-100">
              <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <ShoppingCart className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Belum ada pesanan</h3>
              <p className="text-gray-600">Pesanan dari pembeli akan muncul di sini</p>
            </div>
          </div>
        ) : (
          <div className="grid gap-6">
            {sellerOrders.map((order: any[], index) => (
              <Card
                key={order[0]}
                className="bg-white border-0 shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl overflow-hidden"
              >
                <CardContent className="p-0">
                  <div className="flex flex-col lg:flex-row">
                    {/* Left side - Order info */}
                    <div className="flex-1 p-6">
                      <div className="space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center gap-3">
                              <Badge
                                variant={
                                  order[6] === "pending"
                                    ? "secondary"
                                    : order[6] === "confirmed"
                                      ? "default"
                                      : order[6] === "completed"
                                        ? "default"
                                        : "destructive"
                                }
                                className={`px-4 py-2 text-sm font-semibold ${
                                  order[6] === "pending"
                                    ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                                    : order[6] === "confirmed"
                                      ? "bg-blue-100 text-blue-800 border-blue-200"
                                      : order[6] === "completed"
                                        ? "bg-green-100 text-green-800 border-green-200"
                                        : "bg-red-100 text-red-800 border-red-200"
                                }`}
                              >
                                {order[6] === "pending" && <Clock className="h-4 w-4 mr-2" />}
                                {order[6] === "confirmed" && <CheckCircle className="h-4 w-4 mr-2" />}
                                {order[6] === "completed" && <Star className="h-4 w-4 mr-2" />}
                                {order[6] === "rejected" && <AlertCircle className="h-4 w-4 mr-2" />}
                                {order[6] === "pending"
                                  ? "Menunggu Konfirmasi"
                                  : order[6] === "confirmed"
                                    ? "Dikonfirmasi"
                                    : order[6] === "completed"
                                      ? "Selesai"
                                      : "Ditolak"}
                              </Badge>
                              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                #{order[0].slice(0, 8)}
                              </span>
                            </div>

                            {(() => {
                              // Cari produk berdasarkan product_id dari order
                              const orderProductId = order[3] // Ini adalah product_id dari order
                              const matchingProduct = products.find((product: any[]) => product[0] === orderProductId)
                              const productName = matchingProduct ? matchingProduct[2] : "Produk Tidak Ditemukan"

                              return (
                                <div className="space-y-2">
                                  <h3 className="font-bold text-xl text-gray-900">{productName}</h3>
                                  <div className="flex items-center gap-4 text-sm">
                                    <div className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-xl">
                                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                                        <Users className="h-4 w-4 text-white" />
                                      </div>
                                      <div>
                                        <div className="font-semibold text-blue-900">{order[1]}</div>
                                        <div className="text-xs text-blue-600">Pembeli</div>
                                      </div>
                                    </div>

                                    <div className="flex items-center gap-2 bg-purple-50 px-3 py-2 rounded-xl">
                                      <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                                        <Package className="h-4 w-4 text-white" />
                                      </div>
                                      <div>
                                        <div className="font-semibold text-purple-900">{order[4]} porsi</div>
                                        <div className="text-xs text-purple-600">Quantity</div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )
                            })()}
                          </div>

                          <div className="text-right space-y-2">
                            <div className="text-2xl font-bold text-gray-900">{formatPrice(order[5])}</div>
                            <div className="text-sm text-gray-500">
                              {new Date(order[7]).toLocaleDateString("id-ID", {
                                weekday: "short",
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right side - Actions */}
                    <div className="lg:w-64 bg-gray-50 p-6 flex flex-col justify-center">
                      <div className="space-y-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewOrderDetail(order)}
                          className="w-full justify-center hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 rounded-xl py-3"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Lihat Detail
                        </Button>

                        {order[6] === "pending" && (
                          <div className="space-y-2">
                            <Button
                              size="sm"
                              onClick={() => handleProcessOrder(order[0], "confirmed")}
                              disabled={processOrderMutation.isPending}
                              className="w-full bg-green-600 hover:bg-green-700 text-white rounded-xl py-3 font-semibold"
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Terima Pesanan
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleProcessOrder(order[0], "rejected")}
                              disabled={processOrderMutation.isPending}
                              className="w-full rounded-xl py-3 font-semibold"
                            >
                              <AlertCircle className="h-4 w-4 mr-2" />
                              Tolak Pesanan
                            </Button>
                          </div>
                        )}

                        {order[6] === "confirmed" && (
                          <div className="text-center p-4 bg-blue-50 rounded-xl">
                            <CheckCircle className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                            <div className="text-sm font-semibold text-blue-900">Pesanan Dikonfirmasi</div>
                            <div className="text-xs text-blue-600">Siap untuk diproses</div>
                          </div>
                        )}

                        {order[6] === "completed" && (
                          <div className="text-center p-4 bg-green-50 rounded-xl">
                            <Star className="h-8 w-8 text-green-600 mx-auto mb-2" />
                            <div className="text-sm font-semibold text-green-900">Pesanan Selesai</div>
                            <div className="text-xs text-green-600">Terima kasih!</div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <ProductModal isOpen={isProductModalOpen} onClose={() => setIsProductModalOpen(false)} product={editProduct} />

      <OrderDetailModal
        isOpen={isOrderDetailModalOpen}
        onClose={() => setIsOrderDetailModalOpen(false)}
        order={selectedOrder}
      />
    </div>
  )
}
