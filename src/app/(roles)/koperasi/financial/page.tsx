'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { trpc } from '@/lib/trpc'
import { formatCurrency, getPeriodLabel } from '@/lib/financial-utils'
import { FinancialChart } from '@/components/features/financial/FinancialChart'
import { TransactionTable } from '@/components/features/financial/TransactionTable'
import {
  TransactionForm,
  type TransactionFormData,
} from '@/components/features/financial/TransactionForm'
import type { Transaction, Period } from '@/types/financial'
import { PiggyBank, TrendingUp, ArrowUp, ArrowDown, DollarSign, Plus } from 'lucide-react'

export default function FinancialPage() {
  const [period, setPeriod] = useState<Period>('today')
  const [page, setPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)

  // Queries
  const totalBalanceQuery = trpc.financial.getTotalBalance.useQuery()
  const summaryQuery = trpc.financial.getDailySummary.useQuery({ period })
  const transactionsQuery = trpc.financial.getTransactions.useQuery({
    period,
    page,
    limit: 10,
    search: searchQuery,
  })
  const chartQuery = trpc.financial.getChartData.useQuery({ period })

  // Mutations
  const createMutation = trpc.financial.createTransaction.useMutation({
    onSuccess: () => {
      totalBalanceQuery.refetch()
      summaryQuery.refetch()
      transactionsQuery.refetch()
      chartQuery.refetch()
      setIsFormOpen(false)
      setEditingTransaction(null)
    },
  })

  const updateMutation = trpc.financial.updateTransaction.useMutation({
    onSuccess: () => {
      totalBalanceQuery.refetch()
      summaryQuery.refetch()
      transactionsQuery.refetch()
      chartQuery.refetch()
      setIsFormOpen(false)
      setEditingTransaction(null)
    },
  })

  const deleteMutation = trpc.financial.deleteTransaction.useMutation({
    onSuccess: () => {
      totalBalanceQuery.refetch()
      summaryQuery.refetch()
      transactionsQuery.refetch()
      chartQuery.refetch()
    },
  })

  const totalBalance = totalBalanceQuery.data
  const summary = summaryQuery.data
  const transactions = transactionsQuery.data?.transactions || []
  const pagination = transactionsQuery.data?.pagination || {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
    hasMore: false,
  }
  const chartData = chartQuery.data || []

  const handleFormSubmit = (data: TransactionFormData) => {
    if (editingTransaction) {
      updateMutation.mutate({
        id: editingTransaction.id,
        ...data,
      })
    } else {
      createMutation.mutate(data)
    }
  }

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction)
    setIsFormOpen(true)
  }

  const handleDelete = (transaction: Transaction) => {
    if (confirm(`Hapus transaksi "${transaction.description}"?`)) {
      deleteMutation.mutate({ id: transaction.id })
    }
  }

  const handleNewTransaction = () => {
    setEditingTransaction(null)
    setIsFormOpen(true)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Keuangan</h1>
        <p className="mt-1 text-sm text-gray-500">Kelola dan monitor transaksi keuangan koperasi</p>
      </div>

      {/* Period Selector & Add Button */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Periode:</label>
          <select
            value={period}
            onChange={(e) => {
              setPeriod(e.target.value as Period)
              setPage(1)
            }}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
          >
            <option value="today">Hari Ini</option>
            <option value="week">7 Hari Terakhir</option>
            <option value="month">30 Hari Terakhir</option>
          </select>
        </div>
        <Button onClick={handleNewTransaction}>
          <Plus className="mr-2 h-4 w-4" />
          Tambah Transaksi
        </Button>
      </div>

      {/* Saldo Tersedia Card (Total Balance - All Time) */}
      <div className="mb-6 flex justify-center">
        <Card className="w-full max-w-md border-2 border-green-300 bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="pt-6 pb-4">
            {/* Icon */}
            <div className="mb-4 flex justify-center">
              <div className="rounded-2xl bg-green-500 p-4">
                <PiggyBank className="h-8 w-8 text-white" />
              </div>
            </div>

            {/* Title */}
            <div className="mb-2 text-center">
              <h3 className="text-sm font-medium text-green-800">TOTAL SALDO KESELURUHAN</h3>
              <p className="text-xs text-green-600">
                {totalBalance?.totalTransactions || 0} transaksi sejak awal
              </p>
            </div>

            {/* Amount (Large, Centered) - TOTAL BALANCE */}
            <div className="mb-1 text-center">
              <p className="text-4xl font-bold text-green-900">
                {totalBalanceQuery.isLoading
                  ? 'Loading...'
                  : formatCurrency(totalBalance?.totalBalance || 0)}
              </p>
            </div>

            {/* Period Change Indicator */}
            <div className="mb-4 text-center">
              <p className="text-xs text-green-700">
                Perubahan {getPeriodLabel(period).toLowerCase()}:{' '}
                <span
                  className={`font-semibold ${
                    (summary?.netCashFlow || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {(summary?.netCashFlow || 0) >= 0 ? '+' : ''}
                  {formatCurrency(summary?.netCashFlow || 0)}
                </span>
              </p>
            </div>

            {/* Status Badge */}
            <div className="mb-4 flex justify-center">
              <span
                className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
                  (totalBalance?.totalBalance || 0) >= 0
                    ? 'bg-green-500 text-white'
                    : 'bg-red-500 text-white'
                }`}
              >
                <TrendingUp className="h-3 w-3" />
                {(totalBalance?.totalBalance || 0) >= 0 ? 'Surplus' : 'Deficit'}
              </span>
            </div>

            {/* Breakdown Cards - TOTAL BALANCE */}
            <div className="mb-4 space-y-2">
              {/* Toko */}
              <div className="rounded-lg border border-green-200 bg-white/60 p-3 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-blue-500" />
                    <span className="text-sm font-medium text-gray-700">Toko</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">
                    {formatCurrency(totalBalance?.tokoBalance || 0)}
                  </span>
                </div>
              </div>

              {/* Titipan */}
              <div className="rounded-lg border border-green-200 bg-white/60 p-3 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-purple-500" />
                    <span className="text-sm font-medium text-gray-700">Titipan</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">
                    {formatCurrency(totalBalance?.titipanBalance || 0)}
                  </span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-green-200 pt-3 text-center">
              <p className="text-xs text-green-700">
                Periode tampilan: <span className="font-semibold">{getPeriodLabel(period)}</span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Metrics Cards */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Mutasi Masuk - Green */}
        <Card className="border-2 border-green-200 bg-white">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-700">MUTASI MASUK</CardTitle>
              <ArrowUp className="h-5 w-5 text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {summaryQuery.isLoading ? 'Loading...' : formatCurrency(summary?.cashIn || 0)}
            </div>
            <p className="mt-1 text-xs text-gray-500">Cash In periode ini</p>
          </CardContent>
        </Card>

        {/* Mutasi Keluar - Red */}
        <Card className="border-2 border-red-200 bg-white">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-700">MUTASI KELUAR</CardTitle>
              <ArrowDown className="h-5 w-5 text-red-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {summaryQuery.isLoading ? 'Loading...' : formatCurrency(summary?.cashOut || 0)}
            </div>
            <p className="mt-1 text-xs text-gray-500">Cash Out periode ini</p>
          </CardContent>
        </Card>

        {/* Selisih - Blue */}
        <Card className="border-2 border-blue-200 bg-white">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-700">SELISIH</CardTitle>
              <DollarSign className="h-5 w-5 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {summaryQuery.isLoading ? 'Loading...' : formatCurrency(summary?.netCashFlow || 0)}
            </div>
            <p className="mt-1 text-xs text-gray-500">Net Cash Flow</p>
          </CardContent>
        </Card>
      </div>

      {/* Financial Chart */}
      <div className="mb-6">
        <FinancialChart data={chartData} />
      </div>

      {/* Transaction Table */}
      <TransactionTable
        transactions={transactions}
        pagination={pagination}
        onPageChange={setPage}
        onSearch={setSearchQuery}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Transaction Form Modal */}
      <TransactionForm
        transaction={editingTransaction}
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false)
          setEditingTransaction(null)
        }}
        onSubmit={handleFormSubmit}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  )
}
