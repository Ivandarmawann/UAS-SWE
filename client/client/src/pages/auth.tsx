"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/auth"
import { makeAPICall } from "@/lib/api"
import { insertUserSchema, loginUserSchema, type InsertUser, type LoginUser } from "@shared/schema"
import { useLocation } from "wouter"
import {
  ArrowLeft,
  Mail,
  Lock,
  User,
  Phone,
  GraduationCap,
  ShoppingBag,
  Store,
  Shield,
  CheckCircle,
  Eye,
  EyeOff,
  Sparkles,
  Star,
  Users,
  Award,
  Zap,
  Heart,
} from "lucide-react"

export default function Auth() {
  const [location, navigate] = useLocation()
  const { toast } = useToast()
  const { login } = useAuth()

  const params = new URLSearchParams(location.split("?")[1])
  const initialMode = params.get("mode") || "login"
  const initialRole = params.get("role") || ""

  const [mode, setMode] = useState<"login" | "register">(initialMode as "login" | "register")
  const [showPassword, setShowPassword] = useState(false)

  const loginForm = useForm<LoginUser>({
    resolver: zodResolver(loginUserSchema),
    defaultValues: { email: "", password: "" },
  })

  const registerForm = useForm<InsertUser>({
    resolver: zodResolver(insertUserSchema),
    defaultValues: {
      email: "",
      password: "",
      fullName: "",
      nomorHp: "",
      jurusan: "",
      role: (initialRole as "buyer" | "seller") || undefined,
    },
  })

  const loginMutation = useMutation({
    mutationFn: async (data: LoginUser) => {
      return makeAPICall({
        action: "login",
        email: data.email,
        password: data.password,
      })
    },
    onSuccess: (response) => {
      if (response.success) {
        const userData = {
          userId: response.data?.userId || response.userId || loginForm.getValues("email"),
          email: response.data?.email || loginForm.getValues("email"),
          fullName: response.data?.fullName || loginForm.getValues("email"),
          nomorHp: response.data?.nomorHp || "",
          jurusan: response.data?.jurusan || "",
          role: (response.data?.role || response.role) as "buyer" | "seller",
          createdAt: response.data?.createdAt || new Date().toISOString(),
          updatedAt: response.data?.updatedAt || new Date().toISOString(),
        }

        login(userData)
        toast({
          title: "Login berhasil!",
          description: "Selamat datang kembali di UPJ Marketplace",
        })

        navigate(response.role === "buyer" ? "/buyer" : "/seller")
      } else {
        toast({
          title: "Login gagal",
          description: response.error || "Email atau password salah",
          variant: "destructive",
        })
      }
    },
    onError: () => {
      toast({
        title: "Login gagal",
        description: "Terjadi kesalahan saat login",
        variant: "destructive",
      })
    },
  })

  const registerMutation = useMutation({
    mutationFn: async (data: InsertUser) => {
      return makeAPICall({
        action: "register",
        email: data.email,
        password: data.password,
        fullName: data.fullName,
        nomorHp: data.nomorHp,
        jurusan: data.jurusan,
        role: data.role,
      })
    },
    onSuccess: (response) => {
      if (response.success) {
        const userData = response.data || {
          userId: response.userId || registerForm.getValues("email"),
          email: registerForm.getValues("email"),
          fullName: registerForm.getValues("fullName"),
          nomorHp: registerForm.getValues("nomorHp"),
          jurusan: registerForm.getValues("jurusan"),
          role: registerForm.getValues("role"),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }

        login(userData)
        toast({
          title: "Registrasi berhasil!",
          description: "Selamat datang di UPJ Marketplace",
        })

        if (response.redirect) {
          navigate(response.redirect)
        } else {
          navigate(userData.role === "buyer" ? "/buyer" : "/seller")
        }
      } else {
        toast({
          title: "Registrasi gagal",
          description: response.error || "Terjadi kesalahan",
          variant: "destructive",
        })
      }
    },
    onError: () => {
      toast({
        title: "Registrasi gagal",
        description: "Terjadi kesalahan saat registrasi",
        variant: "destructive",
      })
    },
  })

  const onLoginSubmit = loginForm.handleSubmit((data) => {
    loginMutation.mutate(data)
  })

  const onRegisterSubmit = registerForm.handleSubmit((data) => {
    registerMutation.mutate(data)
  })

  const benefits = [
    { icon: <Shield className="h-4 w-4" />, text: "Keamanan Terjamin", color: "text-green-600" },
    { icon: <Zap className="h-4 w-4" />, text: "Proses Cepat", color: "text-blue-600" },
    { icon: <Users className="h-4 w-4" />, text: "Komunitas Aktif", color: "text-purple-600" },
    { icon: <Award className="h-4 w-4" />, text: "Kualitas Premium", color: "text-orange-600" },
  ]

  const stats = [
    { number: "100K+", label: "Pengguna", icon: <Users className="h-4 w-4" /> },
    { number: "5K+", label: "Penjual", icon: <Store className="h-4 w-4" /> },
    { number: "4.9/5", label: "Rating", icon: <Star className="h-4 w-4" /> },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 25px 25px, rgba(59,130,246,0.3) 2px, transparent 0)`,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-pulse delay-1000" />

      <div className="relative min-h-screen flex">
        {/* Left Side - Hero Section */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center p-12 relative">
          <div className="max-w-lg">
            {/* Back Button */}
            <div className="mb-8">
              <Button
                variant="ghost"
                onClick={() => navigate("/")}
                className="group flex items-center text-gray-600 hover:text-blue-600 transition-colors font-medium"
              >
                <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                Kembali ke Beranda
              </Button>
            </div>

            <Badge className="mb-6 px-4 py-2 bg-blue-100 text-blue-700 rounded-full font-semibold">
              <Sparkles className="h-4 w-4 mr-2" />
              Platform MarketPlace UPJ
            </Badge>

            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              {mode === "login" ? (
                <>
                  Selamat Datang
                  <span className="block text-blue-600">Kembali!</span>
                </>
              ) : (
                <>
                  Bergabung dengan
                  <span className="block text-blue-600">Revolusi Market</span>
                </>
              )}
            </h1>

            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              {mode === "login"
                ? "Masuk ke akun Anda dan lanjutkan perjalanan kuliner yang menakjubkan bersama ribuan penjual terpercaya."
                : "Daftar sekarang dan rasakan pengalaman berbelanja yang tak terlupakan dengan teknologi terdepan."}
            </p>

            {/* Benefits */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 bg-white/60 backdrop-blur-sm px-4 py-3 rounded-xl border border-white/20 hover:bg-white/80 transition-all duration-300"
                >
                  <div className={`${benefit.color}`}>{benefit.icon}</div>
                  <span className="text-sm font-medium text-gray-700">{benefit.text}</span>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">Platform Terpercaya</h3>
              <div className="grid grid-cols-3 gap-4">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                      <div className="text-blue-600">{stat.icon}</div>
                    </div>
                    <div className="text-lg font-bold text-gray-900">{stat.number}</div>
                    <div className="text-xs text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form Section */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-4 lg:p-12">
          <div className="w-full max-w-md">
            {/* Mobile Back Button */}
            <div className="lg:hidden mb-6">
              <Button
                variant="ghost"
                onClick={() => navigate("/")}
                className="group flex items-center text-gray-600 hover:text-blue-600 transition-colors font-medium"
              >
                <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                Kembali ke Beranda
              </Button>
            </div>

            <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-sm">
              <CardHeader className="text-center pb-6">
                {/* Logo */}
                <div className="flex justify-center mb-6">
                  <div className="relative">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl flex items-center justify-center shadow-xl">
                      {mode === "login" ? (
                        <User className="h-10 w-10 text-white" />
                      ) : (
                        <ShoppingBag className="h-10 w-10 text-white" />
                      )}
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
                      <Sparkles className="h-4 w-4 text-yellow-800" />
                    </div>
                  </div>
                </div>

                {/* Title */}
                <h2 className="text-3xl font-bold text-gray-900 mb-3">
                  {mode === "login" ? "Masuk ke Akun" : "Buat Akun Baru"}
                </h2>
                <p className="text-gray-600 mb-6">
                  {mode === "login"
                    ? "Masuk untuk mengakses dashboard dan fitur eksklusif"
                    : "Bergabunglah dengan ribuan pengguna yang telah merasakan kemudahan"}
                </p>

                {/* Mode Toggle */}
                <div className="flex items-center justify-center">
                  <div className="bg-gray-100 rounded-2xl p-1 flex">
                    <Button
                      variant={mode === "login" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setMode("login")}
                      className={`rounded-xl px-8 py-3 font-semibold transition-all ${
                        mode === "login"
                          ? "bg-blue-600 text-white shadow-lg"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                      }`}
                    >
                      Masuk
                    </Button>
                    <Button
                      variant={mode === "register" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setMode("register")}
                      className={`rounded-xl px-8 py-3 font-semibold transition-all ${
                        mode === "register"
                          ? "bg-blue-600 text-white shadow-lg"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                      }`}
                    >
                      Daftar
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="px-8 pb-8">
                {mode === "login" ? (
                  <form onSubmit={onLoginSubmit} className="space-y-6">
                    <div className="space-y-5">
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-semibold flex items-center text-gray-700">
                          <Mail className="h-4 w-4 mr-2 text-blue-600" />
                          Email Address
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="nama@email.com"
                          {...loginForm.register("email")}
                          error={loginForm.formState.errors.email?.message}
                          className="h-14 rounded-xl border-2 border-gray-200 focus:border-blue-400 focus:ring-blue-400 transition-all duration-300 text-lg"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password" className="text-sm font-semibold flex items-center text-gray-700">
                          <Lock className="h-4 w-4 mr-2 text-blue-600" />
                          Password
                        </Label>
                        <div className="relative">
                          <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Masukkan password"
                            {...loginForm.register("password")}
                            error={loginForm.formState.errors.password?.message}
                            className="h-14 rounded-xl border-2 border-gray-200 focus:border-blue-400 focus:ring-blue-400 transition-all duration-300 pr-14 text-lg"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 h-10 w-10 p-0 hover:bg-gray-100 rounded-lg"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-5 w-5 text-gray-500" />
                            ) : (
                              <Eye className="h-5 w-5 text-gray-500" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                      disabled={loginMutation.isPending}
                    >
                      {loginMutation.isPending ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                          Memproses...
                        </div>
                      ) : (
                        <>
                          <User className="mr-3 h-5 w-5" />
                          Masuk ke Dashboard
                        </>
                      )}
                    </Button>

                    <div className="text-center">
                      <p className="text-gray-600">
                        Belum punya akun?{" "}
                        <button
                          type="button"
                          onClick={() => setMode("register")}
                          className="text-blue-600 font-bold hover:text-blue-700 transition-colors hover:underline"
                        >
                          Daftar sekarang
                        </button>
                      </p>
                    </div>
                  </form>
                ) : (
                  <form onSubmit={onRegisterSubmit} className="space-y-6">
                    <div className="space-y-5">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="fullName" className="text-sm font-semibold flex items-center text-gray-700">
                            <User className="h-4 w-4 mr-2 text-blue-600" />
                            Nama
                          </Label>
                          <Input
                            id="fullName"
                            placeholder="Nama lengkap"
                            {...registerForm.register("fullName")}
                            error={registerForm.formState.errors.fullName?.message}
                            className="h-12 rounded-xl border-2 border-gray-200 focus:border-blue-400 focus:ring-blue-400 transition-all duration-300"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="nomorHp" className="text-sm font-semibold flex items-center text-gray-700">
                            <Phone className="h-4 w-4 mr-2 text-blue-600" />
                            No. HP
                          </Label>
                          <Input
                            id="nomorHp"
                            type="tel"
                            placeholder="08xxxxxxxxxx"
                            {...registerForm.register("nomorHp")}
                            error={registerForm.formState.errors.nomorHp?.message}
                            className="h-12 rounded-xl border-2 border-gray-200 focus:border-blue-400 focus:ring-blue-400 transition-all duration-300"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-semibold flex items-center text-gray-700">
                          <Mail className="h-4 w-4 mr-2 text-blue-600" />
                          Email Address
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="nama@email.com"
                          {...registerForm.register("email")}
                          error={registerForm.formState.errors.email?.message}
                          className="h-12 rounded-xl border-2 border-gray-200 focus:border-blue-400 focus:ring-blue-400 transition-all duration-300"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="password" className="text-sm font-semibold flex items-center text-gray-700">
                          <Lock className="h-4 w-4 mr-2 text-blue-600" />
                          Password
                        </Label>
                        <div className="relative">
                          <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Minimal 6 karakter"
                            {...registerForm.register("password")}
                            error={registerForm.formState.errors.password?.message}
                            className="h-12 rounded-xl border-2 border-gray-200 focus:border-blue-400 focus:ring-blue-400 transition-all duration-300 pr-12"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100 rounded-lg"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4 text-gray-500" />
                            ) : (
                              <Eye className="h-4 w-4 text-gray-500" />
                            )}
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="jurusan" className="text-sm font-semibold flex items-center text-gray-700">
                          <GraduationCap className="h-4 w-4 mr-2 text-blue-600" />
                          Jurusan
                        </Label>
                        <Input
                          id="jurusan"
                          placeholder="Contoh: Teknik Informatika"
                          {...registerForm.register("jurusan")}
                          error={registerForm.formState.errors.jurusan?.message}
                          className="h-12 rounded-xl border-2 border-gray-200 focus:border-blue-400 focus:ring-blue-400 transition-all duration-300"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="role" className="text-sm font-semibold text-gray-700">
                          Daftar Sebagai
                        </Label>
                        <Select
                          value={registerForm.watch("role")}
                          onValueChange={(value) => registerForm.setValue("role", value as "buyer" | "seller")}
                        >
                          <SelectTrigger className="h-12 rounded-xl border-2 border-gray-200 focus:border-blue-400 focus:ring-blue-400">
                            <SelectValue placeholder="Pilih peran Anda" />
                          </SelectTrigger>
                          <SelectContent className="bg-white text-gray-900 shadow-lg border border-gray-200 rounded-xl">

                            <SelectItem value="buyer" className="py-4">
                              <div className="flex items-center">
                                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                                  <ShoppingBag className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                  <div className="font-bold text-lg">Pembeli</div>
                                  <div className="text-sm text-gray-500">Saya ingin membeli Produk</div>
                                </div>
                              </div>
                            </SelectItem>
                            <SelectItem value="seller" className="py-4">
                              <div className="flex items-center">
                                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mr-4">
                                  <Store className="h-5 w-5 text-green-600" />
                                </div>
                                <div>
                                  <div className="font-bold text-lg">Penjual</div>
                                  <div className="text-sm text-gray-500">Saya ingin menjual Produk</div>
                                </div>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        {registerForm.formState.errors.role && (
                          <p className="text-sm text-red-500 font-medium">
                            {registerForm.formState.errors.role.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                      disabled={registerMutation.isPending}
                    >
                      {registerMutation.isPending ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                          Memproses...
                        </div>
                      ) : (
                        <>
                          <Sparkles className="mr-3 h-5 w-5" />
                          Daftar Sekarang
                        </>
                      )}
                    </Button>

                    <div className="text-center">
                      <p className="text-gray-600">
                        Sudah punya akun?{" "}
                        <button
                          type="button"
                          onClick={() => setMode("login")}
                          className="text-blue-600 font-bold hover:text-blue-700 transition-colors hover:underline"
                        >
                          Masuk di sini
                        </button>
                      </p>
                    </div>
                  </form>
                )}

                {/* Trust Indicators */}
                <div className="mt-8 pt-6 border-t border-gray-100">
                  <div className="flex items-center justify-center space-x-8 text-center">
                    <div className="flex flex-col items-center space-y-2">
                      <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
                        <Shield className="h-6 w-6 text-green-600" />
                      </div>
                      <p className="text-xs text-gray-600 font-semibold">100% Aman</p>
                    </div>
                    <div className="flex flex-col items-center space-y-2">
                      <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                        <CheckCircle className="h-6 w-6 text-blue-600" />
                      </div>
                      <p className="text-xs text-gray-600 font-semibold">Gratis Selamanya</p>
                    </div>
                    <div className="flex flex-col items-center space-y-2">
                      <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center">
                        <Heart className="h-6 w-6 text-purple-600" />
                      </div>
                      <p className="text-xs text-gray-600 font-semibold">Support 24/7</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
