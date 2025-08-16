import React, { useState } from 'react';
import { X, Save, Building2, Crown } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { Filial } from '../../types/empresa';

interface FilialModalProps {
  empresaId: string;
  filial?: Filial | null;
  onClose: () => void;
}

export function FilialModal({ empresaId, filial, onClose }: FilialModalProps) {
  const { adicionarFilial, atualizarFilial, filiais } = useApp();
  const isEdit = !!filial;
  
  const [formData, setFormData] = useState({
    codigo: filial?.codigo || '',
    nome: filial?.nome || '',
    isMatriz: filial?.isMatriz || false,
    cnpj: filial?.cnpj || '',
    inscricaoEstadual: filial?.inscricaoEstadual || '',
    email: filial?.email || '',
    telefone: filial?.telefone || '',
    endereco: {
      logradouro: filial?.endereco?.logradouro || '',
      numero: filial?.endereco?.numero || '',
      complemento: filial?.endereco?.complemento || '',
      bairro: filial?.endereco?.bairro || '',
      cidade: filial?.endereco?.cidade || '',
      estado: filial?.endereco?.estado || '',
      cep: filial?.endereco?.cep || '',
    },
    responsavel: {
      nome: filial?.responsavel?.nome || '',
      email: filial?.responsavel?.email || '',
      telefone: filial?.responsavel?.telefone || '',
      cargo: filial?.responsavel?.cargo || '',
    },
    configuracoes: {
      permiteVendas: filial?.configuracoes?.permiteVendas ?? true,
      permiteCompras: filial?.configuracoes?.permiteCompras ?? true,
      permiteEstoque: filial?.configuracoes?.permiteEstoque ?? true,
      centroCusto: filial?.configuracoes?.centroCusto || '',
    },
    ativa: filial?.ativa ?? true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Verificar se já existe uma matriz
    const jaTemMatriz = filiais.some(f => f.empresaId === empresaId && f.isMatriz && f.id !== filial?.id);
    
    if (formData.isMatriz && jaTemMatriz) {
      alert('Já existe uma matriz cadastrada para esta empresa. Apenas uma filial pode ser matriz.');
      return;
    }
    
    if (isEdit && filial) {
      atualizarFilial(filial.id, {
        ...formData,
        atualizadoEm: new Date().toISOString().split('T')[0],
      });
    } else {
      const novaFilial: Filial = {
        id: Date.now().toString(),
        empresaId,
        ...formData,
        criadoEm: new Date().toISOString().split('T')[0],
        atualizadoEm: new Date().toISOString().split('T')[0],
      };
      adicionarFilial(novaFilial);
    }
    
    onClose();
  };

  const gerarProximoCodigo = () => {
    const filiaisEmpresa = filiais.filter(f => f.empresaId === empresaId);
    const ultimoCodigo = Math.max(...filiaisEmpresa.map(f => parseInt(f.codigo) || 0), 0);
    return (ultimoCodigo + 1).toString().padStart(3, '0');
  };

  const estados = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 
    'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {isEdit ? 'Editar Filial' : 'Nova Filial'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Informações Básicas */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Informações da Filial</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Código da Filial *
                </label>
                <div className="flex">
                  <input
                    type="text"
                    required
                    value={formData.codigo}
                    onChange={(e) => setFormData(prev => ({ ...prev, codigo: e.target.value }))}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="001"
                  />
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, codigo: gerarProximoCodigo() }))}
                    className="px-3 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-lg hover:bg-gray-200 transition-colors text-sm"
                  >
                    Gerar
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome da Filial *
                </label>
                <input
                  type="text"
                  required
                  value={formData.nome}
                  onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Filial São Paulo"
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isMatriz"
                  checked={formData.isMatriz}
                  onChange={(e) => setFormData(prev => ({ ...prev, isMatriz: e.target.checked }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="isMatriz" className="ml-2 flex items-center space-x-2 text-sm text-gray-900">
                  <Crown className="w-4 h-4 text-yellow-600" />
                  <span>É Matriz</span>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CNPJ (se diferente da matriz)
                </label>
                <input
                  type="text"
                  value={formData.cnpj}
                  onChange={(e) => setFormData(prev => ({ ...prev, cnpj: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="00.000.000/0000-00"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Inscrição Estadual
                </label>
                <input
                  type="text"
                  value={formData.inscricaoEstadual}
                  onChange={(e) => setFormData(prev => ({ ...prev, inscricaoEstadual: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  E-mail *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Telefone *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.telefone}
                  onChange={(e) => setFormData(prev => ({ ...prev, telefone: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Endereço */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Endereço da Filial</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Logradouro *
                </label>
                <input
                  type="text"
                  required
                  value={formData.endereco.logradouro}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    endereco: { ...prev.endereco, logradouro: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Número *
                </label>
                <input
                  type="text"
                  required
                  value={formData.endereco.numero}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    endereco: { ...prev.endereco, numero: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Complemento
                </label>
                <input
                  type="text"
                  value={formData.endereco.complemento}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    endereco: { ...prev.endereco, complemento: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bairro *
                </label>
                <input
                  type="text"
                  required
                  value={formData.endereco.bairro}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    endereco: { ...prev.endereco, bairro: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cidade *
                </label>
                <input
                  type="text"
                  required
                  value={formData.endereco.cidade}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    endereco: { ...prev.endereco, cidade: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estado *
                </label>
                <select
                  required
                  value={formData.endereco.estado}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    endereco: { ...prev.endereco, estado: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Selecione</option>
                  {estados.map(estado => (
                    <option key={estado} value={estado}>{estado}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CEP *
                </label>
                <input
                  type="text"
                  required
                  value={formData.endereco.cep}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    endereco: { ...prev.endereco, cep: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="00000-000"
                />
              </div>
            </div>
          </div>

          {/* Responsável */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Responsável pela Filial</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome do Responsável *
                </label>
                <input
                  type="text"
                  required
                  value={formData.responsavel.nome}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    responsavel: { ...prev.responsavel, nome: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cargo *
                </label>
                <input
                  type="text"
                  required
                  value={formData.responsavel.cargo}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    responsavel: { ...prev.responsavel, cargo: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Gerente da Filial"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  E-mail do Responsável *
                </label>
                <input
                  type="email"
                  required
                  value={formData.responsavel.email}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    responsavel: { ...prev.responsavel, email: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Telefone do Responsável *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.responsavel.telefone}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    responsavel: { ...prev.responsavel, telefone: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Configurações Operacionais */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Configurações Operacionais</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="permiteVendas"
                    checked={formData.configuracoes.permiteVendas}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      configuracoes: { ...prev.configuracoes, permiteVendas: e.target.checked }
                    }))}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="permiteVendas" className="ml-2 block text-sm text-gray-900">
                    Permite Vendas
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="permiteCompras"
                    checked={formData.configuracoes.permiteCompras}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      configuracoes: { ...prev.configuracoes, permiteCompras: e.target.checked }
                    }))}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="permiteCompras" className="ml-2 block text-sm text-gray-900">
                    Permite Compras
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="permiteEstoque"
                    checked={formData.configuracoes.permiteEstoque}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      configuracoes: { ...prev.configuracoes, permiteEstoque: e.target.checked }
                    }))}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="permiteEstoque" className="ml-2 block text-sm text-gray-900">
                    Controla Estoque
                  </label>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Centro de Custo
                </label>
                <input
                  type="text"
                  value={formData.configuracoes.centroCusto}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    configuracoes: { ...prev.configuracoes, centroCusto: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="CC-001"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="ativa"
              checked={formData.ativa}
              onChange={(e) => setFormData(prev => ({ ...prev, ativa: e.target.checked }))}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="ativa" className="ml-2 block text-sm text-gray-900">
              Filial Ativa
            </label>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>{isEdit ? 'Salvar Filial' : 'Criar Filial'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}