import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Eye, Edit2, Download, DollarSign, Calendar, User, FileText } from 'lucide-react';
import { FaturaModal } from './FaturaModal';

export function FaturasList() {
  const { faturas, clientes, contratos } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [faturaEdit, setFaturaEdit] = useState(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pago': return 'bg-green-100 text-green-700';
      case 'Pendente': return 'bg-yellow-100 text-yellow-700';
      case 'Vencida': return 'bg-red-100 text-red-700';
      case 'Cancelada': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getClienteNome = (clienteId: string) => {
    const cliente = clientes.find(c => c.id === clienteId);
    return cliente ? cliente.nome : 'Cliente não encontrado';
  };

  const getContratoNome = (contratoId: string) => {
    const contrato = contratos.find(c => c.id === contratoId);
    return contrato ? contrato.nome : 'Contrato não encontrado';
  };

  const handleEditFatura = (fatura: any) => {
    setFaturaEdit(fatura);
    setShowModal(true);
  };

  const isVencida = (dataVencimento: string) => {
    return new Date(dataVencimento) < new Date();
  };

  return (
    <div className="p-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Fatura</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Cliente</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Contrato</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Valor</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Vencimento</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Status</th>
                <th className="text-right py-4 px-6 font-semibold text-gray-900">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {faturas.map((fatura) => (
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
                      <User className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="text-gray-900">{getClienteNome(fatura.clienteId)}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-gray-700 text-sm">{getContratoNome(fatura.contratoId)}</span>
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
                      <button
                        onClick={() => handleEditFatura(fatura)}
                        className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                        title="Editar fatura"
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
        <FaturaModal
          fatura={faturaEdit}
          onClose={() => {
            setShowModal(false);
            setFaturaEdit(null);
          }}
        />
      )}
    </div>
  );
}