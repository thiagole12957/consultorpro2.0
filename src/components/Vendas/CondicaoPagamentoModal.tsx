import React, { useState } from 'react';
import { X, Save, Plus, Trash2, Calendar } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { CondicaoPagamento, ParcelaPagamento } from '../../types/vendas';

interface CondicaoPagamentoModalProps {
  condicao?: CondicaoPagamento | null;
  onClose: () => void;
}

export function CondicaoPagamentoModal({ condicao, onClose }: CondicaoPagamentoModalProps) {
  const { adicionarCondicaoPagamento, atualizarCondicaoPagamento, empresaSelecionada } = useApp();
  const isEdit = !!condicao;
  
  const [formData, setFormData] = useState({
    nome: condicao?.nome || '',
    descricao: condicao?.descricao || '',
    ativa: condicao?.ativa ?? true,
  });

  const [parcelas, setParcelas] = useState<ParcelaPagamento[]>(
    condicao?.parcelas || [
      { numero: 1, dias: 0, percentual: 100 }
    ]
  );

  const adicionarParcela = () => {
    const novaParcela: ParcelaPagamento = {
      numero: parcelas.length + 1,
      dias: 30 * parcelas.length,
      percentual: 0
    };
    setParcelas([...parcelas, novaParcela]);
  };

  const removerParcela = (index: number) => {
    if (parcelas.length > 1) {
      setParcelas(parcelas.filter((_, i) => i !== index));
      // Reordenar números das parcelas
      setParcelas(prev => prev.map((p, i) => ({ ...p, numero: i + 1 })));
    }
  };

  const atualizarParcela = (index: number, campo: string, valor: number) => {
    const novasParcelas = [...parcelas];
    novasParcelas[index] = { ...novasParcelas[index], [campo]: valor };
    setParcelas(novasParcelas);
  };

  const distribuirPercentuais = () => {
    const percentualPorParcela = 100 / parcelas.length;
    setParcelas(prev => prev.map(p => ({ ...p, percentual: percentualPorParcela })));
  };

  const totalPercentual = parcelas.reduce((sum, p) => sum + p.percentual, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!empresaSelecionada) {
      alert('Selecione uma empresa primeiro');
      return;
    }

    if (Math.abs(totalPercentual - 100) > 0.01) {
      alert('O total dos percentuais deve ser 100%');
      return;
    }
    
    if (isEdit && condicao) {
      atualizarCondicaoPagamento(condicao.id, {
        ...formData,
        parcelas,
      });
    } else {
      const novaCondicao: CondicaoPagamento = {
        id: Date.now().toString(),
        empresaId: empresaSelecionada.id,
        ...formData,
        parcelas,
        criadoEm: new Date().toISOString().split('T')[0],
      };
      adicionarCondicaoPagamento(novaCondicao);
    }
    
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {isEdit ? 'Editar Condição de Pagamento' : 'Nova Condição de Pagamento'}
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
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Informações da Condição</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome da Condição *
                </label>
                <input
                  type="text"
                  required
                  value={formData.nome}
                  onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: À Vista, 30/60/90 dias"
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
                  Condição Ativa
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descrição
              </label>
              <textarea
                value={formData.descricao}
                onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Descrição detalhada da condição de pagamento"
              />
            </div>
          </div>

          {/* Parcelas */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Parcelas</h3>
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={distribuirPercentuais}
                  className="bg-green-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-green-700 transition-colors"
                >
                  Distribuir Igualmente
                </button>
                <button
                  type="button"
                  onClick={adicionarParcela}
                  className="bg-blue-600 text-white px-3 py-1 rounded-lg flex items-center space-x-1 hover:bg-blue-700 transition-colors text-sm"
                >
                  <Plus className="w-3 h-3" />
                  <span>Parcela</span>
                </button>
              </div>
            </div>
            
            <div className="space-y-3">
              {parcelas.map((parcela, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Parcela
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={parcela.numero}
                        onChange={(e) => atualizarParcela(index, 'numero', Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Dias após venda
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={parcela.dias}
                        onChange={(e) => atualizarParcela(index, 'dias', Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Percentual (%)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                        value={parcela.percentual}
                        onChange={(e) => atualizarParcela(index, 'percentual', Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div className="flex items-end">
                      <button
                        type="button"
                        onClick={() => removerParcela(index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        disabled={parcelas.length === 1}
                        title="Remover parcela"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Resumo das Parcelas */}
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="font-medium text-blue-900">Total de Percentuais:</span>
                <span className={`text-lg font-bold ${
                  Math.abs(totalPercentual - 100) < 0.01 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {totalPercentual.toFixed(2)}%
                </span>
              </div>
              {Math.abs(totalPercentual - 100) > 0.01 && (
                <p className="text-sm text-red-600 mt-1">
                  ⚠️ O total deve ser exatamente 100%
                </p>
              )}
            </div>
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
              <span>{isEdit ? 'Salvar Condição' : 'Criar Condição'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}