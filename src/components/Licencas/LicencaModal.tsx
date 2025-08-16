import React, { useState } from 'react';
import { X, Save } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { Licenca } from '../../types';

interface LicencaModalProps {
  licenca?: Licenca | null;
  onClose: () => void;
}

export function LicencaModal({ licenca, onClose }: LicencaModalProps) {
  const { adicionarLicenca, atualizarLicenca, clientes, produtos, fornecedores } = useApp();
  const isEdit = !!licenca;
  
  const [formData, setFormData] = useState({
    clienteId: licenca?.clienteId || '',
    software: licenca?.software || '',
    usuarios: licenca?.usuarios || 1,
    custoMensal: licenca?.custoMensal || 0,
    dataInicio: licenca?.dataInicio || '',
    dataFim: licenca?.dataFim || '',
    status: licenca?.status || 'Ativa',
    fornecedor: licenca?.fornecedor || '',
    produtoId: licenca?.produtoId || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEdit && licenca) {
      atualizarLicenca(licenca.id, formData);
    } else {
      const novaLicenca: Licenca = {
        id: Date.now().toString(),
        ...formData,
      };
      adicionarLicenca(novaLicenca);
    }
    
    onClose();
  };

  const softwaresComuns = [
    'Microsoft 365',
    'SAP Business One',
    'Salesforce',
    'Adobe Creative Suite',
    'AutoCAD',
    'Slack',
    'Zoom',
    'Dropbox Business',
    'Google Workspace',
    'Atlassian Suite'
  ];

  const fornecedoresComuns = [
    'Microsoft',
    'SAP',
    'Salesforce',
    'Adobe',
    'Autodesk',
    'Slack Technologies',
    'Zoom',
    'Dropbox',
    'Google',
    'Atlassian'
  ];

  // Filtrar produtos do tipo Software disponíveis (não vinculados a outras licenças)
  const produtosSoftwareDisponiveis = produtos.filter(produto => 
    produto.tipo === 'Software' && (!produto.licencaId || (isEdit && produto.licencaId === licenca?.id))
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {isEdit ? 'Editar Licença' : 'Nova Licença'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cliente *
            </label>
            <select
              required
              value={formData.clienteId}
              onChange={(e) => setFormData(prev => ({ ...prev, clienteId: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Selecione um cliente</option>
              {clientes.map(cliente => (
                <option key={cliente.id} value={cliente.id}>
                  {cliente.nome} - {cliente.empresa}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Produto Vinculado *
            </label>
            <select
              required
              value={formData.produtoId}
              onChange={(e) => setFormData(prev => ({ ...prev, produtoId: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Selecione um produto</option>
              {produtosSoftwareDisponiveis.map(produto => (
                <option key={produto.id} value={produto.id}>
                  {produto.nome} - R$ {produto.precoUnitario.toLocaleString('pt-BR')}/{produto.unidadeMedida}
                </option>
              ))}
            </select>
            {produtosSoftwareDisponiveis.length === 0 && (
              <p className="text-sm text-red-600 mt-1">
                Nenhum produto de software disponível. Crie um produto do tipo "Software" primeiro.
              </p>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Software *
              </label>
              <input
                type="text"
                required
                list="softwares"
                value={formData.software}
                onChange={(e) => setFormData(prev => ({ ...prev, software: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <datalist id="softwares">
                {softwaresComuns.map(software => (
                  <option key={software} value={software} />
                ))}
              </datalist>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fornecedor
              </label>
              <select
                value={formData.fornecedor}
                onChange={(e) => {
                  const fornecedorSelecionado = fornecedores.find(f => f.id === e.target.value);
                  setFormData(prev => ({ ...prev, fornecedor: fornecedorSelecionado?.nome || '' }));
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Selecione um fornecedor</option>
                {fornecedores
                  .filter(f => f.ativo)
                  .map(fornecedor => (
                    <option key={fornecedor.id} value={fornecedor.id}>
                      {fornecedor.nome} - {fornecedor.cnpj}
                    </option>
                  ))}
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Número de Usuários
              </label>
              <input
                type="number"
                min="1"
                value={formData.usuarios}
                onChange={(e) => setFormData(prev => ({ ...prev, usuarios: Number(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Custo Mensal
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.custoMensal}
                onChange={(e) => setFormData(prev => ({ ...prev, custoMensal: Number(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data de Início
              </label>
              <input
                type="date"
                value={formData.dataInicio}
                onChange={(e) => setFormData(prev => ({ ...prev, dataInicio: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data de Fim
              </label>
              <input
                type="date"
                value={formData.dataFim}
                onChange={(e) => setFormData(prev => ({ ...prev, dataFim: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as Licenca['status'] }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="Ativa">Ativa</option>
              <option value="Vencida">Vencida</option>
              <option value="Cancelada">Cancelada</option>
            </select>
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
              <span>{isEdit ? 'Salvar' : 'Criar Licença'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}