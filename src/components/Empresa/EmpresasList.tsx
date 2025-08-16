import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Plus, Edit2, Building2, Crown, MapPin, Mail, Phone, Eye, Users } from 'lucide-react';
import { EmpresaModal } from './EmpresaModal';
import { FilialModal } from './FilialModal';

export function EmpresasList() {
  const { empresas, filiais, setEmpresaSelecionada } = useApp();
  const [showEmpresaModal, setShowEmpresaModal] = useState(false);
  const [showFilialModal, setShowFilialModal] = useState(false);
  const [empresaEdit, setEmpresaEdit] = useState(null);
  const [empresaIdFilial, setEmpresaIdFilial] = useState('');

  const handleEditEmpresa = (empresa: any) => {
    setEmpresaEdit(empresa);
    setShowEmpresaModal(true);
  };

  const handleAddFilial = (empresaId: string) => {
    setEmpresaIdFilial(empresaId);
    setShowFilialModal(true);
  };

  const handleViewEmpresa = (empresa: any) => {
    setEmpresaSelecionada(empresa);
  };

  const getFiliais = (empresaId: string) => {
    return filiais.filter(f => f.empresaId === empresaId && f.ativa);
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestão de Empresas</h2>
          <p className="text-gray-600">Configure empresas e filiais do sistema</p>
        </div>
        <button
          onClick={() => setShowEmpresaModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Nova Empresa</span>
        </button>
      </div>

      {/* Lista de Empresas */}
      <div className="space-y-6">
        {empresas.length > 0 ? (
          empresas.map((empresa) => {
            const empresaFiliais = getFiliais(empresa.id);
            const matriz = empresaFiliais.find(f => f.isMatriz);
            
            return (
              <div key={empresa.id} className="bg-white rounded-xl shadow-sm border border-gray-100">
                {/* Header da Empresa */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
                        {empresa.nomeFantasia.split(' ').map(word => word[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{empresa.nomeFantasia}</h3>
                        <p className="text-gray-600">{empresa.razaoSocial}</p>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                          <span>CNPJ: {empresa.cnpj}</span>
                          <span>•</span>
                          <span>{empresaFiliais.length} filiais</span>
                          {matriz && (
                            <>
                              <span>•</span>
                              <span className="flex items-center space-x-1">
                                <Crown className="w-3 h-3 text-yellow-600" />
                                <span>Matriz: {matriz.nome}</span>
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleAddFilial(empresa.id)}
                        className="bg-green-600 text-white px-3 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-700 transition-colors text-sm"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Nova Filial</span>
                      </button>
                      
                      <button
                        onClick={() => handleViewEmpresa(empresa)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Ver detalhes"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={() => handleEditEmpresa(empresa)}
                        className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                        title="Editar empresa"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Informações da Empresa */}
                <div className="p-6 border-b border-gray-200 bg-gray-50">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
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
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Cidade:</span>
                      <span className="text-gray-900">{empresa.endereco.cidade}, {empresa.endereco.estado}</span>
                    </div>
                  </div>
                </div>

                {/* Lista de Filiais */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-gray-900">Filiais</h4>
                    <span className="text-sm text-gray-500">{empresaFiliais.length} filiais ativas</span>
                  </div>
                  
                  {empresaFiliais.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {empresaFiliais.map((filial) => (
                        <div key={filial.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white font-semibold ${
                                filial.isMatriz 
                                  ? 'bg-gradient-to-br from-yellow-500 to-orange-600' 
                                  : 'bg-gradient-to-br from-blue-500 to-purple-600'
                              }`}>
                                {filial.isMatriz ? <Crown className="w-5 h-5" /> : <Building2 className="w-5 h-5" />}
                              </div>
                              <div>
                                <h5 className="font-semibold text-gray-900">{filial.nome}</h5>
                                <p className="text-sm text-gray-500">Código: {filial.codigo}</p>
                              </div>
                            </div>
                            
                            {filial.isMatriz && (
                              <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                                Matriz
                              </span>
                            )}
                          </div>
                          
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center space-x-2">
                              <MapPin className="w-3 h-3 text-gray-400" />
                              <span className="text-gray-600">{filial.endereco.cidade}, {filial.endereco.estado}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Users className="w-3 h-3 text-gray-400" />
                              <span className="text-gray-600">{filial.responsavel.nome}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Mail className="w-3 h-3 text-gray-400" />
                              <span className="text-gray-600">{filial.email}</span>
                            </div>
                          </div>
                          
                          <div className="mt-3 pt-3 border-t border-gray-200">
                            <div className="flex items-center justify-between text-xs">
                              <div className="flex space-x-2">
                                {filial.configuracoes.permiteVendas && (
                                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full">Vendas</span>
                                )}
                                {filial.configuracoes.permiteCompras && (
                                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full">Compras</span>
                                )}
                                {filial.configuracoes.permiteEstoque && (
                                  <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full">Estoque</span>
                                )}
                              </div>
                              <button
                                onClick={() => {
                                  setEmpresaIdFilial(empresa.id);
                                  setShowFilialModal(true);
                                }}
                                className="text-blue-600 hover:text-blue-700"
                              >
                                <Edit2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Building2 className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>Nenhuma filial cadastrada</p>
                      <p className="text-sm mt-2">Adicione pelo menos uma filial (matriz) para começar</p>
                      <button
                        onClick={() => handleAddFilial(empresa.id)}
                        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors mx-auto"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Adicionar Matriz</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-white rounded-xl p-8 text-center shadow-sm border border-gray-100">
            <Building2 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhuma empresa cadastrada</h3>
            <p className="text-gray-600 mb-4">Cadastre sua primeira empresa para começar a usar o sistema</p>
            <button
              onClick={() => setShowEmpresaModal(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors mx-auto"
            >
              <Plus className="w-5 h-5" />
              <span>Cadastrar Primeira Empresa</span>
            </button>
          </div>
        )}
      </div>

      {/* Modal Nova Empresa */}
      {showEmpresaModal && (
        <EmpresaModal
          empresa={empresaEdit}
          onClose={() => {
            setShowEmpresaModal(false);
            setEmpresaEdit(null);
          }}
        />
      )}

      {/* Modal Nova Filial */}
      {showFilialModal && (
        <FilialModal
          empresaId={empresaIdFilial}
          onClose={() => {
            setShowFilialModal(false);
            setEmpresaIdFilial('');
          }}
        />
      )}
    </div>
  );
}