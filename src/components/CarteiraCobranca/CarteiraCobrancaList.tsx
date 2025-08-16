import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Edit2, Eye, CreditCard, Building2, Landmark, Settings, Wifi, WifiOff } from 'lucide-react';
import { CarteiraCobrancaModal } from './CarteiraCobrancaModal';

export function CarteiraCobrancaList() {
  const { carteirasCobranca, contasBancarias, contasContabeis } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [carteiraEdit, setCarteiraEdit] = useState(null);

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'interna': return 'bg-blue-100 text-blue-700';
      case 'bancaria': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getIntegracaoIcon = (tipo?: string) => {
    switch (tipo) {
      case 'efi_gerencianet': return <Wifi className="w-4 h-4 text-green-600" />;
      case 'banco_assas': return <Wifi className="w-4 h-4 text-blue-600" />;
      case 'manual': return <WifiOff className="w-4 h-4 text-gray-600" />;
      default: return <WifiOff className="w-4 h-4 text-gray-400" />;
    }
  };

  const getContaNome = (carteiraId: string, tipo: string) => {
    const carteira = carteirasCobranca.find(c => c.id === carteiraId);
    if (!carteira) return 'Não encontrada';

    if (tipo === 'interna' && carteira.contaCaixaId) {
      const conta = contasContabeis.find(c => c.id === carteira.contaCaixaId);
      return conta ? `${conta.codigo} - ${conta.nome}` : 'Conta não encontrada';
    }

    if (tipo === 'bancaria' && carteira.contaBancariaId) {
      const conta = contasBancarias.find(c => c.id === carteira.contaBancariaId);
      return conta ? `${conta.nome} - ${conta.banco}` : 'Conta não encontrada';
    }

    return 'Não vinculada';
  };

  const handleEditCarteira = (carteira: any) => {
    setCarteiraEdit(carteira);
    setShowModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 mb-1">{carteirasCobranca.length}</p>
            <p className="text-sm text-gray-600">Total de Carteiras</p>
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
              {carteirasCobranca.filter(c => c.tipo === 'interna').length}
            </p>
            <p className="text-sm text-gray-600">Carteiras Internas</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 shadow-lg">
              <Landmark className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 mb-1">
              {carteirasCobranca.filter(c => c.tipo === 'bancaria').length}
            </p>
            <p className="text-sm text-gray-600">Carteiras Bancárias</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg">
              <Wifi className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 mb-1">
              {carteirasCobranca.filter(c => c.integracaoBanco && c.integracaoBanco.tipo !== 'manual').length}
            </p>
            <p className="text-sm text-gray-600">Com Integração</p>
          </div>
        </div>
      </div>

      {/* Lista de Carteiras */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Carteira</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Tipo</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Conta Vinculada</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Integração</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Configurações</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Status</th>
                <th className="text-right py-4 px-6 font-semibold text-gray-900">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {carteirasCobranca.length > 0 ? (
                carteirasCobranca.map((carteira) => (
                  <tr key={carteira.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                          <CreditCard className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{carteira.nome}</p>
                          <p className="text-sm text-gray-500">ID: {carteira.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTipoColor(carteira.tipo)}`}>
                        {carteira.tipo === 'interna' ? 'Interna' : 'Bancária'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-gray-700 text-sm">
                        {getContaNome(carteira.id, carteira.tipo)}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        {getIntegracaoIcon(carteira.integracaoBanco?.tipo)}
                        <span className="text-sm text-gray-600">
                          {carteira.integracaoBanco?.tipo === 'efi_gerencianet' ? 'EFI Gerencianet' :
                           carteira.integracaoBanco?.tipo === 'banco_assas' ? 'Banco Asaas' :
                           'Manual'}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-1">
                        {carteira.configuracoes.gerarBoleto && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">Boleto</span>
                        )}
                        {carteira.configuracoes.gerarPix && (
                          <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">PIX</span>
                        )}
                        {carteira.configuracoes.enviarEmail && (
                          <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">Email</span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        carteira.ativa ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {carteira.ativa ? 'Ativa' : 'Inativa'}
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
                          onClick={() => handleEditCarteira(carteira)}
                          className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                          title="Editar carteira"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Configurações"
                        >
                          <Settings className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-500">
                    <CreditCard className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>Nenhuma carteira de cobrança encontrada</p>
                    <p className="text-sm mt-2">Crie carteiras para gerenciar cobranças</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <CarteiraCobrancaModal
          carteira={carteiraEdit}
          onClose={() => {
            setShowModal(false);
            setCarteiraEdit(null);
          }}
        />
      )}
    </div>
  );
}