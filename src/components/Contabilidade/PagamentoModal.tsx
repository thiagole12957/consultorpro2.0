import React, { useState } from 'react';
import { X, Save, CreditCard, DollarSign, Calendar, FileText } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { ContaPagar } from '../../types';

interface PagamentoModalProps {
  conta: ContaPagar;
  onClose: () => void;
}

export function PagamentoModal({ conta, onClose }: PagamentoModalProps) {
  const { realizarPagamento, contasBancarias, fornecedores } = useApp();
  
  const [formData, setFormData] = useState({
    valorPago: conta.valor,
    jurosMulta: 0,
    desconto: 0,
    dataPagamento: new Date().toISOString().split('T')[0],
    formaPagamento: conta.formaPagamento || 'PIX',
    contaBancariaId: conta.contaBancariaId || '',
    observacoes: '',
    comprovante: '',
  });

  const fornecedor = fornecedores.find(f => f.id === conta.fornecedorId);
  const valorFinal = formData.valorPago + formData.jurosMulta - formData.desconto;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    realizarPagamento(conta.id, {
      ...formData,
      valor: valorFinal,
    });
    
    onClose();
  };

  const contasDisponiveis = contasBancarias.filter(cb => 
    cb.ativa && cb.saldoAtual >= valorFinal
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-green-100">
              <CreditCard className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Realizar Pagamento</h2>
              <p className="text-sm text-gray-600">{fornecedor?.nome}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Informações da Conta */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Descrição:</span>
              <p className="font-medium text-gray-900">{conta.descricao}</p>
            </div>
            <div>
              <span className="text-gray-600">Vencimento:</span>
              <p className="font-medium text-gray-900">
                {new Date(conta.dataVencimento).toLocaleDateString('pt-BR')}
              </p>
            </div>
            <div>
              <span className="text-gray-600">Valor Original:</span>
              <p className="font-medium text-gray-900">R$ {conta.valor.toLocaleString('pt-BR')}</p>
            </div>
            <div>
              <span className="text-gray-600">Documento:</span>
              <p className="font-medium text-gray-900">{conta.documento || 'Não informado'}</p>
            </div>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Valores do Pagamento */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Valores do Pagamento</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Valor a Pagar *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.valorPago}
                  onChange={(e) => setFormData(prev => ({ ...prev, valorPago: Number(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Juros/Multa
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.jurosMulta}
                  onChange={(e) => setFormData(prev => ({ ...prev, jurosMulta: Number(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Desconto
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.desconto}
                  onChange={(e) => setFormData(prev => ({ ...prev, desconto: Number(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            {/* Resumo do Valor Final */}
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium text-green-900">Valor Final a Pagar:</span>
                <span className="text-2xl font-bold text-green-600">
                  R$ {valorFinal.toLocaleString('pt-BR')}
                </span>
              </div>
              <div className="mt-2 text-sm text-green-700 space-y-1">
                <div className="flex justify-between">
                  <span>Valor Original:</span>
                  <span>R$ {formData.valorPago.toLocaleString('pt-BR')}</span>
                </div>
                {formData.jurosMulta > 0 && (
                  <div className="flex justify-between">
                    <span>+ Juros/Multa:</span>
                    <span>R$ {formData.jurosMulta.toLocaleString('pt-BR')}</span>
                  </div>
                )}
                {formData.desconto > 0 && (
                  <div className="flex justify-between">
                    <span>- Desconto:</span>
                    <span>R$ {formData.desconto.toLocaleString('pt-BR')}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Data e Forma de Pagamento */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data do Pagamento *
              </label>
              <input
                type="date"
                required
                value={formData.dataPagamento}
                onChange={(e) => setFormData(prev => ({ ...prev, dataPagamento: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Forma de Pagamento *
              </label>
              <select
                required
                value={formData.formaPagamento}
                onChange={(e) => setFormData(prev => ({ ...prev, formaPagamento: e.target.value as ContaPagar['formaPagamento'] }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="PIX">PIX</option>
                <option value="TED">TED</option>
                <option value="Boleto">Boleto</option>
                <option value="Debito">Débito Automático</option>
                <option value="Cartao">Cartão</option>
                <option value="Dinheiro">Dinheiro</option>
              </select>
            </div>
          </div>

          {/* Conta Bancária */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Conta Bancária/Caixa *
            </label>
            <select
              required
              value={formData.contaBancariaId}
              onChange={(e) => setFormData(prev => ({ ...prev, contaBancariaId: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Selecione a conta para débito</option>
              {contasBancarias
                .filter(cb => cb.ativa)
                .map(contaBancaria => {
                  const saldoSuficiente = contaBancaria.saldoAtual >= valorFinal;
                  return (
                    <option 
                      key={contaBancaria.id} 
                      value={contaBancaria.id}
                      disabled={!saldoSuficiente}
                    >
                      {contaBancaria.nome} - {contaBancaria.banco} 
                      (Saldo: R$ {contaBancaria.saldoAtual.toLocaleString('pt-BR')})
                      {!saldoSuficiente && ' - SALDO INSUFICIENTE'}
                    </option>
                  );
                })}
            </select>
            
            {contasDisponiveis.length === 0 && (
              <p className="text-sm text-red-600 mt-1">
                ⚠️ Nenhuma conta tem saldo suficiente para este pagamento
              </p>
            )}
          </div>

          {/* Comprovante */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Comprovante de Pagamento
            </label>
            <input
              type="text"
              value={formData.comprovante}
              onChange={(e) => setFormData(prev => ({ ...prev, comprovante: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="URL ou nome do arquivo do comprovante"
            />
          </div>

          {/* Observações do Pagamento */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Observações do Pagamento
            </label>
            <textarea
              value={formData.observacoes}
              onChange={(e) => setFormData(prev => ({ ...prev, observacoes: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Observações específicas sobre este pagamento..."
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
              disabled={contasDisponiveis.length === 0}
              className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CreditCard className="w-4 h-4" />
              <span>Confirmar Pagamento</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}