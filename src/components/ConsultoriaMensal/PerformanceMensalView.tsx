import React from 'react';
import { useApp } from '../../contexts/AppContext';
import { TrendingUp, TrendingDown, Users, DollarSign, AlertTriangle, CheckCircle, BarChart3 } from 'lucide-react';

interface PerformanceMensalViewProps {
  clienteId: string;
  mesAno: string;
}

export function PerformanceMensalView({ clienteId, mesAno }: PerformanceMensalViewProps) {
  const { performanceMensal, metasMensais } = useApp();

  const performanceAtual = performanceMensal.find(p => 
    p.clienteId === clienteId && p.mesAno === mesAno
  );

  const metasDoMes = metasMensais.filter(m => 
    m.consultoriaMensalId && m.consultoriaMensalId.includes(mesAno)
  );

  if (!performanceAtual) {
    return (
      <div className="bg-white rounded-xl p-8 text-center">
        <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Performance não encontrada</h3>
        <p className="text-gray-600">Adicione os dados de performance para este período.</p>
      </div>
    );
  }

  const compararComMeta = (valorAtual: number, tipoMeta: string) => {
    const meta = metasDoMes.find(m => m.tipo === tipoMeta);
    if (!meta) return null;
    
    const progresso = meta.valorMeta > 0 ? (valorAtual / meta.valorMeta) * 100 : 0;
    return {
      meta: meta.valorMeta,
      progresso,
      status: progresso >= 100 ? 'cumprida' : progresso >= 75 ? 'em_andamento' : 'nao_atingida'
    };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-lg p-6 text-white">
        <h2 className="text-xl font-bold mb-2">Performance Detalhada - {mesAno}</h2>
        <p className="text-green-100">Resultados alcançados vs metas definidas</p>
      </div>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
            {(() => {
              const comparacao = compararComMeta(performanceAtual.clientesAtivos, 'crescimento_clientes');
              return comparacao && (
                <div className={`flex items-center text-sm font-medium px-2 py-1 rounded-full ${
                  comparacao.status === 'cumprida' ? 'text-green-700 bg-green-100' :
                  comparacao.status === 'em_andamento' ? 'text-blue-700 bg-blue-100' :
                  'text-red-700 bg-red-100'
                }`}>
                  <span>{comparacao.progresso.toFixed(1)}% da meta</span>
                </div>
              );
            })()}
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 mb-1">{performanceAtual.clientesAtivos}</p>
            <p className="text-sm text-gray-600">Clientes Ativos</p>
            <div className="mt-2 text-xs text-gray-500">
              <span className="text-green-600">+{performanceAtual.novosClientes} novos</span>
              <span className="mx-2">•</span>
              <span className="text-red-600">-{performanceAtual.clientesCancelados} cancelados</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-green-500 to-green-600 shadow-lg">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            {(() => {
              const comparacao = compararComMeta(performanceAtual.faturamentoTotal, 'vendas');
              return comparacao && (
                <div className={`flex items-center text-sm font-medium px-2 py-1 rounded-full ${
                  comparacao.status === 'cumprida' ? 'text-green-700 bg-green-100' :
                  comparacao.status === 'em_andamento' ? 'text-blue-700 bg-blue-100' :
                  'text-red-700 bg-red-100'
                }`}>
                  <span>{comparacao.progresso.toFixed(1)}% da meta</span>
                </div>
              );
            })()}
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 mb-1">
              R$ {(performanceAtual.faturamentoTotal / 1000).toFixed(0)}k
            </p>
            <p className="text-sm text-gray-600">Faturamento Total</p>
            <div className="mt-2 text-xs text-gray-500">
              ARPU: R$ {performanceAtual.arpu.toLocaleString('pt-BR')}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 shadow-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div className={`flex items-center text-sm font-medium px-2 py-1 rounded-full ${
              performanceAtual.nps >= 50 ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'
            }`}>
              <span>{performanceAtual.nps}</span>
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 mb-1">NPS</p>
            <p className="text-sm text-gray-600">Net Promoter Score</p>
            <div className="mt-2 text-xs text-gray-500">
              Satisfação: {performanceAtual.satisfacaoMedia.toFixed(1)}/5
            </div>
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
            <p className="text-2xl font-bold text-gray-900 mb-1">Inadimplência</p>
            <p className="text-sm text-gray-600">% do Faturamento</p>
            <div className="mt-2 text-xs text-gray-500">
              R$ {performanceAtual.inadimplencia.toLocaleString('pt-BR')}
            </div>
          </div>
        </div>
      </div>

      {/* Detalhamento por Categoria */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Métricas Operacionais */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Métricas Operacionais</h4>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Contratos Ativos:</span>
              <span className="font-semibold text-gray-900">{performanceAtual.contratosAtivos}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Logins Únicos:</span>
              <span className="font-semibold text-gray-900">{performanceAtual.loginsUnicos.toLocaleString('pt-BR')}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Ordens de Serviço:</span>
              <span className="font-semibold text-gray-900">{performanceAtual.ordensServico}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Resolvidas no Prazo:</span>
              <span className="font-semibold text-green-600">
                {performanceAtual.ordensResolvidasPrazo} ({performanceAtual.ordensServico > 0 ? 
                  ((performanceAtual.ordensResolvidasPrazo / performanceAtual.ordensServico) * 100).toFixed(1) : 0}%)
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Uptime:</span>
              <span className="font-semibold text-blue-600">{performanceAtual.uptime.toFixed(2)}%</span>
            </div>
          </div>
        </div>

        {/* Métricas de Suporte */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Métricas de Suporte</h4>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Chamados Abertos:</span>
              <span className="font-semibold text-gray-900">{performanceAtual.chamadosSuporte}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Tempo Médio Resolução:</span>
              <span className="font-semibold text-orange-600">{performanceAtual.tempoMedioResolucao.toFixed(1)}h</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Velocidade Média:</span>
              <span className="font-semibold text-blue-600">{performanceAtual.velocidadeMediaMbps} Mbps</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Tempo Instalação:</span>
              <span className="font-semibold text-purple-600">{performanceAtual.tempoMedioInstalacao} dias</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">CAC:</span>
              <span className="font-semibold text-gray-900">R$ {performanceAtual.custoAquisicaoCliente.toLocaleString('pt-BR')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Comparativo com Metas */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Comparativo com Metas Definidas</h4>
        
        <div className="space-y-4">
          {metasDoMes.map((meta) => {
            const progresso = meta.valorMeta > 0 ? (meta.valorAtual / meta.valorMeta) * 100 : 0;
            
            return (
              <div key={meta.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h5 className="font-medium text-gray-900">{meta.descricao}</h5>
                    <p className="text-sm text-gray-500 capitalize">{meta.tipo.replace('_', ' ')}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    meta.status === 'cumprida' ? 'bg-green-100 text-green-700' :
                    meta.status === 'em_andamento' ? 'bg-blue-100 text-blue-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {meta.status === 'cumprida' ? 'Cumprida' :
                     meta.status === 'em_andamento' ? 'Em Andamento' : 'Não Atingida'}
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mb-3">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Meta</p>
                    <p className="font-semibold text-gray-900">
                      {meta.unidade === 'percentual' ? `${meta.valorMeta.toFixed(1)}%` :
                       meta.unidade === 'valor' ? `R$ ${meta.valorMeta.toLocaleString('pt-BR')}` :
                       meta.valorMeta.toString()}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Atual</p>
                    <p className="font-semibold text-blue-600">
                      {meta.unidade === 'percentual' ? `${meta.valorAtual.toFixed(1)}%` :
                       meta.unidade === 'valor' ? `R$ ${meta.valorAtual.toLocaleString('pt-BR')}` :
                       meta.valorAtual.toString()}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Progresso</p>
                    <p className={`font-semibold ${
                      progresso >= 100 ? 'text-green-600' :
                      progresso >= 75 ? 'text-blue-600' :
                      'text-red-600'
                    }`}>
                      {progresso.toFixed(1)}%
                    </p>
                  </div>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full transition-all duration-300 ${
                      progresso >= 100 ? 'bg-green-500' :
                      progresso >= 75 ? 'bg-blue-500' :
                      progresso >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${Math.min(progresso, 100)}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Evolução Histórica */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Evolução Histórica</h4>
        
        <div className="h-64 flex items-end justify-between space-x-2">
          {performanceMensal
            .filter(p => p.clienteId === clienteId)
            .slice(-6)
            .map((performance, index) => {
              const maxValue = Math.max(...performanceMensal.filter(p => p.clienteId === clienteId).map(p => p.faturamentoTotal));
              const height = maxValue > 0 ? (performance.faturamentoTotal / maxValue) * 100 : 0;
              
              return (
                <div key={performance.id} className="flex-1 flex flex-col items-center space-y-1">
                  <div 
                    className="w-full bg-gradient-to-t from-green-500 to-green-400 rounded-t-sm transition-all duration-300 hover:from-green-600 hover:to-green-500 cursor-pointer"
                    style={{ height: `${height}%` }}
                    title={`${performance.mesAno}: R$ ${performance.faturamentoTotal.toLocaleString('pt-BR')}`}
                  ></div>
                  <span className="text-xs text-gray-600">
                    {performance.mesAno.split('-')[1]}/{performance.mesAno.split('-')[0].slice(-2)}
                  </span>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}