import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Plus, TrendingUp, TrendingDown, Users, DollarSign, Calendar, BarChart3 } from 'lucide-react';
import { PerformanceMensalModal } from './PerformanceMensalModal';

interface PerformanceMensalProps {
  clienteId: string;
}

export function PerformanceMensal({ clienteId }: PerformanceMensalProps) {
  const { performanceMensal } = useApp();
  const [showModal, setShowModal] = useState(false);

  const clientePerformance = performanceMensal.filter(p => p.clienteId === clienteId);

  const getVariacao = (atual: number, anterior: number) => {
    if (anterior === 0) return 0;
    return ((atual - anterior) / anterior) * 100;
  };

  const ultimaPerformance = clientePerformance[clientePerformance.length - 1];
  const penultimaPerformance = clientePerformance[clientePerformance.length - 2];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Performance Mensal</h3>
          <p className="text-gray-600">Acompanhe métricas mensais do cliente</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Adicionar Dados</span>
        </button>
      </div>

      {ultimaPerformance ? (
        <>
          {/* Métricas Principais */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg">
                  <Users className="w-6 h-6 text-white" />
                </div>
                {penultimaPerformance && (
                  <div className={`flex items-center text-sm font-medium px-2 py-1 rounded-full ${
                    getVariacao(ultimaPerformance.clientesAtivos, penultimaPerformance.clientesAtivos) >= 0
                      ? 'text-green-700 bg-green-100'
                      : 'text-red-700 bg-red-100'
                  }`}>
                    {getVariacao(ultimaPerformance.clientesAtivos, penultimaPerformance.clientesAtivos) >= 0 ? (
                      <TrendingUp className="w-4 h-4 mr-1" />
                    ) : (
                      <TrendingDown className="w-4 h-4 mr-1" />
                    )}
                    <span>{Math.abs(getVariacao(ultimaPerformance.clientesAtivos, penultimaPerformance.clientesAtivos)).toFixed(1)}%</span>
                  </div>
                )}
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 mb-1">{ultimaPerformance.clientesAtivos}</p>
                <p className="text-sm text-gray-600">Clientes Ativos</p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-lg bg-gradient-to-r from-green-500 to-green-600 shadow-lg">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                {penultimaPerformance && (
                  <div className={`flex items-center text-sm font-medium px-2 py-1 rounded-full ${
                    getVariacao(ultimaPerformance.faturamentoTotal, penultimaPerformance.faturamentoTotal) >= 0
                      ? 'text-green-700 bg-green-100'
                      : 'text-red-700 bg-red-100'
                  }`}>
                    {getVariacao(ultimaPerformance.faturamentoTotal, penultimaPerformance.faturamentoTotal) >= 0 ? (
                      <TrendingUp className="w-4 h-4 mr-1" />
                    ) : (
                      <TrendingDown className="w-4 h-4 mr-1" />
                    )}
                    <span>{Math.abs(getVariacao(ultimaPerformance.faturamentoTotal, penultimaPerformance.faturamentoTotal)).toFixed(1)}%</span>
                  </div>
                )}
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 mb-1">
                  R$ {(ultimaPerformance.faturamentoTotal / 1000).toFixed(0)}k
                </p>
                <p className="text-sm text-gray-600">Faturamento</p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 shadow-lg">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 mb-1">{ultimaPerformance.nps}</p>
                <p className="text-sm text-gray-600">NPS Score</p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 mb-1">{ultimaPerformance.taxaChurn.toFixed(1)}%</p>
                <p className="text-sm text-gray-600">Taxa de Churn</p>
              </div>
            </div>
          </div>

          {/* Gráfico de Evolução */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Evolução do Faturamento</h4>
            <div className="h-64 flex items-end justify-between space-x-2">
              {clientePerformance.slice(-12).map((performance, index) => {
                const maxValue = Math.max(...clientePerformance.map(p => p.faturamentoTotal));
                const height = maxValue > 0 ? (performance.faturamentoTotal / maxValue) * 100 : 0;
                
                return (
                  <div key={performance.id} className="flex-1 flex flex-col items-center space-y-1">
                    <div 
                      className="w-full bg-gradient-to-t from-green-500 to-green-400 rounded-t-sm transition-all duration-300 hover:from-green-600 hover:to-green-500 cursor-pointer"
                      style={{ height: `${height}%` }}
                      title={`${performance.mesAno}: R$ ${performance.faturamentoTotal.toLocaleString('pt-BR')}`}
                    ></div>
                    <span className="text-xs text-gray-600">
                      {performance.mesAno.split('-')[1]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Detalhes da Última Performance */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              Detalhes - {ultimaPerformance.mesAno}
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Novos Clientes:</span>
                  <span className="font-medium text-gray-900">{ultimaPerformance.novosClientes}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Cancelamentos:</span>
                  <span className="font-medium text-gray-900">{ultimaPerformance.clientesCancelados}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Contratos Ativos:</span>
                  <span className="font-medium text-gray-900">{ultimaPerformance.contratosAtivos}</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Inadimplência:</span>
                  <span className="font-medium text-red-600">
                    R$ {ultimaPerformance.inadimplencia.toLocaleString('pt-BR')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">% Inadimplência:</span>
                  <span className="font-medium text-red-600">{ultimaPerformance.percentualInadimplencia.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Ticket Médio:</span>
                  <span className="font-medium text-gray-900">
                    R$ {ultimaPerformance.ticketMedio.toLocaleString('pt-BR')}
                  </span>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Satisfação:</span>
                  <span className="font-medium text-blue-600">{ultimaPerformance.satisfacaoMedia.toFixed(1)}/5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Uptime:</span>
                  <span className="font-medium text-green-600">{ultimaPerformance.uptime.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">CAC:</span>
                  <span className="font-medium text-gray-900">
                    R$ {ultimaPerformance.custoAquisicaoCliente.toLocaleString('pt-BR')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="bg-white rounded-xl p-8 text-center shadow-sm border border-gray-100">
          <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum dado de performance</h3>
          <p className="text-gray-600 mb-4">Adicione dados mensais para acompanhar a performance do cliente</p>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors mx-auto"
          >
            <Plus className="w-5 h-5" />
            <span>Adicionar Primeiro Registro</span>
          </button>
        </div>
      )}

      {showModal && (
        <PerformanceMensalModal
          clienteId={clienteId}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}