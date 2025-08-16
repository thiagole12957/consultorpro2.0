import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Edit2, Landmark, Building2, DollarSign } from 'lucide-react';
import { ContaBancariaModal } from './ContaBancariaModal';

export function ContasBancariasList() {
  const { contasBancarias, contasContabeis } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [contaEdit, setContaEdit] = useState(null);

  const getContaContabilNome = (contaId: string) => {
    const conta = contasContabeis.find(c => c.id === contaId);
    return conta ? `${conta.codigo} - ${conta.nome}` : 'Conta não encontrada';
  };

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'Corrente': return 'bg-blue-100 text-blue-700';
      case 'Poupanca': return 'bg-green-100 text-green-700';
      case 'Caixa': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handleEditConta = (conta: any) => {
    setContaEdit(conta);
    setShowModal(true);
  };

  const saldoTotal = contasBancarias
    .filter(c => c.ativa)
    .reduce((sum, c) => sum + c.saldoAtual, 0);

  return (
    <div className="space-y-6">
      {/* Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg">
              <Landmark className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 mb-1">{contasBancarias.length}</p>
            <p className="text-sm text-gray-600">Total de Contas</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-green-500 to-green-600 shadow-lg">
              <Building2 className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 mb-1">
              {contasBancarias.filter(c => c.ativa).length}
            </p>
            <p className="text-sm text-gray-600">Contas Ativas</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 shadow-lg">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 mb-1">
              R$ {(saldoTotal / 1000).toFixed(0)}k
            </p>
            <p className="text-sm text-gray-600">Saldo Total</p>
          </div>
        </div>
      </div>

      {/* Lista de Contas Bancárias */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Conta</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Banco</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Tipo</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Agência/Conta</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Saldo Atual</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Status</th>
                <th className="text-right py-4 px-6 font-semibold text-gray-900">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {contasBancarias.map((conta) => (
                <tr key={conta.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                        <Landmark className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{conta.nome}</p>
                        <p className="text-sm text-gray-500">{getContaContabilNome(conta.contaContabilId)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-gray-900">{conta.banco}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTipoColor(conta.tipo)}`}>
                      {conta.tipo}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm text-gray-600">
                      {conta.agencia && conta.conta ? (
                        <span className="font-mono">{conta.agencia} / {conta.conta}</span>
                      ) : (
                        <span>-</span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center">
                      <DollarSign className="w-4 h-4 mr-1 text-green-600" />
                      <span className={`font-semibold ${
                        conta.saldoAtual >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        R$ {conta.saldoAtual.toLocaleString('pt-BR')}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      conta.ativa 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {conta.ativa ? 'Ativa' : 'Inativa'}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleEditConta(conta)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Editar conta"
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
        <ContaBancariaModal
          conta={contaEdit}
          onClose={() => {
            setShowModal(false);
            setContaEdit(null);
          }}
        />
      )}
    </div>
  );
}