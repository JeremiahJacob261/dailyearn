"use client"

import { useState } from "react"
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
  CreditCard,
  Clock,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  Download,
  RefreshCw,
  Calendar,
  DollarSign
} from "lucide-react"

export default function AdminPayouts() {
  const [payouts] = useState([
    {
      id: 1,
      userId: "user_123",
      userName: "John Doe",
      userEmail: "john@example.com",
      amount: 5000,
      status: "pending",
      method: "bank_transfer",
      requestedAt: "2024-01-20T10:30:00Z",
      processedAt: null,
      reference: "PAY_001"
    },
    {
      id: 2,
      userId: "user_456",
      userName: "Jane Smith",
      userEmail: "jane@example.com",
      amount: 7500,
      status: "completed",
      method: "paypal",
      requestedAt: "2024-01-19T14:15:00Z",
      processedAt: "2024-01-19T16:20:00Z",
      reference: "PAY_002"
    },
    {
      id: 3,
      userId: "user_789",
      userName: "Mike Johnson",
      userEmail: "mike@example.com",
      amount: 12000,
      status: "rejected",
      method: "bank_transfer",
      requestedAt: "2024-01-18T09:45:00Z",
      processedAt: "2024-01-18T11:30:00Z",
      reference: "PAY_003"
    },
    {
      id: 4,
      userId: "user_321",
      userName: "Sarah Wilson",
      userEmail: "sarah@example.com",
      amount: 8500,
      status: "processing",
      method: "mobile_money",
      requestedAt: "2024-01-17T16:20:00Z",
      processedAt: null,
      reference: "PAY_004"
    }
  ])

  const [statusFilter, setStatusFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredPayouts = payouts.filter(payout => {
    const matchesStatus = statusFilter === "all" || payout.status === statusFilter
    const matchesSearch = payout.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         payout.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         payout.reference.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">Pending</Badge>
      case "processing":
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Processing</Badge>
      case "completed":
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Completed</Badge>
      case "rejected":
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Rejected</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getMethodBadge = (method: string) => {
    switch (method) {
      case "bank_transfer":
        return <Badge variant="outline">Bank Transfer</Badge>
      case "paypal":
        return <Badge variant="outline">PayPal</Badge>
      case "mobile_money":
        return <Badge variant="outline">Mobile Money</Badge>
      default:
        return <Badge variant="outline">{method}</Badge>
    }
  }

  const totalAmount = payouts.reduce((sum, payout) => sum + payout.amount, 0)
  const completedAmount = payouts
    .filter(p => p.status === 'completed')
    .reduce((sum, payout) => sum + payout.amount, 0)
  const pendingAmount = payouts
    .filter(p => p.status === 'pending')
    .reduce((sum, payout) => sum + payout.amount, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Payout Management</h1>
          <p className="text-slate-600 mt-1">
            Review and manage user payout requests.
          </p>
        </div>
        <div className="flex items-center space-x-3 mt-4 md:mt-0">
          <Button variant="outline" size="sm" className="border-slate-200">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm" className="border-slate-200">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-0 shadow-md bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Requests</p>
                <p className="text-2xl font-bold text-slate-900">{payouts.length}</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <CreditCard className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-md bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Pending</p>
                <p className="text-2xl font-bold text-slate-900">
                  {payouts.filter(p => p.status === 'pending').length}
                </p>
                <p className="text-sm text-slate-500">₦{pendingAmount.toLocaleString()}</p>
              </div>
              <div className="bg-yellow-50 p-3 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-md bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Completed</p>
                <p className="text-2xl font-bold text-slate-900">
                  {payouts.filter(p => p.status === 'completed').length}
                </p>
                <p className="text-sm text-slate-500">₦{completedAmount.toLocaleString()}</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-md bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Amount</p>
                <p className="text-2xl font-bold text-slate-900">₦{totalAmount.toLocaleString()}</p>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="border-0 shadow-md bg-white">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                placeholder="Search by name, email, or reference"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-10 border-slate-200 focus:border-blue-300 focus:ring-blue-100"
              />
            </div>
            <div className="flex items-center space-x-3">
              <Filter className="w-4 h-4 text-slate-500" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40 border-slate-200 focus:border-blue-300 focus:ring-blue-100">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payouts Table */}
      <Card className="border-0 shadow-md bg-white">
        <CardHeader>
          <CardTitle>Payout Requests</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredPayouts.length === 0 ? (
            <div className="text-center py-8">
              <CreditCard className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600">No payout requests found.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-slate-200">
                  <TableHead className="text-slate-700 font-semibold">User</TableHead>
                  <TableHead className="text-slate-700 font-semibold">Amount</TableHead>
                  <TableHead className="text-slate-700 font-semibold">Method</TableHead>
                  <TableHead className="text-slate-700 font-semibold">Status</TableHead>
                  <TableHead className="text-slate-700 font-semibold">Requested</TableHead>
                  <TableHead className="text-slate-700 font-semibold">Reference</TableHead>
                  <TableHead className="text-slate-700 font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayouts.map(payout => (
                  <TableRow key={payout.id} className="border-slate-100 hover:bg-slate-50">
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold">
                            {payout.userName.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-slate-900">{payout.userName}</p>
                          <p className="text-sm text-slate-600">{payout.userEmail}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-slate-900">
                      ₦{payout.amount.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {getMethodBadge(payout.method)}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(payout.status)}
                    </TableCell>
                    <TableCell className="text-slate-600">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(payout.requestedAt).toLocaleDateString()}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-mono">
                        {payout.reference}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {payout.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-red-200 text-red-600 hover:bg-red-50"
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Reject
                            </Button>
                          </>
                        )}
                        {payout.status === 'processing' && (
                          <Button
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Complete
                          </Button>
                        )}
                        {(payout.status === 'completed' || payout.status === 'rejected') && (
                          <span className="text-sm text-slate-500">No actions</span>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 