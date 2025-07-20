"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { 
  Plus,
  CheckSquare,
  Clock,
  DollarSign,
  Eye,
  Edit,
  Trash2,
  Calendar
} from "lucide-react"

export default function AdminTasks() {
  const [tasks] = useState([
    {
      id: 1,
      title: "Watch Advertisement Video",
      description: "Watch a 30-second promotional video and earn rewards",
      reward: 50,
      status: "active",
      category: "video",
      completions: 245,
      createdAt: "2024-01-15"
    },
    {
      id: 2,
      title: "Follow Social Media Account",
      description: "Follow our official social media accounts",
      reward: 25,
      status: "active", 
      category: "social",
      completions: 189,
      createdAt: "2024-01-14"
    },
    {
      id: 3,
      title: "Complete Survey",
      description: "Fill out a short customer feedback survey",
      reward: 75,
      status: "inactive",
      category: "survey",
      completions: 98,
      createdAt: "2024-01-13"
    }
  ])

  const [showAddForm, setShowAddForm] = useState(false)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Task Management</h1>
          <p className="text-slate-600 mt-1">
            Create and manage tasks for users to complete and earn rewards.
          </p>
        </div>
        <div className="flex items-center space-x-3 mt-4 md:mt-0">
          <Button 
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Task
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-0 shadow-md bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Tasks</p>
                <p className="text-2xl font-bold text-slate-900">{tasks.length}</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <CheckSquare className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-md bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Active Tasks</p>
                <p className="text-2xl font-bold text-slate-900">
                  {tasks.filter(t => t.status === 'active').length}
                </p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-md bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Completions</p>
                <p className="text-2xl font-bold text-slate-900">
                  {tasks.reduce((sum, t) => sum + t.completions, 0)}
                </p>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg">
                <Eye className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-md bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Rewards</p>
                <p className="text-2xl font-bold text-slate-900">
                  ₦{tasks.reduce((sum, t) => sum + (t.reward * t.completions), 0)}
                </p>
              </div>
              <div className="bg-orange-50 p-3 rounded-lg">
                <DollarSign className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Task Form */}
      {showAddForm && (
        <Card className="border-0 shadow-md bg-white">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Create New Task</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">Task Title</Label>
                <Input 
                  id="title"
                  placeholder="Enter task title"
                  className="border-slate-200 focus:border-blue-300 focus:ring-blue-100"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select>
                  <SelectTrigger className="border-slate-200 focus:border-blue-300 focus:ring-blue-100">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="social">Social Media</SelectItem>
                    <SelectItem value="survey">Survey</SelectItem>
                    <SelectItem value="download">App Download</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description"
                placeholder="Describe what users need to do to complete this task"
                className="border-slate-200 focus:border-blue-300 focus:ring-blue-100"
                rows={3}
              />
            </div>
            
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="reward">Reward Amount (₦)</Label>
                <Input 
                  id="reward"
                  type="number"
                  placeholder="0"
                  className="border-slate-200 focus:border-blue-300 focus:ring-blue-100"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select>
                  <SelectTrigger className="border-slate-200 focus:border-blue-300 focus:ring-blue-100">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <Button 
                variant="outline" 
                onClick={() => setShowAddForm(false)}
                className="border-slate-200"
              >
                Cancel
              </Button>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                Create Task
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tasks Table */}
      <Card className="border-0 shadow-md bg-white">
        <CardHeader>
          <CardTitle>All Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-slate-200">
                <TableHead className="text-slate-700 font-semibold">Task</TableHead>
                <TableHead className="text-slate-700 font-semibold">Category</TableHead>
                <TableHead className="text-slate-700 font-semibold">Reward</TableHead>
                <TableHead className="text-slate-700 font-semibold">Status</TableHead>
                <TableHead className="text-slate-700 font-semibold">Completions</TableHead>
                <TableHead className="text-slate-700 font-semibold">Created</TableHead>
                <TableHead className="text-slate-700 font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.map(task => (
                <TableRow key={task.id} className="border-slate-100 hover:bg-slate-50">
                  <TableCell>
                    <div>
                      <p className="font-medium text-slate-900">{task.title}</p>
                      <p className="text-sm text-slate-600 truncate max-w-xs">{task.description}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {task.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium text-slate-900">
                    ₦{task.reward}
                  </TableCell>
                  <TableCell>
                    <Badge 
                      className={task.status === 'active' 
                        ? "bg-green-100 text-green-700 hover:bg-green-100" 
                        : "bg-red-100 text-red-700 hover:bg-red-100"
                      }
                    >
                      {task.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-slate-600">
                    {task.completions}
                  </TableCell>
                  <TableCell className="text-slate-600">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{task.createdAt}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
} 