import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Plus, Edit2, Eye, Calendar, Percent, Trash2 } from 'lucide-react';
import { CondicaoPagamentoModal } from './CondicaoPagamentoModal';

export function CondicaoPagamentoList() {
  const { condicoesPagamento, excluirCondicaoPagamento } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [condicaoEdit, setCondicaoEdit] = useState(null);

  const handleEditCondicao = (condicao: any) => {
    setCondicaoEdit(condicao);
    setShowModal(true);
  };

  const handleExcluirCondicao = (condicaoId: string) => {
    if (confirm('Tem certeza que deseja excluir esta condição de pagamento?')) {
      excluirCondicaoPagamento(condicaoId);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">Condições de Pagamento</h3>
          <p className="text-gray-600">Configure formas de parcelamento</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Nova Condição</span>
        </button>
      </div>

      {/* Lista de Condições */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Condição</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Parcelas</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Detalhes</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Status</th>
                <th className="text-right py-4 px-6 font-semibold text-gray-900">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {condicoesPagamento.length > 0 ? (
                condicoesPagamento.map((condicao) => (
                  <tr key={condicao.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                          <Calendar className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{condicao.nome}</p>
                          <p className="text-sm text-gray-500">{condicao.descricao}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-gray-900 font-semibold">{condicao.parcelas.length}x</span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="space-y-1">
                        {condicao.parcelas.slice(0, 3).map((parcela, index) => (
                          <div key={index} className="text-sm text-gray-600">
                            {parcela.numero}ª: {parcela.dias} dias - {parcela.percentual.toFixed(1)}%
                          </div>
                        ))}
                        {condicao.parcelas.length > 3 && (
                          <div className="text-xs text-gray-500">
                            +{condicao.parcelas.length - 3} parcelas
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        condicao.ativa ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {condicao.ativa ? 'Ativa' : 'Inativa'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Ver detalhes"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEditCondicao(condicao)}
                          className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                          title="Editar condição"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleExcluirCondicao(condicao.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Excluir condição"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-500">
                    <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>Nenhuma condição de pagamento encontrada</p>
                    <p className="text-sm mt-2">Crie condições para facilitar as vendas</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <CondicaoPagamentoModal
          condicao={condicaoEdit}
          onClose={() => {
            setShowModal(false);
            setCondicaoEdit(null);
          }}
        />
      )}
    </div>
  );
}