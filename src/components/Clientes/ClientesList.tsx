import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Eye, Edit2, Building2, Mail, Phone, TrendingUp, Users, Search, Filter } from 'lucide-react';
import { ClienteModal } from './ClienteModal';

export function ClientesList() {
  const { clientes, setClienteSelecionado } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [clienteEdit, setClienteEdit] = useState(null);
  const [filtroStatus, setFiltroStatus] = useState('todos');
  const [filtroSegmento, setFiltroSegmento] = useState('todos');
  const [busca, setBusca] = useState('');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ativo': return 'bg-green-100 text-green-700';
      case 'Prospect': return 'bg-blue-100 text-blue-700';
      case 'Inativo': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getTamanhoColor = (tamanho: string) => {
    switch (tamanho) {
      case 'Grande': return 'bg-purple-100 text-purple-700';
      case 'Médio': return 'bg-blue-100 text-blue-700';
      case 'Pequeno': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handleEditCliente = (cliente: any) => {
    setClienteEdit(cliente);
    setShowModal(true);
  };

  const handleViewCliente = (cliente: any) => {
    setClienteSelecionado(cliente);
  };

  const clientesFiltrados = clientes.filter(cliente => {
    const matchStatus = filtroStatus === 'todos' || cliente.status === filtroStatus;
    const matchSegmento = filtroSegmento === 'todos' || cliente.segmento === filtroSegmento;
    const matchBusca = busca === '' || 
      cliente.nome.toLowerCase().includes(busca.toLowerCase()) ||
      cliente.empresa.toLowerCase().includes(busca.toLowerCase()) ||
      cliente.email.toLowerCase().includes(busca.toLowerCase());
    
    return matchStatus && matchSegmento && matchBusca;
  });

  const segmentosUnicos = [...new Set(clientes.map(c => c.segmento))];

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 mb-1">{clientes.length}</p>
            <p className="text-sm text-gray-600">Total de Clientes</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-green-500 to-green-600 shadow-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 mb-1">
              {clientes.filter(c => c.status === 'Ativo').length}
            </p>
            <p className="text-sm text-gray-600">Clientes Ativos</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-yellow-500 to-yellow-600 shadow-lg">
              <Building2 className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 mb-1">
              {clientes.filter(c => c.status === 'Prospect').length}
            </p>
            <p className="text-sm text-gray-600">Prospects</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 shadow-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 mb-1">
              {clientes.length > 0 ? ((clientes.filter(c => c.status === 'Ativo').length / clientes.length) * 100).toFixed(1) : 0}%
            </p>
            <p className="text-sm text-gray-600">Taxa de Conversão</p>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
          <div className="flex items-center space-x-2">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              placeholder="Buscar clientes..."
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={filtroStatus}
              onChange={(e) => setFiltroStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="todos">Todos os Status</option>
              <option value="Ativo">Ativo</option>
              <option value="Prospect">Prospect</option>
              <option value="Inativo">Inativo</option>
            </select>
          </div>

          <select
            value={filtroSegmento}
            onChange={(e) => setFiltroSegmento(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            <option value="todos">Todos os Segmentos</option>
            {segmentosUnicos.map(segmento => (
              <option key={segmento} value={segmento}>{segmento}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Lista de Clientes */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Cliente</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Contato</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Segmento</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Tamanho</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Valor Total</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Status</th>
                <th className="text-right py-4 px-6 font-semibold text-gray-900">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {clientesFiltrados.length > 0 ? (
                clientesFiltrados.map((cliente) => (
                  <tr key={cliente.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {cliente.empresa.split(' ').map(word => word[0]).join('').slice(0, 2)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{cliente.empresa}</p>
                          <p className="text-sm text-gray-500">{cliente.nome}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="space-y-1">
                        <div className="flex items-center text-sm text-gray-600">
                          <Mail className="w-4 h-4 mr-1" />
                          <span>{cliente.email}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Phone className="w-4 h-4 mr-1" />
                          <span>{cliente.telefone}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-gray-700">{cliente.segmento}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTamanhoColor(cliente.tamanho)}`}>
                        {cliente.tamanho}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-semibold text-gray-900">
                        R$ {cliente.valorTotal.toLocaleString('pt-BR')}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(cliente.status)}`}>
                        {cliente.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleViewCliente(cliente)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Ver detalhes"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEditCliente(cliente)}
                          className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                          title="Editar cliente"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-500">
                    <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>Nenhum cliente encontrado</p>
                    <p className="text-sm mt-2">
                      {busca ? 'Tente ajustar os filtros de busca' : 'Clique em "Adicionar" para criar seu primeiro cliente'}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <ClienteModal
          cliente={clienteEdit}
          onClose={() => {
            setShowModal(false);
            setClienteEdit(null);
          }}
        />
      )}
    </div>
  );
}