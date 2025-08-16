import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Plus, Target, Calendar, Users, TrendingUp, AlertCircle, CheckCircle, Clock } from 'lucide-react';

interface Projeto {
  id: string;
  nome: string;
  clienteId: string;
  contratoId?: string;
  descricao: string;
  dataInicio: string;
  dataFim: string;
  status: 'Planejamento' | 'Em Andamento' | 'Pausado' | 'Concluído' | 'Cancelado';
  progresso: number;
  orcamento: number;
  custoAtual: number;
  responsavel: string;
  equipe: string[];
  prioridade: 'Baixa' | 'Média' | 'Alta' | 'Crítica';
  marcos: Marco[];
  riscos: Risco[];
}

interface Marco {
  id: string;
  nome: string;
  dataPrevisao: string;
  dataConclusao?: string;
  status: 'Pendente' | 'Em Andamento' | 'Concluído' | 'Atrasado';
  responsavel: string;
}

interface Risco {
  id: string;
  descricao: string;
  probabilidade: 'Baixa' | 'Média' | 'Alta';
  impacto: 'Baixo' | 'Médio' | 'Alto';
  status: 'Identificado' | 'Mitigado' | 'Ocorrido';
  planoMitigacao: string;
}

export function ProjetosDashboard() {
  const { clientes, contratos } = useApp();
  const [projetos, setProjetos] = useState<Projeto[]>([
    {
      id: '1',
      nome: 'Implementação ERP TechCorp',
      clienteId: '1',
      contratoId: '1',
      descricao: 'Implementação completa do SAP Business One',
      dataInicio: '2024-01-15',
      dataFim: '2024-12-15',
      status: 'Em Andamento',
      progresso: 65,
      orcamento: 150000,
      custoAtual: 87500,
      responsavel: 'João Silva',
      equipe: ['João Silva', 'Maria Santos', 'Carlos Oliveira'],
      prioridade: 'Alta',
      marcos: [
        {
          id: '1',
          nome: 'Análise de Requisitos',
          dataPrevisao: '2024-02-15',
          dataConclusao: '2024-02-10',
          status: 'Concluído',
          responsavel: 'João Silva'
        },
        {
          id: '2',
          nome: 'Configuração do Sistema',
          dataPrevisao: '2024-06-15',
          status: 'Em Andamento',
          responsavel: 'Maria Santos'
        }
      ],
      riscos: [
        {
          id: '1',
          descricao: 'Atraso na entrega de dados pelo cliente',
          probabilidade: 'Média',
          impacto: 'Alto',
          status: 'Identificado',
          planoMitigacao: 'Reuniões semanais de acompanhamento'
        }
      ]
    }
  ]);

  const [activeView, setActiveView] = useState<'dashboard' | 'kanban' | 'gantt' | 'riscos'>('dashboard');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Concluído': return 'bg-green-100 text-green-700';
      case 'Em Andamento': return 'bg-blue-100 text-blue-700';
      case 'Pausado': return 'bg-yellow-100 text-yellow-700';
      case 'Cancelado': return 'bg-red-100 text-red-700';
      case 'Planejamento': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getPrioridadeColor = (prioridade: string) => {
    switch (prioridade) {
      case 'Crítica': return 'bg-red-100 text-red-700';
      case 'Alta': return 'bg-orange-100 text-orange-700';
      case 'Média': return 'bg-yellow-100 text-yellow-700';
      case 'Baixa': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getClienteNome = (clienteId: string) => {
    const cliente = clientes.find(c => c.id === clienteId);
    return cliente ? cliente.nome : 'Cliente não encontrado';
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg">
              <Target className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 mb-1">{projetos.length}</p>
            <p className="text-sm text-gray-600">Total de Projetos</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-green-500 to-green-600 shadow-lg">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 mb-1">
              {projetos.filter(p => p.status === 'Em Andamento').length}
            </p>
            <p className="text-sm text-gray-600">Em Andamento</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 mb-1">
              {projetos.reduce((acc, p) => acc + p.riscos.filter(r => r.status === 'Identificado').length, 0)}
            </p>
            <p className="text-sm text-gray-600">Riscos Ativos</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 shadow-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 mb-1">
              {Math.round(projetos.reduce((acc, p) => acc + p.progresso, 0) / projetos.length)}%
            </p>
            <p className="text-sm text-gray-600">Progresso Médio</p>
          </div>
        </div>
      </div>

      {/* Projetos List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Projetos Ativos</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {projetos.map((projeto) => (
            <div key={projeto.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">{projeto.nome}</h4>
                  <p className="text-sm text-gray-600 mb-2">{projeto.descricao}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>Cliente: {getClienteNome(projeto.clienteId)}</span>
                    <span>Responsável: {projeto.responsavel}</span>
                    <span>Equipe: {projeto.equipe.length} pessoas</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPrioridadeColor(projeto.prioridade)}`}>
                    {projeto.prioridade}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(projeto.status)}`}>
                    {projeto.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600">Progresso</span>
                    <span className="text-sm font-medium text-gray-900">{projeto.progresso}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${projeto.progresso}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600">Orçamento</span>
                    <span className="text-sm font-medium text-gray-900">
                      R$ {projeto.custoAtual.toLocaleString('pt-BR')} / R$ {projeto.orcamento.toLocaleString('pt-BR')}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        (projeto.custoAtual / projeto.orcamento) > 0.9 ? 'bg-red-600' : 
                        (projeto.custoAtual / projeto.orcamento) > 0.7 ? 'bg-yellow-600' : 'bg-green-600'
                      }`}
                      style={{ width: `${Math.min((projeto.custoAtual / projeto.orcamento) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600">Prazo</span>
                    <span className="text-sm font-medium text-gray-900">
                      {new Date(projeto.dataFim).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">
                      {Math.ceil((new Date(projeto.dataFim).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} dias restantes
                    </span>
                  </div>
                </div>
              </div>

              {/* Marcos */}
              <div className="border-t border-gray-200 pt-4">
                <h5 className="font-medium text-gray-700 mb-2">Próximos Marcos</h5>
                <div className="flex space-x-4">
                  {projeto.marcos.slice(0, 3).map((marco) => (
                    <div key={marco.id} className="flex items-center space-x-2">
                      {marco.status === 'Concluído' ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : marco.status === 'Em Andamento' ? (
                        <Clock className="w-4 h-4 text-blue-600" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-gray-400" />
                      )}
                      <span className="text-sm text-gray-600">{marco.nome}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestão de Projetos</h2>
          <p className="text-gray-600">Acompanhe o progresso e gerencie seus projetos</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4" />
          <span>Novo Projeto</span>
        </button>
      </div>

      {/* Navigation */}
      <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => setActiveView('dashboard')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeView === 'dashboard' 
              ? 'bg-white text-blue-600 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Dashboard
        </button>
        <button
          onClick={() => setActiveView('kanban')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeView === 'kanban' 
              ? 'bg-white text-blue-600 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Kanban
        </button>
        <button
          onClick={() => setActiveView('gantt')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeView === 'gantt' 
              ? 'bg-white text-blue-600 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Gantt
        </button>
        <button
          onClick={() => setActiveView('riscos')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeView === 'riscos' 
              ? 'bg-white text-blue-600 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Riscos
        </button>
      </div>

      {/* Content */}
      {activeView === 'dashboard' && renderDashboard()}
      {activeView === 'kanban' && (
        <div className="bg-white rounded-xl p-8 text-center">
          <Target className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Kanban Board</h3>
          <p className="text-gray-600">Visualização em Kanban será implementada em breve</p>
        </div>
      )}
      {activeView === 'gantt' && (
        <div className="bg-white rounded-xl p-8 text-center">
          <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Gráfico de Gantt</h3>
          <p className="text-gray-600">Cronograma detalhado será implementado em breve</p>
        </div>
      )}
      {activeView === 'riscos' && (
        <div className="bg-white rounded-xl p-8 text-center">
          <AlertCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Gestão de Riscos</h3>
          <p className="text-gray-600">Matriz de riscos será implementada em breve</p>
        </div>
      )}
    </div>
  );
}