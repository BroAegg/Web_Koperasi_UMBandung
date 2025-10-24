'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Search, ArrowDownCircle, ArrowUpCircle, History } from 'lucide-react'
import { trpc } from '@/lib/trpc'
import { DepositModal } from './deposit-modal'
import { WithdrawalModal } from './withdrawal-modal'
import { TransactionHistoryDialog } from './transaction-history-dialog'
import { SkeletonTable } from '@/components/ui/loading-skeleton'

export function MembersContent() {
  const [searchQuery, setSearchQuery] = useState('')
  const [transactionType, setTransactionType] = useState<string>('all')
  const [page, setPage] = useState(1)
  const [showDepositModal, setShowDepositModal] = useState(false)
  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false)
  const [showHistoryDialog, setShowHistoryDialog] = useState(false)
  const [selectedMemberName, setSelectedMemberName] = useState('')

  const { data, isLoading } = trpc.member.getMemberTransactions.useQuery({
    member_name: searchQuery || undefined,
    type:
      transactionType === 'all'
        ? undefined
        : (transactionType as 'MEMBER_DEPOSIT' | 'MEMBER_WITHDRAWAL'),
    page,
    limit: 10,
  })

  const { data: stats } = trpc.member.getMemberStats.useQuery()

  const handleViewHistory = (memberName: string) => {
    setSelectedMemberName(memberName)
    setShowHistoryDialog(true)
  }

  // Extract unique member names from descriptions
  const extractMemberName = (description: string): string => {
    const match = description.match(/(?:Setoran|Penarikan) Anggota - (.+)/)
    return match ? match[1] : 'Unknown'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Anggota</h1>
          <p className="text-muted-foreground">Kelola setoran dan penarikan anggota koperasi</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowDepositModal(true)}>
            <ArrowDownCircle className="mr-2 h-4 w-4" />
            Setoran
          </Button>
          <Button variant="outline" onClick={() => setShowWithdrawalModal(true)}>
            <ArrowUpCircle className="mr-2 h-4 w-4" />
            Penarikan
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-3">
          <Card hover className="group p-6">
            <div className="flex items-center gap-2">
              <ArrowDownCircle className="h-5 w-5 text-green-500 transition-transform group-hover:scale-110" />
              <div className="flex-1">
                <p className="text-muted-foreground text-sm">Total Setoran</p>
                <p className="text-2xl font-bold">
                  Rp {stats.totalDepositAmount.toLocaleString('id-ID')}
                </p>
                <p className="text-muted-foreground text-sm">{stats.totalDeposits} transaksi</p>
              </div>
            </div>
          </Card>

          <Card hover className="group p-6">
            <div className="flex items-center gap-2">
              <ArrowUpCircle className="h-5 w-5 text-red-500 transition-transform group-hover:scale-110" />
              <div className="flex-1">
                <p className="text-muted-foreground text-sm">Total Penarikan</p>
                <p className="text-2xl font-bold">
                  Rp {stats.totalWithdrawalAmount.toLocaleString('id-ID')}
                </p>
                <p className="text-muted-foreground text-sm">{stats.totalWithdrawals} transaksi</p>
              </div>
            </div>
          </Card>

          <Card hover className="group p-6">
            <div className="flex items-center gap-2">
              <div
                className={`h-5 w-5 rounded-full transition-transform group-hover:scale-110 ${
                  stats.balance >= 0 ? 'bg-green-500' : 'bg-red-500'
                }`}
              />
              <div className="flex-1">
                <p className="text-muted-foreground text-sm">Saldo Anggota</p>
                <p className="text-2xl font-bold">Rp {stats.balance.toLocaleString('id-ID')}</p>
                <p className="text-muted-foreground text-sm">
                  {stats.totalDeposits + stats.totalWithdrawals} total transaksi
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="relative flex-1">
            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              placeholder="Cari nama anggota..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setPage(1)
              }}
              className="pl-9"
            />
          </div>
          <Select
            value={transactionType}
            onValueChange={(value) => {
              setTransactionType(value)
              setPage(1)
            }}
          >
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Transaksi</SelectItem>
              <SelectItem value="MEMBER_DEPOSIT">Setoran</SelectItem>
              <SelectItem value="MEMBER_WITHDRAWAL">Penarikan</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Transactions Table */}
      <Card hover>
        <div className="overflow-x-auto">
          {isLoading ? (
            <SkeletonTable rows={10} />
          ) : (
            <table className="w-full">
              <thead className="border-b">
                <tr className="text-left">
                  <th className="p-4 font-medium">Tanggal</th>
                  <th className="p-4 font-medium">Nama Anggota</th>
                  <th className="p-4 font-medium">Tipe</th>
                  <th className="p-4 font-medium">Metode</th>
                  <th className="p-4 font-medium">Jumlah</th>
                  <th className="p-4 font-medium">Catatan</th>
                  <th className="p-4 font-medium">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {data?.transactions.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-muted-foreground p-8 text-center">
                      Tidak ada transaksi
                    </td>
                  </tr>
                ) : (
                  data?.transactions.map((transaction) => {
                    const memberName = extractMemberName(transaction.description)
                    return (
                      <tr key={transaction.id} className="hover:bg-muted/50">
                        <td className="p-4">
                          {new Date(transaction.created_at).toLocaleDateString('id-ID', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          })}
                          <br />
                          <span className="text-muted-foreground text-sm">
                            {new Date(transaction.created_at).toLocaleTimeString('id-ID', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </td>
                        <td className="p-4 font-medium">{memberName}</td>
                        <td className="p-4">
                          <Badge
                            variant={
                              transaction.category === 'MEMBER_DEPOSIT' ? 'default' : 'destructive'
                            }
                          >
                            {transaction.category === 'MEMBER_DEPOSIT' ? (
                              <>
                                <ArrowDownCircle className="mr-1 h-3 w-3" />
                                Setoran
                              </>
                            ) : (
                              <>
                                <ArrowUpCircle className="mr-1 h-3 w-3" />
                                Penarikan
                              </>
                            )}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <span className="text-sm">
                            {transaction.payment_method.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="p-4">
                          <span
                            className={`font-semibold ${
                              transaction.category === 'MEMBER_DEPOSIT'
                                ? 'text-green-600'
                                : 'text-red-600'
                            }`}
                          >
                            {transaction.category === 'MEMBER_DEPOSIT' ? '+' : '-'}
                            Rp {Number(transaction.amount).toLocaleString('id-ID')}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="text-muted-foreground text-sm">
                            {transaction.notes || '-'}
                          </span>
                        </td>
                        <td className="p-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewHistory(memberName)}
                          >
                            <History className="mr-1 h-4 w-4" />
                            Riwayat
                          </Button>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {data && data.pagination.totalPages > 1 && (
          <div className="flex items-center justify-between border-t p-4">
            <p className="text-muted-foreground text-sm">
              Halaman {data.pagination.page} dari {data.pagination.totalPages} (
              {data.pagination.total} total transaksi)
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                Sebelumnya
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={!data.pagination.hasMore}
                onClick={() => setPage(page + 1)}
              >
                Selanjutnya
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Modals */}
      <DepositModal open={showDepositModal} onOpenChange={setShowDepositModal} />
      <WithdrawalModal open={showWithdrawalModal} onOpenChange={setShowWithdrawalModal} />
      <TransactionHistoryDialog
        open={showHistoryDialog}
        onOpenChange={setShowHistoryDialog}
        memberName={selectedMemberName}
      />
    </div>
  )
}
