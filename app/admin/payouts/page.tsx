"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { 
  CreditCard,
  Clock,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  Download,
  RefreshCw,
  Calendar,
  DollarSign,
  Eye,
  AlertTriangle
} from "lucide-react"
import { supabase } from "@/lib/supabase"

interface Payout {
  id: string
  user_id: string
  amount: number
  status: 'pending' | 'approved' | 'completed' | 'rejected'
  method: 'bank_transfer' | 'mobile_money' | 'paypal'
  account_details: any
  requested_at: string
  processed_at?: string
  reference: string
  user?: {
    full_name: string
    email: string
  }
}

export default function AdminPayoutsPage() {
  const [payouts, setPayouts] = useState<Payout[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedPayout, setSelectedPayout] = useState<Payout | null>(null)

  useEffect(() => {
    fetchPayouts()
  }, [])

  const fetchPayouts = async () => {
    try {
      setLoading(true)
      const { data: payoutsData, error } = await supabase
        .from('dailyearn_payouts')
        .select(`
          *,
          user:dailyearn_users!user_id(full_name, email)
        `)
        .order('requested_at', { ascending: false })

      if (error) throw error
      setPayouts(payoutsData || [])
    } catch (error) {
      console.error("Error fetching payouts:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (payoutId: string, newStatus: string) => {
    try {
      const updateData: any = { status: newStatus }
      if (newStatus === 'completed' || newStatus === 'approved') {
        updateData.processed_at = new Date().toISOString()
      }

      const { error } = await supabase
        .from('dailyearn_payouts')
        .update(updateData)
        .eq('id', payoutId)

      if (error) throw error
      fetchPayouts()
    } catch (error) {
      console.error("Error updating payout:", error)
    }
  }

  const filteredPayouts = payouts.filter(payout => {
    const user = payout.user as any
    const matchesSearch = 
      user?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payout.reference.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || payout.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>
      case 'approved':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Approved</Badge>
      case 'completed':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Completed</Badge>
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Rejected</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">{status}</Badge>
    }
  }

  const getMethodBadge = (method: string) => {
    switch (method) {
      case 'bank_transfer':
        return <Badge variant="secondary" className="bg-purple-100 text-purple-800">Bank Transfer</Badge>
      case 'mobile_money':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Mobile Money</Badge>
      case 'paypal':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">PayPal</Badge>
      default:
        return <Badge variant="secondary">{method}</Badge>
    }
  }

  const totalPending = payouts.filter(p => p.status === 'pending').length
  const totalCompleted = payouts.filter(p => p.status === 'completed').length
  const totalAmount = payouts.reduce((sum, p) => sum + p.amount, 0)
  const pendingAmount = payouts.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Payout Management</h1>
          <p className="text-gray-600 mt-1">Process and manage user payout requests</p>
        </div>
        
        <div className="flex space-x-2">
          <Button variant="outline" onClick={fetchPayouts} className="border-gray-300">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" className="border-gray-300">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Payouts</p>
                <p className="text-2xl font-bold text-gray-900">{payouts.length}</p>
              </div>
              <CreditCard className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{totalPending}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{totalCompleted}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Amount</p>
                <p className="text-2xl font-bold text-gray-900">₦{totalAmount.toLocaleString()}</p>
              </div>
              <DollarSign className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Alert */}
      {totalPending > 0 && (
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
              <div>
                <p className="text-yellow-800 font-medium">
                  {totalPending} pending payout{totalPending > 1 ? 's' : ''} requiring attention
                </p>
                <p className="text-yellow-700 text-sm">
                  Total pending amount: ₦{pendingAmount.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card className="bg-white border-gray-200">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by user name, email, or reference..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="sm:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payouts Table */}
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-900">Payout Requests</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-gray-700">User</TableHead>
                    <TableHead className="text-gray-700">Amount</TableHead>
                    <TableHead className="text-gray-700">Method</TableHead>
                    <TableHead className="text-gray-700">Status</TableHead>
                    <TableHead className="text-gray-700">Reference</TableHead>
                    <TableHead className="text-gray-700">Requested</TableHead>
                    <TableHead className="text-gray-700">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayouts.map((payout) => {
                    const user = payout.user as any
                    return (
                      <TableRow key={payout.id} className="hover:bg-gray-50">
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar>
                              <AvatarFallback className="bg-blue-100 text-blue-600">
                                {user?.full_name?.charAt(0) || 'U'}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-gray-900">
                                {user?.full_name || 'Unknown User'}
                              </p>
                              <p className="text-sm text-gray-600">{user?.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-900 font-medium">
                          ₦{payout.amount.toLocaleString()}
                        </TableCell>
                        <TableCell>{getMethodBadge(payout.method)}</TableCell>
                        <TableCell>{getStatusBadge(payout.status)}</TableCell>
                        <TableCell className="text-gray-600 font-mono text-sm">
                          {payout.reference}
                        </TableCell>
                        <TableCell className="text-gray-600">
                          {new Date(payout.requested_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedPayout(payout)}
                              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            
                            {payout.status === 'pending' && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleStatusUpdate(payout.id, 'approved')}
                                  className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleStatusUpdate(payout.id, 'rejected')}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  <XCircle className="w-4 h-4" />
                                </Button>
                              </>
                            )}
                            
                            {payout.status === 'approved' && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleStatusUpdate(payout.id, 'completed')}
                                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                              >
                                Complete
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
              
              {filteredPayouts.length === 0 && (
                <div className="text-center py-12">
                  <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No payout requests found</p>
                  <p className="text-sm text-gray-500">
                    {statusFilter !== "all" 
                      ? `No ${statusFilter} payouts match your search`
                      : "Payout requests will appear here when users make withdrawal requests"
                    }
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payout Details Modal */}
      <Dialog open={!!selectedPayout} onOpenChange={() => setSelectedPayout(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Payout Request Details</DialogTitle>
          </DialogHeader>
          
          {selectedPayout && (
            <div className="space-y-6">
              {/* User Information */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">User Information</h3>
                  <div className="space-y-2">
                    <p className="text-sm">
                      <span className="text-gray-600">Name:</span>{' '}
                      <span className="text-gray-900">{(selectedPayout.user as any)?.full_name}</span>
                    </p>
                    <p className="text-sm">
                      <span className="text-gray-600">Email:</span>{' '}
                      <span className="text-gray-900">{(selectedPayout.user as any)?.email}</span>
                    </p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Payout Information</h3>
                  <div className="space-y-2">
                    <p className="text-sm">
                      <span className="text-gray-600">Amount:</span>{' '}
                      <span className="text-gray-900 font-medium">₦{selectedPayout.amount.toLocaleString()}</span>
                    </p>
                    <p className="text-sm">
                      <span className="text-gray-600">Reference:</span>{' '}
                      <span className="text-gray-900 font-mono">{selectedPayout.reference}</span>
                    </p>
                    <p className="text-sm">
                      <span className="text-gray-600">Method:</span>{' '}
                      <span className="text-gray-900">{selectedPayout.method.replace('_', ' ')}</span>
                    </p>
                    <p className="text-sm">
                      <span className="text-gray-600">Status:</span>{' '}
                      {getStatusBadge(selectedPayout.status)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Account Details */}
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Account Details</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                    {JSON.stringify(selectedPayout.account_details, null, 2)}
                  </pre>
                </div>
              </div>

              {/* Timestamps */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Timeline</h3>
                  <div className="space-y-2">
                    <p className="text-sm">
                      <span className="text-gray-600">Requested:</span>{' '}
                      <span className="text-gray-900">
                        {new Date(selectedPayout.requested_at).toLocaleString()}
                      </span>
                    </p>
                    {selectedPayout.processed_at && (
                      <p className="text-sm">
                        <span className="text-gray-600">Processed:</span>{' '}
                        <span className="text-gray-900">
                          {new Date(selectedPayout.processed_at).toLocaleString()}
                        </span>
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              {selectedPayout.status === 'pending' && (
                <div className="flex space-x-3 pt-4 border-t">
                  <Button
                    onClick={() => {
                      handleStatusUpdate(selectedPayout.id, 'approved')
                      setSelectedPayout(null)
                    }}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve Payout
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      handleStatusUpdate(selectedPayout.id, 'rejected')
                      setSelectedPayout(null)
                    }}
                    className="border-red-300 text-red-600 hover:bg-red-50"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject Payout
                  </Button>
                </div>
              )}
              
              {selectedPayout.status === 'approved' && (
                <div className="flex space-x-3 pt-4 border-t">
                  <Button
                    onClick={() => {
                      handleStatusUpdate(selectedPayout.id, 'completed')
                      setSelectedPayout(null)
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Mark as Completed
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
