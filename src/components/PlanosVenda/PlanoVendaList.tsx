import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Eye, Edit2, TrendingUp, DollarSign, Calendar, User, Package } from 'lucide-react';
import { PlanoVendaModal } from './PlanoVendaModal';

export function PlanoVendaList() {
  const { planosVenda, contratos } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [planoEdit, setPlanoEdit] = useState(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Aprovado': return 'bg-green-100 text-green-700';
      case 'Enviado': return 'bg-blue-100 text-blue-700';
      case 'Rascunho': return 'bg-gray-100 text-gray-700';
      case 'Rejeitado': return 'bg-red-100 text-red-700';
      case 'Convertido': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };


  const getContratoNome = (contratoId: string) => {
    const contrato = contratos.find(c => c.id === contratoId);
    return contrato ? contrato.nome : 'Contrato não encontrado';
  };

  const handleEditPlano = (plano: any) => {
    setPlanoEdit(plano);
    setShowModal(true);
  };

  return (
    <div className="p-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Plano de Venda</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Contrato Vinculado</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Valor Total</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Margem</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Validade</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Status</th>
                <th className="text-right py-4 px-6 font-semibold text-gray-900">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {planosVenda.map((plano) => (
                <tr key={plano.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-semibold">
                        <Package className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{plano.nome}</p>
                        <p className="text-sm text-gray-500">{plano.itens.length} itens</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-gray-700 text-sm">
                      {plano.contratoId ? getContratoNome(plano.contratoId) : 'Não vinculado'}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center">
                      <DollarSign className="w-4 h-4 mr-1 text-green-600" />
                      <div>
                        <span className="font-semibold text-gray-900">
                          R$ {plano.valorTotal.toLocaleString('pt-BR')}
                        </span>
                        <p className="text-xs text-gray-500">
                          Custo: R$ {plano.custoTotal.toLocaleString('pt-BR')}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center">
                      <TrendingUp className="w-4 h-4 mr-1 text-blue-600" />
                      <span className="font-medium text-blue-900">
                        {plano.margemLucro.toFixed(1)}%
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>{new Date(plano.dataValidade).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(plano.status)}`}>
                      {plano.status}
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
                        onClick={() => handleEditPlano(plano)}
                        className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                        title="Editar plano"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <PlanoVendaModal
          plano={planoEdit}
          onClose={() => {
            setShowModal(false);
            setPlanoEdit(null);
          }}
        />
      )}
    </div>
  );
}