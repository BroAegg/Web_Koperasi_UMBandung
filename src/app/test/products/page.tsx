'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { trpc } from '@/lib/trpc'
import { ArrowLeft, Package, TrendingDown, Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function ProductsTestPage() {
  const { data: stats, isLoading: statsLoading } = trpc.product.getStats.useQuery()
  const { data: productsData, isLoading: productsLoading } = trpc.product.getAll.useQuery({
    limit: 20,
    skip: 0,
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">🛍️ Products Test Page</h1>
            <p className="text-gray-600">Testing tRPC + Prisma data fetching</p>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <Card className="border-2 border-blue-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-gray-600">Total Products</CardTitle>
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
              ) : (
                <p className="text-3xl font-bold text-blue-600">{stats?.total || 0}</p>
              )}
            </CardContent>
          </Card>

          <Card className="border-2 border-green-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-gray-600">Active Products</CardTitle>
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
              ) : (
                <p className="text-3xl font-bold text-green-600">{stats?.active || 0}</p>
              )}
            </CardContent>
          </Card>

          <Card className="border-2 border-orange-200">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm text-gray-600">
                <TrendingDown className="h-4 w-4" />
                Low Stock
              </CardTitle>
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
              ) : (
                <p className="text-3xl font-bold text-orange-600">{stats?.lowStock || 0}</p>
              )}
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-gray-600">Categories</CardTitle>
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
              ) : (
                <p className="text-3xl font-bold text-purple-600">{stats?.categories || 0}</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Products List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Products List
            </CardTitle>
          </CardHeader>
          <CardContent>
            {productsLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                <span className="ml-2 text-gray-600">Loading products...</span>
              </div>
            ) : productsData?.products.length === 0 ? (
              <div className="py-8 text-center text-gray-500">No products found</div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {productsData?.products.map((product: any) => (
                    <Card key={product.id} className="border border-gray-200">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-base">{product.name}</CardTitle>
                            <p className="mt-1 text-xs text-gray-500">{product.sku}</p>
                          </div>
                          {product.stock <= product.min_stock && (
                            <span className="rounded bg-orange-100 px-2 py-1 text-xs text-orange-700">
                              Low Stock
                            </span>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Category:</span>
                          <span className="font-medium">{product.category.name}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Supplier:</span>
                          <span className="font-medium">{product.supplier.business_name}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Stock:</span>
                          <span
                            className={`font-bold ${
                              product.stock <= product.min_stock
                                ? 'text-orange-600'
                                : 'text-green-600'
                            }`}
                          >
                            {product.stock} units
                          </span>
                        </div>
                        <div className="space-y-1 border-t pt-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Purchase:</span>
                            <span className="font-medium">
                              Rp {product.purchase_price.toString()}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Selling:</span>
                            <span className="font-bold text-green-600">
                              Rp {product.selling_price.toString()}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Pagination Info */}
                <div className="border-t pt-4 text-center text-sm text-gray-600">
                  Showing {productsData?.products.length} of {productsData?.pagination.total}{' '}
                  products
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* API Response Debug */}
        <Card className="bg-gray-50">
          <CardHeader>
            <CardTitle className="text-sm">🔍 Raw API Response</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="max-h-60 overflow-auto rounded border bg-white p-4 text-xs">
              {JSON.stringify(productsData, null, 2)}
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
