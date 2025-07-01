"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Store,
  ShoppingCart,
  Star,
  Shield,
  Users,
  Award,
  CheckCircle,
  ArrowRight,
  ChefHat,
  Clock,
  Sparkles,
  Heart,
  Crown,
  Globe,
  Smartphone,
  CreditCard,
  Headphones,
  Search,
  Target,
  Gift,
} from "lucide-react"
import { Link } from "wouter"
import { useState } from "react"

export default function Landing() {
  const [activeFeature, setActiveFeature] = useState(0)

  const features = [
    {
      icon: <Store className="h-6 w-6" />,
      title: "Marketplace Terpercaya",
      description: "Platform yang aman dengan sistem verifikasi berlapis untuk menjamin kualitas setiap transaksi.",
      color: "blue",
      stats: "99.9% Uptime",
    },
    {
      icon: <ChefHat className="h-6 w-6" />,
      title: "Chef Profesional",
      description: "Kerjasama dengan chef berpengalaman dan bersertifikat untuk menciptakan cita rasa terbaik.",
      color: "orange",
      stats: "500+ Chef",
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Pengiriman Cepat",
      description: "Sistem logistik dengan tracking real-time dan jaminan ketepatan waktu hingga 99.9%.",
      color: "green",
      stats: "30 Menit Avg",
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Keamanan Terjamin",
      description: "Transaksi aman dengan enkripsi tingkat bank dan perlindungan data pribadi yang ketat.",
      color: "purple",
      stats: "256-bit SSL",
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Komunitas Aktif",
      description: "Bergabung dengan ribuan penjual dan pembeli aktif yang saling mendukung.",
      color: "pink",
      stats: "100K+ Users",
    },
    {
      icon: <Award className="h-6 w-6" />,
      title: "Kualitas Premium",
      description: "Standar kualitas tinggi dengan sistem review transparan dan rating terverifikasi.",
      color: "yellow",
      stats: "4.9/5 Rating",
    },
  ]

  const stats = [
    { number: "100K+", label: "Pengguna Aktif", icon: <Users className="h-5 w-5" /> },
    { number: "5K+", label: "Penjual Terdaftar", icon: <Store className="h-5 w-5" /> },
    { number: "500K+", label: "Pesanan Selesai", icon: <CheckCircle className="h-5 w-5" /> },
    { number: "4.9/5", label: "Rating Kepuasan", icon: <Star className="h-5 w-5" /> },
  ]

  const testimonials = [
    {
      name: "Sarah Wijaya",
      role: "Event Organizer",
      content:
        "Platform yang sangat membantu untuk kebutuhan Produk acara. Kualitas terjamin dan pelayanan memuaskan!",
      rating: 5,
      avatar: "SW",
      company: "Elegant Events",
    },
    {
      name: "Ahmad Rizki",
      role: "Penjual Produk",
      content: "Sejak bergabung, penjualan meningkat drastis. Interface mudah digunakan dan support team responsif.",
      rating: 5,
      avatar: "AR",
      company: "Rizki Catering",
    },
    {
      name: "Maya Sari",
      role: "Corporate Manager",
      content: "Solusi terbaik untuk kebutuhan Produk kantor. Proses pemesanan cepat dan hasil selalu memuaskan.",
      rating: 5,
      avatar: "MS",
      company: "Tech Corp",
    },
  ]

  const benefits = [
    { icon: <CreditCard className="h-5 w-5" />, text: "Pembayaran Aman" },
    { icon: <Headphones className="h-5 w-5" />, text: "Support 24/7" },
    { icon: <Smartphone className="h-5 w-5" />, text: "Mobile Friendly" },
    { icon: <Globe className="h-5 w-5" />, text: "Jangkauan Nasional" },
  ]

  const processSteps = [
    {
      step: "1",
      title: "Daftar & Verifikasi",
      description: "Buat akun gratis dan verifikasi identitas untuk keamanan maksimal",
      icon: <Users className="h-8 w-8" />,
    },
    {
      step: "2",
      title: "Jelajahi & Pilih",
      description: "Temukan Produk terbaik dengan filter canggih dan review pelanggan",
      icon: <Search className="h-8 w-8" />,
    },
    {
      step: "3",
      title: "Pesan & Nikmati",
      description: "Lakukan pemesanan dengan pembayaran aman dan nikmati Produk berkualitas",
      icon: <CheckCircle className="h-8 w-8" />,
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center bg-gradient-to-br from-slate-50 to-blue-50 overflow-hidden">
        {/* Simple Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 25px 25px, rgba(59,130,246,0.3) 2px, transparent 0)`,
              backgroundSize: "50px 50px",
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <Badge className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full font-semibold">
                <Sparkles className="h-4 w-4 mr-2" />
                Platform Produk Terdepan di Indonesia
              </Badge>

              <div className="space-y-6">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Revolusi
                  <span className="block text-blue-600">Produk Digital</span>
                  <span className="block text-2xl sm:text-3xl lg:text-4xl text-gray-600 font-semibold mt-2">
                    untuk Indonesia
                  </span>
                </h1>

                <p className="text-xl text-gray-600 leading-relaxed max-w-2xl">
                  Temukan dan pesan Produk terbaik dengan mudah. Platform yang menghubungkan
                  <span className="text-blue-600 font-semibold"> ribuan penjual Produk profesional </span>
                  dengan pelanggan di seluruh Indonesia.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/auth?mode=seller">
                  <Button className="group px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl">
                    <Store className="mr-3 h-5 w-5" />
                    Mulai Jual Produk
                    <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>

                <Link href="/auth?mode=buyer">
                  <Button
                    variant="outline"
                    className="group px-8 py-4 border-2 border-gray-300 hover:border-blue-300 text-gray-700 hover:text-blue-600 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105"
                  >
                    <ShoppingCart className="mr-3 h-5 w-5" />
                    Pesan Produk
                  </Button>
                </Link>
              </div>

              {/* Benefits */}
              <div className="flex flex-wrap gap-4 pt-4">
                {benefits.map((benefit, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100"
                  >
                    <div className="text-blue-600">{benefit.icon}</div>
                    <span className="text-sm font-medium text-gray-700">{benefit.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Content - Stats */}
            <div className="lg:pl-8">
              <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
                <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Platform Terpercaya</h3>
                <div className="grid grid-cols-2 gap-6">
                  {stats.map((stat, index) => (
                    <div key={index} className="text-center group hover:scale-105 transition-transform duration-300">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-200 transition-colors">
                        <div className="text-blue-600">{stat.icon}</div>
                      </div>
                      <div className="text-2xl font-bold text-gray-900 mb-1">{stat.number}</div>
                      <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 px-4 py-2 bg-purple-100 text-purple-700 rounded-full font-semibold">
              <Crown className="h-4 w-4 mr-2" />
              Mengapa Memilih Kami
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Fitur <span className="text-blue-600">Unggulan</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Berbagai keunggulan yang membuat UPJ Marketplace menjadi pilihan terbaik
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="group border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer"
                onClick={() => setActiveFeature(index)}
              >
                <CardContent className="p-8">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-all duration-300 ${
                      activeFeature === index
                        ? "bg-blue-600 text-white scale-110"
                        : "bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white"
                    }`}
                  >
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-4">{feature.description}</p>
                  <Badge className="bg-green-100 text-green-700 font-semibold">✓ {feature.stats}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 px-4 py-2 bg-green-100 text-green-700 rounded-full font-semibold">
              <Target className="h-4 w-4 mr-2" />
              Cara Kerja
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Mudah dalam <span className="text-green-600">3 Langkah</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {processSteps.map((step, index) => (
              <div key={index} className="text-center group">
                <div className="relative mb-8">
                  {/* Connection Line */}
                  {index < processSteps.length - 1 && (
                    <div className="hidden md:block absolute top-10 left-full w-full h-0.5 bg-gray-200 transform translate-x-4 z-0" />
                  )}

                  {/* Step Circle */}
                  <div className="relative w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:scale-110 transition-transform duration-300 z-10">
                    <div className="text-white">{step.icon}</div>
                  </div>

                  {/* Step Number */}
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-sm font-bold text-gray-900">{step.step}</span>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 px-4 py-2 bg-pink-100 text-pink-700 rounded-full font-semibold">
              <Heart className="h-4 w-4 mr-2" />
              Testimoni Pelanggan
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Apa Kata <span className="text-pink-600">Mereka</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-6 italic leading-relaxed">"{testimonial.content}"</p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mr-4 text-white font-bold">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">{testimonial.name}</div>
                      <div className="text-sm text-gray-600">{testimonial.role}</div>
                      <div className="text-xs text-blue-600 font-semibold">{testimonial.company}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="mb-8 bg-white/20 text-white border-white/30 px-6 py-3 rounded-full font-semibold backdrop-blur-sm">
            <Gift className="h-5 w-5 mr-2" />
            Bergabung Sekarang
          </Badge>

          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 leading-tight">
            Siap Memulai Perjalanan
            <br />
            <span className="text-yellow-300">Produk Digital Anda?</span>
          </h2>

          <p className="text-xl text-white/90 max-w-3xl mx-auto mb-12 leading-relaxed">
            Bergabunglah dengan ribuan penjual dan pembeli yang telah merasakan kemudahan bertransaksi di platform kami.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <Link href="/auth?mode=seller">
              <Button
                size="lg"
                className="px-12 py-6 bg-white text-blue-600 hover:bg-yellow-300 hover:text-blue-700 font-bold text-lg rounded-xl shadow-2xl hover:scale-105 transition-all duration-300"
              >
                <Store className="mr-3 h-6 w-6" />
                Daftar Sebagai Penjual
                <ArrowRight className="ml-3 h-6 w-6" />
              </Button>
            </Link>

            <Link href="/auth?mode=buyer">
              <Button
                size="lg"
                variant="outline"
                className="px-12 py-6 border-2 border-white text-white hover:bg-white hover:text-blue-600 font-bold text-lg rounded-xl hover:scale-105 transition-all duration-300"
              >
                <ShoppingCart className="mr-3 h-6 w-6" />
                Daftar Sebagai Pembeli
              </Button>
            </Link>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-8 text-white/80">
            {[
              { icon: <CheckCircle className="h-5 w-5" />, text: "Gratis Selamanya" },
              { icon: <CheckCircle className="h-5 w-5" />, text: "Tanpa Biaya Setup" },
              { icon: <CheckCircle className="h-5 w-5" />, text: "Support 24/7" },
              { icon: <CheckCircle className="h-5 w-5" />, text: "Jaminan Keamanan" },
            ].map((item, index) => (
              <div key={index} className="flex items-center space-x-2 hover:text-white transition-colors">
                <div className="text-green-400">{item.icon}</div>
                <span className="font-semibold">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
