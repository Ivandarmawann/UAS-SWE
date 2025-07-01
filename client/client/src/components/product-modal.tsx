"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/auth"
import { makeAPICall, fileToBase64 } from "@/lib/api"
import { insertProductSchema, type InsertProduct } from "@shared/schema"
import {
  Upload,
  Package,
  DollarSign,
  Hash,
  FileText,
  Tag,
  ImageIcon,
  CheckCircle,
  Sparkles,
  Save,
  X,
} from "lucide-react"

interface ProductModalProps {
  isOpen: boolean
  onClose: () => void
  product?: any[] | null
}

export function ProductModal({ isOpen, onClose, product }: ProductModalProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [imagePreview, setImagePreview] = useState<string>("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const isEdit = !!product

  const form = useForm<InsertProduct>({
    resolver: zodResolver(insertProductSchema),
    defaultValues: {
      product_name: "",
      description: "",
      price: 0,
      stock: 0,
      category: "",
      status: 1,
    },
  })

  useEffect(() => {
    if (isEdit && product && isOpen) {
      form.reset({
        product_name: product[2] || "",
        description: product[4] || "",
        price: Number(product[5]) || 0,
        stock: Number(product[6]) || 0,
        category: product[7] || "",
        status: Number(product[8]) || 1,
      })

      if (product[3]) {
        setImagePreview(product[3])
      }
      setImageFile(null)
    } else if (!isEdit && isOpen) {
      form.reset({
        product_name: "",
        description: "",
        price: 0,
        stock: 0,
        category: "",
        status: 1,
      })
      setImagePreview("")
      setImageFile(null)
    }
  }, [product, isOpen, isEdit, form])

  const productMutation = useMutation({
    mutationFn: async (data: InsertProduct) => {
      console.log("Product mutation data:", data)
      console.log("Is edit mode:", isEdit)
      console.log("Product data:", product)

      const apiData: any = {
        email: user?.email,
        action: isEdit ? "update" : "create",
        data: {
          product_name: data.product_name,
          description: data.description,
          price: Number(data.price),
          stock: Number(data.stock),
          category: data.category,
          status: data.status || 1,
        },
      }

      if (isEdit && product) {
        apiData.product_id = product[0]
        console.log("Setting product_id for update:", product[0])
      }

      // Handle image upload
      if (imageFile) {
        const base64 = await fileToBase64(imageFile)
        apiData.data.imageData = base64.split(",")[1] // Remove data:image/...;base64, prefix
        apiData.data.mimeType = imageFile.type
        apiData.data.fileName = imageFile.name
        console.log("Adding image data to request")
      }

      console.log("Final API payload for products:", apiData)
      return makeAPICall(apiData, "products")
    },
    onSuccess: (response) => {
      console.log("Product save response:", response)
      if (response.success) {
        toast({
          title: isEdit ? "Produk berhasil diupdate!" : "Produk berhasil ditambahkan!",
          description: "Perubahan telah disimpan",
        })

        queryClient.invalidateQueries({ queryKey: ["/api/products"] })
        handleClose()
      } else {
        console.error("Product save failed:", response.error)
        toast({
          title: "Gagal menyimpan produk",
          description: response.error || "Terjadi kesalahan. Pastikan Google Apps Script sudah diperbarui.",
          variant: "destructive",
        })
      }
    },
    onError: (error) => {
      console.error("Product save error:", error)
      toast({
        title: "Gagal menyimpan produk",
        description: "Terjadi kesalahan saat menyimpan produk",
        variant: "destructive",
      })
    },
  })

  const onSubmit = form.handleSubmit((data) => {
    productMutation.mutate(data)
  })

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validasi ukuran file (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File terlalu besar",
          description: "Ukuran file maksimal 5MB",
          variant: "destructive",
        })
        return
      }

      // Validasi tipe file
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Format file tidak didukung",
          description: "Hanya file gambar yang diperbolehkan",
          variant: "destructive",
        })
        return
      }

      setImageFile(file)

      // Create preview URL
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setImagePreview(result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveFile = () => {
    setImageFile(null)
    setImagePreview("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleClose = () => {
    form.reset()
    setImagePreview("")
    setImageFile(null)
    onClose()
  }

  const categories = [
    "Nasi Kotak",
    "Snack Box",
    "Prasmanan",
    "Kue & Dessert",
    "Minuman",
    "Paket Lengkap",
    "Makanan Tradisional",
    "Makanan Modern",
  ]

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] min-h-[600px] bg-white rounded-2xl border-0 shadow-2xl p-0 overflow-hidden">
        <div className="flex flex-col h-full">
          {/* Header - Fixed */}
          <DialogHeader className="px-6 py-4 border-b border-gray-100 flex-shrink-0">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                {isEdit ? <Package className="h-5 w-5 text-white" /> : <Sparkles className="h-5 w-5 text-white" />}
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-gray-900">
                  {isEdit ? "Edit Produk" : "Tambah Produk Baru"}
                </DialogTitle>
                <p className="text-sm text-gray-600">
                  {isEdit ? "Perbarui informasi produk Anda" : "Tambahkan produk baru ke katalog"}
                </p>
              </div>
            </div>
          </DialogHeader>

          {/* Content - Scrollable */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            <form onSubmit={onSubmit} className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Left Column - Basic Info */}
                <div className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="w-7 h-7 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FileText className="h-4 w-4 text-blue-600" />
                      </div>
                      <h3 className="text-base font-semibold text-gray-900">Informasi Dasar</h3>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="product_name" className="text-sm font-medium text-gray-900 flex items-center">
                        <Package className="h-3 w-3 mr-2 text-blue-600" />
                        Nama Produk
                      </Label>
                      <Input
                        id="product_name"
                        placeholder="Contoh: Nasi Kotak Ayam Bakar"
                        {...form.register("product_name")}
                        error={form.formState.errors.product_name?.message}
                        className="h-10 rounded-lg border-2 border-gray-200 focus:border-blue-400 transition-all"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description" className="text-sm font-medium text-gray-900 flex items-center">
                        <FileText className="h-3 w-3 mr-2 text-blue-600" />
                        Deskripsi
                      </Label>
                      <Textarea
                        id="description"
                        placeholder="Deskripsikan produk Anda dengan detail..."
                        {...form.register("description")}
                        error={form.formState.errors.description?.message}
                        className="min-h-[80px] rounded-lg border-2 border-gray-200 focus:border-blue-400 transition-all resize-none"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category" className="text-sm font-medium text-gray-900 flex items-center">
                        <Tag className="h-3 w-3 mr-2 text-blue-600" />
                        Kategori
                      </Label>
                      <Select
                        value={form.watch("category")}
                        onValueChange={(value) => form.setValue("category", value)}
                      >
                        <SelectTrigger className="h-10 rounded-lg border-2 border-gray-200 focus:border-blue-400 bg-white">
                          <SelectValue placeholder="Pilih kategori produk" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border border-gray-200 rounded-lg shadow-lg">
                          {categories.map((category) => (
                            <SelectItem
                              key={category}
                              value={category}
                              className="py-2 hover:bg-blue-50 focus:bg-blue-50"
                            >
                              <div className="flex items-center">
                                <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center mr-2">
                                  <Tag className="h-3 w-3 text-blue-600" />
                                </div>
                                <span className="text-sm">{category}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Price and Stock */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="w-7 h-7 bg-green-100 rounded-lg flex items-center justify-center">
                        <DollarSign className="h-4 w-4 text-green-600" />
                      </div>
                      <h3 className="text-base font-semibold text-gray-900">Harga & Stok</h3>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label htmlFor="price" className="text-sm font-medium text-gray-900 flex items-center">
                          <DollarSign className="h-3 w-3 mr-2 text-green-600" />
                          Harga (Rp)
                        </Label>
                        <Input
                          id="price"
                          type="number"
                          min="0"
                          placeholder="50000"
                          {...form.register("price", { valueAsNumber: true })}
                          error={form.formState.errors.price?.message}
                          className="h-10 rounded-lg border-2 border-gray-200 focus:border-green-400 transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="stock" className="text-sm font-medium text-gray-900 flex items-center">
                          <Hash className="h-3 w-3 mr-2 text-green-600" />
                          Stok
                        </Label>
                        <Input
                          id="stock"
                          type="number"
                          min="0"
                          placeholder="10"
                          {...form.register("stock", { valueAsNumber: true })}
                          error={form.formState.errors.stock?.message}
                          className="h-10 rounded-lg border-2 border-gray-200 focus:border-green-400 transition-all"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Image & Status */}
                <div className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="w-7 h-7 bg-purple-100 rounded-lg flex items-center justify-center">
                        <ImageIcon className="h-4 w-4 text-purple-600" />
                      </div>
                      <h3 className="text-base font-semibold text-gray-900">Gambar Produk</h3>
                    </div>

                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-900 flex items-center">
                          <ImageIcon className="h-3 w-3 mr-2 text-purple-600" />
                          Upload Gambar
                        </Label>

                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleFileSelect}
                          className="hidden"
                        />

                        {!imageFile && !imagePreview ? (
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full h-10 rounded-lg border-2 border-dashed border-purple-300 hover:border-purple-400 hover:bg-purple-50 transition-all flex items-center justify-center space-x-2"
                          >
                            <Upload className="h-4 w-4 text-purple-600" />
                            <span className="text-sm font-medium text-purple-700">Pilih Gambar</span>
                          </Button>
                        ) : (
                          <div className="flex items-center justify-between bg-purple-50 rounded-lg p-2">
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-medium text-purple-900 truncate">
                                {imageFile ? imageFile.name : "Gambar dari database"}
                              </span>
                              {imageFile && (
                                <Badge variant="secondary" className="text-xs">
                                  {(imageFile.size / 1024 / 1024).toFixed(2)} MB
                                </Badge>
                              )}
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={handleRemoveFile}
                              className="text-purple-600 hover:text-purple-800 hover:bg-purple-100 h-6 w-6 p-0"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                      </div>

                      {/* Image Preview - Kompak */}
                      <div className="relative">
                        <div className="aspect-[4/3] max-h-48 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 overflow-hidden">
                          {imagePreview ? (
                            <img
                              src={imagePreview || "/placeholder.svg"}
                              alt="Preview"
                              className="w-full h-full object-cover"
                              onError={() => setImagePreview("")}
                            />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                              <Upload className="h-8 w-8 mb-2" />
                              <p className="text-xs font-medium">Preview gambar akan muncul di sini</p>
                              <p className="text-xs text-gray-500">Pilih file gambar di atas</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Status - Kompak */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="w-7 h-7 bg-orange-100 rounded-lg flex items-center justify-center">
                        <CheckCircle className="h-4 w-4 text-orange-600" />
                      </div>
                      <h3 className="text-base font-semibold text-gray-900">Status Produk</h3>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center space-x-3">
                        <Button
                          type="button"
                          variant={form.watch("status") === 1 ? "default" : "outline"}
                          onClick={() => form.setValue("status", 1)}
                          className={`flex-1 h-9 rounded-lg text-sm font-medium transition-all ${
                            form.watch("status") === 1
                              ? "bg-green-600 text-white hover:bg-green-700"
                              : "border-2 border-gray-200 hover:border-green-400 hover:text-green-600"
                          }`}
                        >
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Aktif
                        </Button>
                        <Button
                          type="button"
                          variant={form.watch("status") === 0 ? "default" : "outline"}
                          onClick={() => form.setValue("status", 0)}
                          className={`flex-1 h-9 rounded-lg text-sm font-medium transition-all ${
                            form.watch("status") === 0
                              ? "bg-gray-600 text-white hover:bg-gray-700"
                              : "border-2 border-gray-200 hover:border-gray-400 hover:text-gray-600"
                          }`}
                        >
                          <X className="h-3 w-3 mr-1" />
                          Nonaktif
                        </Button>
                      </div>
                      <div className="text-center">
                        <Badge
                          className={`px-3 py-1 text-xs ${
                            form.watch("status") === 1
                              ? "bg-green-100 text-green-800 border-green-200"
                              : "bg-gray-100 text-gray-800 border-gray-200"
                          }`}
                        >
                          {form.watch("status") === 1
                            ? "Produk akan tampil di katalog"
                            : "Produk disembunyikan dari katalog"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Footer - Fixed & Sticky */}
          <div className="px-6 py-4 border-t border-gray-100 flex-shrink-0 sticky bottom-0 bg-white">
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={productMutation.isPending}
                className="flex-1 h-10 rounded-lg font-medium border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all"
              >
                Batal
              </Button>
              <Button
                type="submit"
                onClick={onSubmit}
                disabled={productMutation.isPending}
                className="flex-1 h-10 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-medium transition-all hover:scale-105 shadow-md hover:shadow-lg"
              >
                {productMutation.isPending ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {isEdit ? "Memperbarui..." : "Menyimpan..."}
                  </div>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {isEdit ? "Perbarui Produk" : "Simpan Produk"}
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
