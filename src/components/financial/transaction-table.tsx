'use client'

import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { TransactionFormDialog } from './transaction-form-dialog'
import { DeleteConfirmDialog } from './delete-confirm-dialog'

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

interface TransactionTableProps {
  data?: {
    transactions: Transaction[]
    pagination: {
      total: number
      page: number
      limit: number
      totalPages: number
      hasMore: boolean
    }
  }
  loading: boolean
  onPageChange: (page: number) => void
}

export function TransactionTable({ data, loading, onPageChange }: TransactionTableProps) {
  const [editTransaction, setEditTransaction] = useState<Transaction | null>(null)
  const [deleteTransaction, setDeleteTransaction] = useState<Transaction | null>(null)

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

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    )
  }

  if (!data || data.transactions.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">No transactions found</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Supplier</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Created By</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.transactions.map((transaction) => {
              const typeBadge = getTypeBadge(transaction.type)
              return (
                <TableRow key={transaction.id}>
                  <TableCell className="font-mono text-sm">
                    {formatDate(transaction.created_at)}
                  </TableCell>
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
                        <DropdownMenuItem onClick={() => setEditTransaction(transaction)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setDeleteTransaction(transaction)}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-muted-foreground text-sm">
          Showing {(data.pagination.page - 1) * data.pagination.limit + 1} to{' '}
          {Math.min(data.pagination.page * data.pagination.limit, data.pagination.total)} of{' '}
          {data.pagination.total} transactions
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(data.pagination.page - 1)}
            disabled={data.pagination.page === 1}
          >
            Previous
          </Button>
          <div className="flex items-center gap-1">
            {[...Array(Math.min(5, data.pagination.totalPages))].map((_, i) => {
              const pageNum = i + 1
              return (
                <Button
                  key={i}
                  variant={pageNum === data.pagination.page ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onPageChange(pageNum)}
                >
                  {pageNum}
                </Button>
              )
            })}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(data.pagination.page + 1)}
            disabled={!data.pagination.hasMore}
          >
            Next
          </Button>
        </div>
      </div>

      {/* Edit Dialog */}
      {editTransaction && (
        <TransactionFormDialog
          open={!!editTransaction}
          onOpenChange={(open) => !open && setEditTransaction(null)}
          transaction={editTransaction}
        />
      )}

      {/* Delete Dialog */}
      {deleteTransaction && (
        <DeleteConfirmDialog
          open={!!deleteTransaction}
          onOpenChange={(open) => !open && setDeleteTransaction(null)}
          transaction={deleteTransaction}
        />
      )}
    </div>
  )
}
