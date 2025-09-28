'use client';

import { useState, useEffect } from 'react';
import { useAuth, useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import ClientCard from '@/components/clients/ClientCard';
import ClientForm from '@/components/clients/ClientForm';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  UserGroupIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  BuildingOfficeIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';

interface Client {
  id: string;
  firstName: string;
  lastName: string;
  company?: string;
  email: string;
  phone?: string;
  address?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  _count: {
    contracts: number;
  };
}

export default function ClientsPage() {
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();
  const router = useRouter();
  const { t } = useLanguage();
  
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('all');
  const [companies, setCompanies] = useState<string[]>([]);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/sign-in');
    }
  }, [isLoaded, isSignedIn, router]);

  useEffect(() => {
    if (isSignedIn && user) {
      fetchClients();
    }
  }, [isSignedIn, user]);

  const fetchClients = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/clients?clerkId=${user?.id}`);
      const data = await response.json();

      if (data.success) {
        setClients(data.clients);
        
        // Extract unique companies for filter
        const uniqueCompanies = [...new Set(
          data.clients
            .map((client: Client) => client.company)
            .filter(Boolean)
        )] as string[];
        setCompanies(uniqueCompanies);
      } else {
        console.error('Failed to fetch clients:', data.error);
      }
    } catch (error) {
      console.error('Error fetching clients:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddClient = async (clientData: any) => {
    try {
      const response = await fetch('/api/clients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...clientData,
          clerkId: user?.id
        }),
      });

      const data = await response.json();

      if (data.success) {
        setClients(prev => [data.client, ...prev]);
        setShowAddForm(false);
        
        // Update companies list if new company
        if (clientData.company && !companies.includes(clientData.company)) {
          setCompanies(prev => [...prev, clientData.company]);
        }
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Error adding client:', error);
      throw error;
    }
  };

  const handleUpdateClient = async (clientId: string, clientData: any) => {
    try {
      const response = await fetch(`/api/clients/${clientId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...clientData,
          clerkId: user?.id
        }),
      });

      const data = await response.json();

      if (data.success) {
        setClients(prev => prev.map(client => 
          client.id === clientId ? data.client : client
        ));
        setEditingClient(null);
        
        // Update companies list if company changed
        if (clientData.company && !companies.includes(clientData.company)) {
          setCompanies(prev => [...prev, clientData.company]);
        }
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Error updating client:', error);
      throw error;
    }
  };

  const handleDeleteClient = async (clientId: string) => {
    if (!confirm('Are you sure you want to delete this client?')) {
      return;
    }

    try {
      const response = await fetch(`/api/clients/${clientId}?clerkId=${user?.id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        setClients(prev => prev.filter(client => client.id !== clientId));
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Error deleting client:', error);
      alert('Failed to delete client. Please try again.');
    }
  };

  const filteredClients = clients.filter(client => {
    const matchesSearch = 
      client.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (client.company && client.company.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCompany = selectedCompany === 'all' || client.company === selectedCompany;
    
    return matchesSearch && matchesCompany;
  });

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-300">{t.loading}</p>
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="flex-1 flex flex-col p-6 bg-slate-900">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
              <UserGroupIcon className="w-8 h-8" />
              {t.clients}
            </h1>
            <p className="text-slate-300">{t.manageClients}</p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-gradient-to-r from-blue-500 to-emerald-500 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-200 transform hover:scale-105 flex items-center gap-2"
          >
            <PlusIcon className="w-5 h-5" />
            <span>{t.addClient}</span>
          </button>
        </div>

        {/* Search and Filter */}
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder={t.searchClients}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <FunnelIcon className="w-5 h-5 text-slate-400" />
            <select
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
              className="px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="all">{t.allCompanies}</option>
              {companies.map(company => (
                <option key={company} value={company}>{company}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Clients Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-slate-300">{t.loading}</p>
            </div>
          </div>
        ) : filteredClients.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center max-w-md mx-auto">
              <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <UserGroupIcon className="w-12 h-12 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{t.noClients}</h3>
              <p className="text-slate-400 mb-6">{t.noClientsDesc}</p>
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-gradient-to-r from-blue-500 to-emerald-500 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-200 transform hover:scale-105 flex items-center gap-2 mx-auto"
              >
                <PlusIcon className="w-5 h-5" />
                <span>{t.addClient}</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClients.map((client) => (
              <ClientCard
                key={client.id}
                client={client}
                onEdit={setEditingClient}
                onDelete={handleDeleteClient}
                onUseForContract={(client) => {
                  // Navigate to create contract with client data
                  const clientData = {
                    parties: [`${client.firstName} ${client.lastName}${client.company ? ` - ${client.company}` : ''}`],
                    // Add more client data as needed for auto-fill
                  };
                  const queryString = new URLSearchParams({
                    client: JSON.stringify(clientData)
                  }).toString();
                  router.push(`/create-contract?${queryString}`);
                }}
              />
            ))}
          </div>
        )}

        {/* Add Client Form Modal */}
        {showAddForm && (
          <ClientForm
            onSave={handleAddClient}
            onCancel={() => setShowAddForm(false)}
            title={t.addClient}
          />
        )}

        {/* Edit Client Form Modal */}
        {editingClient && (
          <ClientForm
            client={editingClient}
            onSave={(clientData) => handleUpdateClient(editingClient.id, clientData)}
            onCancel={() => setEditingClient(null)}
            title={t.editClient}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
