import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Building2, Crown, MapPin, Mail, Phone, Users, Plus, Edit2, FileText, DollarSign } from 'lucide-react';
import { FilialModal } from './FilialModal';

export function EmpresaDetalhes() {
  const { empresaSelecionada, filiais, clientes, contratos, faturas } = useApp();
  const [showFilialModal, setShowFilialModal] = useState(false);
  const [filialEdit, setFilialEdit] = useState(null);

  if (!empresaSelecionada) {
    return null;
  }

  const empresa = empresaSelecionada;
  const empresaFiliais = filiais.filter(f => f.empresaId === empresa.id);
  const matriz = empresaFiliais.find(f => f.isMatriz);
  
  // Dados consolidados da empresa
  const clientesEmpresa = clientes.filter(c => c.empresaId === empresa.id);
  const contratosEmpresa = contratos.filter(c => c.empresaId === empresa.id);
  const faturasEmpresa = faturas.filter(f => f.empresaId === empresa.id);
  
  const valorTotalContratos = contratosEmpresa.reduce((sum, c) => sum + c.valor, 0);
  const faturamentoTotal = faturasEmpresa.filter(f => f.status === 'Pago').reduce((sum, f) => sum + f.valor, 0);

  const handleEditFilial = (filial: any) => {
    setFilialEdit(filial);
    setShowFilialModal(true);
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header da Empresa */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-start space-x-6">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl">
            {empresa.nomeFantasia.split(' ').map(word => word[0]).join('').slice(0, 2)}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-4">
              <h2 className="text-2xl font-bold text-gray-900">{empresa.nomeFantasia}</h2>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                empresa.ativa ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
              }`}>
                {empresa.ativa ? 'Ativa' : 'Inativa'}
              </span>
            </div>
            
            <p className="text-gray-600 mb-4">{empresa.razaoSocial}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">CNPJ:</span>
                  <span className="font-medium text-gray-900">{empresa.cnpj}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">E-mail:</span>
                  <span className="text-gray-900">{empresa.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">Telefone:</span>
                  <span className="text-gray-900">{empresa.telefone}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">Endereço:</span>
                  <span className="text-gray-900">
                    {empresa.endereco.cidade}, {empresa.endereco.estado}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Building2 className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">Filiais:</span>
                  <span className="text-gray-900">{empresaFiliais.length}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">Clientes:</span>
                  <span className="text-gray-900">{clientesEmpresa.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Métricas da Empresa */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg">
              <Building2 className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 mb-1">{empresaFiliais.length}</p>
            <p className="text-sm text-gray-600">Filiais Ativas</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-green-500 to-green-600 shadow-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 mb-1">{clientesEmpresa.length}</p>
            <p className="text-sm text-gray-600">Clientes</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 shadow-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 mb-1">{contratosEmpresa.length}</p>
            <p className="text-sm text-gray-600">Contratos</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 mb-1">
              R$ {(faturamentoTotal / 1000).toFixed(0)}k
            </p>
            <p className="text-sm text-gray-600">Faturamento</p>
          </div>
        </div>
      </div>

      {/* Detalhes das Filiais */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Filiais Detalhadas</h3>
            <button
              onClick={() => setShowFilialModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Nova Filial</span>
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Filial</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Responsável</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Localização</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Operações</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Status</th>
                <th className="text-right py-4 px-6 font-semibold text-gray-900">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {empresaFiliais.map((filial) => (
                <tr key={filial.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white font-semibold ${
                        filial.isMatriz 
                          ? 'bg-gradient-to-br from-yellow-500 to-orange-600' 
                          : 'bg-gradient-to-br from-blue-500 to-purple-600'
                      }`}>
                        {filial.isMatriz ? <Crown className="w-5 h-5" /> : <Building2 className="w-5 h-5" />}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{filial.nome}</p>
                        <p className="text-sm text-gray-500">Código: {filial.codigo}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div>
                      <p className="font-medium text-gray-900">{filial.responsavel.nome}</p>
                      <p className="text-sm text-gray-500">{filial.responsavel.cargo}</p>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900">{filial.endereco.cidade}, {filial.endereco.estado}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex space-x-1">
                      {filial.configuracoes.permiteVendas && (
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">Vendas</span>
                      )}
                      {filial.configuracoes.permiteCompras && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">Compras</span>
                      )}
                      {filial.configuracoes.permiteEstoque && (
                        <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">Estoque</span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      {filial.isMatriz && (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium flex items-center space-x-1">
                          <Crown className="w-3 h-3" />
                          <span>Matriz</span>
                        </span>
                      )}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        filial.ativa ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {filial.ativa ? 'Ativa' : 'Inativa'}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => handleEditFilial(filial)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Editar filial"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Filial */}
      {showFilialModal && (
        <FilialModal
          empresaId={empresa.id}
          filial={filialEdit}
          onClose={() => {
            setShowFilialModal(false);
            setFilialEdit(null);
          }}
        />
      )}
    </div>
  );
}