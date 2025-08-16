import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Plus, Edit2, Eye, FileText, DollarSign, User, Calendar, CreditCard, Package } from 'lucide-react';
import { VendaModal } from './VendaModal';

export function VendasList() {
  const { vendas, clientes, condicoesPagamento, gerarFaturasVenda } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [vendaEdit, setVendaEdit] = useState(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Aprovada': return 'bg-green-100 text-green-700';
      case 'Orcamento': return 'bg-blue-100 text-blue-700';
      case 'Faturada': return 'bg-purple-100 text-purple-700';
      case 'Cancelada': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getClienteNome = (clienteId: string) => {
    const cliente = clientes.find(c => c.id === clienteId);
    return cliente ? `${cliente.nome} - ${cliente.empresa}` : 'Cliente não encontrado';
  };

  const getCondicaoPagamento = (condicaoId: string) => {
    const condicao = condicoesPagamento.find(c => c.id === condicaoId);
    return condicao ? `${condicao.nome} (${condicao.parcelas.length}x)` : 'Não informado';
  };

  const handleEditVenda = (venda: any) => {
    setVendaEdit(venda);
    setShowModal(true);
  };

  const handleGerarFaturas = (vendaId: string) => {
    if (confirm('Deseja gerar as faturas desta venda?')) {
      gerarFaturasVenda(vendaId);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">Vendas</h3>
          <p className="text-gray-600">Gerencie vendas e gere faturas automaticamente</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Nova Venda</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg">
              <Package className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 mb-1">{vendas.length}</p>
            <p className="text-sm text-gray-600">Total de Vendas</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-green-500 to-green-600 shadow-lg">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 mb-1">
              R$ {(vendas.filter(v => v.status === 'Aprovada' || v.status === 'Faturada').reduce((sum, v) => sum + v.valorFinal, 0) / 1000).toFixed(0)}k
            </p>
            <p className="text-sm text-gray-600">Vendas Aprovadas</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 shadow-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 mb-1">
              {vendas.filter(v => v.status === 'Faturada').length}
            </p>
            <p className="text-sm text-gray-600">Faturadas</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-yellow-500 to-yellow-600 shadow-lg">
              <Calendar className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 mb-1">
              {vendas.filter(v => v.status === 'Orcamento').length}
            </p>
            <p className="text-sm text-gray-600">Orçamentos</p>
          </div>
        </div>
      </div>

      {/* Lista de Vendas */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Venda</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Cliente</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Data</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Valor Final</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Condição</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Vendedor</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Status</th>
                <th className="text-right py-4 px-6 font-semibold text-gray-900">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {vendas.length > 0 ? (
                vendas.map((venda) => (
                  <tr key={venda.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                          <Package className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{venda.numero}</p>
                          <p className="text-sm text-gray-500">{venda.itens.length} itens</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="text-gray-900">{getClienteNome(venda.clienteId)}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="text-gray-900">{new Date(venda.dataVenda).toLocaleDateString('pt-BR')}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center">
                        <DollarSign className="w-4 h-4 mr-1 text-green-600" />
                        <div>
                          <span className="font-semibold text-gray-900">
                            R$ {venda.valorFinal.toLocaleString('pt-BR')}
                          </span>
                          {venda.desconto > 0 && (
                            <p className="text-xs text-gray-500">
                              Desc: R$ {venda.desconto.toLocaleString('pt-BR')}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-gray-700 text-sm">{getCondicaoPagamento(venda.condicaoPagamentoId)}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-gray-900">{venda.vendedor || '-'}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(venda.status)}`}>
                        {venda.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        {venda.status === 'Aprovada' && (
                          <button
                            onClick={() => handleGerarFaturas(venda.id)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Gerar faturas"
                          >
                            <CreditCard className="w-4 h-4" />
                          </button>
                        )}
                        
                        <button
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Ver detalhes"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        
                        <button
                          onClick={() => handleEditVenda(venda)}
                          className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                          title="Editar venda"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-gray-500">
                    <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>Nenhuma venda encontrada</p>
                    <p className="text-sm mt-2">Crie vendas para gerar faturas automaticamente</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <VendaModal
          venda={vendaEdit}
          onClose={() => {
            setShowModal(false);
            setVendaEdit(null);
          }}
        />
      )}
    </div>
  );
}