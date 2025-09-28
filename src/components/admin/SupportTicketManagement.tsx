'use client';

import { useState, useEffect } from 'react';
import {
  ChatBubbleLeftRightIcon,
  BugAntIcon,
  LightBulbIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  EyeIcon,
  PencilIcon,
  XMarkIcon,
  PaperAirplaneIcon,
  UserIcon,
  CalendarIcon,
  TagIcon
} from '@heroicons/react/24/outline';

interface SupportTicket {
  id: string;
  type: 'CONTACT' | 'BUG_REPORT' | 'FEATURE_REQUEST';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  userEmail: string;
  userName: string;
  metadata?: any;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    firstName?: string;
    lastName?: string;
    email: string;
    tier: string;
  };
}

interface TicketResponse {
  id?: string;
  ticketId: string;
  message: string;
  isAdmin: boolean;
  createdAt: string;
}

export default function SupportTicketManagement() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [responses, setResponses] = useState<TicketResponse[]>([]);
  const [newResponse, setNewResponse] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filter, setFilter] = useState<'all' | 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'CONTACT' | 'BUG_REPORT' | 'FEATURE_REQUEST'>('all');

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const response = await fetch('/api/admin/support-tickets');
      if (response.ok) {
        const data = await response.json();
        setTickets(data.tickets || []);
      }
    } catch (error) {
      console.error('Error fetching tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchResponses = async (ticketId: string) => {
    try {
      const response = await fetch(`/api/admin/support-tickets/${ticketId}/responses`);
      if (response.ok) {
        const data = await response.json();
        setResponses(data.responses || []);
      }
    } catch (error) {
      console.error('Error fetching responses:', error);
    }
  };

  const handleTicketSelect = (ticket: SupportTicket) => {
    setSelectedTicket(ticket);
    fetchResponses(ticket.id);
  };

  const handleStatusUpdate = async (ticketId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/support-tickets/${ticketId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        await fetchTickets();
        if (selectedTicket?.id === ticketId) {
          setSelectedTicket({ ...selectedTicket, status: newStatus as any });
        }
      }
    } catch (error) {
      console.error('Error updating ticket status:', error);
    }
  };

  const handleSubmitResponse = async () => {
    if (!selectedTicket || !newResponse.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/admin/support-tickets/${selectedTicket.id}/responses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: newResponse })
      });

      if (response.ok) {
        setNewResponse('');
        await fetchResponses(selectedTicket.id);
        // Send notification to user
        await fetch(`/api/notifications`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'SUPPORT_TICKET_UPDATED',
            title: 'Support Response',
            message: `We've responded to your support request: "${selectedTicket.title}"`,
            userId: selectedTicket.user.id
          })
        });
      }
    } catch (error) {
      console.error('Error submitting response:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'BUG_REPORT':
        return <BugAntIcon className="w-4 h-4 text-red-400" />;
      case 'FEATURE_REQUEST':
        return <LightBulbIcon className="w-4 h-4 text-yellow-400" />;
      default:
        return <ChatBubbleLeftRightIcon className="w-4 h-4 text-blue-400" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'high':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default:
        return 'bg-green-500/20 text-green-400 border-green-500/30';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'IN_PROGRESS':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'RESOLVED':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'CLOSED':
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    const statusMatch = filter === 'all' || ticket.status === filter;
    const typeMatch = typeFilter === 'all' || ticket.type === typeFilter;
    return statusMatch && typeMatch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-slate-400">Loading support tickets...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-slate-700 rounded-lg p-4">
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Status</label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="OPEN">Open</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
              <option value="CLOSED">Closed</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Type</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
              className="px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              <option value="CONTACT">Contact</option>
              <option value="BUG_REPORT">Bug Report</option>
              <option value="FEATURE_REQUEST">Feature Request</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tickets List */}
        <div className="lg:col-span-1">
          <div className="bg-slate-700 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-4">
              Tickets ({filteredTickets.length})
            </h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  onClick={() => handleTicketSelect(ticket)}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedTicket?.id === ticket.id
                      ? 'bg-blue-500/20 border-blue-500/50'
                      : 'bg-slate-600 border-slate-500 hover:bg-slate-500'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(ticket.type)}
                      <span className="text-white font-medium text-sm truncate">
                        {ticket.title}
                      </span>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs border ${getStatusColor(ticket.status)}`}>
                      {ticket.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-1 rounded text-xs border ${getPriorityColor(ticket.priority)}`}>
                      {ticket.priority}
                    </span>
                    <span className="text-slate-400 text-xs">
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-400 text-xs">
                    <UserIcon className="w-3 h-3" />
                    <span className="truncate">{ticket.userName}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Ticket Details */}
        <div className="lg:col-span-2">
          {selectedTicket ? (
            <div className="space-y-6">
              {/* Ticket Header */}
              <div className="bg-slate-700 rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {getTypeIcon(selectedTicket.type)}
                    <h2 className="text-xl font-semibold text-white">{selectedTicket.title}</h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded text-sm border ${getStatusColor(selectedTicket.status)}`}>
                      {selectedTicket.status}
                    </span>
                    <span className={`px-3 py-1 rounded text-sm border ${getPriorityColor(selectedTicket.priority)}`}>
                      {selectedTicket.priority}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-slate-300">
                    <UserIcon className="w-4 h-4" />
                    <span>{selectedTicket.userName} ({selectedTicket.userEmail})</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <CalendarIcon className="w-4 h-4" />
                    <span>{new Date(selectedTicket.createdAt).toLocaleString()}</span>
                  </div>
                </div>

                <div className="mb-4">
                  <h3 className="text-lg font-medium text-white mb-2">Description</h3>
                  <p className="text-slate-300 whitespace-pre-wrap">{selectedTicket.description}</p>
                </div>

                {/* Status Update */}
                <div className="flex items-center gap-4">
                  <label className="text-sm font-medium text-slate-300">Update Status:</label>
                  <select
                    value={selectedTicket.status}
                    onChange={(e) => handleStatusUpdate(selectedTicket.id, e.target.value)}
                    className="px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="OPEN">Open</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="RESOLVED">Resolved</option>
                    <option value="CLOSED">Closed</option>
                  </select>
                </div>
              </div>

              {/* Responses */}
              <div className="bg-slate-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Conversation</h3>
                <div className="space-y-4 max-h-64 overflow-y-auto mb-4">
                  {responses.map((response) => (
                    <div
                      key={response.id}
                      className={`p-3 rounded-lg ${
                        response.isAdmin
                          ? 'bg-blue-500/20 border border-blue-500/30'
                          : 'bg-slate-600 border border-slate-500'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium text-white">
                          {response.isAdmin ? 'Admin' : selectedTicket.userName}
                        </span>
                        <span className="text-slate-400 text-xs">
                          {new Date(response.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-slate-300 text-sm whitespace-pre-wrap">{response.message}</p>
                    </div>
                  ))}
                </div>

                {/* New Response */}
                <div className="space-y-3">
                  <textarea
                    value={newResponse}
                    onChange={(e) => setNewResponse(e.target.value)}
                    placeholder="Type your response..."
                    rows={3}
                    className="w-full px-4 py-3 bg-slate-600 border border-slate-500 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={handleSubmitResponse}
                    disabled={isSubmitting || !newResponse.trim()}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <PaperAirplaneIcon className="w-4 h-4" />
                    {isSubmitting ? 'Sending...' : 'Send Response'}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-700 rounded-lg p-12 text-center">
              <ChatBubbleLeftRightIcon className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Select a Ticket</h3>
              <p className="text-slate-400">Choose a support ticket from the list to view details and respond.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
