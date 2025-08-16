import React, { useState } from 'react';
import { X, Save, Building2 } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { Departamento } from '../../types/rh';

interface DepartamentoModalProps {
  departamento?: Departamento | null;
  onClose: () => void;
}

export function DepartamentoModal({ departamento, onClose }: DepartamentoModalProps) {
  const { adicionarDepartamento, atualizarDepartamento, colaboradores, empresaSelecionada } = useApp();
  const isEdit = !!departamento;
  
  const [formData, setFormData] = useState({
    nome: departamento?.nome || '',
    descricao: departamento?.descricao || '',
    responsavelId: departamento?.responsavelId || '',
    centroCusto: departamento?.centroCusto || '',
    orcamentoAnual: departamento?.orcamentoAnual || 0,
    ativo: departamento?.ativo ?? true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!empresaSelecionada) {
      alert('Selecione uma empresa primeiro');
      return;
    }
    
    if (isEdit && departamento) {
      atualizarDepartamento(departamento.id, {
        ...formData,
        atualizadoEm: new Date().toISOString().split('T')[0],
      });
    } else {
      const novoDepartamento: Departamento = {
        id: Date.now().toString(),
        empresaId: empresaSelecionada.id,
        ...formData,
        criadoEm: new Date().toISOString().split('T')[0],
        atualizadoEm: new Date().toISOString().split('T')[0],
      };
      adicionarDepartamento(novoDepartamento);
    }
    
    onClose();
  };

  const colaboradoresAtivos = colaboradores.filter(c => 
    c.empresaId === empresaSelecionada?.id && c.status === 'ativo'
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {isEdit ? 'Editar Departamento' : 'Novo Departamento'}
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
              Nome do Departamento *
            </label>
            <input
              type="text"
              required
              value={formData.nome}
              onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ex: Tecnologia da Informação"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descrição
            </label>
            <textarea
              value={formData.descricao}
              onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Descrição das atividades do departamento"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Responsável
              </label>
              <select
                value={formData.responsavelId}
                onChange={(e) => setFormData(prev => ({ ...prev, responsavelId: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Selecione um responsável</option>
                {colaboradoresAtivos.map(colaborador => (
                  <option key={colaborador.id} value={colaborador.id}>
                    {colaborador.nome} - {colaborador.dadosProfissionais.cargo}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Centro de Custo
              </label>
              <input
                type="text"
                value={formData.centroCusto}
                onChange={(e) => setFormData(prev => ({ ...prev, centroCusto: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="CC-001"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Orçamento Anual (R$)
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.orcamentoAnual}
              onChange={(e) => setFormData(prev => ({ ...prev, orcamentoAnual: Number(e.target.value) }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
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
              Departamento Ativo
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
              <span>{isEdit ? 'Salvar' : 'Criar Departamento'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}