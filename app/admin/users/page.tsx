"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { databaseService } from "@/lib/database"
import { 
  Users, 
  Search, 
  Filter, 
  Eye, 
  CheckCircle, 
  CreditCard,
  ChevronLeft,
  ChevronRight,
  Mail,
  Calendar,
  DollarSign,
  UserCheck,
  RefreshCw,
  TrendingUp
} from "lucide-react"
import { Label } from "@/components/ui/label"

interface UserData {
  id: string
  full_name: string
  email: string
  balance: number
  email_verified: boolean
  referral_code: string
  created_at: string
  total_referrals?: number
  referral_earnings?: number
}

interface UserDetailsModalProps {
  user: UserData | null
  onClose: () => void
}

function UserDetailsModal({ user, onClose }: UserDetailsModalProps) {
  if (!user) return null
  
  return (
    <Dialog open={!!user} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-2xl bg-white border border-gray-200">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-gray-500">
            <Users className="w-5 h-5 text-blue-600" />
            <span>User Details</span>
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          {/* User Profile Section */}
          <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
            <Avatar className="w-16 h-16">
              <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-lg font-semibold">
                {user.full_name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-xl font-semibold text-gray-500">{user.full_name}</h3>
              <p className="text-gray-600 flex items-center gap-1">
                <Mail className="w-4 h-4" />
                {user.email}
              </p>
              <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                <Calendar className="w-4 h-4" />
                Joined {new Date(user.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-4 gap-4">
            <Card className="border border-gray-200 bg-white">
              <CardContent className="p-4 text-center">
                <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-500">₦{user.balance.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Current Balance</p>
              </CardContent>
            </Card>
            <Card className="border border-gray-200 bg-white">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  {user.email_verified ? (
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center">
                      <Mail className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
                <p className="text-lg font-semibold text-gray-500">
                  {user.email_verified ? "Verified" : "Unverified"}
                </p>
                <p className="text-sm text-gray-600">Email Status</p>
              </CardContent>
            </Card>
            <Card className="border border-gray-200 bg-white">
              <CardContent className="p-4 text-center">
                <UserCheck className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-lg font-semibold text-gray-500 font-mono">{user.referral_code}</p>
                <p className="text-sm text-gray-600">Referral Code</p>
              </CardContent>
            </Card>
            <Card className="border border-gray-200 bg-white">
              <CardContent className="p-4 text-center">
                <Users className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <p className="text-lg font-semibold text-gray-500">{user.total_referrals || 0}</p>
                <p className="text-sm text-gray-600">Referrals</p>
              </CardContent>
            </Card>
          </div>
          
          {/* Additional Information */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-500 border-b border-gray-200 pb-2">Account Information</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">User ID:</span>
                  <span className="text-gray-500 font-mono">{user.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Referral Earnings:</span>
                  <span className="text-gray-500">₦{(user.referral_earnings || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Referrals:</span>
                  <span className="text-gray-500">{user.total_referrals || 0}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Member Since:</span>
                  <span className="text-gray-500">{new Date(user.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Active:</span>
                  <span className="text-gray-500">Recently</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Account Type:</span>
                  <Badge className={user.email_verified ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                    {user.email_verified ? "Verified User" : "Pending Verification"}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Referral Performance */}
          {(user.total_referrals || 0) > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium text-gray-500 border-b border-gray-200 pb-2">Referral Performance</h4>
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-purple-600">{user.total_referrals || 0}</p>
                    <p className="text-sm text-gray-600">Total Referrals</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-600">₦{(user.referral_earnings || 0).toLocaleString()}</p>
                    <p className="text-sm text-gray-600">Earnings</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-blue-600">₦{((user.referral_earnings || 0) / Math.max(user.total_referrals || 1, 1)).toFixed(0)}</p>
                    <p className="text-sm text-gray-600">Avg per Referral</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Quick Actions */}
          <div className="flex gap-2 pt-4 border-t border-gray-200">
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
              <Mail className="w-4 h-4 mr-2" />
              Send Email
            </Button>
            <Button variant="outline" size="sm" className="border-gray-300 text-gray-700">
              <Eye className="w-4 h-4 mr-2" />
              View Activity
            </Button>
            <Button variant="outline" size="sm" className="border-gray-300 text-gray-700">
              <Users className="w-4 h-4 mr-2" />
              View Referrals
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Add EditUserModal component
function EditUserModal({ user, open, onClose, onSave }: { user: UserData | null, open: boolean, onClose: () => void, onSave: (updates: Partial<UserData>) => void }) {
  const [form, setForm] = useState({ full_name: user?.full_name || "", email: user?.email || "", balance: user?.balance || 0 })
  useEffect(() => {
    setForm({ full_name: user?.full_name || "", email: user?.email || "", balance: user?.balance || 0 })
  }, [user])
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
        </DialogHeader>
        <form className="space-y-4" onSubmit={e => { e.preventDefault(); onSave(form) }}>
          <div>
            <Label htmlFor="full_name">Full Name</Label>
            <Input id="full_name" value={form.full_name} onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))} required />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
          </div>
          <div>
            <Label htmlFor="balance">Balance</Label>
            <Input id="balance" type="number" value={form.balance} onChange={e => setForm(f => ({ ...f, balance: Number(e.target.value) }))} required />
          </div>
          <div className="flex gap-2 mt-4">
            <Button type="submit" className="bg-blue-600 text-white">Save</Button>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserData[]>([])
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [filtered, setFiltered] = useState<UserData[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [modalUser, setModalUser] = useState<UserData | null>(null)
  const USERS_PER_PAGE = 10
  const { toast } = useToast();
  const [editUser, setEditUser] = useState<UserData | null>(null);
  const [deleteUser, setDeleteUser] = useState<UserData | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const allUsers = await databaseService.getAllUsers()
      
      // Fetch referral stats for each user
      const usersWithReferrals = await Promise.all(
        allUsers.map(async (user) => {
          try {
            const referralStats = await databaseService.getReferralStats(user.id)
            return {
              ...user,
              total_referrals: referralStats.totalReferrals,
              referral_earnings: referralStats.totalEarnings
            }
          } catch (error) {
            console.error(`Error fetching referrals for user ${user.id}:`, error)
            return {
              ...user,
              total_referrals: 0,
              referral_earnings: 0
            }
          }
        })
      )
      
      setUsers(usersWithReferrals)
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let result = users
    
    if (search) {
      const s = search.toLowerCase()
      result = result.filter(
        u =>
          u.full_name.toLowerCase().includes(s) ||
          u.email.toLowerCase().includes(s) ||
          u.referral_code.toLowerCase().includes(s)
      )
    }
    
    if (statusFilter !== "all") {
      result = result.filter(u => {
        if (statusFilter === "verified") return u.email_verified
        if (statusFilter === "unverified") return !u.email_verified
        return true
      })
    }
    
    setFiltered(result)
    setPage(1)
  }, [search, statusFilter, users])

  const paged = filtered.slice((page - 1) * USERS_PER_PAGE, page * USERS_PER_PAGE)
  const totalPages = Math.ceil(filtered.length / USERS_PER_PAGE)
  const verifiedUsers = users.filter(u => u.email_verified).length
  const totalBalance = users.reduce((sum, u) => sum + (u.balance || 0), 0)
  const totalReferrals = users.reduce((sum, u) => sum + (u.total_referrals || 0), 0)
  const totalReferralEarnings = users.reduce((sum, u) => sum + (u.referral_earnings || 0), 0)

  // Add edit and delete handlers
  const handleEditSave = async (updates: Partial<UserData>) => {
    if (!editUser) return;
    try {
      await databaseService.updateUserByAdmin(editUser.id, updates);
      toast({ title: "User updated" });
      setEditUser(null);
      fetchUsers();
    } catch (e) {
      toast({ title: "Failed to update user", variant: "destructive" });
    }
  };
  const handleDelete = async () => {
    if (!deleteUser) return;
    setDeleting(true);
    try {
      await databaseService.deleteUser(deleteUser.id);
      toast({ title: "User deleted" });
      setDeleteUser(null);
      fetchUsers();
    } catch (e) {
      toast({ title: "Failed to delete user", variant: "destructive" });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-500">User Management</h1>
          <p className="text-gray-600 mt-1">Manage and monitor all platform users</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={fetchUsers} className="border-gray-300 text-gray-700 bg-white hover:bg-gray-50">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="bg-white border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-500">{users.length}</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Verified Users</p>
                <p className="text-2xl font-bold text-gray-500">{verifiedUsers}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Balance</p>
                <p className="text-2xl font-bold text-gray-500">₦{totalBalance.toLocaleString()}</p>
              </div>
              <DollarSign className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Referrals</p>
                <p className="text-2xl font-bold text-gray-500">{totalReferrals}</p>
              </div>
              <UserCheck className="w-8 h-8 text-indigo-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Referral Earnings</p>
                <p className="text-2xl font-bold text-gray-500">₦{totalReferralEarnings.toLocaleString()}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-emerald-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-white border-gray-200">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by name, email, or referral code..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
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
                  <SelectItem value="all">All Users</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="unverified">Unverified</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-500">Users</CardTitle>
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
                    <TableHead className="text-gray-700">Email</TableHead>
                    <TableHead className="text-gray-700">Balance</TableHead>
                    <TableHead className="text-gray-700">Referrals</TableHead>
                    <TableHead className="text-gray-700">Status</TableHead>
                    <TableHead className="text-gray-700">Joined</TableHead>
                    <TableHead className="text-gray-700">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paged.map((user) => (
                    <TableRow key={user.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="w-10 h-10">
                            <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                              {user.full_name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-gray-500">{user.full_name}</p>
                            <p className="text-sm text-gray-500 font-mono">{user.referral_code}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-500">{user.email}</TableCell>
                      <TableCell>
                        <span className="font-medium text-gray-500">₦{user.balance.toLocaleString()}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-500">{user.total_referrals || 0}</span>
                          <span className="text-xs text-gray-500">₦{(user.referral_earnings || 0).toLocaleString()} earned</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={user.email_verified ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                          {user.email_verified ? "Verified" : "Unverified"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {new Date(user.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setModalUser(user)}
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditUser(user)}
                          className="text-green-600 hover:text-green-700 hover:bg-green-50"
                        >
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteUser(user)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {filtered.length === 0 && (
                <div className="text-center py-12">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No users found</p>
                  <p className="text-sm text-gray-500">
                    {statusFilter !== "all" 
                      ? `No ${statusFilter} users match your search`
                      : search 
                        ? "Try adjusting your search criteria"
                        : "Users will appear here when they register"
                    }
                  </p>
                </div>
              )}
            </div>
          )}
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Showing {(page - 1) * USERS_PER_PAGE + 1} to {Math.min(page * USERS_PER_PAGE, filtered.length)} of {filtered.length} users
              </p>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>
                <span className="text-sm text-gray-600">
                  Page {page} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* User Details Modal */}
      <UserDetailsModal user={modalUser} onClose={() => setModalUser(null)} />
      {/* Edit User Modal */}
      <EditUserModal user={editUser} open={!!editUser} onClose={() => setEditUser(null)} onSave={handleEditSave} />
      {/* Delete User Confirmation Dialog */}
      <Dialog open={!!deleteUser} onOpenChange={() => setDeleteUser(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete <span className="font-bold">{deleteUser?.full_name}</span>? This action cannot be undone.</p>
          <div className="flex gap-2 mt-4">
            <Button onClick={handleDelete} className="bg-red-600 text-white" disabled={deleting}>{deleting ? "Deleting..." : "Delete"}</Button>
            <Button variant="outline" onClick={() => setDeleteUser(null)}>Cancel</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
