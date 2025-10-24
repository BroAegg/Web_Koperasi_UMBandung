'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Download, Filter } from 'lucide-react'
import { trpc } from '@/lib/trpc/client'
import { FinancialSummary } from './financial-summary'
import { TransactionTable } from './transaction-table'
import { TransactionFormDialog } from './transaction-form-dialog'
import { TransactionFilters } from './transaction-filters'
import { SkeletonTable } from '@/components/ui/loading-skeleton'

export function FinancialContent() {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [period, setPeriod] = useState<'today' | 'week' | 'month' | 'custom'>('month')
  const [filters, setFilters] = useState({
    search: '',
    type: undefined as 'CASH_IN' | 'CASH_OUT' | 'TRANSFER' | 'ADJUSTMENT' | undefined,
    category: undefined as
      | 'SALES'
      | 'PURCHASE'
      | 'OPERATIONAL'
      | 'MEMBER_DEPOSIT'
      | 'MEMBER_WITHDRAWAL'
      | 'OTHER'
      | undefined,
    page: 1,
    limit: 10,
  })

  // Fetch summary data
  const summaryQuery = trpc.financial.getDailySummary.useQuery({ period })

  // Fetch transactions
  const transactionsQuery = trpc.financial.getTransactions.useQuery({
    ...filters,
    period,
  })

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters)
  }

  return (
    <div className="space-y-6">
      {/* Financial Summary Cards */}
      <FinancialSummary
        data={
          summaryQuery.data as unknown as typeof summaryQuery.data & {
            status: 'surplus' | 'deficit'
          }
        }
        loading={summaryQuery.isLoading}
        period={period}
        onPeriodChange={setPeriod}
      />

      {/* Transactions Section */}
      <Card hover>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Transactions</CardTitle>
              <CardDescription>View and manage all financial transactions</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setIsFilterOpen(!isFilterOpen)}>
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
              <Button size="sm" onClick={() => setIsFormOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                New Transaction
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          {isFilterOpen && (
            <div className="animate-slide-down mb-4">
              <TransactionFilters filters={filters} onFilterChange={handleFilterChange} />
            </div>
          )}

          {/* Transactions Table */}
          {transactionsQuery.isLoading ? (
            <SkeletonTable rows={5} />
          ) : (
            <TransactionTable
              data={
                transactionsQuery.data
                  ? {
                      transactions: transactionsQuery.data.transactions.map((tx) => ({
                        ...tx,
                        amount: Number(tx.amount),
                      })),
                      pagination: transactionsQuery.data.pagination,
                    }
                  : undefined
              }
              loading={transactionsQuery.isLoading}
              onPageChange={(page) => setFilters({ ...filters, page })}
            />
          )}
        </CardContent>
      </Card>

      {/* Transaction Form Dialog */}
      <TransactionFormDialog open={isFormOpen} onOpenChange={setIsFormOpen} />
    </div>
  )
}
