import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Plus, Target, AlertTriangle, CheckCircle, Clock, TrendingUp } from 'lucide-react';

interface DiagnosticoPlanejamentoProps {
  clienteId: string;
}

export function DiagnosticoPlanejamento({ clienteId }: DiagnosticoPlanejamentoProps) {
  const { diagnosticos, acoesPlano } = useApp();
  const [activeTab, setActiveTab] = useState<'diagnosticos' | 'acoes'>('diagnosticos');

  const clienteDiagnosticos = diagnosticos.filter(d => d.clienteId === clienteId);
  const clienteAcoes = acoesPlano.filter(a => a.clienteId === clienteId);

  const getCriticidadeColor = (criticidade: string) => {
    switch (criticidade) {
      case 'alta': return 'bg-red-100 text-red-700';
      case 'média': return 'bg-yellow-100 text-yellow-700';
      case 'baixa': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getPrioridadeColor = (prioridade: string) => {
    switch (prioridade) {
      case 'P0': return 'bg-red-100 text-red-700';
      case 'P1': return 'bg-orange-100 text-orange-700';
      case 'P2': return 'bg-yellow-100 text-yellow-700';
      case 'P3': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusAcaoColor = (status: string) => {
    switch (status) {
      case 'concluida': return 'bg-green-100 text-green-700';
      case 'em_andamento': return 'bg-blue-100 text-blue-700';
      case 'a_fazer': return 'bg-gray-100 text-gray-700';
      case 'bloqueada': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const renderDiagnosticos = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-lg font-semibold text-gray-900">Diagnósticos</h4>
          <p className="text-gray-600">Análise de processos e identificação de gaps</p>
        </div>
        <button className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-red-700 transition-colors">
          <Plus className="w-4 h-4" />
          <span>Novo Diagnóstico</span>
        </button>
      </div>

      {/* Lista de Diagnósticos */}
      {clienteDiagnosticos.length > 0 ? (
        <div className="space-y-4">
          {clienteDiagnosticos.map((diagnostico) => (
            <div key={diagnostico.id} className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h5 className="font-semibold text-gray-900 mb-2">{diagnostico.area}</h5>
                  <p className="text-sm text-gray-600 mb-2">{diagnostico.processo}</p>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCriticidadeColor(diagnostico.criticidade)}`}>
                      {diagnostico.criticidade}
                    </span>
                    <span className="text-sm text-gray-500">
                      Impacto: {diagnostico.impacto}/5
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full ${
                        i < diagnostico.impacto ? 'bg-red-500' : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Situação Atual (As-Is):</span>
                  <p className="text-gray-600 mt-1">{diagnostico.descricaoAsIs}</p>
                </div>
                
                <div>
                  <span className="font-medium text-gray-700">Problema/Gap:</span>
                  <p className="text-gray-600 mt-1">{diagnostico.problemaGap}</p>
                </div>
                
                <div>
                  <span className="font-medium text-gray-700">Causa Raiz:</span>
                  <p className="text-gray-600 mt-1">{diagnostico.causaRaiz}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl p-8 text-center">
          <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h4 className="text-lg font-semibold text-gray-900 mb-2">Nenhum diagnóstico realizado</h4>
          <p className="text-gray-600 mb-4">Inicie a análise dos processos do cliente</p>
          <button className="bg-red-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2 hover:bg-red-700 transition-colors mx-auto">
            <Plus className="w-5 h-5" />
            <span>Primeiro Diagnóstico</span>
          </button>
        </div>
      )}
    </div>
  );

  const renderAcoes = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-lg font-semibold text-gray-900">Plano de Ação</h4>
          <p className="text-gray-600">Ações para resolver os gaps identificados</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4" />
          <span>Nova Ação</span>
        </button>
      </div>

      {/* Stats das Ações */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {['a_fazer', 'em_andamento', 'concluida', 'bloqueada'].map((status) => {
          const count = clienteAcoes.filter(a => a.status === status).length;
          const labels = {
            'a_fazer': 'A Fazer',
            'em_andamento': 'Em Andamento',
            'concluida': 'Concluída',
            'bloqueada': 'Bloqueada'
          };
          
          return (
            <div key={status} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{count}</p>
                <p className="text-sm text-gray-600">{labels[status as keyof typeof labels]}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Lista de Ações */}
      {clienteAcoes.length > 0 ? (
        <div className="space-y-4">
          {clienteAcoes.map((acao) => (
            <div key={acao.id} className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h5 className="font-semibold text-gray-900 mb-2">{acao.titulo}</h5>
                  <p className="text-sm text-gray-600 mb-3">{acao.descricaoToBe}</p>
                  <div className="flex items-center space-x-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPrioridadeColor(acao.prioridade)}`}>
                      {acao.prioridade}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusAcaoColor(acao.status)}`}>
                      {acao.status.replace('_', ' ')}
                    </span>
                    <span className="text-xs text-gray-500">
                      {acao.tipo}
                    </span>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-sm text-gray-600">Esforço</p>
                  <p className="font-semibold text-gray-900">{acao.esforcoHoras}h</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Responsável:</span>
                  <p className="text-gray-600">{acao.responsavel}</p>
                </div>
                
                <div>
                  <span className="font-medium text-gray-700">Prazo:</span>
                  <p className="text-gray-600">{new Date(acao.prazo).toLocaleDateString('pt-BR')}</p>
                </div>
                
                <div>
                  <span className="font-medium text-gray-700">Ganho Estimado:</span>
                  <p className="text-green-600 font-semibold">R$ {acao.ganhoEstimado.toLocaleString('pt-BR')}</p>
                </div>
              </div>

              {/* KPI Alvo */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-2 mb-2">
                  <Target className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-gray-700">KPI Alvo:</span>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-blue-900">{acao.kpiAlvo.nome}</span>
                    <div className="text-right">
                      <p className="text-sm text-blue-800">
                        {acao.kpiAlvo.baseline} → {acao.kpiAlvo.meta}
                      </p>
                      <p className="text-xs text-blue-600">
                        Meta: {new Date(acao.kpiAlvo.prazoMeta).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl p-8 text-center">
          <Target className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h4 className="text-lg font-semibold text-gray-900 mb-2">Nenhuma ação planejada</h4>
          <p className="text-gray-600 mb-4">Crie ações baseadas nos diagnósticos realizados</p>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors mx-auto">
            <Plus className="w-5 h-5" />
            <span>Primeira Ação</span>
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Navigation */}
      <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => setActiveTab('diagnosticos')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'diagnosticos' 
              ? 'bg-white text-blue-600 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Diagnósticos
        </button>
        <button
          onClick={() => setActiveTab('acoes')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'acoes' 
              ? 'bg-white text-blue-600 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Plano de Ação
        </button>
      </div>

      {/* Content */}
      {activeTab === 'diagnosticos' && renderDiagnosticos()}
      {activeTab === 'acoes' && renderAcoes()}
    </div>
  );
}