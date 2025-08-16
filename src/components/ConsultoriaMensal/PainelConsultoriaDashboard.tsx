import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Target, Calendar, TrendingUp, Users, AlertTriangle, FileText, BarChart3, Lightbulb, Clock, CheckCircle } from 'lucide-react';
import { ResumoExecutivo } from './ResumoExecutivo';
import { MetasMensais } from './MetasMensais';
import { PerformanceMensalView } from './PerformanceMensalView';
import { DiagnosticoMensalView } from './DiagnosticoMensalView';
import { PlanoAcaoView } from './PlanoAcaoView';
import { MatrizImpactoEsforco } from './MatrizImpactoEsforco';
import { DocumentacaoProcessos } from './DocumentacaoProcessos';
import { ReunioesBriefingsView } from './ReunioesBriefingsView';
import { LinhaTempoConsultoria } from './LinhaTempoConsultoria';
import { AlertasPrioridades } from './AlertasPrioridades';
import { OportunidadesNegocio } from './OportunidadesNegocio';
import { RelatoriosAutomaticos } from './RelatoriosAutomaticos';

export function PainelConsultoriaDashboard() {
  const { clientes } = useApp();
  const [clienteSelecionado, setClienteSelecionado] = useState<string>('');
  const [mesAnoSelecionado, setMesAnoSelecionado] = useState<string>(
    new Date().toISOString().slice(0, 7)
  );
  const [activeTab, setActiveTab] = useState<string>('resumo-executivo');

  const tabs = [
    { id: 'resumo-executivo', label: 'Resumo Executivo', icon: BarChart3 },
    { id: 'metas-mensais', label: 'Metas Mensais', icon: Target },
    { id: 'performance-mensal', label: 'Performance', icon: TrendingUp },
    { id: 'diagnostico', label: 'Diagnóstico', icon: AlertTriangle },
    { id: 'plano-acao', label: 'Plano de Ação', icon: CheckCircle },
    { id: 'matriz-impacto', label: 'Matriz Impacto', icon: Target },
    { id: 'documentacao-processos', label: 'Processos', icon: FileText },
    { id: 'reunioes-briefings', label: 'Reuniões', icon: Calendar },
    { id: 'linha-tempo', label: 'Linha do Tempo', icon: Clock },
    { id: 'alertas', label: 'Alertas', icon: AlertTriangle },
    { id: 'oportunidades', label: 'Oportunidades', icon: Lightbulb },
    { id: 'relatorios', label: 'Relatórios', icon: FileText },
  ];

  const renderContent = () => {
    if (!clienteSelecionado) {
      return (
        <div className="bg-white rounded-xl p-8 text-center">
          <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Selecione um Cliente</h3>
          <p className="text-gray-600">Escolha um cliente para acessar o painel de consultoria mensal</p>
        </div>
      );
    }

    switch (activeTab) {
      case 'resumo-executivo':
        return <ResumoExecutivo clienteId={clienteSelecionado} mesAno={mesAnoSelecionado} />;
      case 'metas-mensais':
        return <MetasMensais clienteId={clienteSelecionado} mesAno={mesAnoSelecionado} />;
      case 'performance-mensal':
        return <PerformanceMensalView clienteId={clienteSelecionado} mesAno={mesAnoSelecionado} />;
      case 'diagnostico':
        return <DiagnosticoMensalView clienteId={clienteSelecionado} mesAno={mesAnoSelecionado} />;
      case 'plano-acao':
        return <PlanoAcaoView clienteId={clienteSelecionado} mesAno={mesAnoSelecionado} />;
      case 'matriz-impacto':
        return <MatrizImpactoEsforco clienteId={clienteSelecionado} mesAno={mesAnoSelecionado} />;
      case 'documentacao-processos':
        return <DocumentacaoProcessos clienteId={clienteSelecionado} />;
      case 'reunioes-briefings':
        return <ReunioesBriefingsView clienteId={clienteSelecionado} mesAno={mesAnoSelecionado} />;
      case 'linha-tempo':
        return <LinhaTempoConsultoria clienteId={clienteSelecionado} />;
      case 'alertas':
        return <AlertasPrioridades clienteId={clienteSelecionado} mesAno={mesAnoSelecionado} />;
      case 'oportunidades':
        return <OportunidadesNegocio clienteId={clienteSelecionado} />;
      case 'relatorios':
        return <RelatoriosAutomaticos clienteId={clienteSelecionado} mesAno={mesAnoSelecionado} />;
      default:
        return <ResumoExecutivo clienteId={clienteSelecionado} mesAno={mesAnoSelecionado} />;
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Painel de Consultoria Mensal</h1>
        <p className="text-blue-100">Gestão completa da consultoria por cliente e período</p>
      </div>

      {/* Seletores */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cliente
            </label>
            <select
              value={clienteSelecionado}
              onChange={(e) => setClienteSelecionado(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Selecione um cliente</option>
              {clientes.map(cliente => (
                <option key={cliente.id} value={cliente.id}>
                  {cliente.empresa} - {cliente.nome}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Período (Mês/Ano)
            </label>
            <input
              type="month"
              value={mesAnoSelecionado}
              onChange={(e) => setMesAnoSelecionado(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Navegação por Abas */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-200 overflow-x-auto">
          <nav className="flex space-x-1 px-6 min-w-max">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-3 border-b-2 font-medium text-sm transition-colors whitespace-nowrap flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Conteúdo */}
        <div className="p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}