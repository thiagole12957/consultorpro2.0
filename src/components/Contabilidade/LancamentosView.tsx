import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Plus, FileText, Calendar, DollarSign } from 'lucide-react';
import { LancamentoModal } from './LancamentoModal';

export function LancamentosView() {
  const { lancamentosContabeis, contasContabeis } = useApp();
  const [showModal, setShowModal] = useState(false);

  const getContaNome = (contaId: string) => {
    const conta = contasContabeis.find(c => c.id === contaId);
    return conta ? `${conta.codigo} - ${conta.nome}` : 'Conta não encontrada';
  };

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'Receita': return 'bg-green-100 text-green-700';
      case 'Despesa': return 'bg-red-100 text-red-700';
      case 'Transferencia': return 'bg-blue-100 text-blue-700';
      case 'Ajuste': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Definitivo': return 'bg-green-100 text-green-700';
      case 'Provisorio': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Lançamentos Contábeis</h2>
          <p className="text-gray-600">Controle de movimentações contábeis</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Lançamento</span>
        </button>
      </div>

      {/* Lista de Lançamentos */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Data</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Histórico</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Conta Débito</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Conta Crédito</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Valor</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Tipo</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {lancamentosContabeis.length > 0 ? (
                lancamentosContabeis.map((lancamento) => (
                  <tr key={lancamento.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="text-gray-900">
                          {new Date(lancamento.data).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                          <FileText className="w-4 h-4" />
                        </div>
                        <span className="text-gray-900">{lancamento.historico}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm text-gray-600">
                        {getContaNome(lancamento.contaDebito)}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm text-gray-600">
                        {getContaNome(lancamento.contaCredito)}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center">
                        <DollarSign className="w-4 h-4 mr-1 text-green-600" />
                        <span className="font-semibold text-gray-900">
                          R$ {lancamento.valor.toLocaleString('pt-BR')}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTipoColor(lancamento.tipo)}`}>
                        {lancamento.tipo}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(lancamento.status)}`}>
                        {lancamento.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-500">
                    <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>Nenhum lançamento contábil encontrado</p>
                    <p className="text-sm mt-2">Clique em "Novo Lançamento" para começar</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Resumo por Tipo */}
      {lancamentosContabeis.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {['Receita', 'Despesa', 'Transferencia', 'Ajuste'].map((tipo) => {
            const total = lancamentosContabeis
              .filter(l => l.tipo === tipo)
              .reduce((sum, l) => sum + l.valor, 0);
            
            return (
              <div key={tipo} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-1">{tipo}</p>
                  <p className="text-2xl font-bold text-gray-900">
                    R$ {total.toLocaleString('pt-BR')}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {lancamentosContabeis.filter(l => l.tipo === tipo).length} lançamentos
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showModal && (
        <LancamentoModal onClose={() => setShowModal(false)} />
      )}
    </div>
  );
}