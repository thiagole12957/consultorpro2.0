import React, { useState } from 'react';
import { X, Save } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { ContatoCliente } from '../../types';

interface ContatosModalProps {
  clienteId: string;
  contato?: ContatoCliente | null;
  onClose: () => void;
}

export function ContatosModal({ clienteId, contato, onClose }: ContatosModalProps) {
  const { adicionarContato, atualizarContato } = useApp();
  const isEdit = !!contato;
  
  const [formData, setFormData] = useState({
    nome: contato?.nome || '',
    email: contato?.email || '',
    setor: contato?.setor || 'TI',
    whatsapp: contato?.whatsapp || '',
    funcao: contato?.funcao || '',
    habilidades: contato?.habilidades || [],
    ativo: contato?.ativo ?? true,
  });

  const [novaHabilidade, setNovaHabilidade] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEdit && contato) {
      atualizarContato(contato.id, {
        ...formData,
        atualizadoEm: new Date().toISOString().split('T')[0],
      });
    } else {
      const novoContato: ContatoCliente = {
        id: Date.now().toString(),
        clienteId,
        ...formData,
        criadoEm: new Date().toISOString().split('T')[0],
        atualizadoEm: new Date().toISOString().split('T')[0],
      };
      adicionarContato(novoContato);
    }
    
    onClose();
  };

  const adicionarHabilidade = () => {
    if (novaHabilidade.trim() && !formData.habilidades.includes(novaHabilidade.trim())) {
      setFormData(prev => ({
        ...prev,
        habilidades: [...prev.habilidades, novaHabilidade.trim()]
      }));
      setNovaHabilidade('');
    }
  };

  const removerHabilidade = (index: number) => {
    setFormData(prev => ({
      ...prev,
      habilidades: prev.habilidades.filter((_, i) => i !== index)
    }));
  };

  const setores = ['TI', 'Financeiro', 'Comercial', 'Marketing', 'RH', 'Operações'];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {isEdit ? 'Editar Contato' : 'Novo Contato'}
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
              Nome Completo *
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
              E-mail *
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="joao@empresa.com"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Setor
              </label>
              <select
                value={formData.setor}
                onChange={(e) => setFormData(prev => ({ ...prev, setor: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {setores.map(setor => (
                  <option key={setor} value={setor}>{setor}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                WhatsApp
              </label>
              <input
                type="tel"
                value={formData.whatsapp}
                onChange={(e) => setFormData(prev => ({ ...prev, whatsapp: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="(11) 99999-9999"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Função/Cargo
            </label>
            <input
              type="text"
              value={formData.funcao}
              onChange={(e) => setFormData(prev => ({ ...prev, funcao: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Gerente de TI"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Habilidades
            </label>
            <div className="flex space-x-2 mb-2">
              <input
                type="text"
                value={novaHabilidade}
                onChange={(e) => setNovaHabilidade(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), adicionarHabilidade())}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Digite uma habilidade"
              />
              <button
                type="button"
                onClick={adicionarHabilidade}
                className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Adicionar
              </button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {formData.habilidades.map((habilidade, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm cursor-pointer hover:bg-blue-200 transition-colors"
                  onClick={() => removerHabilidade(index)}
                >
                  {habilidade}
                  <X className="w-3 h-3 ml-1" />
                </span>
              ))}
            </div>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="ativo"
              checked={formData.ativo}
              onChange={(e) => setFormData(prev => ({ ...prev, ativo: e.target.checked }))}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="ativo" className="ml-2 block text-sm text-gray-900">
              Contato Ativo
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
              <span>{isEdit ? 'Salvar' : 'Criar Contato'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}