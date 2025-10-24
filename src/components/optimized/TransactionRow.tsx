// Optimized Transaction Row Component
// Prevents unnecessary re-renders in large transaction tables

import { memo } from 'react'
import { TableCell, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Transaction {
  id: string
  type: string
  category: string
  amount: number
  description: string
  notes: string | null
  created_at: Date
  supplier: {
    id: string
    business_name: string
  } | null
  createdBy: {
    id: string
    full_name: string
    role: string
  }
}

interface TransactionRowProps {
  transaction: Transaction
  onEdit: (transaction: Transaction) => void
  onDelete: (transaction: Transaction) => void
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value)
}

const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const getTypeBadge = (type: string) => {
  const variants: Record<string, { label: string; className: string }> = {
    CASH_IN: {
      label: 'Cash In',
      className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    },
    CASH_OUT: {
      label: 'Cash Out',
      className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    },
    TRANSFER: {
      label: 'Transfer',
      className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    },
    ADJUSTMENT: {
      label: 'Adjustment',
      className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    },
  }
  return variants[type] || { label: type, className: '' }
}

const getCategoryBadge = (category: string) => {
  const labels: Record<string, string> = {
    SALES: 'Sales',
    PURCHASE: 'Purchase',
    OPERATIONAL: 'Operational',
    MEMBER_DEPOSIT: 'Member Deposit',
    MEMBER_WITHDRAWAL: 'Member Withdrawal',
    OTHER: 'Other',
  }
  return labels[category] || category
}

export const TransactionRow = memo(function TransactionRow({
  transaction,
  onEdit,
  onDelete,
}: TransactionRowProps) {
  const typeBadge = getTypeBadge(transaction.type)

  return (
    <TableRow key={transaction.id}>
      <TableCell className="font-mono text-sm">{formatDate(transaction.created_at)}</TableCell>
      <TableCell>
        <Badge variant="outline" className={typeBadge.className}>
          {typeBadge.label}
        </Badge>
      </TableCell>
      <TableCell>
        <Badge variant="secondary">{getCategoryBadge(transaction.category)}</Badge>
      </TableCell>
      <TableCell>
        <div>
          <div className="font-medium">{transaction.description}</div>
          {transaction.notes && (
            <div className="text-muted-foreground text-sm">{transaction.notes}</div>
          )}
        </div>
      </TableCell>
      <TableCell>
        {transaction.supplier ? (
          <span className="text-sm">{transaction.supplier.business_name}</span>
        ) : (
          <span className="text-muted-foreground text-sm">-</span>
        )}
      </TableCell>
      <TableCell className="text-right font-mono">
        <span
          className={cn(
            'font-semibold',
            transaction.type === 'CASH_IN'
              ? 'text-green-600 dark:text-green-400'
              : 'text-red-600 dark:text-red-400'
          )}
        >
          {transaction.type === 'CASH_IN' ? '+' : '-'}
          {formatCurrency(transaction.amount)}
        </span>
      </TableCell>
      <TableCell>
        <div className="text-sm">
          <div className="font-medium">{transaction.createdBy.full_name}</div>
          <div className="text-muted-foreground">{transaction.createdBy.role}</div>
        </div>
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(transaction)}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete(transaction)} className="text-red-600">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  )
})
