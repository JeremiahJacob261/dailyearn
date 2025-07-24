"use client"

import { Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react"

interface PayoutItemProps {
  amount: number
  status: 'pending' | 'approved' | 'completed' | 'rejected'
  method: string
  reference: string
  requestedAt: string
  processedAt?: string
  adminNotes?: string
  accountDetails?: {
    bank?: string
    accountName?: string
    accountNumber?: string
  }
}

export function PayoutItem({
  amount,
  status,
  method,
  reference,
  requestedAt,
  processedAt,
  adminNotes,
  accountDetails
}: PayoutItemProps) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'pending':
        return {
          icon: Clock,
          text: 'Pending Review',
          bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
          borderColor: 'border-yellow-200 dark:border-yellow-800',
          textColor: 'text-yellow-800 dark:text-yellow-300',
          iconColor: 'text-yellow-600 dark:text-yellow-400'
        }
      case 'approved':
        return {
          icon: AlertCircle,
          text: 'Approved - Processing',
          bgColor: 'bg-blue-50 dark:bg-blue-900/20',
          borderColor: 'border-blue-200 dark:border-blue-800',
          textColor: 'text-blue-800 dark:text-blue-300',
          iconColor: 'text-blue-600 dark:text-blue-400'
        }
      case 'completed':
        return {
          icon: CheckCircle,
          text: 'Completed',
          bgColor: 'bg-green-50 dark:bg-green-900/20',
          borderColor: 'border-green-200 dark:border-green-800',
          textColor: 'text-green-800 dark:text-green-300',
          iconColor: 'text-green-600 dark:text-green-400'
        }
      case 'rejected':
        return {
          icon: XCircle,
          text: 'Rejected & Refunded',
          bgColor: 'bg-red-50 dark:bg-red-900/20',
          borderColor: 'border-red-200 dark:border-red-800',
          textColor: 'text-red-800 dark:text-red-300',
          iconColor: 'text-red-600 dark:text-red-400'
        }
      default:
        return {
          icon: Clock,
          text: status,
          bgColor: 'bg-gray-50 dark:bg-gray-900/20',
          borderColor: 'border-gray-200 dark:border-gray-800',
          textColor: 'text-gray-800 dark:text-gray-300',
          iconColor: 'text-gray-600 dark:text-gray-400'
        }
    }
  }

  const config = getStatusConfig(status)
  const StatusIcon = config.icon

  return (
    <div className={`p-4 rounded-xl border-2 ${config.bgColor} ${config.borderColor} transition-all hover:shadow-md`}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-2xl font-bold text-black dark:text-white">
            ₦{amount.toLocaleString()}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 font-mono">
            {reference}
          </p>
        </div>
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${config.bgColor} ${config.borderColor} border`}>
          <StatusIcon className={`w-4 h-4 ${config.iconColor}`} />
          <span className={`text-sm font-medium ${config.textColor}`}>
            {config.text}
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Method:</span>
          <span className="text-black dark:text-white font-medium">
            {method?.replace('_', ' ')?.replace(/\b\w/g, l => l.toUpperCase())}
          </span>
        </div>
        
        {accountDetails?.bank && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Bank:</span>
            <span className="text-black dark:text-white font-medium">
              {accountDetails.bank}
            </span>
          </div>
        )}

        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Requested:</span>
          <span className="text-black dark:text-white">
            {new Date(requestedAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </span>
        </div>

        {processedAt && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Processed:</span>
            <span className="text-black dark:text-white">
              {new Date(processedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>
        )}

        {adminNotes && (
          <div className="mt-3 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Admin Notes:</p>
            <p className="text-sm text-black dark:text-white">{adminNotes}</p>
          </div>
        )}

        {status === 'rejected' && (
          <div className="mt-3 p-3 bg-green-100 dark:bg-green-900/30 rounded-lg border border-green-200 dark:border-green-800">
            <p className="text-sm text-green-800 dark:text-green-300 font-medium">
              💰 Amount has been refunded to your wallet balance
            </p>
          </div>
        )}

        {status === 'completed' && (
          <div className="mt-3 p-3 bg-green-100 dark:bg-green-900/30 rounded-lg border border-green-200 dark:border-green-800">
            <p className="text-sm text-green-800 dark:text-green-300 font-medium">
              ✅ Payment has been sent to your account
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
