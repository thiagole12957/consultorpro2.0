import React, { useState } from 'react';
import { X, AlertTriangle, Save } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

interface CancelamentoContratoModalProps {
  contrato: any;
  onClose: () => void;
}

export function CancelamentoContratoModal({ contrato, onClose }: CancelamentoContratoModalProps) {
  const { atualizarContrato, clientes } = useApp();
  
  const [formData, setFormData] = useState({
    motivoCancelamento: '',
    dataCancelamento: new Date().toISOString().split('T')[0],
    observacoes: '',
  });

  const cliente = clientes.find(c => c.id === contrato.clienteId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.motivoCancelamento.trim()) {
      alert('O motivo do cancelamento é obrigatório');
      return;
    }
    
    atualizarContrato(contrato.id, {
      status: 'Cancelado',
      motivoCancelamento: formData.motivoCancelamento,
      dataCancelamento: formData.dataCancelamento,
      observacoesCancelamento: formData.observacoes,
    });
    
    onClose();
  };

  const motivosComuns = [
    'Inadimplência do cliente',
    'Solicitação do cliente',
    'Não renovação',
    'Problemas técnicos',
    'Mudança de escopo',
    'Questões comerciais',
    'Outros motivos'
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-red-100">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Cancelar Contrato</h2>
              <p className="text-sm text-gray-600">Esta ação não pode ser desfeita</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Informações do Contrato */}
        <div className="p-6 border-b border-gray-200 bg-red-50">
          <h3 className="font-medium text-red-900 mb-2">Contrato a ser cancelado:</h3>
          <div className="space-y-1 text-sm">
            <p><span className="text-red-700">Nome:</span> <span className="font-medium">{contrato.nome}</span></p>
            <p><span className="text-red-700">Cliente:</span> <span className="font-medium">{cliente?.empresa}</span></p>
            <p><span className="text-red-700">Valor:</span> <span className="font-medium">R$ {contrato.valor.toLocaleString('pt-BR')}</span></p>
            <p><span className="text-red-700">Período:</span> <span className="font-medium">
              {new Date(contrato.dataInicio).toLocaleDateString('pt-BR')} - {new Date(contrato.dataFim).toLocaleDateString('pt-BR')}
            </span></p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Motivo do Cancelamento *
            </label>
            <select
              required
              value={formData.motivoCancelamento}
              onChange={(e) => setFormData(prev => ({ ...prev, motivoCancelamento: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Selecione o motivo</option>
              {motivosComuns.map(motivo => (
                <option key={motivo} value={motivo}>{motivo}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data do Cancelamento *
            </label>
            <input
              type="date"
              required
              value={formData.dataCancelamento}
              onChange={(e) => setFormData(prev => ({ ...prev, dataCancelamento: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Observações Adicionais
            </label>
            <textarea
              value={formData.observacoes}
              onChange={(e) => setFormData(prev => ({ ...prev, observacoes: e.target.value }))}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Detalhes adicionais sobre o cancelamento..."
            />
          </div>
          
          {/* Aviso */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-yellow-900">Atenção:</p>
                <p className="text-yellow-800">
                  O cancelamento do contrato irá interromper o faturamento automático e 
                  alterar o status para "Cancelado". Esta ação não pode ser desfeita.
                </p>
              </div>
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
              className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-200 flex items-center space-x-2"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Confirmar Cancelamento</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}