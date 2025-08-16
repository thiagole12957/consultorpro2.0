import React, { useState } from 'react';
import { X, Save, Building2 } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { ContaBancaria } from '../../types';

interface ContaBancariaModalProps {
  conta?: ContaBancaria | null;
  onClose: () => void;
}

export function ContaBancariaModal({ conta, onClose }: ContaBancariaModalProps) {
  const { adicionarContaBancaria, atualizarContaBancaria, contasContabeis } = useApp();
  const isEdit = !!conta;
  
  const [formData, setFormData] = useState({
    nome: conta?.nome || '',
    banco: conta?.banco || '',
    agencia: conta?.agencia || '',
    conta: conta?.conta || '',
    tipo: conta?.tipo || 'Corrente',
    saldoAtual: conta?.saldoAtual || 0,
    ativa: conta?.ativa ?? true,
    contaContabilId: conta?.contaContabilId || '',
    observacoes: conta?.observacoes || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEdit && conta) {
      atualizarContaBancaria(conta.id, formData);
    } else {
      const novaConta: ContaBancaria = {
        id: Date.now().toString(),
        ...formData,
        criadoEm: new Date().toISOString().split('T')[0],
      };
      adicionarContaBancaria(novaConta);
    }
    
    onClose();
  };

  const contasCaixa = contasContabeis.filter(c => 
    (c.codigo.startsWith('1.1.1') || c.nome.toLowerCase().includes('caixa') || c.nome.toLowerCase().includes('banco')) &&
    (c.subtipo === 'Conta' || c.subtipo === 'Analitica')
  );

  const bancos = [
    'Banco do Brasil',
    'Caixa Econômica Federal',
    'Bradesco',
    'Itaú Unibanco',
    'Santander',
    'BTG Pactual',
    'Nubank',
    'Inter',
    'C6 Bank',
    'Sicoob',
    'Sicredi',
    'Caixa Físico'
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {isEdit ? 'Editar Conta Bancária' : 'Nova Conta Bancária'}
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
              Nome da Conta *
            </label>
            <input
              type="text"
              required
              value={formData.nome}
              onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ex: Conta Corrente Principal"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Banco *
              </label>
              <select
                required
                value={formData.banco}
                onChange={(e) => setFormData(prev => ({ ...prev, banco: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Selecione o banco</option>
                {bancos.map(banco => (
                  <option key={banco} value={banco}>{banco}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Conta *
              </label>
              <select
                required
                value={formData.tipo}
                onChange={(e) => setFormData(prev => ({ ...prev, tipo: e.target.value as ContaBancaria['tipo'] }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Corrente">Conta Corrente</option>
                <option value="Poupanca">Conta Poupança</option>
                <option value="Caixa">Caixa Físico</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Agência
              </label>
              <input
                type="text"
                value={formData.agencia}
                onChange={(e) => setFormData(prev => ({ ...prev, agencia: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="1234-5"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Número da Conta
              </label>
              <input
                type="text"
                value={formData.conta}
                onChange={(e) => setFormData(prev => ({ ...prev, conta: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="12345-6"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Saldo Atual *
              </label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={formData.saldoAtual}
                onChange={(e) => setFormData(prev => ({ ...prev, saldoAtual: Number(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Conta Contábil *
              </label>
              <select
                required
                value={formData.contaContabilId}
                onChange={(e) => setFormData(prev => ({ ...prev, contaContabilId: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Selecione a conta contábil</option>
                {contasCaixa.map(conta => (
                  <option key={conta.id} value={conta.id}>
                    {conta.codigo} - {conta.nome}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Observações
            </label>
            <textarea
              value={formData.observacoes}
              onChange={(e) => setFormData(prev => ({ ...prev, observacoes: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Observações sobre a conta bancária..."
            />
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
              Conta Ativa
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
              <span>{isEdit ? 'Salvar Conta' : 'Criar Conta'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}