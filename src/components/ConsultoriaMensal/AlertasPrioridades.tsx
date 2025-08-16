import React from 'react';
import { useApp } from '../../contexts/AppContext';
import { AlertTriangle, Clock, Calendar, Target, CheckCircle, Users } from 'lucide-react';

interface AlertasPrioridadesProps {
  clienteId: string;
  mesAno: string;
}

export function AlertasPrioridades({ clienteId, mesAno }: AlertasPrioridadesProps) {
  const { acoesConsultoria, reunioes, metasMensais } = useApp();

  // Ações críticas ou atrasadas
  const acoesCriticas = acoesConsultoria.filter(a => {
    if (!a.consultoriaMensalId || !a.consultoriaMensalId.includes(mesAno)) return false;
    
    const isAtrasada = a.prazo && new Date(a.prazo) < new Date();
    const isCritica = a.status === 'atrasado' || a.impacto === 'alto';
    
    return isAtrasada || isCritica;
  });

  // Reuniões próximas
  const reunioesProximas = reunioes.filter(r => {
    if (r.clienteId !== clienteId || r.status !== 'agendada') return false;
    
    const dataReuniao = new Date(r.dataHoraInicio);
    const hoje = new Date();
    const diasRestantes = Math.ceil((dataReuniao.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
    
    return diasRestantes <= 7 && diasRestantes >= 0;
  });

  // Metas em risco
  const metasEmRisco = metasMensais.filter(m => {
    if (!m.consultoriaMensalId || !m.consultoriaMensalId.includes(mesAno)) return false;
    
    const progresso = m.valorMeta > 0 ? (m.valorAtual / m.valorMeta) * 100 : 0;
    const prazoProximo = m.prazo && new Date(m.prazo).getTime() - new Date().getTime() < 7 * 24 * 60 * 60 * 1000;
    
    return progresso < 75 && prazoProximo;
  });

  const totalAlertas = acoesCriticas.length + reunioesProximas.length + metasEmRisco.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">Alertas e Prioridades</h3>
          <p className="text-gray-600">Itens que requerem atenção imediata</p>
        </div>
        <div className={`px-4 py-2 rounded-full ${
          totalAlertas === 0 ? 'bg-green-100 text-green-700' :
          totalAlertas <= 3 ? 'bg-yellow-100 text-yellow-700' :
          'bg-red-100 text-red-700'
        }`}>
          <span className="font-semibold">{totalAlertas} alertas</span>
        </div>
      </div>

      {/* Resumo de Alertas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-red-500 to-red-600 shadow-lg">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 mb-1">{acoesCriticas.length}</p>
            <p className="text-sm text-gray-600">Ações Críticas</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg">
              <Calendar className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 mb-1">{reunioesProximas.length}</p>
            <p className="text-sm text-gray-600">Reuniões Próximas</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-yellow-500 to-yellow-600 shadow-lg">
              <Target className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 mb-1">{metasEmRisco.length}</p>
            <p className="text-sm text-gray-600">Metas em Risco</p>
          </div>
        </div>
      </div>

      {/* Ações Críticas */}
      {acoesCriticas.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <h4 className="text-lg font-semibold text-gray-900">Ações Críticas</h4>
            </div>
          </div>
          
          <div className="divide-y divide-gray-100">
            {acoesCriticas.map((acao) => {
              const isAtrasada = acao.prazo && new Date(acao.prazo) < new Date();
              
              return (
                <div key={acao.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <AlertTriangle className="w-4 h-4 text-red-600" />
                        <h5 className="font-medium text-gray-900">{acao.descricao}</h5>
                        {isAtrasada && (
                          <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                            ATRASADA
                          </span>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Responsável Cliente:</span>
                          <p className="font-medium text-gray-900">{acao.responsavelCliente}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Responsável Consultoria:</span>
                          <p className="font-medium text-blue-900">{acao.responsavelConsultoria}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Prazo:</span>
                          <p className={`font-medium ${isAtrasada ? 'text-red-600' : 'text-gray-900'}`}>
                            {acao.prazo ? new Date(acao.prazo).toLocaleDateString('pt-BR') : 'Não definido'}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        acao.impacto === 'alto' ? 'bg-red-100 text-red-700' :
                        acao.impacto === 'medio' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {acao.impacto} impacto
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Reuniões Próximas */}
      {reunioesProximas.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              <h4 className="text-lg font-semibold text-gray-900">Reuniões Próximas (7 dias)</h4>
            </div>
          </div>
          
          <div className="divide-y divide-gray-100">
            {reunioesProximas.map((reuniao) => {
              const diasRestantes = Math.ceil((new Date(reuniao.dataHoraInicio).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
              
              return (
                <div key={reuniao.id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <div>
                        <h5 className="font-medium text-gray-900">{reuniao.objetivo}</h5>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <span>{new Date(reuniao.dataHoraInicio).toLocaleDateString('pt-BR')}</span>
                          <span>•</span>
                          <span>{new Date(reuniao.dataHoraInicio).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                          <span>•</span>
                          <Users className="w-4 h-4" />
                          <span>{reuniao.participantes.length} participantes</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                      diasRestantes === 0 ? 'bg-red-100 text-red-700' :
                      diasRestantes <= 2 ? 'bg-yellow-100 text-yellow-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {diasRestantes === 0 ? 'Hoje' :
                       diasRestantes === 1 ? 'Amanhã' :
                       `${diasRestantes} dias`}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Metas em Risco */}
      {metasEmRisco.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-yellow-600" />
              <h4 className="text-lg font-semibold text-gray-900">Metas em Risco</h4>
            </div>
          </div>
          
          <div className="divide-y divide-gray-100">
            {metasEmRisco.map((meta) => {
              const progresso = meta.valorMeta > 0 ? (meta.valorAtual / meta.valorMeta) * 100 : 0;
              
              return (
                <div key={meta.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Target className="w-4 h-4 text-yellow-600" />
                        <h5 className="font-medium text-gray-900">{meta.descricao}</h5>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Meta:</span>
                          <p className="font-medium text-gray-900">
                            {meta.unidade === 'percentual' ? `${meta.valorMeta.toFixed(1)}%` :
                             meta.unidade === 'valor' ? `R$ ${meta.valorMeta.toLocaleString('pt-BR')}` :
                             meta.valorMeta.toString()}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-600">Atual:</span>
                          <p className="font-medium text-blue-600">
                            {meta.unidade === 'percentual' ? `${meta.valorAtual.toFixed(1)}%` :
                             meta.unidade === 'valor' ? `R$ ${meta.valorAtual.toLocaleString('pt-BR')}` :
                             meta.valorAtual.toString()}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-600">Progresso:</span>
                          <p className={`font-medium ${
                            progresso >= 75 ? 'text-green-600' :
                            progresso >= 50 ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {progresso.toFixed(1)}%
                          </p>
                        </div>
                      </div>
                      
                      <div className="mt-3">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-300 ${
                              progresso >= 75 ? 'bg-green-500' :
                              progresso >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${Math.min(progresso, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                      progresso >= 75 ? 'bg-green-100 text-green-700' :
                      progresso >= 50 ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {progresso >= 75 ? 'No prazo' :
                       progresso >= 50 ? 'Atenção' : 'Risco'}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Estado sem alertas */}
      {totalAlertas === 0 && (
        <div className="bg-white rounded-xl p-8 text-center">
          <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
          <h4 className="text-lg font-semibold text-gray-900 mb-2">Tudo em dia!</h4>
          <p className="text-gray-600">Não há alertas ou prioridades pendentes no momento.</p>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center justify-center space-x-2 text-green-600">
              <CheckCircle className="w-4 h-4" />
              <span>Ações em dia</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-green-600">
              <CheckCircle className="w-4 h-4" />
              <span>Metas no prazo</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-green-600">
              <CheckCircle className="w-4 h-4" />
              <span>Reuniões agendadas</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}