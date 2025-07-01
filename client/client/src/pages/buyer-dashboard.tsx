"use client"

import { useState, useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ProductCard } from "@/components/product-card"
import { OrderModal } from "@/components/order-modal"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { useAuth } from "@/lib/auth"
import { makeAPICall } from "@/lib/api"
import {
  ShoppingBag,
  RefreshCw,
  Search,
  Filter,
  Grid3X3,
  List,
  TrendingUp,
  Package,
  MapPin,
  Heart,
  Crown,
  Users,
} from "lucide-react"
import { Link } from "wouter"
import { Label } from "@/components/ui/label"

export default function BuyerDashboard() {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [orderProduct, setOrderProduct] = useState<any[] | null>(null)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const {
    data: productsResponse,
    isLoading,
    refetch,
  } = useQuery({
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

  const products = productsResponse?.success ? productsResponse.data : []
  const categories = Array.from(new Set(products.map((product: any[]) => product[7]).filter(Boolean))) as string[]

  const filteredProducts = useMemo(() => {
    let filtered = products || []

    if (searchQuery) {
      filtered = filtered.filter(
        (product: any[]) =>
          product[2]?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product[4]?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    if (selectedCategory && selectedCategory !== "all") {
      filtered = filtered.filter((product: any[]) => product[7] === selectedCategory)
    }

    filtered = filtered.filter((product: any[]) => product[8] === 1 && product[1] !== user?.email)

    return filtered
  }, [products, searchQuery, selectedCategory, user?.email])

  const handleOrder = (product: any[]) => {
    setOrderProduct(product)
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  const stats = [
    {
      title: "Total Produk",
      value: products.length,
      icon: Package,
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
      borderColor: "border-blue-200",
    },
    {
      title: "Kategori Tersedia",
      value: categories.length,
      icon: Filter,
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
      borderColor: "border-purple-200",
    },
    {
      title: "Hasil Pencarian",
      value: filteredProducts.length,
      icon: Search,
      bgColor: "bg-green-50",
      textColor: "text-green-600",
      borderColor: "border-green-200",
    },
    {
      title: "Favorit Saya",
      value: 12,
      icon: Heart,
      bgColor: "bg-red-50",
      textColor: "text-red-600",
      borderColor: "border-red-200",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 space-y-8">
      {/* Modern Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl mx-4 sm:mx-6 lg:mx-8 mt-6">
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
                  Dashboard Pembeli
                </Badge>

                <div className="space-y-3">
                  <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
                    Halo, {user?.fullName?.split(" ")[0] || "Pembeli"}! 👋
                  </h1>
                  <p className="text-white/90 text-lg lg:text-xl max-w-2xl font-medium">
                    Temukan Produk terbaik dengan mudah dan nikmati pengalaman berbelanja yang tak terlupakan
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
                  <span className="text-sm font-medium">Pembeli Aktif</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/orders">
                <Button className="bg-white/20 text-white border-white/30 hover:bg-white/30 transition-all duration-300 shadow-lg hover:shadow-xl group px-6 py-3 backdrop-blur-sm rounded-xl">
                  <ShoppingBag className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
                  Pesanan Saya
                </Button>
              </Link>
              <Button
                variant="outline"
                className="bg-white/10 text-white border-white/30 hover:bg-white/20 transition-all duration-300 shadow-lg hover:shadow-xl group px-6 py-3 backdrop-blur-sm rounded-xl"
                onClick={() => refetch()}
              >
                <RefreshCw className="h-5 w-5 mr-2 group-hover:rotate-180 transition-transform duration-500" />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 px-4 sm:px-6 lg:px-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`bg-white rounded-2xl p-6 shadow-sm border ${stat.borderColor} hover:shadow-lg transition-all duration-300 group`}
          >
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-600 group-hover:text-gray-900 transition-colors">
                  {stat.title}
                </p>
                <p className="text-2xl lg:text-3xl font-bold text-gray-900">{stat.value}</p>
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

      {/* Search and Filter Section */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mx-4 sm:mx-6 lg:mx-8">
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center justify-center">
              <Search className="h-6 w-6 mr-3 text-blue-600" />
              Cari Produk Favorit
            </h2>
            <p className="text-gray-600">Temukan Produk terbaik sesuai selera Anda</p>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
              <Label className="block text-sm font-semibold text-gray-900 mb-3">Cari Produk</Label>
              <div className="relative">
                <Input
                  placeholder="Ketik nama produk atau deskripsi..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-12 pr-4 h-12 bg-gray-50 border-2 border-gray-200 rounded-xl focus:bg-white focus:border-blue-400 focus:ring-blue-400 transition-all duration-300"
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              </div>
            </div>

            <div className="w-full lg:w-64">
              <Label className="block text-sm font-semibold text-gray-900 mb-3">Kategori</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="h-12 bg-gray-50 border-2 border-gray-200 rounded-xl hover:border-blue-400 transition-colors">
                  <SelectValue placeholder="Pilih Kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Kategori</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end gap-3">
              <div className="space-y-3">
                <Label className="block text-sm font-semibold text-gray-900">Tampilan</Label>
                <div className="flex gap-2">
                  <Button
                    variant={viewMode === "grid" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className={`h-12 px-4 rounded-xl ${
                      viewMode === "grid"
                        ? "bg-blue-600 text-white"
                        : "border-gray-200 text-gray-600 hover:border-blue-400"
                    }`}
                  >
                    <Grid3X3 className="h-5 w-5" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className={`h-12 px-4 rounded-xl ${
                      viewMode === "list"
                        ? "bg-blue-600 text-white"
                        : "border-gray-200 text-gray-600 hover:border-blue-400"
                    }`}
                  >
                    <List className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {(searchQuery || selectedCategory) && (
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-sm text-gray-700 font-medium">Filter aktif:</span>
              {searchQuery && (
                <Badge className="gap-2 px-3 py-1 bg-blue-100 text-blue-700 border-blue-300 rounded-lg">
                  Pencarian: "{searchQuery}"
                  <button onClick={() => setSearchQuery("")} className="ml-1 hover:text-red-600">
                    ×
                  </button>
                </Badge>
              )}
              {selectedCategory && selectedCategory !== "all" && (
                <Badge className="gap-2 px-3 py-1 bg-purple-100 text-purple-700 border-purple-300 rounded-lg">
                  Kategori: {selectedCategory}
                  <button onClick={() => setSelectedCategory("all")} className="ml-1 hover:text-red-600">
                    ×
                  </button>
                </Badge>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Products Section */}
      <div className="space-y-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-gray-900 flex items-center">
              <TrendingUp className="h-8 w-8 mr-3 text-blue-600" />
              Katalog Produk
            </h2>
            <p className="text-gray-600">Temukan Produk terbaik untuk kebutuhan Anda</p>
          </div>
          <div className="bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm">
            <span className="text-sm font-medium text-gray-900">
              Menampilkan {filteredProducts.length} dari {products.length} produk
            </span>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-white rounded-3xl p-12 shadow-sm max-w-md mx-auto border border-gray-100">
              <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {searchQuery || selectedCategory ? "Tidak ada produk yang sesuai" : "Belum ada produk"}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchQuery || selectedCategory
                  ? "Coba ubah kata kunci pencarian atau kategori"
                  : "Tunggu penjual menambahkan produk baru"}
              </p>
              {(searchQuery || selectedCategory) && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("")
                    setSelectedCategory("all")
                  }}
                  className="px-6 py-3 rounded-xl hover:bg-blue-50 hover:border-blue-300 transition-all"
                >
                  Reset Filter
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div
            className={`grid gap-6 ${
              viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"
            }`}
          >
            {filteredProducts.map((product: any[], index) => (
              <div key={product[0]}>
                <ProductCard product={product} onOrder={handleOrder} viewMode={viewMode} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Order Modal */}
      <OrderModal isOpen={!!orderProduct} onClose={() => setOrderProduct(null)} product={orderProduct} />
    </div>
  )
}
