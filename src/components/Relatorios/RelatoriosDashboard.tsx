import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { BarChart3, PieChart, TrendingUp, Download, Calendar, Filter, FileText } from 'lucide-react';

export function RelatoriosDashboard() {
  const { clientes, contratos, faturas, licencas } = useApp();
  const [activeReport, setActiveReport] = useState<'financeiro' | 'clientes' | 'contratos' | 'licencas'>('financeiro');
  const [periodo, setPeriodo] = useState('mes');

  const gerarRelatorioFinanceiro = () => {
    const receitaTotal = faturas.filter(f => f.status === 'Pago').reduce((sum, f) => sum + f.valor, 0);
    const receitaPendente = faturas.filter(f => f.status === 'Pendente').reduce((sum, f) => sum + f.valor, 0);
    const custoLicencas = licencas.filter(l => l.status === 'Ativa').reduce((sum, l) => sum + l.custoMensal, 0);
    
    return {
      receitaTotal,
      receitaPendente,
      custoLicencas,
      margemBruta: receitaTotal > 0 ? ((receitaTotal - custoLicencas) / receitaTotal) * 100 : 0
    };
  };

  const gerarRelatorioClientes = () => {
    const clientesAtivos = clientes.filter(c => c.status === 'Ativo').length;
    const clientesProspects = clientes.filter(c => c.status === 'Prospect').length;
    const clientesInativos = clientes.filter(c => c.status === 'Inativo').length;
    
    return {
      total: clientes.length,
      ativos: clientesAtivos,
      prospects: clientesProspects,
      inativos: clientesInativos,
      conversao: clientes.length > 0 ? (clientesAtivos / clientes.length) * 100 : 0
    };
  };

  const relatorioFinanceiro = gerarRelatorioFinanceiro();
  const relatorioClientes = gerarRelatorioClientes();

  const exportarRelatorio = (tipo: string) => {
    const data = new Date().toLocaleDateString('pt-BR');
    let conteudo = '';
    
    switch (tipo) {
      case 'financeiro':
        conteudo = `RELATÓRIO FINANCEIRO - ${data}\n\n`;
        conteudo += `Receita Total: R$ ${relatorioFinanceiro.receitaTotal.toLocaleString('pt-BR')}\n`;
        conteudo += `Receita Pendente: R$ ${relatorioFinanceiro.receitaPendente.toLocaleString('pt-BR')}\n`;
        conteudo += `Custo Licenças: R$ ${relatorioFinanceiro.custoLicencas.toLocaleString('pt-BR')}\n`;
        conteudo += `Margem Bruta: ${relatorioFinanceiro.margemBruta.toFixed(1)}%\n`;
        break;
      case 'clientes':
        conteudo = `RELATÓRIO DE CLIENTES - ${data}\n\n`;
        conteudo += `Total de Clientes: ${relatorioClientes.total}\n`;
        conteudo += `Clientes Ativos: ${relatorioClientes.ativos}\n`;
        conteudo += `Prospects: ${relatorioClientes.prospects}\n`;
        conteudo += `Taxa de Conversão: ${relatorioClientes.conversao.toFixed(1)}%\n`;
        break;
    }
    
    const blob = new Blob([conteudo], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio-${tipo}-${data.replace(/\//g, '-')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const renderFinanceiro = () => (
    <div className="space-y-6">
      {/* Cards de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-green-500 to-green-600 shadow-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 mb-1">
              R$ {(relatorioFinanceiro.receitaTotal / 1000).toFixed(0)}k
            </p>
            <p className="text-sm text-gray-600">Receita Total</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-yellow-500 to-yellow-600 shadow-lg">
              <Calendar className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 mb-1">
              R$ {(relatorioFinanceiro.receitaPendente / 1000).toFixed(0)}k
            </p>
            <p className="text-sm text-gray-600">Receita Pendente</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-red-500 to-red-600 shadow-lg">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 mb-1">
              R$ {(relatorioFinanceiro.custoLicencas / 1000).toFixed(0)}k
            </p>
            <p className="text-sm text-gray-600">Custos Mensais</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg">
              <PieChart className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 mb-1">
              {relatorioFinanceiro.margemBruta.toFixed(1)}%
            </p>
            <p className="text-sm text-gray-600">Margem Bruta</p>
          </div>
        </div>
      </div>

      {/* Gráfico de Receitas */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Evolução da Receita</h3>
          <button
            onClick={() => exportarRelatorio('financeiro')}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
          >
            <Download className="w-4 h-4" />
            <span>Exportar</span>
          </button>
        </div>
        
        <div className="h-64 flex items-end justify-between space-x-2">
          {Array.from({ length: 12 }, (_, i) => {
            const receita = Math.random() * 50000 + 20000;
            const maxValue = 70000;
            
            return (
              <div key={i} className="flex-1 flex flex-col items-center space-y-1">
                <div 
                  className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-sm transition-all duration-300 hover:from-blue-600 hover:to-blue-500 cursor-pointer"
                  style={{ height: `${(receita / maxValue) * 100}%` }}
                  title={`Receita: R$ ${receita.toLocaleString('pt-BR')}`}
                ></div>
                <span className="text-xs text-gray-600">
                  {['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'][i]}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderClientes = () => (
    <div className="space-y-6">
      {/* Cards de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 mb-1">{relatorioClientes.total}</p>
            <p className="text-sm text-gray-600">Total de Clientes</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-green-500 to-green-600 shadow-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 mb-1">{relatorioClientes.ativos}</p>
            <p className="text-sm text-gray-600">Clientes Ativos</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-yellow-500 to-yellow-600 shadow-lg">
              <Calendar className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 mb-1">{relatorioClientes.prospects}</p>
            <p className="text-sm text-gray-600">Prospects</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 shadow-lg">
              <PieChart className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 mb-1">{relatorioClientes.conversao.toFixed(1)}%</p>
            <p className="text-sm text-gray-600">Taxa de Conversão</p>
          </div>
        </div>
      </div>

      {/* Distribuição por Segmento */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Distribuição por Segmento</h3>
          <button
            onClick={() => exportarRelatorio('clientes')}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
          >
            <Download className="w-4 h-4" />
            <span>Exportar</span>
          </button>
        </div>
        
        <div className="space-y-4">
          {['Tecnologia', 'Software', 'Startup', 'Consultoria'].map((segmento, index) => {
            const count = clientes.filter(c => c.segmento === segmento).length;
            const percentage = clientes.length > 0 ? (count / clientes.length) * 100 : 0;
            
            return (
              <div key={segmento} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full ${
                    ['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500'][index]
                  }`}></div>
                  <span className="text-sm font-medium text-gray-700">{segmento}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        ['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500'][index]
                      }`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 w-12 text-right">{count}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Relatórios & Analytics</h2>
          <p className="text-gray-600">Análises detalhadas do seu negócio</p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={periodo}
            onChange={(e) => setPeriodo(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="mes">Este Mês</option>
            <option value="trimestre">Este Trimestre</option>
            <option value="ano">Este Ano</option>
          </select>
          <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-700">
            <Filter className="w-4 h-4" />
            <span>Filtros</span>
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => setActiveReport('financeiro')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeReport === 'financeiro' 
              ? 'bg-white text-blue-600 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Financeiro
        </button>
        <button
          onClick={() => setActiveReport('clientes')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeReport === 'clientes' 
              ? 'bg-white text-blue-600 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Clientes
        </button>
        <button
          onClick={() => setActiveReport('contratos')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeReport === 'contratos' 
              ? 'bg-white text-blue-600 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Contratos
        </button>
        <button
          onClick={() => setActiveReport('licencas')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeReport === 'licencas' 
              ? 'bg-white text-blue-600 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Licenças
        </button>
      </div>

      {/* Content */}
      {activeReport === 'financeiro' && renderFinanceiro()}
      {activeReport === 'clientes' && renderClientes()}
      {activeReport === 'contratos' && (
        <div className="bg-white rounded-xl p-8 text-center">
          <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Relatório de Contratos</h3>
          <p className="text-gray-600">Análise detalhada de contratos será implementada em breve</p>
        </div>
      )}
      {activeReport === 'licencas' && (
        <div className="bg-white rounded-xl p-8 text-center">
          <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Relatório de Licenças</h3>
          <p className="text-gray-600">Análise de custos de licenças será implementada em breve</p>
        </div>
      )}
    </div>
  );
}