'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { trpc } from '@/lib/trpc'
import { ArrowDownCircle, ArrowUpCircle, User } from 'lucide-react'

interface TransactionHistoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  memberName: string
}

export function TransactionHistoryDialog({
  open,
  onOpenChange,
  memberName,
}: TransactionHistoryDialogProps) {
  const { data, isLoading } = trpc.member.getMemberTransactions.useQuery(
    {
      member_name: memberName,
      page: 1,
      limit: 50,
    },
    {
      enabled: open && !!memberName,
    }
  )

  // Calculate member statistics
  const stats = data?.transactions.reduce(
    (acc, tx) => {
      if (tx.category === 'MEMBER_DEPOSIT') {
        acc.totalDeposits += Number(tx.amount)
        acc.depositCount += 1
      } else {
        acc.totalWithdrawals += Number(tx.amount)
        acc.withdrawalCount += 1
      }
      return acc
    },
    {
      totalDeposits: 0,
      totalWithdrawals: 0,
      depositCount: 0,
      withdrawalCount: 0,
    }
  )

  const balance = (stats?.totalDeposits || 0) - (stats?.totalWithdrawals || 0)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[80vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Riwayat Transaksi - {memberName}
          </DialogTitle>
          <DialogDescription>Riwayat lengkap setoran dan penarikan anggota</DialogDescription>
        </DialogHeader>

        {/* Member Stats */}
        {stats && (
          <div className="mb-4 grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border p-4">
              <p className="text-muted-foreground mb-1 text-sm">Total Setoran</p>
              <p className="text-xl font-bold text-green-600">
                Rp {stats.totalDeposits.toLocaleString('id-ID')}
              </p>
              <p className="text-muted-foreground text-xs">{stats.depositCount} transaksi</p>
            </div>

            <div className="rounded-lg border p-4">
              <p className="text-muted-foreground mb-1 text-sm">Total Penarikan</p>
              <p className="text-xl font-bold text-red-600">
                Rp {stats.totalWithdrawals.toLocaleString('id-ID')}
              </p>
              <p className="text-muted-foreground text-xs">{stats.withdrawalCount} transaksi</p>
            </div>

            <div className="rounded-lg border p-4">
              <p className="text-muted-foreground mb-1 text-sm">Saldo</p>
              <p
                className={`text-xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}
              >
                Rp {balance.toLocaleString('id-ID')}
              </p>
              <p className="text-muted-foreground text-xs">
                {stats.depositCount + stats.withdrawalCount} total transaksi
              </p>
            </div>
          </div>
        )}

        {/* Transaction List */}
        <div className="space-y-3">
          <h3 className="font-semibold">Riwayat Transaksi</h3>

          {isLoading ? (
            <div className="text-muted-foreground py-8 text-center">Memuat riwayat...</div>
          ) : data?.transactions.length === 0 ? (
            <div className="text-muted-foreground py-8 text-center">
              Tidak ada riwayat transaksi
            </div>
          ) : (
            <div className="max-h-96 space-y-2 overflow-y-auto">
              {data?.transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="hover:bg-muted/50 flex items-start gap-3 rounded-lg border p-3 transition-colors"
                >
                  <div
                    className={`mt-1 rounded-full p-2 ${
                      transaction.category === 'MEMBER_DEPOSIT'
                        ? 'bg-green-100 text-green-600'
                        : 'bg-red-100 text-red-600'
                    }`}
                  >
                    {transaction.category === 'MEMBER_DEPOSIT' ? (
                      <ArrowDownCircle className="h-4 w-4" />
                    ) : (
                      <ArrowUpCircle className="h-4 w-4" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="mb-1 flex items-center gap-2">
                          <Badge
                            variant={
                              transaction.category === 'MEMBER_DEPOSIT' ? 'default' : 'destructive'
                            }
                          >
                            {transaction.category === 'MEMBER_DEPOSIT' ? 'Setoran' : 'Penarikan'}
                          </Badge>
                          <span className="text-muted-foreground text-xs">
                            {transaction.payment_method.replace(/_/g, ' ')}
                          </span>
                        </div>
                        <p className="text-muted-foreground text-sm">
                          {new Date(transaction.created_at).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                        {transaction.notes && (
                          <p className="text-muted-foreground mt-1 text-sm">{transaction.notes}</p>
                        )}
                      </div>

                      <p
                        className={`text-lg font-bold whitespace-nowrap ${
                          transaction.category === 'MEMBER_DEPOSIT'
                            ? 'text-green-600'
                            : 'text-red-600'
                        }`}
                      >
                        {transaction.category === 'MEMBER_DEPOSIT' ? '+' : '-'}
                        Rp {Number(transaction.amount).toLocaleString('id-ID')}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
