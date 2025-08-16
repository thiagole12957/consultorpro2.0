import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { TrendingUp, TrendingDown, DollarSign, PieChart, BarChart3, FileText } from 'lucide-react';
import { DREView } from './DREView';
import { BalancoView } from './BalancoView';
import { LancamentosView } from './LancamentosView';
import { ContasPagarView } from './ContasPagarView';
import { ContasReceberView } from './ContasReceberView';
import { PlanoContasView } from './PlanoContasView';

export function ContabilidadeDashboard() {
  const { faturas, contratos, licencas, lancamentosContabeis, contasPagar } = useApp();
  const [activeView, setActiveView] = useState<'dashboard' | 'dre' | 'balanco' | 'lancamentos' | 'contas-pagar' | 'contas-receber' | 'plano-contas'>('dashboard');
  // Cálculos para o dashboard
  const receitaTotal = faturas
    .filter(f => f.status === 'Pago')
    .reduce((sum, f) => sum + f.valor, 0);

  const custoLicencas = licencas
    .filter(l => l.status === 'Ativa')
    .reduce((sum, l) => sum + l.custoMensal, 0);

  const contratosAtivos = contratos.filter(c => c.status === 'Ativo').length;
  const faturasPendentes = faturas.filter(f => f.status === 'Pendente').length;

  const margemBruta = receitaTotal > 0 ? ((receitaTotal - custoLicencas) / receitaTotal) * 100 : 0;

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Cards de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-green-500 to-green-600 shadow-lg">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div className="flex items-center text-sm font-medium px-2 py-1 rounded-full text-green-700 bg-green-100">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span>+12%</span>
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 mb-1">
              R$ {(receitaTotal / 1000).toFixed(0)}k
            </p>
            <p className="text-sm text-gray-600">Receita Total</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-red-500 to-red-600 shadow-lg">
              <TrendingDown className="w-6 h-6 text-white" />
            </div>
            <div className="flex items-center text-sm font-medium px-2 py-1 rounded-full text-red-700 bg-red-100">
              <TrendingDown className="w-4 h-4 mr-1" />
              <span>-3%</span>
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 mb-1">
              R$ {(custoLicencas / 1000).toFixed(0)}k
            </p>
            <p className="text-sm text-gray-600">Custos Mensais</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg">
              <PieChart className="w-6 h-6 text-white" />
            </div>
            <div className="flex items-center text-sm font-medium px-2 py-1 rounded-full text-blue-700 bg-blue-100">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span>+5%</span>
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 mb-1">
              {margemBruta.toFixed(1)}%
            </p>
            <p className="text-sm text-gray-600">Margem Bruta</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 shadow-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div className="flex items-center text-sm font-medium px-2 py-1 rounded-full text-purple-700 bg-purple-100">
              <span>{faturasPendentes}</span>
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 mb-1">
              {contratosAtivos}
            </p>
            <p className="text-sm text-gray-600">Contratos Ativos</p>
          </div>
        </div>
      </div>

      {/* Gráfico de Receitas vs Custos */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Receitas vs Custos (Últimos 12 meses)</h3>
          <BarChart3 className="w-5 h-5 text-blue-600" />
        </div>
        
        <div className="h-64 flex items-end justify-between space-x-2">
          {Array.from({ length: 12 }, (_, i) => {
            const receita = Math.random() * 100000 + 50000;
            const custo = Math.random() * 40000 + 20000;
            const maxValue = 150000;
            
            return (
              <div key={i} className="flex-1 flex flex-col items-center space-y-1">
                <div className="w-full flex flex-col space-y-1">
                  <div 
                    className="w-full bg-gradient-to-t from-green-500 to-green-400 rounded-t-sm transition-all duration-300 hover:from-green-600 hover:to-green-500 cursor-pointer"
                    style={{ height: `${(receita / maxValue) * 100}%` }}
                    title={`Receita: R$ ${receita.toLocaleString('pt-BR')}`}
                  ></div>
                  <div 
                    className="w-full bg-gradient-to-t from-red-500 to-red-400 rounded-b-sm transition-all duration-300 hover:from-red-600 hover:to-red-500 cursor-pointer"
                    style={{ height: `${(custo / maxValue) * 100}%` }}
                    title={`Custo: R$ ${custo.toLocaleString('pt-BR')}`}
                  ></div>
                </div>
                <span className="text-xs text-gray-600">
                  {['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'][i]}
                </span>
              </div>
            );
          })}
        </div>
        
        <div className="flex items-center justify-center space-x-6 mt-4">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className="text-sm text-gray-600">Receitas</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span className="text-sm text-gray-600">Custos</span>
          </div>
        </div>
      </div>

      {/* Resumo por Cliente */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top 5 Clientes por Receita</h3>
        <div className="space-y-3">
          {faturas
            .reduce((acc: any[], fatura) => {
              if (fatura.status === 'Pago') {
                const existing = acc.find(item => item.clienteId === fatura.clienteId);
                if (existing) {
                  existing.valor += fatura.valor;
                } else {
                  acc.push({ clienteId: fatura.clienteId, valor: fatura.valor });
                }
              }
              return acc;
            }, [])
            .sort((a, b) => b.valor - a.valor)
            .slice(0, 5)
            .map((item, index) => (
              <div key={item.clienteId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {index + 1}
                  </div>
                  <span className="font-medium text-gray-900">Cliente {item.clienteId}</span>
                </div>
                <span className="font-semibold text-green-600">
                  R$ {item.valor.toLocaleString('pt-BR')}
                </span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      {/* Navegação */}
      <div className="flex items-center justify-between mb-6">
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
            onClick={() => setActiveView('dre')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeView === 'dre' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            DRE
          </button>
          <button
            onClick={() => setActiveView('balanco')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeView === 'balanco' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Balanço
          </button>
          <button
            onClick={() => setActiveView('lancamentos')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeView === 'lancamentos' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Lançamentos
          </button>
          <button
            onClick={() => setActiveView('contas-receber')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeView === 'contas-receber' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Contas a Receber
          </button>
          <button
            onClick={() => setActiveView('contas-pagar')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeView === 'contas-pagar' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Contas a Pagar
          </button>
          <button
            onClick={() => setActiveView('plano-contas')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeView === 'plano-contas' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Plano de Contas
          </button>
        </div>
      </div>

      {/* Conteúdo */}
      {activeView === 'dashboard' && renderDashboard()}
      {activeView === 'dre' && <DREView />}
      {activeView === 'balanco' && <BalancoView />}
      {activeView === 'lancamentos' && <LancamentosView />}
      {activeView === 'contas-receber' && <ContasReceberView />}
      {activeView === 'contas-pagar' && <ContasPagarView />}
      {activeView === 'plano-contas' && <PlanoContasView />}
    </div>
  );
}