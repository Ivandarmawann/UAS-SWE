"use client"

import type React from "react"

import { Link, useLocation } from "wouter"
import { useAuth } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, ShoppingBag, Package, LogOut, Menu, X, Bell, User } from "lucide-react"
import { useState } from "react"

interface NavbarProps {
  onSearch?: (query: string) => void
}

export function Navbar({ onSearch }: NavbarProps) {
  const { user, isAuthenticated, logout } = useAuth()
  const [location] = useLocation()
  const [searchQuery, setSearchQuery] = useState("")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
    onSearch?.(query)
  }

  const handleLogout = () => {
    logout()
    window.location.href = "/"
  }

  const isAuthPage = location.includes("/auth")

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 group">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-blue-200 transition-all duration-300">
                  <ShoppingBag className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">UPJ MarketPlace</h1>
                  <p className="text-xs text-blue-600 font-medium">Platform Terdepan</p>
                </div>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          {isAuthenticated && (
            <div className="hidden md:flex items-center space-x-1">
              <Link
                href={user?.role === "buyer" ? "/buyer" : "/seller"}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  location === (user?.role === "buyer" ? "/buyer" : "/seller")
                    ? "bg-blue-50 text-blue-700 shadow-sm"
                    : "text-gray-600 hover:text-blue-700 hover:bg-blue-50"
                }`}
              >
                Dashboard
              </Link>

              {user?.role === "buyer" && (
                <Link
                  href="/orders"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center ${
                    location === "/orders"
                      ? "bg-blue-50 text-blue-700 shadow-sm"
                      : "text-gray-600 hover:text-blue-700 hover:bg-blue-50"
                  }`}
                >
                  <Package className="w-4 h-4 mr-2" />
                  Pesanan
                </Link>
              )}
            </div>
          )}

          {/* Search Bar */}
          {isAuthenticated && user?.role === "buyer" && !isAuthPage && (
            <div className="hidden md:block flex-1 max-w-md mx-8">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Cari katering impian Anda..."
                  value={searchQuery}
                  onChange={handleSearch}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-gray-200 rounded-xl focus:bg-white focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              </div>
            </div>
          )}

          {/* Right side */}
          <div className="flex items-center space-x-3">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                {/* Notifications */}
                <Button variant="ghost" size="sm" className="relative p-2 hover:bg-blue-50 rounded-lg">
                  <Bell className="h-5 w-5 text-gray-600" />
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-red-500"
                  >
                    3
                  </Badge>
                </Button>

                {/* User Menu */}
                <div className="flex items-center space-x-3 pl-3 border-l border-gray-200">
                  <div className="hidden sm:block text-right">
                    <div className="text-sm font-semibold text-gray-900">{user?.fullName || "User"}</div>
                    <div className="text-xs text-blue-600 capitalize font-medium">{user?.role}</div>
                  </div>

                  <div className="w-9 h-9 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-md">
                    <User className="h-4 w-4 text-white" />
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link href="/auth?mode=login">
                  <Button variant="ghost" size="sm" className="text-gray-600 hover:text-blue-700 hover:bg-blue-50">
                    Masuk
                  </Button>
                </Link>
                <Link href="/auth?mode=register">
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-md hover:shadow-lg transition-all duration-200 rounded-lg px-6"
                  >
                    Daftar
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 hover:bg-blue-50 rounded-lg"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 py-4 space-y-2 bg-white">
            {isAuthenticated && (
              <>
                <Link
                  href={user?.role === "buyer" ? "/buyer" : "/seller"}
                  className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors mx-2 ${
                    location === (user?.role === "buyer" ? "/buyer" : "/seller")
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-600 hover:text-blue-700 hover:bg-blue-50"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>

                {user?.role === "buyer" && (
                  <>
                    <Link
                      href="/orders"
                      className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors mx-2 flex items-center ${
                        location === "/orders"
                          ? "bg-blue-50 text-blue-700"
                          : "text-gray-600 hover:text-blue-700 hover:bg-blue-50"
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Package className="w-4 h-4 mr-2" />
                      Pesanan
                    </Link>

                    <div className="px-4 py-2">
                      <div className="relative">
                        <Input
                          type="text"
                          placeholder="Cari katering..."
                          value={searchQuery}
                          onChange={handleSearch}
                          className="w-full pl-10 bg-gray-50 border-gray-200 rounded-xl focus:bg-white focus:border-blue-300"
                        />
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      </div>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
