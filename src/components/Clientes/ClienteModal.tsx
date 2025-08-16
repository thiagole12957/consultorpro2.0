import React, { useState } from 'react';
import { X, Save } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { Cliente } from '../../types';

interface ClienteModalProps {
  cliente?: Cliente | null;
  onClose: () => void;
}

export function ClienteModal({ cliente, onClose }: ClienteModalProps) {
  const { adicionarCliente, atualizarCliente, empresaSelecionada, filiais, empresas } = useApp();
  const isEdit = !!cliente;
  
  const [formData, setFormData] = useState({
    empresaId: cliente?.empresaId || empresaSelecionada?.id || '',
    filialId: cliente?.filialId || '',
    nome: cliente?.nome || '',
    empresa: cliente?.empresa || '',
    email: cliente?.email || '',
    telefone: cliente?.telefone || '',
    segmento: cliente?.segmento || 'Tecnologia',
    tamanho: cliente?.tamanho || 'Médio',
    status: cliente?.status || 'Prospect',
    dataConversao: cliente?.dataConversao || '',
    valorTotal: cliente?.valorTotal || 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.empresaId || !formData.filialId) {
      alert('Selecione a empresa e filial para o cliente');
      return;
    }
    
    if (isEdit && cliente) {
      atualizarCliente(cliente.id, formData);
    } else {
      const novoCliente: Cliente = {
        id: Date.now().toString(),
        ...formData,
        dataConversao: formData.dataConversao || new Date().toISOString().split('T')[0],
      };
      adicionarCliente(novoCliente);
    }
    
    onClose();
  };

  const filiaisDisponiveis = filiais.filter(f => 
    f.empresaId === formData.empresaId && f.ativa && f.configuracoes.permiteVendas
  );

  const segmentos = ['Tecnologia', 'Software', 'Startup', 'Consultoria', 'E-commerce', 'Saúde', 'Educação', 'Financeiro'];
  const tamanhos = ['Pequeno', 'Médio', 'Grande'];
  const statusOptions = ['Prospect', 'Ativo', 'Inativo'];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {isEdit ? 'Editar Cliente' : 'Novo Cliente'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Seleção de Empresa e Filial */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-3">Empresa e Filial</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Empresa *
                </label>
                <select
                  required
                  value={formData.empresaId}
                  onChange={(e) => setFormData(prev => ({ ...prev, empresaId: e.target.value, filialId: '' }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Selecione a empresa</option>
                  {empresas.filter(e => e.ativa).map(empresa => (
                    <option key={empresa.id} value={empresa.id}>
                      {empresa.nomeFantasia}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Filial *
                </label>
                <select
                  required
                  value={formData.filialId}
                  onChange={(e) => setFormData(prev => ({ ...prev, filialId: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={!formData.empresaId}
                >
                  <option value="">Selecione a filial</option>
                  {filiaisDisponiveis.map(filial => (
                    <option key={filial.id} value={filial.id}>
                      {filial.nome} {filial.isMatriz ? '(Matriz)' : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome do Contato *
              </label>
              <input
                type="text"
                required
                value={formData.nome}
                onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="João Silva"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Empresa *
              </label>
              <input
                type="text"
                required
                value={formData.empresa}
                onChange={(e) => setFormData(prev => ({ ...prev, empresa: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="TechCorp Ltda"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                placeholder="joao@techcorp.com"
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
                placeholder="(11) 99999-9999"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Segmento
              </label>
              <select
                value={formData.segmento}
                onChange={(e) => setFormData(prev => ({ ...prev, segmento: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {segmentos.map(segmento => (
                  <option key={segmento} value={segmento}>{segmento}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tamanho da Empresa
              </label>
              <select
                value={formData.tamanho}
                onChange={(e) => setFormData(prev => ({ ...prev, tamanho: e.target.value as Cliente['tamanho'] }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {tamanhos.map(tamanho => (
                  <option key={tamanho} value={tamanho}>{tamanho}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as Cliente['status'] }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {statusOptions.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Valor Total Estimado
              </label>
              <input
                type="number"
                min="0"
                value={formData.valorTotal}
                onChange={(e) => setFormData(prev => ({ ...prev, valorTotal: Number(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0"
              />
            </div>
          </div>
          
          {formData.status === 'Ativo' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data de Conversão
              </label>
              <input
                type="date"
                value={formData.dataConversao}
                onChange={(e) => setFormData(prev => ({ ...prev, dataConversao: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          )}
          
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
              <span>{isEdit ? 'Salvar' : 'Criar Cliente'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}