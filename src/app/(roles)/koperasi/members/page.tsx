'use client'

import { useState } from 'react'
import { trpc } from '@/lib/trpc'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Users, TrendingUp, TrendingDown, DollarSign, X, Search } from 'lucide-react'

type TransactionType = 'MEMBER_DEPOSIT' | 'MEMBER_WITHDRAWAL'

export default function MembersPage() {
  const [showForm, setShowForm] = useState(false)
  const [transactionType, setTransactionType] = useState<TransactionType>('MEMBER_DEPOSIT')
  const [memberName, setMemberName] = useState('')
  const [amount, setAmount] = useState<number>(0)
  const [paymentMethod, setPaymentMethod] = useState<
    'CASH' | 'BANK_TRANSFER' | 'E_WALLET' | 'OTHER'
  >('CASH')
  const [notes, setNotes] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<TransactionType | ''>('')

  const utils = trpc.useUtils()

  // Queries
  const { data: transactionsData } = trpc.member.getMemberTransactions.useQuery({
    member_name: searchQuery || undefined,
    type: filterType || undefined,
    page: 1,
    limit: 50,
  })

  const { data: stats } = trpc.member.getMemberStats.useQuery()

  // Mutations
  const depositMutation = trpc.member.recordDeposit.useMutation({
    onSuccess: () => {
      utils.member.getMemberTransactions.invalidate()
      utils.member.getMemberStats.invalidate()
      setShowForm(false)
      resetForm()
    },
  })

  const withdrawalMutation = trpc.member.recordWithdrawal.useMutation({
    onSuccess: () => {
      utils.member.getMemberTransactions.invalidate()
      utils.member.getMemberStats.invalidate()
      setShowForm(false)
      resetForm()
    },
  })

  const resetForm = () => {
    setMemberName('')
    setAmount(0)
    setPaymentMethod('CASH')
    setNotes('')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const data = {
      member_name: memberName,
      amount,
      payment_method: paymentMethod,
      notes: notes || undefined,
    }

    if (transactionType === 'MEMBER_DEPOSIT') {
      depositMutation.mutate(data)
    } else {
      withdrawalMutation.mutate(data)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Simpanan Anggota</h1>
        <Button onClick={() => setShowForm(true)} className="bg-green-600 hover:bg-green-700">
          <Plus className="mr-2 h-4 w-4" />
          Transaksi Baru
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card className="border-green-200 bg-green-50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-green-700">Saldo Simpanan</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">
              Rp {(stats?.balance || 0).toLocaleString('id-ID')}
            </div>
            <p className="mt-1 text-xs text-green-600">Total Saldo</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Setoran</CardTitle>
            <TrendingUp className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              Rp {(stats?.totalDepositAmount || 0).toLocaleString('id-ID')}
            </div>
            <p className="mt-1 text-xs text-gray-500">{stats?.totalDeposits || 0} Transaksi</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Penarikan</CardTitle>
            <TrendingDown className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              Rp {(stats?.totalWithdrawalAmount || 0).toLocaleString('id-ID')}
            </div>
            <p className="mt-1 text-xs text-gray-500">{stats?.totalWithdrawals || 0} Transaksi</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Transaksi</CardTitle>
            <Users className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(stats?.totalDeposits || 0) + (stats?.totalWithdrawals || 0)}
            </div>
            <p className="mt-1 text-xs text-gray-500">Setoran + Penarikan</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Cari nama anggota..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border py-2 pr-4 pl-10 focus:ring-2 focus:ring-green-500 focus:outline-none"
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as TransactionType | '')}
          className="rounded-lg border px-4 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
        >
          <option value="">Semua Jenis</option>
          <option value="MEMBER_DEPOSIT">Setoran</option>
          <option value="MEMBER_WITHDRAWAL">Penarikan</option>
        </select>
      </div>

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Riwayat Transaksi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-3 text-left">Tanggal</th>
                  <th className="px-4 py-3 text-left">Nama Anggota</th>
                  <th className="px-4 py-3 text-left">Jenis</th>
                  <th className="px-4 py-3 text-left">Metode</th>
                  <th className="px-4 py-3 text-right">Jumlah</th>
                  <th className="px-4 py-3 text-left">Catatan</th>
                </tr>
              </thead>
              <tbody>
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {transactionsData?.transactions.map((transaction: any) => {
                  const memberName = transaction.description
                    .replace('Setoran Anggota - ', '')
                    .replace('Penarikan Anggota - ', '')
                  const isDeposit = transaction.category === 'MEMBER_DEPOSIT'

                  return (
                    <tr key={transaction.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3">
                        {new Date(transaction.created_at).toLocaleDateString('id-ID', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="px-4 py-3 font-medium">{memberName}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                            isDeposit ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {isDeposit ? (
                            <>
                              <TrendingUp className="mr-1 h-3 w-3" />
                              Setoran
                            </>
                          ) : (
                            <>
                              <TrendingDown className="mr-1 h-3 w-3" />
                              Penarikan
                            </>
                          )}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {transaction.payment_method === 'CASH' && 'Tunai'}
                        {transaction.payment_method === 'BANK_TRANSFER' && 'Transfer Bank'}
                        {transaction.payment_method === 'E_WALLET' && 'E-Wallet'}
                        {transaction.payment_method === 'OTHER' && 'Lainnya'}
                      </td>
                      <td
                        className={`px-4 py-3 text-right font-bold ${isDeposit ? 'text-green-600' : 'text-red-600'}`}
                      >
                        {isDeposit ? '+' : '-'} Rp{' '}
                        {Number(transaction.amount).toLocaleString('id-ID')}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {transaction.notes || '-'}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {transactionsData?.transactions.length === 0 && (
            <div className="py-8 text-center text-gray-400">
              <Users className="mx-auto mb-2 h-12 w-12" />
              <p>Belum ada transaksi</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Transaction Form Modal */}
      {showForm && (
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Transaksi Simpanan Anggota</CardTitle>
              <Button variant="ghost" onClick={() => setShowForm(false)}>
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium">Jenis Transaksi *</label>
                  <select
                    value={transactionType}
                    onChange={(e) => setTransactionType(e.target.value as TransactionType)}
                    className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                  >
                    <option value="MEMBER_DEPOSIT">Setoran</option>
                    <option value="MEMBER_WITHDRAWAL">Penarikan</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium">Nama Anggota *</label>
                  <input
                    type="text"
                    required
                    value={memberName}
                    onChange={(e) => setMemberName(e.target.value)}
                    className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                    placeholder="Nama lengkap anggota"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium">Jumlah (Rp) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={amount || ''}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium">Metode Pembayaran *</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as typeof paymentMethod)}
                    className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                  >
                    <option value="CASH">Tunai</option>
                    <option value="BANK_TRANSFER">Transfer Bank</option>
                    <option value="E_WALLET">E-Wallet</option>
                    <option value="OTHER">Lainnya</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium">Catatan</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                    placeholder="Catatan tambahan (opsional)"
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowForm(false)}
                    className="flex-1"
                  >
                    Batal
                  </Button>
                  <Button
                    type="submit"
                    disabled={depositMutation.isPending || withdrawalMutation.isPending}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    {depositMutation.isPending || withdrawalMutation.isPending
                      ? 'Menyimpan...'
                      : 'Simpan'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
