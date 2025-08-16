import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Eye, Download, DollarSign, Calendar, User, FileText, CreditCard } from 'lucide-react';

export function FaturasContrato() {
  const { faturas, contratos, clientes } = useApp();
  const [contratoSelecionado, setContratoSelecionado] = useState('');

  const faturasContrato = faturas.filter(f => f.contratoId === contratoSelecionado);
  const contrato = contratos.find(c => c.id === contratoSelecionado);
  const cliente = contrato ? clientes.find(c => c.id === contrato.clienteId) : null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pago': return 'bg-green-100 text-green-700';
      case 'Pendente': return 'bg-yellow-100 text-yellow-700';
      case 'Vencida': return 'bg-red-100 text-red-700';
      case 'Cancelada': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const isVencida = (dataVencimento: string) => {
    return new Date(dataVencimento) < new Date();
  };

  const totalFaturado = faturasContrato.reduce((sum, f) => sum + f.valor, 0);
  const totalPago = faturasContrato.filter(f => f.status === 'Pago').reduce((sum, f) => sum + f.valor, 0);
  const totalPendente = faturasContrato.filter(f => f.status === 'Pendente').reduce((sum, f) => sum + f.valor, 0);

  return (
    <div className="space-y-6">
      {/* Seleção de Contrato */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Faturas por Contrato</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Selecione o Contrato
            </label>
            <select
              value={contratoSelecionado}
              onChange={(e) => setContratoSelecionado(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Selecione um contrato</option>
              {contratos.map(contrato => {
                const cliente = clientes.find(cl => cl.id === contrato.clienteId);
                return (
                  <option key={contrato.id} value={contrato.id}>
                    {contrato.nome} - {cliente?.empresa}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
      </div>

      {/* Resumo Financeiro */}
      {contrato && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 mb-1">
                R$ {(totalFaturado / 1000).toFixed(0)}k
              </p>
              <p className="text-sm text-gray-600">Total Faturado</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-gradient-to-r from-green-500 to-green-600 shadow-lg">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 mb-1">
                R$ {(totalPago / 1000).toFixed(0)}k
              </p>
              <p className="text-sm text-gray-600">Total Recebido</p>
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
                R$ {(totalPendente / 1000).toFixed(0)}k
              </p>
              <p className="text-sm text-gray-600">Pendente</p>
            </div>
          </div>
        </div>
      )}

      {/* Lista de Faturas */}
      {contrato && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-semibold text-gray-900">
                Faturas - {contrato.nome}
              </h4>
              <span className="text-sm text-gray-500">
                {faturasContrato.length} faturas
              </span>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Fatura</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Valor</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Vencimento</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Status</th>
                  <th className="text-right py-4 px-6 font-semibold text-gray-900">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {faturasContrato.length > 0 ? (
                  faturasContrato.map((fatura) => (
                    <tr key={fatura.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center text-white font-semibold">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{fatura.numero}</p>
                            <p className="text-sm text-gray-500">
                              {fatura.descricao} ({fatura.parcela}/{fatura.totalParcelas})
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center">
                          <DollarSign className="w-4 h-4 mr-1 text-green-600" />
                          <span className="font-semibold text-gray-900">
                            R$ {fatura.valor.toLocaleString('pt-BR')}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className={`flex items-center text-sm ${
                          isVencida(fatura.dataVencimento) && fatura.status === 'Pendente' 
                            ? 'text-red-600' 
                            : 'text-gray-600'
                        }`}>
                          <Calendar className="w-4 h-4 mr-1" />
                          <span>{new Date(fatura.dataVencimento).toLocaleDateString('pt-BR')}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(fatura.status)}`}>
                          {fatura.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Download PDF"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Ver detalhes"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-500">
                      <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>Nenhuma fatura encontrada para este contrato</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Estado sem contrato selecionado */}
      {!contratoSelecionado && (
        <div className="bg-white rounded-xl p-8 text-center">
          <CreditCard className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Selecione um Contrato</h3>
          <p className="text-gray-600">Escolha um contrato para visualizar suas faturas</p>
        </div>
      )}
    </div>
  );
}