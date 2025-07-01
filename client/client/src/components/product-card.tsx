"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatPrice } from "@/lib/api"
import { Edit, Trash2, ShoppingCart, Heart, Star, Package } from "lucide-react"
import { useState } from "react"

interface ProductCardProps {
  product: any[]
  onOrder?: (product: any[]) => void
  onEdit?: (product: any[]) => void
  onDelete?: (productId: string) => void
  isOwner?: boolean
  viewMode?: "grid" | "list"
}

export function ProductCard({
  product,
  onOrder,
  onEdit,
  onDelete,
  isOwner = false,
  viewMode = "grid",
}: ProductCardProps) {
  const [productId, userId, productName, imageUrl, description, price, stock, category, status] = product
  const [isLiked, setIsLiked] = useState(false)

  const isOutOfStock = stock === 0
  const isActive = status === 1

  const getDirectImageUrl = (url: string) => {
    if (!url) return ""

    if (url.includes("drive.google.com")) {
      let fileId = ""

      const fileIdMatch = url.match(/\/d\/([a-zA-Z0-9-_]+)/)
      if (fileIdMatch) {
        fileId = fileIdMatch[1]
      } else {
        const idMatch = url.match(/[?&]id=([a-zA-Z0-9-_]+)/)
        if (idMatch) {
          fileId = idMatch[1]
        }
      }

      if (fileId) {
        return `https://drive.google.com/thumbnail?id=${fileId}&sz=w400-h400`
      }
    }

    return url
  }

  const directImageUrl = getDirectImageUrl(imageUrl)

  return (
    <Card className="group relative overflow-hidden bg-white border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 rounded-2xl">
      {/* Status badges */}
      <div className="absolute top-4 left-4 z-10 flex gap-2">
        {!isActive && <Badge className="bg-gray-500/90 text-white shadow-lg font-medium">Tidak Aktif</Badge>}
        {isOutOfStock && <Badge className="bg-red-500/90 text-white shadow-lg font-medium">Stok Habis</Badge>}
        {stock > 0 && stock <= 5 && (
          <Badge className="bg-orange-500/90 text-white shadow-lg font-medium">Stok Terbatas</Badge>
        )}
        {stock > 15 && <Badge className="bg-green-500/90 text-white shadow-lg font-medium">Stok Melimpah</Badge>}
      </div>

      {/* Favorite button */}
      {!isOwner && (
        <Button
          variant="ghost"
          size="sm"
          className={`absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm ${isLiked ? "text-red-500" : "text-gray-600"} hover:scale-110 transition-all duration-300 shadow-lg`}
          onClick={(e) => {
            e.stopPropagation()
            setIsLiked(!isLiked)
          }}
        >
          <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
        </Button>
      )}

      <div className="aspect-square bg-gray-50 relative overflow-hidden rounded-t-2xl">
        {directImageUrl ? (
          <img
            src={directImageUrl || "/placeholder.svg"}
            alt={productName}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={(e) => {
              e.currentTarget.style.display = "none"
              const placeholder = e.currentTarget.parentElement?.querySelector(".image-placeholder") as HTMLElement
              if (placeholder) {
                placeholder.style.display = "flex"
              }
            }}
            onLoad={(e) => {
              const placeholder = e.currentTarget.parentElement?.querySelector(".image-placeholder") as HTMLElement
              if (placeholder) {
                placeholder.style.display = "none"
              }
            }}
            referrerPolicy="no-referrer"
          />
        ) : null}

        <div
          className="w-full h-full flex items-center justify-center image-placeholder bg-gray-100"
          style={{ display: directImageUrl ? "none" : "flex" }}
        >
          <Package className="h-16 w-16 text-gray-300" />
        </div>

        {/* Stock out overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <div className="bg-red-500 text-white px-4 py-2 rounded-xl font-semibold">Stok Habis</div>
          </div>
        )}

        {/* Category badge */}
        {category && (
          <div className="absolute bottom-4 left-4">
            <Badge className="bg-white/90 backdrop-blur-sm border-white/20 text-gray-700 shadow-lg font-medium">
              {category}
            </Badge>
          </div>
        )}
      </div>

      <CardContent className="p-6 space-y-4">
        <div className="space-y-2">
          <h3 className="font-bold text-lg text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {productName}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">{description || "Tidak ada deskripsi"}</p>
        </div>

        {/* Price section */}
        <div className="space-y-3">
          <div className="flex justify-between items-end">
            <div className="space-y-1">
              <span className="text-2xl font-bold text-gray-900">{formatPrice(price)}</span>
              <div className="text-xs text-gray-500">Per item</div>
            </div>
            <div className="text-right">
              <div className="text-sm font-semibold text-gray-700">{stock} tersisa</div>
              <div className="flex-1 bg-gray-200 rounded-full h-1.5 w-16 mt-1">
                <div
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    stock > 10 ? "bg-green-500" : stock > 5 ? "bg-yellow-500" : "bg-red-500"
                  }`}
                  style={{ width: `${Math.min((stock / 20) * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Rating stars */}
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`h-4 w-4 ${i < 4 ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
            ))}
            <span className="text-xs text-gray-500 ml-1">(4.8)</span>
          </div>
        </div>

        {/* Action buttons */}
        {isOwner ? (
          <div className="flex space-x-3 pt-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 transition-all duration-300 rounded-xl"
              onClick={() => onEdit?.(product)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-300 transition-all duration-300 rounded-xl"
              onClick={() => onDelete?.(productId)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Hapus
            </Button>
          </div>
        ) : (
          <Button
            size="sm"
            className={`w-full transition-all duration-300 rounded-xl font-semibold ${
              !isOutOfStock && isActive
                ? "bg-blue-600 hover:bg-blue-700 text-white hover:scale-105"
                : "bg-gray-400 cursor-not-allowed hover:bg-gray-400"
            }`}
            onClick={() => onOrder?.(product)}
            disabled={isOutOfStock || !isActive}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            {isOutOfStock ? "Stok Habis" : !isActive ? "Tidak Tersedia" : "Beli Sekarang"}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
