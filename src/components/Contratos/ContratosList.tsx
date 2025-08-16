import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Eye, Edit2, Calendar, DollarSign, User, FileText, Play, Square, AlertTriangle } from 'lucide-react';
import { ContratoModal } from './ContratoModal';
import { CancelamentoContratoModal } from './CancelamentoContratoModal';

export function ContratosList() {
  const { contratos, clientes, atualizarContrato } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [contratoEdit, setContratoEdit] = useState(null);
  const [showCancelamentoModal, setShowCancelamentoModal] = useState(false);
  const [contratoParaCancelar, setContratoParaCancelar] = useState(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ativo': return 'bg-green-100 text-green-700';
      case 'Vencido': return 'bg-red-100 text-red-700';
      case 'Cancelado': return 'bg-gray-100 text-gray-700';
      case 'Em Negociação': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'Consultoria': return 'bg-blue-100 text-blue-700';
      case 'Software': return 'bg-purple-100 text-purple-700';
      case 'Suporte': return 'bg-orange-100 text-orange-700';
      case 'Misto': return 'bg-cyan-100 text-cyan-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getClienteNome = (clienteId: string) => {
    const cliente = clientes.find(c => c.id === clienteId);
    return cliente ? cliente.nome : 'Cliente não encontrado';
  };

  const handleEditContrato = (contrato: any) => {
    setContratoEdit(contrato);
    setShowModal(true);
  };

  const handleAtivarContrato = (contratoId: string) => {
    if (confirm('Deseja ativar este contrato?')) {
      atualizarContrato(contratoId, {
        status: 'Ativo',
        dataInicio: new Date().toISOString().split('T')[0],
      });
    }
  };

  const handleCancelarContrato = (contrato: any) => {
    setContratoParaCancelar(contrato);
    setShowCancelamentoModal(true);
  };

  return (
    <>
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Contrato</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Cliente</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Tipo</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Valor</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Período</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Status</th>
                  <th className="text-right py-4 px-6 font-semibold text-gray-900">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {contratos.map((contrato) => (
                  <tr key={contrato.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{contrato.nome}</p>
                          <p className="text-sm text-gray-500">ID: {contrato.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="text-gray-900">{getClienteNome(contrato.clienteId)}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTipoColor(contrato.tipo)}`}>
                        {contrato.tipo}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center">
                        <DollarSign className="w-4 h-4 mr-1 text-green-600" />
                        <span className="font-semibold text-gray-900">
                          R$ {contrato.valor.toLocaleString('pt-BR')}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span>
                          {new Date(contrato.dataInicio).toLocaleDateString('pt-BR')} - {new Date(contrato.dataFim).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(contrato.status)}`}>
                        {contrato.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        {contrato.status === 'Em Negociação' && (
                          <button
                            onClick={() => handleAtivarContrato(contrato.id)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Ativar contrato"
                          >
                            <Play className="w-4 h-4" />
                          </button>
                        )}
                        
                        {contrato.status === 'Ativo' && (
                          <button
                            onClick={() => handleCancelarContrato(contrato)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Cancelar contrato"
                          >
                            <Square className="w-4 h-4" />
                          </button>
                        )}
                        
                        <button
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Ver detalhes"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEditContrato(contrato)}
                          className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                          title="Editar contrato"
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
          <ContratoModal
            contrato={contratoEdit}
            onClose={() => {
              setShowModal(false);
              setContratoEdit(null);
            }}
          />
        )}
      </div>
      
      {showCancelamentoModal && contratoParaCancelar && (
        <CancelamentoContratoModal
          contrato={contratoParaCancelar}
          onClose={() => {
            setShowCancelamentoModal(false);
            setContratoParaCancelar(null);
          }}
        />
      )}
    </>
  );
}