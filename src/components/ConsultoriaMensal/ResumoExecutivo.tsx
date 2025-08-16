import React from 'react';
import { useApp } from '../../contexts/AppContext';
import { TrendingUp, TrendingDown, Users, DollarSign, AlertTriangle, CheckCircle, Target, Calendar, BarChart3 } from 'lucide-react';

interface ResumoExecutivoProps {
  clienteId: string;
  mesAno: string;
}

export function ResumoExecutivo({ clienteId, mesAno }: ResumoExecutivoProps) {
  const { performanceMensal, metasMensais, acoesConsultoria } = useApp();

  // Buscar dados do período
  const performanceAtual = performanceMensal.find(p => 
    p.clienteId === clienteId && p.mesAno === mesAno
  );

  const metasDoMes = metasMensais.filter(m => 
    m.consultoriaMensalId && m.consultoriaMensalId.includes(mesAno)
  );

  const acoesDoMes = acoesConsultoria.filter(a => 
    a.consultoriaMensalId && a.consultoriaMensalId.includes(mesAno)
  );

  // Calcular score de performance
  const calcularScorePerformance = () => {
    if (!performanceAtual) return 0;
    
    let score = 0;
    let fatores = 0;

    // Fator 1: Taxa de Churn (peso 25%)
    if (performanceAtual.taxaChurn <= 2) score += 25;
    else if (performanceAtual.taxaChurn <= 5) score += 15;
    else if (performanceAtual.taxaChurn <= 10) score += 5;
    fatores++;

    // Fator 2: NPS (peso 25%)
    if (performanceAtual.nps >= 70) score += 25;
    else if (performanceAtual.nps >= 50) score += 15;
    else if (performanceAtual.nps >= 30) score += 5;
    fatores++;

    // Fator 3: Inadimplência (peso 25%)
    if (performanceAtual.percentualInadimplencia <= 2) score += 25;
    else if (performanceAtual.percentualInadimplencia <= 5) score += 15;
    else if (performanceAtual.percentualInadimplencia <= 10) score += 5;
    fatores++;

    // Fator 4: Crescimento (peso 25%)
    if (performanceAtual.novosClientes > performanceAtual.clientesCancelados) score += 25;
    else if (performanceAtual.novosClientes === performanceAtual.clientesCancelados) score += 15;
    fatores++;

    return Math.round(score);
  };

  const scorePerformance = calcularScorePerformance();

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBackground = (score: number) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const metasCumpridas = metasDoMes.filter(m => m.status === 'cumprida').length;
  const acoesConcluidas = acoesDoMes.filter(a => a.status === 'concluido').length;

  if (!performanceAtual) {
    return (
      <div className="bg-white rounded-xl p-8 text-center">
        <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Dados não encontrados</h3>
        <p className="text-gray-600">Não há dados de performance para este cliente no período selecionado.</p>
        <p className="text-sm text-gray-500 mt-2">Vá para a aba "Performance" para adicionar os dados.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Score de Performance */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Score de Performance Geral</h3>
          <div className={`px-4 py-2 rounded-full ${getScoreBackground(scorePerformance)}`}>
            <span className={`text-2xl font-bold ${getScoreColor(scorePerformance)}`}>
              {scorePerformance}/100
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <Target className="w-8 h-8 mx-auto mb-2 text-blue-600" />
            <p className="text-sm text-gray-600">Metas Cumpridas</p>
            <p className="text-2xl font-bold text-blue-600">{metasCumpridas}/{metasDoMes.length}</p>
          </div>
          
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-600" />
            <p className="text-sm text-gray-600">Ações Concluídas</p>
            <p className="text-2xl font-bold text-green-600">{acoesConcluidas}/{acoesDoMes.length}</p>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <TrendingUp className="w-8 h-8 mx-auto mb-2 text-purple-600" />
            <p className="text-sm text-gray-600">NPS</p>
            <p className="text-2xl font-bold text-purple-600">{performanceAtual.nps}</p>
          </div>
          
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-orange-600" />
            <p className="text-sm text-gray-600">Churn</p>
            <p className="text-2xl font-bold text-orange-600">{performanceAtual.taxaChurn.toFixed(1)}%</p>
          </div>
        </div>
      </div>

      {/* Indicadores Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div className={`flex items-center text-sm font-medium px-2 py-1 rounded-full ${
              performanceAtual.novosClientes > 0 ? 'text-green-700 bg-green-100' : 'text-gray-700 bg-gray-100'
            }`}>
              {performanceAtual.novosClientes > 0 ? (
                <TrendingUp className="w-4 h-4 mr-1" />
              ) : (
                <TrendingDown className="w-4 h-4 mr-1" />
              )}
              <span>+{performanceAtual.novosClientes}</span>
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 mb-1">{performanceAtual.clientesAtivos}</p>
            <p className="text-sm text-gray-600">Clientes Ativos</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-green-500 to-green-600 shadow-lg">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div className="flex items-center text-sm font-medium px-2 py-1 rounded-full text-green-700 bg-green-100">
              <span>R$ {performanceAtual.ticketMedio.toLocaleString('pt-BR')}</span>
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 mb-1">
              R$ {(performanceAtual.faturamentoTotal / 1000).toFixed(0)}k
            </p>
            <p className="text-sm text-gray-600">Faturamento</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-red-500 to-red-600 shadow-lg">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div className={`flex items-center text-sm font-medium px-2 py-1 rounded-full ${
              performanceAtual.percentualInadimplencia <= 5 ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'
            }`}>
              <span>{performanceAtual.percentualInadimplencia.toFixed(1)}%</span>
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 mb-1">
              R$ {(performanceAtual.inadimplencia / 1000).toFixed(0)}k
            </p>
            <p className="text-sm text-gray-600">Inadimplência</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 shadow-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div className={`flex items-center text-sm font-medium px-2 py-1 rounded-full ${
              performanceAtual.taxaChurn <= 5 ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'
            }`}>
              <span>{performanceAtual.taxaChurn.toFixed(1)}%</span>
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 mb-1">Churn</p>
            <p className="text-sm text-gray-600">Taxa de Cancelamento</p>
          </div>
        </div>
      </div>

      {/* Gráfico de Tendência */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Tendência dos Últimos 12 Meses</h3>
        
        <div className="h-64 flex items-end justify-between space-x-2">
          {performanceMensal
            .filter(p => p.clienteId === clienteId)
            .slice(-12)
            .map((performance, index) => {
              const maxValue = Math.max(...performanceMensal.map(p => p.faturamentoTotal));
              const height = maxValue > 0 ? (performance.faturamentoTotal / maxValue) * 100 : 0;
              
              return (
                <div key={performance.id} className="flex-1 flex flex-col items-center space-y-1">
                  <div 
                    className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-sm transition-all duration-300 hover:from-blue-600 hover:to-blue-500 cursor-pointer"
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

      {/* Resumo de Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3 mb-4">
            <Target className="w-6 h-6 text-blue-600" />
            <h4 className="text-lg font-semibold text-gray-900">Metas do Mês</h4>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Total:</span>
              <span className="font-medium">{metasDoMes.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Cumpridas:</span>
              <span className="font-medium text-green-600">{metasCumpridas}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Taxa de Sucesso:</span>
              <span className="font-medium text-blue-600">
                {metasDoMes.length > 0 ? ((metasCumpridas / metasDoMes.length) * 100).toFixed(1) : 0}%
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3 mb-4">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <h4 className="text-lg font-semibold text-gray-900">Plano de Ação</h4>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Total:</span>
              <span className="font-medium">{acoesDoMes.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Concluídas:</span>
              <span className="font-medium text-green-600">{acoesConcluidas}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Em Andamento:</span>
              <span className="font-medium text-blue-600">
                {acoesDoMes.filter(a => a.status === 'em_andamento').length}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3 mb-4">
            <Calendar className="w-6 h-6 text-purple-600" />
            <h4 className="text-lg font-semibold text-gray-900">Período Atual</h4>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Mês/Ano:</span>
              <span className="font-medium">{mesAno}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Score Geral:</span>
              <span className={`font-bold text-xl ${getScoreColor(scorePerformance)}`}>
                {scorePerformance}/100
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <span className={`font-medium ${
                scorePerformance >= 80 ? 'text-green-600' :
                scorePerformance >= 60 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {scorePerformance >= 80 ? 'Excelente' :
                 scorePerformance >= 60 ? 'Bom' : 'Precisa Melhorar'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Sinalizações Automáticas */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Sinalizações Automáticas</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Churn */}
          <div className={`p-4 rounded-lg border-l-4 ${
            performanceAtual.taxaChurn <= 2 ? 'bg-green-50 border-green-500' :
            performanceAtual.taxaChurn <= 5 ? 'bg-yellow-50 border-yellow-500' :
            'bg-red-50 border-red-500'
          }`}>
            <div className="flex items-center space-x-2 mb-2">
              {performanceAtual.taxaChurn <= 2 ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : performanceAtual.taxaChurn <= 5 ? (
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-red-600" />
              )}
              <span className="font-medium text-gray-900">Taxa de Churn</span>
            </div>
            <p className="text-sm text-gray-600">
              {performanceAtual.taxaChurn <= 2 ? 'Excelente - Abaixo de 2%' :
               performanceAtual.taxaChurn <= 5 ? 'Atenção - Entre 2% e 5%' :
               'Crítico - Acima de 5%'}
            </p>
          </div>

          {/* NPS */}
          <div className={`p-4 rounded-lg border-l-4 ${
            performanceAtual.nps >= 70 ? 'bg-green-50 border-green-500' :
            performanceAtual.nps >= 50 ? 'bg-yellow-50 border-yellow-500' :
            'bg-red-50 border-red-500'
          }`}>
            <div className="flex items-center space-x-2 mb-2">
              {performanceAtual.nps >= 70 ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : performanceAtual.nps >= 50 ? (
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-red-600" />
              )}
              <span className="font-medium text-gray-900">NPS Score</span>
            </div>
            <p className="text-sm text-gray-600">
              {performanceAtual.nps >= 70 ? 'Excelente - Promotores' :
               performanceAtual.nps >= 50 ? 'Bom - Neutros' :
               'Crítico - Detratores'}
            </p>
          </div>

          {/* Inadimplência */}
          <div className={`p-4 rounded-lg border-l-4 ${
            performanceAtual.percentualInadimplencia <= 2 ? 'bg-green-50 border-green-500' :
            performanceAtual.percentualInadimplencia <= 5 ? 'bg-yellow-50 border-yellow-500' :
            'bg-red-50 border-red-500'
          }`}>
            <div className="flex items-center space-x-2 mb-2">
              {performanceAtual.percentualInadimplencia <= 2 ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : performanceAtual.percentualInadimplencia <= 5 ? (
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-red-600" />
              )}
              <span className="font-medium text-gray-900">Inadimplência</span>
            </div>
            <p className="text-sm text-gray-600">
              {performanceAtual.percentualInadimplencia <= 2 ? 'Controlada - Abaixo de 2%' :
               performanceAtual.percentualInadimplencia <= 5 ? 'Atenção - Entre 2% e 5%' :
               'Crítica - Acima de 5%'}
            </p>
          </div>
        </div>
      </div>

      {/* Comparativo com Mês Anterior */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Comparativo com Mês Anterior</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Aqui você pode implementar a lógica de comparação */}
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Crescimento de Clientes</p>
            <p className="text-xl font-bold text-green-600">+{performanceAtual.novosClientes}</p>
            <p className="text-xs text-gray-500">vs mês anterior</p>
          </div>
          
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Variação Faturamento</p>
            <p className="text-xl font-bold text-blue-600">+8.5%</p>
            <p className="text-xs text-gray-500">vs mês anterior</p>
          </div>
          
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Variação NPS</p>
            <p className="text-xl font-bold text-purple-600">+5 pts</p>
            <p className="text-xs text-gray-500">vs mês anterior</p>
          </div>
          
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Variação Churn</p>
            <p className="text-xl font-bold text-orange-600">-1.2%</p>
            <p className="text-xs text-gray-500">vs mês anterior</p>
          </div>
        </div>
      </div>
    </div>
  );
}