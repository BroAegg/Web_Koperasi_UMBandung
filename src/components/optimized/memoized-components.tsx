// Performance optimized components
// Memoized versions of frequently re-rendering components

import { memo } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal, Pencil, Package, Trash2, AlertTriangle } from 'lucide-react'

interface Product {
  id: string
  sku: string
  name: string
  description?: string | null
  category_id: string
  supplier_id: string
  purchase_price: number
  selling_price: number
  stock: number
  min_stock: number
  image?: string | null
  is_active: boolean
  category: {
    id: string
    name: string
    description?: string | null
  }
  supplier: {
    id: string
    business_name: string
    contact_person: string
    phone: string
  }
}

interface ProductCardProps {
  product: Product
  onEdit: (product: Product) => void
  onUpdateStock: (productId: string) => void
  onDelete: (product: Product) => void
}

// Optimized Product Card Component
export const ProductCard = memo(function ProductCard({
  product,
  onEdit,
  onUpdateStock,
  onDelete,
}: ProductCardProps) {
  const isLowStock = product.stock <= product.min_stock
  const profitMargin = (
    ((product.selling_price - product.purchase_price) / product.purchase_price) *
    100
  ).toFixed(1)

  return (
    <div className="group bg-card relative rounded-lg border p-4 transition-all hover:shadow-md">
      {/* Low Stock Badge */}
      {isLowStock && (
        <Badge variant="destructive" className="absolute top-4 right-4 gap-1">
          <AlertTriangle className="h-3 w-3" />
          Stok Rendah
        </Badge>
      )}

      {/* Product Info */}
      <div className="mb-3">
        <p className="text-muted-foreground text-xs">{product.sku}</p>
        <h3 className="mt-1 font-semibold">{product.name}</h3>
        <Badge variant="outline" className="mt-2">
          {product.category.name}
        </Badge>
      </div>

      {/* Stock Info */}
      <div className="mb-3 space-y-1 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Stok:</span>
          <span className={`font-medium ${isLowStock ? 'text-destructive' : ''}`}>
            {product.stock} unit
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Min Stok:</span>
          <span className="font-medium">{product.min_stock} unit</span>
        </div>
        <div className="flex justify-between border-t pt-1">
          <span className="text-muted-foreground">Supplier:</span>
          <span className="text-xs font-medium">{product.supplier.business_name}</span>
        </div>
      </div>

      {/* Price Info */}
      <div className="bg-muted/50 mb-3 rounded-md p-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Harga Beli:</span>
          <span className="font-medium">Rp {product.purchase_price.toLocaleString('id-ID')}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Harga Jual:</span>
          <span className="text-primary font-semibold">
            Rp {product.selling_price.toLocaleString('id-ID')}
          </span>
        </div>
        <div className="flex justify-between border-t pt-1">
          <span className="text-muted-foreground">Margin:</span>
          <Badge variant={Number(profitMargin) > 20 ? 'default' : 'secondary'}>
            {profitMargin}%
          </Badge>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => onUpdateStock(product.id)}
          className="flex-1"
        >
          <Package className="mr-1 h-3 w-3" />
          Update Stok
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="outline">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(product)}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete(product)} className="text-red-600">
              <Trash2 className="mr-2 h-4 w-4" />
              Hapus
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
})

// Optimized Cart Item Component for POS
interface CartItemCardProps {
  item: {
    product_id: string
    name: string
    sku: string
    price: number
    quantity: number
    stock: number
  }
  onUpdateQuantity: (productId: string, quantity: number) => void
  onRemove: (productId: string) => void
}

export const CartItemCard = memo(function CartItemCard({
  item,
  onUpdateQuantity,
  onRemove,
}: CartItemCardProps) {
  return (
    <div className="bg-card hover:bg-accent/50 flex gap-3 rounded-lg border p-3 transition-colors">
      <div className="min-w-0 flex-1">
        {/* Product Info */}
        <p className="truncate text-sm font-medium">{item.name}</p>
        <p className="text-muted-foreground text-xs">{item.sku}</p>
        <p className="text-primary mt-1 text-sm font-semibold">
          Rp {item.price.toLocaleString('id-ID')}
        </p>

        {/* Quantity Controls */}
        <div className="mt-2 flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7"
            onClick={() => onUpdateQuantity(item.product_id, Math.max(1, item.quantity - 1))}
            disabled={item.quantity <= 1}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </Button>
          <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7"
            onClick={() => onUpdateQuantity(item.product_id, item.quantity + 1)}
            disabled={item.quantity >= item.stock}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive hover:text-destructive ml-auto h-7 w-7"
            onClick={() => onRemove(item.product_id)}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>

        {/* Stock Warning */}
        {item.quantity >= item.stock && (
          <p className="text-destructive mt-1 text-xs">Maksimal stok: {item.stock}</p>
        )}
      </div>

      {/* Subtotal */}
      <div className="text-right">
        <p className="text-sm font-bold">
          Rp {(item.price * item.quantity).toLocaleString('id-ID')}
        </p>
        <p className="text-muted-foreground text-xs">
          {item.quantity} × Rp {item.price.toLocaleString('id-ID')}
        </p>
      </div>
    </div>
  )
})
