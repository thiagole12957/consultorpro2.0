import React, { useState } from 'react';
import { X, Save } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { PerformanceMensal } from '../../types';

interface PerformanceMensalModalProps {
  clienteId: string;
  performance?: PerformanceMensal | null;
  onClose: () => void;
}

export function PerformanceMensalModal({ clienteId, performance, onClose }: PerformanceMensalModalProps) {
  const { adicionarPerformanceMensal, atualizarPerformanceMensal } = useApp();
  const isEdit = !!performance;
  
  const [formData, setFormData] = useState({
    mesAno: performance?.mesAno || new Date().toISOString().slice(0, 7),
    clientesAtivos: performance?.clientesAtivos || 0,
    novosClientes: performance?.novosClientes || 0,
    clientesCancelados: performance?.clientesCancelados || 0,
    contratosAtivos: performance?.contratosAtivos || 0,
    loginsUnicos: performance?.loginsUnicos || 0,
    faturamentoTotal: performance?.faturamentoTotal || 0,
    inadimplencia: performance?.inadimplencia || 0,
    percentualInadimplencia: performance?.percentualInadimplencia || 0,
    ordensServico: performance?.ordensServico || 0,
    ordensResolvidasPrazo: performance?.ordensResolvidasPrazo || 0,
    velocidadeMediaMbps: performance?.velocidadeMediaMbps || 0,
    tempoMedioInstalacao: performance?.tempoMedioInstalacao || 0,
    taxaChurn: performance?.taxaChurn || 0,
    custoAquisicaoCliente: performance?.custoAquisicaoCliente || 0,
    nps: performance?.nps || 0,
    satisfacaoMedia: performance?.satisfacaoMedia || 0,
    ticketMedio: performance?.ticketMedio || 0,
    arpu: performance?.arpu || 0,
    uptime: performance?.uptime || 99.9,
    chamadosSuporte: performance?.chamadosSuporte || 0,
    tempoMedioResolucao: performance?.tempoMedioResolucao || 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEdit && performance) {
      atualizarPerformanceMensal(performance.id, {
        ...formData,
        atualizadoEm: new Date().toISOString().split('T')[0],
      });
    } else {
      const novaPerformance: PerformanceMensal = {
        id: Date.now().toString(),
        clienteId,
        ...formData,
        criadoEm: new Date().toISOString().split('T')[0],
        atualizadoEm: new Date().toISOString().split('T')[0],
      };
      adicionarPerformanceMensal(novaPerformance);
    }
    
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {isEdit ? 'Editar Performance Mensal' : 'Nova Performance Mensal'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Período */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mês/Ano *
            </label>
            <input
              type="month"
              required
              value={formData.mesAno}
              onChange={(e) => setFormData(prev => ({ ...prev, mesAno: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Métricas de Clientes */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Métricas de Clientes</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Clientes Ativos
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.clientesAtivos}
                  onChange={(e) => setFormData(prev => ({ ...prev, clientesAtivos: Number(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Novos Clientes
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.novosClientes}
                  onChange={(e) => setFormData(prev => ({ ...prev, novosClientes: Number(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cancelamentos
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.clientesCancelados}
                  onChange={(e) => setFormData(prev => ({ ...prev, clientesCancelados: Number(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Métricas Financeiras */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Métricas Financeiras</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Faturamento Total (R$)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.faturamentoTotal}
                  onChange={(e) => setFormData(prev => ({ ...prev, faturamentoTotal: Number(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Inadimplência (R$)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.inadimplencia}
                  onChange={(e) => setFormData(prev => ({ ...prev, inadimplencia: Number(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ticket Médio (R$)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.ticketMedio}
                  onChange={(e) => setFormData(prev => ({ ...prev, ticketMedio: Number(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ARPU (R$)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.arpu}
                  onChange={(e) => setFormData(prev => ({ ...prev, arpu: Number(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Métricas de Qualidade */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Métricas de Qualidade</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  NPS (-100 a 100)
                </label>
                <input
                  type="number"
                  min="-100"
                  max="100"
                  value={formData.nps}
                  onChange={(e) => setFormData(prev => ({ ...prev, nps: Number(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Satisfação Média (1-5)
                </label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  step="0.1"
                  value={formData.satisfacaoMedia}
                  onChange={(e) => setFormData(prev => ({ ...prev, satisfacaoMedia: Number(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Uptime (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={formData.uptime}
                  onChange={(e) => setFormData(prev => ({ ...prev, uptime: Number(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Taxa de Churn (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={formData.taxaChurn}
                  onChange={(e) => setFormData(prev => ({ ...prev, taxaChurn: Number(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
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
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>{isEdit ? 'Salvar' : 'Adicionar Performance'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}