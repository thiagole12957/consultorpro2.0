import React, { useState } from 'react';
import { X, Save, Building2 } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { Empresa } from '../../types/empresa';

interface EmpresaModalProps {
  empresa?: Empresa | null;
  onClose: () => void;
}

export function EmpresaModal({ empresa, onClose }: EmpresaModalProps) {
  const { adicionarEmpresa, atualizarEmpresa } = useApp();
  const isEdit = !!empresa;
  
  const [formData, setFormData] = useState({
    razaoSocial: empresa?.razaoSocial || '',
    nomeFantasia: empresa?.nomeFantasia || '',
    cnpj: empresa?.cnpj || '',
    inscricaoEstadual: empresa?.inscricaoEstadual || '',
    inscricaoMunicipal: empresa?.inscricaoMunicipal || '',
    email: empresa?.email || '',
    telefone: empresa?.telefone || '',
    endereco: {
      logradouro: empresa?.endereco?.logradouro || '',
      numero: empresa?.endereco?.numero || '',
      complemento: empresa?.endereco?.complemento || '',
      bairro: empresa?.endereco?.bairro || '',
      cidade: empresa?.endereco?.cidade || '',
      estado: empresa?.endereco?.estado || '',
      cep: empresa?.endereco?.cep || '',
    },
    dadosBancarios: {
      banco: empresa?.dadosBancarios?.banco || '',
      agencia: empresa?.dadosBancarios?.agencia || '',
      conta: empresa?.dadosBancarios?.conta || '',
      tipoConta: empresa?.dadosBancarios?.tipoConta || 'Corrente',
    },
    configuracoes: {
      moeda: empresa?.configuracoes?.moeda || 'BRL',
      timezone: empresa?.configuracoes?.timezone || 'America/Sao_Paulo',
      formatoData: empresa?.configuracoes?.formatoData || 'DD/MM/YYYY',
      logoUrl: empresa?.configuracoes?.logoUrl || '',
    },
    ativa: empresa?.ativa ?? true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEdit && empresa) {
      atualizarEmpresa(empresa.id, {
        ...formData,
        atualizadoEm: new Date().toISOString().split('T')[0],
      });
    } else {
      const novaEmpresa: Empresa = {
        id: Date.now().toString(),
        ...formData,
        criadoEm: new Date().toISOString().split('T')[0],
        atualizadoEm: new Date().toISOString().split('T')[0],
      };
      adicionarEmpresa(novaEmpresa);
    }
    
    onClose();
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
            {isEdit ? 'Editar Empresa' : 'Nova Empresa'}
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
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Informações da Empresa</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Razão Social *
                </label>
                <input
                  type="text"
                  required
                  value={formData.razaoSocial}
                  onChange={(e) => setFormData(prev => ({ ...prev, razaoSocial: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome Fantasia *
                </label>
                <input
                  type="text"
                  required
                  value={formData.nomeFantasia}
                  onChange={(e) => setFormData(prev => ({ ...prev, nomeFantasia: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CNPJ *
                </label>
                <input
                  type="text"
                  required
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
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Endereço</h3>
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

          {/* Dados Bancários */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Dados Bancários (Opcional)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Banco
                </label>
                <input
                  type="text"
                  value={formData.dadosBancarios.banco}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    dadosBancarios: { ...prev.dadosBancarios, banco: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Agência
                </label>
                <input
                  type="text"
                  value={formData.dadosBancarios.agencia}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    dadosBancarios: { ...prev.dadosBancarios, agencia: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Conta
                </label>
                <input
                  type="text"
                  value={formData.dadosBancarios.conta}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    dadosBancarios: { ...prev.dadosBancarios, conta: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Conta
                </label>
                <select
                  value={formData.dadosBancarios.tipoConta}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    dadosBancarios: { ...prev.dadosBancarios, tipoConta: e.target.value as 'Corrente' | 'Poupança' }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Corrente">Corrente</option>
                  <option value="Poupança">Poupança</option>
                </select>
              </div>
            </div>
          </div>

          {/* Configurações */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Configurações</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Moeda
                </label>
                <select
                  value={formData.configuracoes.moeda}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    configuracoes: { ...prev.configuracoes, moeda: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="BRL">Real Brasileiro (BRL)</option>
                  <option value="USD">Dólar Americano (USD)</option>
                  <option value="EUR">Euro (EUR)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fuso Horário
                </label>
                <select
                  value={formData.configuracoes.timezone}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    configuracoes: { ...prev.configuracoes, timezone: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="America/Sao_Paulo">São Paulo (GMT-3)</option>
                  <option value="America/Manaus">Manaus (GMT-4)</option>
                  <option value="America/Rio_Branco">Rio Branco (GMT-5)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Formato de Data
                </label>
                <select
                  value={formData.configuracoes.formatoData}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    configuracoes: { ...prev.configuracoes, formatoData: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL do Logo
                </label>
                <input
                  type="url"
                  value={formData.configuracoes.logoUrl}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    configuracoes: { ...prev.configuracoes, logoUrl: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://exemplo.com/logo.png"
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
              Empresa Ativa
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
              <span>{isEdit ? 'Salvar Empresa' : 'Criar Empresa'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}