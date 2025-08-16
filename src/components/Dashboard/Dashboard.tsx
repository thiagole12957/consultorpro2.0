import React from 'react';
import { Users, DollarSign, FileText, TrendingUp, Calendar, AlertCircle, CreditCard, Key } from 'lucide-react';
import { MetricCard } from './MetricCard';
import { useApp } from '../../contexts/AppContext';

export function Dashboard() {
  const { clientes, contratos, faturas, licencas, reunioes } = useApp();
  
  const clientesAtivos = clientes.filter(c => c.status === 'Ativo').length;
  const receitaTotal = contratos.reduce((sum, c) => sum + c.valor, 0);
  const contratosAtivos = contratos.filter(c => c.status === 'Ativo').length;
  const faturasPendentes = faturas.filter(f => f.status === 'Pendente').length;
  const custoLicencas = licencas.reduce((sum, l) => sum + l.custoMensal, 0);

  const proximasReunioes = reunioes
    .filter(r => r.status === 'agendada')
    .sort((a, b) => new Date(a.dataHoraInicio).getTime() - new Date(b.dataHoraInicio).getTime())
    .slice(0, 3);

  const alertas = [
    { tipo: 'contrato', mensagem: '2 contratos vencem em 30 dias', prioridade: 'alta' },
    { tipo: 'fatura', mensagem: `${faturasPendentes} faturas pendentes de pagamento`, prioridade: 'média' },
    { tipo: 'licenca', mensagem: '1 licença expira esta semana', prioridade: 'alta' },
  ];

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 bg-gray-50 min-h-screen">
      {/* Métricas Principais */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <MetricCard
          title="Clientes Ativos"
          value={clientesAtivos.toString()}
          change="+12%"
          trend="up"
          icon={Users}
          color="bg-gradient-to-r from-blue-500 to-blue-600"
        />
        <MetricCard
          title="Receita Total"
          value={`R$ ${(receitaTotal / 1000).toFixed(0)}k`}
          change="+8%"
          trend="up"
          icon={DollarSign}
          color="bg-gradient-to-r from-green-500 to-green-600"
        />
        <MetricCard
          title="Contratos Ativos"
          value={contratosAtivos.toString()}
          change="+5%"
          trend="up"
          icon={FileText}
          color="bg-gradient-to-r from-orange-500 to-orange-600"
        />
        <MetricCard
          title="Custo Licenças"
          value={`R$ ${(custoLicencas / 1000).toFixed(0)}k`}
          change="-3%"
          trend="down"
          icon={Key}
          color="bg-gradient-to-r from-purple-500 to-purple-600"
        />
      </div>

      {/* Grid com Cards */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        {/* Próximas Reuniões */}
        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Próximas Reuniões</h3>
            <Calendar className="w-5 h-5 text-blue-600" />
          </div>
          
          <div className="space-y-2 sm:space-y-3">
            {proximasReunioes.length > 0 ? (
              proximasReunioes.map((reuniao) => (
                <div key={reuniao.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors space-y-2 sm:space-y-0">
                  <div>
                    <p className="font-medium text-gray-900 text-sm sm:text-base">{reuniao.objetivo}</p>
                    <p className="text-xs sm:text-sm text-gray-600">
                      {new Date(reuniao.dataHoraInicio).toLocaleString('pt-BR')}
                    </p>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium self-start sm:self-auto ${
                    reuniao.canal === 'online' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'bg-green-100 text-green-700'
                  }`}>
                    {reuniao.canal}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4 text-sm">Nenhuma reunião agendada</p>
            )}
          </div>
        </div>

        {/* Alertas e Notificações */}
        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Alertas</h3>
            <AlertCircle className="w-5 h-5 text-orange-600" />
          </div>
          
          <div className="space-y-2 sm:space-y-3">
            {alertas.map((alerta, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  alerta.prioridade === 'alta' ? 'bg-red-500' : 'bg-yellow-500'
                }`}></div>
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-900">{alerta.mensagem}</p>
                  <p className="text-xs text-gray-600 capitalize">{alerta.tipo}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Resumo Financeiro */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Faturas Pendentes</h3>
            <CreditCard className="w-5 h-5 text-red-600" />
          </div>
          <div className="text-center">
            <p className="text-2xl sm:text-3xl font-bold text-red-600">{faturasPendentes}</p>
            <p className="text-xs sm:text-sm text-gray-600">faturas em aberto</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Licenças Ativas</h3>
            <Key className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-center">
            <p className="text-2xl sm:text-3xl font-bold text-green-600">{licencas.filter(l => l.status === 'Ativa').length}</p>
            <p className="text-xs sm:text-sm text-gray-600">licenças em uso</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100 sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Performance</h3>
            <TrendingUp className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-center">
            <p className="text-2xl sm:text-3xl font-bold text-blue-600">94%</p>
            <p className="text-xs sm:text-sm text-gray-600">satisfação cliente</p>
          </div>
        </div>
      </div>

      {/* Gráfico de Performance */}
      <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">Performance Mensal</h3>
          <TrendingUp className="w-5 h-5 text-green-600" />
        </div>
        
        <div className="h-48 sm:h-64 flex items-end justify-between space-x-1 sm:space-x-2">
          {[65, 78, 82, 90, 85, 92, 88, 95, 87, 91, 89, 96].map((height, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div 
                className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-sm transition-all duration-300 hover:from-blue-600 hover:to-blue-500 cursor-pointer min-h-[4px]"
                style={{ height: `${height}%` }}
              ></div>
              <span className="text-xs text-gray-600 mt-1 sm:mt-2">
                {['Jan', 'Feb', 'Mar', 'Apr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'][index]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}