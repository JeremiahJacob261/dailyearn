"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Mail, 
  User, 
  Calendar, 
  MessageSquare, 
  Search,
  Eye,
  RefreshCw,
  Filter
} from "lucide-react";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'new' | 'in_progress' | 'resolved' | 'closed';
  admin_response?: string;
  user_id?: string;
  created_at: string;
  updated_at: string;
  user?: {
    full_name: string;
    email: string;
  };
}

export default function AdminContactPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [adminResponse, setAdminResponse] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/contact');
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (messageId: string, newStatus: string) => {
    try {
      setIsUpdating(true);
      const response = await fetch(`/api/contact/${messageId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          status: newStatus,
          adminResponse: adminResponse.trim() || undefined
        }),
      });

      if (response.ok) {
        await fetchMessages();
        setSelectedMessage(null);
        setShowDetailsModal(false);
        setAdminResponse("");
      }
    } catch (error) {
      console.error('Error updating message:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleViewDetails = (message: ContactMessage) => {
    setSelectedMessage(message);
    setAdminResponse(message.admin_response || "");
    setShowDetailsModal(true);
  };

  const filteredMessages = messages.filter(message => {
    const matchesSearch = 
      message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.subject.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || message.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      new: { label: "New", variant: "default" as const, color: "bg-blue-100 text-blue-800" },
      in_progress: { label: "In Progress", variant: "secondary" as const, color: "bg-yellow-100 text-yellow-800" },
      resolved: { label: "Resolved", variant: "outline" as const, color: "bg-green-100 text-green-800" },
      closed: { label: "Closed", variant: "destructive" as const, color: "bg-gray-100 text-gray-800" },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.new;
    return (
      <Badge variant={config.variant} className={config.color}>
        {config.label}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getMessageCount = (status: string) => {
    if (status === 'all') return messages.length;
    return messages.filter(msg => msg.status === status).length;
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Contact Messages</h1>
          <p className="text-gray-600 mt-1">Manage user inquiries and support requests</p>
        </div>
        <Button onClick={fetchMessages} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {[
          { label: "All Messages", value: getMessageCount('all'), status: 'all', color: "bg-blue-50 border-blue-200" },
          { label: "New", value: getMessageCount('new'), status: 'new', color: "bg-blue-50 border-blue-200" },
          { label: "In Progress", value: getMessageCount('in_progress'), status: 'in_progress', color: "bg-yellow-50 border-yellow-200" },
          { label: "Resolved", value: getMessageCount('resolved'), status: 'resolved', color: "bg-green-50 border-green-200" },
          { label: "Closed", value: getMessageCount('closed'), status: 'closed', color: "bg-gray-50 border-gray-200" },
        ].map((stat) => (
          <div
            key={stat.status}
            className={`p-4 rounded-lg border-2 ${stat.color} cursor-pointer transition-all hover:shadow-md ${
              statusFilter === stat.status ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => setStatusFilter(stat.status)}
          >
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            <div className="text-sm text-gray-600">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search by name, email, or subject..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-48">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Messages List */}
      <div className="bg-white rounded-lg border">
        {filteredMessages.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No contact messages found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Contact Info</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Subject</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Date</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMessages.map((message) => (
                  <tr key={message.id} className="border-b hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 text-gray-600" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{message.name}</div>
                          <div className="text-sm text-gray-500">{message.email}</div>
                          {message.user && (
                            <div className="text-xs text-blue-600">Registered User</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="max-w-xs">
                        <div className="font-medium text-gray-900 truncate">{message.subject}</div>
                        <div className="text-sm text-gray-500 truncate">{message.message}</div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      {getStatusBadge(message.status)}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(message.created_at)}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDetails(message)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Message Details Modal */}
      <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Contact Message Details</DialogTitle>
            <DialogDescription>
              Manage this contact message and provide a response
            </DialogDescription>
          </DialogHeader>
          
          {selectedMessage && (
            <div className="space-y-6">
              {/* Message Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Name</label>
                  <p className="text-gray-900">{selectedMessage.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <p className="text-gray-900">{selectedMessage.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Status</label>
                  <div className="mt-1">{getStatusBadge(selectedMessage.status)}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Date</label>
                  <p className="text-gray-900">{formatDate(selectedMessage.created_at)}</p>
                </div>
              </div>

              {/* Subject and Message */}
              <div>
                <label className="text-sm font-medium text-gray-700">Subject</label>
                <p className="text-gray-900 bg-gray-50 p-3 rounded-md mt-1">{selectedMessage.subject}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Message</label>
                <p className="text-gray-900 bg-gray-50 p-3 rounded-md mt-1 whitespace-pre-wrap">{selectedMessage.message}</p>
              </div>

              {/* Admin Response */}
              <div>
                <label className="text-sm font-medium text-gray-700">Admin Response</label>
                <Textarea
                  value={adminResponse}
                  onChange={(e) => setAdminResponse(e.target.value)}
                  placeholder="Enter your response to the user..."
                  rows={4}
                  className="mt-1"
                />
              </div>

              {/* Status Update */}
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-700">Update Status</label>
                  <Select 
                    defaultValue={selectedMessage.status}
                    onValueChange={(value) => handleStatusUpdate(selectedMessage.id, value)}
                    disabled={isUpdating}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button
                  onClick={() => handleStatusUpdate(selectedMessage.id, selectedMessage.status)}
                  disabled={isUpdating}
                  className="mt-6"
                >
                  {isUpdating ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Updating...
                    </div>
                  ) : (
                    <>
                      <Mail className="h-4 w-4 mr-2" />
                      Update & Save Response
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
