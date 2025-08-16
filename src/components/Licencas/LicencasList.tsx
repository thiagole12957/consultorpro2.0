import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Eye, Edit2, Key, DollarSign, Calendar, User, Building2 } from 'lucide-react';
import { LicencaModal } from './LicencaModal';

export function LicencasList() {
  const { licencas, clientes, fornecedores } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [licencaEdit, setLicencaEdit] = useState(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ativa': return 'bg-green-100 text-green-700';
      case 'Vencida': return 'bg-red-100 text-red-700';
      case 'Cancelada': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getClienteNome = (clienteId: string) => {
    const cliente = clientes.find(c => c.id === clienteId);
    return cliente ? cliente.nome : 'Cliente não encontrado';
  };

  const getFornecedorNome = (fornecedor: string) => {
    return fornecedor || 'Não informado';
  };

  const handleEditLicenca = (licenca: any) => {
    setLicencaEdit(licenca);
    setShowModal(true);
  };

  const isVencendo = (dataFim: string) => {
    const hoje = new Date();
    const vencimento = new Date(dataFim);
    const diasRestantes = Math.ceil((vencimento.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
    return diasRestantes <= 30 && diasRestantes > 0;
  };

  return (
    <div className="p-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Software</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Cliente</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Fornecedor</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Usuários</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Custo Mensal</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Vencimento</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Status</th>
                <th className="text-right py-4 px-6 font-semibold text-gray-900">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {licencas.map((licenca) => (
                <tr key={licenca.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                        <Key className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{licenca.software}</p>
                        <p className="text-sm text-gray-500">ID: {licenca.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="text-gray-900">{getClienteNome(licenca.clienteId)}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center">
                      <Building2 className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="text-gray-700">{getFornecedorNome(licenca.fornecedor)}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-medium text-gray-900">{licenca.usuarios}</span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center">
                      <DollarSign className="w-4 h-4 mr-1 text-green-600" />
                      <span className="font-semibold text-gray-900">
                        R$ {licenca.custoMensal.toLocaleString('pt-BR')}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className={`flex items-center text-sm ${
                      isVencendo(licenca.dataFim) ? 'text-orange-600' : 'text-gray-600'
                    }`}>
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>{new Date(licenca.dataFim).toLocaleDateString('pt-BR')}</span>
                    </div>
                    {isVencendo(licenca.dataFim) && (
                      <p className="text-xs text-orange-600 mt-1">Vence em breve!</p>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(licenca.status)}`}>
                      {licenca.status}
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
                        onClick={() => handleEditLicenca(licenca)}
                        className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                        title="Editar licença"
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
        <LicencaModal
          licenca={licencaEdit}
          onClose={() => {
            setShowModal(false);
            setLicencaEdit(null);
          }}
        />
      )}
    </div>
  );
}