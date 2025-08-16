import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Target, Zap, Briefcase, X, Eye } from 'lucide-react';
import { AcaoConsultoria } from '../../types/consultoria';

interface MatrizImpactoEsforcoProps {
  clienteId: string;
  mesAno: string;
}

export function MatrizImpactoEsforco({ clienteId, mesAno }: MatrizImpactoEsforcoProps) {
  const { acoesConsultoria, atualizarAcaoConsultoria } = useApp();
  const [acaoSelecionada, setAcaoSelecionada] = useState<AcaoConsultoria | null>(null);

  const acoesDoMes = acoesConsultoria.filter(a => 
    a.consultoriaMensalId && a.consultoriaMensalId.includes(mesAno)
  );

  const getAcoesPorQuadrante = (quadrante: AcaoConsultoria['quadrante']) => {
    return acoesDoMes.filter(a => a.quadrante === quadrante);
  };

  const moverAcao = (acaoId: string, novoQuadrante: AcaoConsultoria['quadrante']) => {
    const acao = acoesDoMes.find(a => a.id === acaoId);
    if (!acao) return;

    // Determinar impacto e esforço baseado no quadrante
    let impacto: AcaoConsultoria['impacto'];
    let esforco: AcaoConsultoria['esforco'];

    switch (novoQuadrante) {
      case 'quick_wins':
        impacto = 'alto';
        esforco = 'baixo';
        break;
      case 'projetos':
        impacto = 'alto';
        esforco = 'alto';
        break;
      case 'fill_ins':
        impacto = 'baixo';
        esforco = 'baixo';
        break;
      case 'thankless':
        impacto = 'baixo';
        esforco = 'alto';
        break;
    }

    atualizarAcaoConsultoria(acaoId, {
      quadrante: novoQuadrante,
      impacto,
      esforco,
      atualizadoEm: new Date().toISOString().split('T')[0],
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'concluido': return 'bg-green-500';
      case 'em_andamento': return 'bg-blue-500';
      case 'atrasado': return 'bg-red-500';
      case 'nao_iniciado': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const renderQuadrante = (
    titulo: string,
    quadrante: AcaoConsultoria['quadrante'],
    cor: string,
    icone: React.ReactNode,
    descricao: string
  ) => {
    const acoes = getAcoesPorQuadrante(quadrante);

    return (
      <div 
        className={`${cor} rounded-xl p-6 min-h-[300px] border-2 border-dashed border-opacity-30`}
        onDrop={(e) => {
          e.preventDefault();
          const acaoId = e.dataTransfer.getData('text/plain');
          moverAcao(acaoId, quadrante);
        }}
        onDragOver={(e) => e.preventDefault()}
      >
        <div className="flex items-center space-x-3 mb-4">
          {icone}
          <div>
            <h4 className="font-semibold text-gray-900">{titulo}</h4>
            <p className="text-sm text-gray-600">{descricao}</p>
          </div>
        </div>
        
        <div className="space-y-3">
          {acoes.map((acao) => (
            <div
              key={acao.id}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData('text/plain', acao.id);
              }}
              className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 cursor-move hover:shadow-md transition-shadow"
              onClick={() => setAcaoSelecionada(acao)}
            >
              <div className="flex items-start justify-between mb-2">
                <h5 className="font-medium text-gray-900 text-sm leading-tight">
                  {acao.descricao}
                </h5>
                <div className={`w-3 h-3 rounded-full ${getStatusColor(acao.status)}`}></div>
              </div>
              
              <div className="text-xs text-gray-500 space-y-1">
                <p>Cliente: {acao.responsavelCliente}</p>
                <p>Consultoria: {acao.responsavelConsultoria}</p>
                {acao.prazo && (
                  <p className={`${
                    new Date(acao.prazo) < new Date() ? 'text-red-600' : 'text-gray-500'
                  }`}>
                    Prazo: {new Date(acao.prazo).toLocaleDateString('pt-BR')}
                  </p>
                )}
              </div>
            </div>
          ))}
          
          {acoes.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              <p className="text-sm">Arraste ações para este quadrante</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">Matriz Impacto x Esforço</h3>
          <p className="text-gray-600">Priorização visual das ações - {mesAno}</p>
        </div>
        <div className="text-sm text-gray-500">
          <p>Arraste as ações entre os quadrantes para repriorizar</p>
        </div>
      </div>

      {/* Legenda */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Concluído</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>Em Andamento</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>Atrasado</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
            <span>Não Iniciado</span>
          </div>
        </div>
      </div>

      {/* Matriz */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Alto Impacto */}
        <div className="space-y-6">
          <div className="text-center">
            <h4 className="text-lg font-semibold text-gray-900">Alto Impacto</h4>
          </div>
          
          {/* Quick Wins */}
          {renderQuadrante(
            '🚀 Quick Wins',
            'quick_wins',
            'bg-green-50',
            <Target className="w-6 h-6 text-green-600" />,
            'Alto impacto, baixo esforço - Prioridade máxima'
          )}
          
          {/* Projetos */}
          {renderQuadrante(
            '📋 Projetos',
            'projetos',
            'bg-blue-50',
            <Briefcase className="w-6 h-6 text-blue-600" />,
            'Alto impacto, alto esforço - Planejamento necessário'
          )}
        </div>

        {/* Baixo Impacto */}
        <div className="space-y-6">
          <div className="text-center">
            <h4 className="text-lg font-semibold text-gray-900">Baixo Impacto</h4>
          </div>
          
          {/* Fill Ins */}
          {renderQuadrante(
            '⚡ Fill Ins',
            'fill_ins',
            'bg-yellow-50',
            <Zap className="w-6 h-6 text-yellow-600" />,
            'Baixo impacto, baixo esforço - Tempo livre'
          )}
          
          {/* Thankless */}
          {renderQuadrante(
            '❌ Thankless',
            'thankless',
            'bg-red-50',
            <X className="w-6 h-6 text-red-600" />,
            'Baixo impacto, alto esforço - Evitar'
          )}
        </div>
      </div>

      {/* Resumo por Quadrante */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Resumo da Priorização</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <Target className="w-8 h-8 mx-auto mb-2 text-green-600" />
            <p className="font-semibold text-green-900">{getAcoesPorQuadrante('quick_wins').length}</p>
            <p className="text-sm text-green-700">Quick Wins</p>
          </div>
          
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <Briefcase className="w-8 h-8 mx-auto mb-2 text-blue-600" />
            <p className="font-semibold text-blue-900">{getAcoesPorQuadrante('projetos').length}</p>
            <p className="text-sm text-blue-700">Projetos</p>
          </div>
          
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <Zap className="w-8 h-8 mx-auto mb-2 text-yellow-600" />
            <p className="font-semibold text-yellow-900">{getAcoesPorQuadrante('fill_ins').length}</p>
            <p className="text-sm text-yellow-700">Fill Ins</p>
          </div>
          
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <X className="w-8 h-8 mx-auto mb-2 text-red-600" />
            <p className="font-semibold text-red-900">{getAcoesPorQuadrante('thankless').length}</p>
            <p className="text-sm text-red-700">Thankless</p>
          </div>
        </div>
      </div>

      {/* Modal de Detalhes da Ação */}
      {acaoSelecionada && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Detalhes da Ação</h2>
              <button
                onClick={() => setAcaoSelecionada(null)}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Descrição</h3>
                <p className="text-gray-700">{acaoSelecionada.descricao}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-700">Responsável Cliente</h4>
                  <p className="text-gray-600">{acaoSelecionada.responsavelCliente}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700">Responsável Consultoria</h4>
                  <p className="text-gray-600">{acaoSelecionada.responsavelConsultoria}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <h4 className="font-medium text-gray-700">Status</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    acaoSelecionada.status === 'concluido' ? 'bg-green-100 text-green-700' :
                    acaoSelecionada.status === 'em_andamento' ? 'bg-blue-100 text-blue-700' :
                    acaoSelecionada.status === 'atrasado' ? 'bg-red-100 text-red-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {acaoSelecionada.status.replace('_', ' ')}
                  </span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700">Impacto</h4>
                  <p className="text-gray-600 capitalize">{acaoSelecionada.impacto}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700">Esforço</h4>
                  <p className="text-gray-600 capitalize">{acaoSelecionada.esforco}</p>
                </div>
              </div>
              
              {acaoSelecionada.prazo && (
                <div>
                  <h4 className="font-medium text-gray-700">Prazo</h4>
                  <p className={`${
                    new Date(acaoSelecionada.prazo) < new Date() ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {new Date(acaoSelecionada.prazo).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              )}
              
              {acaoSelecionada.observacoes && (
                <div>
                  <h4 className="font-medium text-gray-700">Observações</h4>
                  <p className="text-gray-600">{acaoSelecionada.observacoes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}