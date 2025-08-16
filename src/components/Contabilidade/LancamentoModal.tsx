import React, { useState } from 'react';
import { X, Save } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { LancamentoContabil } from '../../types';

interface LancamentoModalProps {
  onClose: () => void;
}

export function LancamentoModal({ onClose }: LancamentoModalProps) {
  const { adicionarLancamentoContabil, contasContabeis } = useApp();
  
  const [formData, setFormData] = useState({
    data: new Date().toISOString().split('T')[0],
    historico: '',
    valor: 0,
    contaDebito: '',
    contaCredito: '',
    documento: '',
    tipo: 'Receita',
    status: 'Provisorio',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const novoLancamento: LancamentoContabil = {
      id: Date.now().toString(),
      ...formData,
      criadoEm: new Date().toISOString().split('T')[0],
    };
    
    adicionarLancamentoContabil(novoLancamento);
    onClose();
  };

  const contasDebito = contasContabeis.filter(c => c.natureza === 'Devedora');
  const contasCredito = contasContabeis.filter(c => c.natureza === 'Credora');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Novo Lançamento Contábil</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data *
              </label>
              <input
                type="date"
                required
                value={formData.data}
                onChange={(e) => setFormData(prev => ({ ...prev, data: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Valor *
              </label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={formData.valor}
                onChange={(e) => setFormData(prev => ({ ...prev, valor: Number(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Histórico *
            </label>
            <input
              type="text"
              required
              value={formData.historico}
              onChange={(e) => setFormData(prev => ({ ...prev, historico: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Descrição do lançamento"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Conta Débito *
            </label>
            <select
              required
              value={formData.contaDebito}
              onChange={(e) => setFormData(prev => ({ ...prev, contaDebito: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Selecione a conta de débito</option>
              {contasContabeis
                .filter(c => c.subtipo === 'Conta' || c.subtipo === 'Analitica')
                .map(conta => (
                <option key={conta.id} value={conta.id}>
                  {conta.codigo} - {conta.nome}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Conta Crédito *
            </label>
            <select
              required
              value={formData.contaCredito}
              onChange={(e) => setFormData(prev => ({ ...prev, contaCredito: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Selecione a conta de crédito</option>
              {contasContabeis
                .filter(c => c.subtipo === 'Conta' || c.subtipo === 'Analitica')
                .map(conta => (
                <option key={conta.id} value={conta.id}>
                  {conta.codigo} - {conta.nome}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo
              </label>
              <select
                value={formData.tipo}
                onChange={(e) => setFormData(prev => ({ ...prev, tipo: e.target.value as LancamentoContabil['tipo'] }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Receita">Receita</option>
                <option value="Despesa">Despesa</option>
                <option value="Transferencia">Transferência</option>
                <option value="Ajuste">Ajuste</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as LancamentoContabil['status'] }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Provisorio">Provisório</option>
                <option value="Definitivo">Definitivo</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Documento
            </label>
            <input
              type="text"
              value={formData.documento}
              onChange={(e) => setFormData(prev => ({ ...prev, documento: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Número do documento"
            />
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
              <span>Criar Lançamento</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}