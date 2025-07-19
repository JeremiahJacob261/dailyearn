import { useEffect, useState } from "react"
import { databaseService, UserData } from "@/lib/database"

interface UserDetailsModalProps {
  user: UserData | null
  onClose: () => void
}

function UserDetailsModal({ user, onClose }: UserDetailsModalProps) {
  if (!user) return null
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 w-full max-w-md relative">
        <button className="absolute top-2 right-2 text-xl" onClick={onClose}>&times;</button>
        <h2 className="text-xl font-bold mb-4">User Details</h2>
        <div className="mb-2"><b>Name:</b> {user.full_name}</div>
        <div className="mb-2"><b>Email:</b> {user.email}</div>
        <div className="mb-2"><b>Referral Code:</b> {user.referral_code}</div>
        <div className="mb-2"><b>Balance:</b> ₦{user.balance.toFixed(2)}</div>
        <div className="mb-2"><b>Email Verified:</b> {user.email_verified ? "Yes" : "No"}</div>
        <div className="mt-4 p-3 bg-gray-100 rounded">[Referrals, completed tasks, etc. coming soon]</div>
      </div>
    </div>
  )
}

export default function AdminUsers() {
  const [users, setUsers] = useState<UserData[]>([])
  const [search, setSearch] = useState("")
  const [filtered, setFiltered] = useState<UserData[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [modalUser, setModalUser] = useState<UserData | null>(null)
  const USERS_PER_PAGE = 10

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true)
      const all = await databaseService.getAllUsers()
      setUsers(all)
      setLoading(false)
    }
    fetchUsers()
  }, [])

  useEffect(() => {
    if (!search) {
      setFiltered(users)
    } else {
      const s = search.toLowerCase()
      setFiltered(
        users.filter(
          u =>
            u.full_name.toLowerCase().includes(s) ||
            u.email.toLowerCase().includes(s) ||
            u.referral_code.toLowerCase().includes(s)
        )
      )
    }
    setPage(1) // Reset to first page on search
  }, [search, users])

  const paged = filtered.slice((page - 1) * USERS_PER_PAGE, page * USERS_PER_PAGE)
  const totalPages = Math.ceil(filtered.length / USERS_PER_PAGE)

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Manage Users</h1>
      <input
        className="mb-6 px-4 py-2 border rounded w-full max-w-md"
        placeholder="Search by name, email, or referral code"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      {loading ? (
        <div>Loading users...</div>
      ) : filtered.length === 0 ? (
        <div>No users found.</div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 border">Name</th>
                  <th className="px-4 py-2 border">Email</th>
                  <th className="px-4 py-2 border">Referral Code</th>
                  <th className="px-4 py-2 border">Balance (₦)</th>
                  <th className="px-4 py-2 border">Email Verified</th>
                  <th className="px-4 py-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paged.map(user => (
                  <tr key={user.id} className="border-b">
                    <td className="px-4 py-2 border">{user.full_name}</td>
                    <td className="px-4 py-2 border">{user.email}</td>
                    <td className="px-4 py-2 border">{user.referral_code}</td>
                    <td className="px-4 py-2 border">{user.balance.toFixed(2)}</td>
                    <td className="px-4 py-2 border">{user.email_verified ? "Yes" : "No"}</td>
                    <td className="px-4 py-2 border">
                      <button className="text-blue-600 underline" onClick={() => setModalUser(user)}>
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between mt-4">
            <button
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </button>
            <span>Page {page} of {totalPages}</span>
            <button
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Next
            </button>
          </div>
        </>
      )}
      {modalUser && <UserDetailsModal user={modalUser} onClose={() => setModalUser(null)} />}
    </div>
  )
} 