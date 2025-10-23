'use client'

import { useState, useMemo } from 'react'
import { trpc } from '@/lib/trpc'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Users, TrendingUp, TrendingDown, DollarSign, X, Search, Wallet, History, ArrowUpCircle, ArrowDownCircle } from 'lucide-react'

type TransactionType = 'MEMBER_DEPOSIT' | 'MEMBER_WITHDRAWAL'
type ViewMode = 'members' | 'transactions'

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
  const [viewMode, setViewMode] = useState<ViewMode>('members')

  const utils = trpc.useUtils()

  // Queries
  const { data: transactionsData } = trpc.member.getMemberTransactions.useQuery({
    member_name: searchQuery || undefined,
    type: filterType || undefined,
    page: 1,
    limit: 50,
  })

  const { data: stats } = trpc.member.getMemberStats.useQuery()

  // Group transactions by member and calculate balances
  const memberBalances = useMemo(() => {
    if (!transactionsData?.transactions) return []

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const memberMap = new Map<string, any>()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    transactionsData.transactions.forEach((transaction: any) => {
      const name = transaction.description
        .replace('Setoran Anggota - ', '')
        .replace('Penarikan Anggota - ', '')

      if (!memberMap.has(name)) {
        memberMap.set(name, {
          name,
          balance: 0,
          totalDeposits: 0,
          totalWithdrawals: 0,
          depositCount: 0,
          withdrawalCount: 0,
          transactions: [],
        })
      }

      const member = memberMap.get(name)
      const isDeposit = transaction.category === 'MEMBER_DEPOSIT'
      const transAmount = Number(transaction.amount)

      if (isDeposit) {
        member.balance += transAmount
        member.totalDeposits += transAmount
        member.depositCount += 1
      } else {
        member.balance -= transAmount
        member.totalWithdrawals += transAmount
        member.withdrawalCount += 1
      }

      member.transactions.push({
        ...transaction,
        isDeposit,
        amount: transAmount,
      })
    })

    // Sort by balance (highest first)
    return Array.from(memberMap.values()).sort((a, b) => b.balance - a.balance)
  }, [transactionsData])

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
        <div>
          <h1 className="text-3xl font-bold">Simpanan Anggota</h1>
          <p className="mt-1 text-sm text-gray-600">
            Kelola simpanan dan transaksi anggota koperasi
          </p>
        </div>
        <Button onClick={() => setShowForm(true)} className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700">
          <Plus className="mr-2 h-4 w-4" />
          Transaksi Baru
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card className="border-2 border-teal-200 bg-gradient-to-br from-teal-50 to-cyan-50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-teal-700">Saldo Simpanan</CardTitle>
            <div className="rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 p-2">
              <DollarSign className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-teal-700">
              Rp {(stats?.balance || 0).toLocaleString('id-ID')}
            </div>
            <p className="mt-1 text-xs font-medium text-teal-600">Total Saldo Koperasi</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-gray-700">Total Setoran</CardTitle>
            <div className="rounded-full bg-green-100 p-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              Rp {(stats?.totalDepositAmount || 0).toLocaleString('id-ID')}
            </div>
            <p className="mt-1 text-xs font-medium text-gray-600">
              {stats?.totalDeposits || 0} Transaksi Masuk
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-gray-700">Total Penarikan</CardTitle>
            <div className="rounded-full bg-red-100 p-2">
              <TrendingDown className="h-5 w-5 text-red-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              Rp {(stats?.totalWithdrawalAmount || 0).toLocaleString('id-ID')}
            </div>
            <p className="mt-1 text-xs font-medium text-gray-600">
              {stats?.totalWithdrawals || 0} Transaksi Keluar
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-gray-700">Total Anggota</CardTitle>
            <div className="rounded-full bg-blue-100 p-2">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {memberBalances.length}
            </div>
            <p className="mt-1 text-xs font-medium text-gray-600">
              Anggota Aktif
            </p>
          </CardContent>
        </Card>
      </div>

      {/* View Toggle & Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex gap-2">
          <Button
            onClick={() => setViewMode('members')}
            variant={viewMode === 'members' ? 'default' : 'outline'}
            className={viewMode === 'members' ? 'bg-teal-600 hover:bg-teal-700' : ''}
          >
            <Wallet className="mr-2 h-4 w-4" />
            Per Anggota
          </Button>
          <Button
            onClick={() => setViewMode('transactions')}
            variant={viewMode === 'transactions' ? 'default' : 'outline'}
            className={viewMode === 'transactions' ? 'bg-teal-600 hover:bg-teal-700' : ''}
          >
            <History className="mr-2 h-4 w-4" />
            Semua Transaksi
          </Button>
        </div>

        <div className="relative flex-1">
          <Search className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Cari nama anggota..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border-2 py-2.5 pr-4 pl-10 font-medium focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none"
          />
        </div>

        {viewMode === 'transactions' && (
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as TransactionType | '')}
            className="rounded-lg border-2 px-4 py-2.5 font-medium focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none"
          >
            <option value="">Semua Jenis</option>
            <option value="MEMBER_DEPOSIT">Setoran</option>
            <option value="MEMBER_WITHDRAWAL">Penarikan</option>
          </select>
        )}
      </div>

      {/* Member Cards View */}
      {viewMode === 'members' && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {memberBalances
            .filter((member) =>
              member.name.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map((member, index) => (
              <Card
                key={member.name}
                className="group overflow-hidden border-2 transition-all hover:shadow-lg hover:scale-[1.02]"
              >
                {/* Header with Gradient */}
                <div className="bg-linear-to-r from-teal-600 to-cyan-600 px-6 py-4 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold">{member.name}</h3>
                      <p className="text-sm text-teal-50">Anggota #{index + 1}</p>
                    </div>
                    <div className="rounded-full bg-white/20 p-3 backdrop-blur-sm">
                      <Users className="h-6 w-6" />
                    </div>
                  </div>
                </div>

                <CardContent className="p-6">
                  {/* Balance Section */}
                  <div className="mb-6 rounded-xl bg-gradient-to-br from-teal-50 to-cyan-50 p-4 border-2 border-teal-200">
                    <div className="mb-2 flex items-center gap-2">
                      <Wallet className="h-5 w-5 text-teal-600" />
                      <span className="text-sm font-semibold text-teal-700">
                        Saldo Simpanan
                      </span>
                    </div>
                    <div className="text-3xl font-bold text-teal-700">
                      Rp {member.balance.toLocaleString('id-ID')}
                    </div>
                    <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-teal-200">
                      <div
                        className="h-full bg-gradient-to-r from-teal-500 to-cyan-500 transition-all"
                        style={{
                          width: `${Math.min((member.balance / (stats?.balance || 1)) * 100, 100)}%`,
                        }}
                      />
                    </div>
                    <p className="mt-1 text-xs text-teal-600">
                      {((member.balance / (stats?.balance || 1)) * 100).toFixed(1)}% dari total
                      simpanan
                    </p>
                  </div>

                  {/* Transaction Stats */}
                  <div className="mb-6 grid grid-cols-2 gap-3">
                    <div className="rounded-lg bg-green-50 p-3 border border-green-200">
                      <div className="mb-1 flex items-center gap-1">
                        <ArrowUpCircle className="h-4 w-4 text-green-600" />
                        <span className="text-xs font-semibold text-green-700">Setoran</span>
                      </div>
                      <div className="text-lg font-bold text-green-700">
                        Rp {member.totalDeposits.toLocaleString('id-ID')}
                      </div>
                      <p className="text-xs text-green-600">{member.depositCount}x transaksi</p>
                    </div>

                    <div className="rounded-lg bg-red-50 p-3 border border-red-200">
                      <div className="mb-1 flex items-center gap-1">
                        <ArrowDownCircle className="h-4 w-4 text-red-600" />
                        <span className="text-xs font-semibold text-red-700">Penarikan</span>
                      </div>
                      <div className="text-lg font-bold text-red-700">
                        Rp {member.totalWithdrawals.toLocaleString('id-ID')}
                      </div>
                      <p className="text-xs text-red-600">{member.withdrawalCount}x transaksi</p>
                    </div>
                  </div>

                  {/* Recent Transactions Preview */}
                  <div className="mb-4">
                    <div className="mb-3 flex items-center gap-2">
                      <History className="h-4 w-4 text-gray-600" />
                      <h4 className="text-sm font-bold text-gray-700">Transaksi Terakhir</h4>
                    </div>
                    <div className="space-y-2">
                      {member.transactions.slice(0, 3).map((trans: any, idx: number) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between rounded-lg bg-gray-50 p-2 text-xs"
                        >
                          <div className="flex items-center gap-2">
                            {trans.isDeposit ? (
                              <div className="rounded-full bg-green-100 p-1">
                                <TrendingUp className="h-3 w-3 text-green-600" />
                              </div>
                            ) : (
                              <div className="rounded-full bg-red-100 p-1">
                                <TrendingDown className="h-3 w-3 text-red-600" />
                              </div>
                            )}
                            <span className="font-medium text-gray-700">
                              {trans.isDeposit ? 'Setoran' : 'Penarikan'}
                            </span>
                          </div>
                          <span
                            className={`font-bold ${trans.isDeposit ? 'text-green-600' : 'text-red-600'}`}
                          >
                            {trans.isDeposit ? '+' : '-'}Rp{' '}
                            {trans.amount.toLocaleString('id-ID')}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      size="sm"
                      onClick={() => {
                        setMemberName(member.name)
                        setTransactionType('MEMBER_DEPOSIT')
                        setShowForm(true)
                      }}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Plus className="mr-1 h-3 w-3" />
                      Setor
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => {
                        setMemberName(member.name)
                        setTransactionType('MEMBER_WITHDRAWAL')
                        setShowForm(true)
                      }}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      <TrendingDown className="mr-1 h-3 w-3" />
                      Tarik
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

          {memberBalances.filter((member) =>
            member.name.toLowerCase().includes(searchQuery.toLowerCase())
          ).length === 0 && (
            <div className="col-span-full py-12 text-center">
              <Users className="mx-auto mb-3 h-16 w-16 text-gray-300" />
              <p className="text-lg font-medium text-gray-400">
                {searchQuery ? 'Anggota tidak ditemukan' : 'Belum ada anggota'}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Transactions Table */}
      {viewMode === 'transactions' && (
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
      )}

      {/* Transaction Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <Card className="w-full max-w-md shadow-2xl">
            {/* Modal Header with Gradient */}
            <div className="bg-linear-to-r from-teal-600 to-cyan-600 px-6 py-4 text-white rounded-t-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold">Transaksi Simpanan</h3>
                  <p className="text-sm text-teal-50">Catat setoran atau penarikan anggota</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setShowForm(false)
                    resetForm()
                  }}
                  className="hover:bg-white/20 text-white"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Jenis Transaksi *
                  </label>
                  <select
                    value={transactionType}
                    onChange={(e) => setTransactionType(e.target.value as TransactionType)}
                    className="w-full rounded-lg border-2 px-4 py-2.5 font-medium focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none"
                  >
                    <option value="MEMBER_DEPOSIT">💰 Setoran</option>
                    <option value="MEMBER_WITHDRAWAL">📤 Penarikan</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Nama Anggota *
                  </label>
                  <input
                    type="text"
                    required
                    value={memberName}
                    onChange={(e) => setMemberName(e.target.value)}
                    className="w-full rounded-lg border-2 px-4 py-2.5 font-medium focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none"
                    placeholder="Nama lengkap anggota"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Jumlah (Rp) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={amount || ''}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full rounded-lg border-2 px-4 py-2.5 font-medium focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none"
                    placeholder="Masukkan nominal"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Metode Pembayaran *
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as typeof paymentMethod)}
                    className="w-full rounded-lg border-2 px-4 py-2.5 font-medium focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none"
                  >
                    <option value="CASH">💵 Tunai</option>
                    <option value="BANK_TRANSFER">🏦 Transfer Bank</option>
                    <option value="E_WALLET">📱 E-Wallet</option>
                    <option value="OTHER">🔄 Lainnya</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Catatan
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    className="w-full rounded-lg border-2 px-4 py-2.5 font-medium focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none"
                    placeholder="Catatan tambahan (opsional)"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowForm(false)
                      resetForm()
                    }}
                    className="flex-1 border-2"
                  >
                    Batal
                  </Button>
                  <Button
                    type="submit"
                    disabled={depositMutation.isPending || withdrawalMutation.isPending}
                    className="flex-1 bg-linear-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700"
                  >
                    {depositMutation.isPending || withdrawalMutation.isPending
                      ? 'Menyimpan...'
                      : '✓ Simpan Transaksi'}
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
