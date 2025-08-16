import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { BarChart3, TrendingUp, Mail, MessageSquare, Phone, Download, Calendar } from 'lucide-react';

export function RelatoriosCobrancaView() {
  const { historicoCobranca, regrasCobranca, logsCobranca } = useApp();
  const [periodo, setPeriodo] = useState('mes');

  const calcularEfetividade = () => {
    const totalEnvios = historicoCobranca.length;
    const sucessos = historicoCobranca.filter(h => h.status === 'entregue' || h.status === 'lido').length;
    const erros = historicoCobranca.filter(h => h.status === 'erro').length;
    
    return {
      totalEnvios,
      sucessos,
      erros,
      taxaSucesso: totalEnvios > 0 ? (sucessos / totalEnvios) * 100 : 0,
      taxaErro: totalEnvios > 0 ? (erros / totalEnvios) * 100 : 0,
    };
  };

  const analisePorCanal = () => {
    const canais = ['email', 'sms', 'whatsapp_oficial', 'whatsapp_web'];
    
    return canais.map(canal => {
      const enviosCanal = historicoCobranca.filter(h => h.canalUtilizado === canal);
      const sucessosCanal = enviosCanal.filter(h => h.status === 'entregue' || h.status === 'lido').length;
      
      return {
        canal,
        envios: enviosCanal.length,
        sucessos: sucessosCanal,
        taxaSucesso: enviosCanal.length > 0 ? (sucessosCanal / enviosCanal.length) * 100 : 0,
      };
    });
  };

  const efetividade = calcularEfetividade();
  const analiseCanais = analisePorCanal();

  const exportarRelatorio = () => {
    const data = new Date().toLocaleDateString('pt-BR');
    let conteudo = `RELATÓRIO DE COBRANÇA AUTOMÁTICA - ${data}\n\n`;
    
    conteudo += `=== RESUMO GERAL ===\n`;
    conteudo += `Total de Envios: ${efetividade.totalEnvios}\n`;
    conteudo += `Sucessos: ${efetividade.sucessos} (${efetividade.taxaSucesso.toFixed(1)}%)\n`;
    conteudo += `Erros: ${efetividade.erros} (${efetividade.taxaErro.toFixed(1)}%)\n\n`;
    
    conteudo += `=== ANÁLISE POR CANAL ===\n`;
    analiseCanais.forEach(canal => {
      conteudo += `${canal.canal.toUpperCase()}: ${canal.envios} envios, ${canal.sucessos} sucessos (${canal.taxaSucesso.toFixed(1)}%)\n`;
    });
    
    const blob = new Blob([conteudo], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio-cobranca-${data.replace(/\//g, '-')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">Relatórios de Cobrança</h3>
          <p className="text-gray-600">Analytics e performance das réguas</p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={periodo}
            onChange={(e) => setPeriodo(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="hoje">Hoje</option>
            <option value="semana">Esta Semana</option>
            <option value="mes">Este Mês</option>
            <option value="trimestre">Este Trimestre</option>
          </select>
          <button
            onClick={exportarRelatorio}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
          >
            <Download className="w-4 h-4" />
            <span>Exportar</span>
          </button>
        </div>
      </div>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div className="flex items-center text-sm font-medium px-2 py-1 rounded-full text-blue-700 bg-blue-100">
              <span>{efetividade.taxaSucesso.toFixed(1)}%</span>
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 mb-1">{efetividade.totalEnvios}</p>
            <p className="text-sm text-gray-600">Total de Envios</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-green-500 to-green-600 shadow-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div className="flex items-center text-sm font-medium px-2 py-1 rounded-full text-green-700 bg-green-100">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span>+12%</span>
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 mb-1">{efetividade.sucessos}</p>
            <p className="text-sm text-gray-600">Entregas Bem-sucedidas</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 shadow-lg">
              <Mail className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 mb-1">
              {analiseCanais.find(c => c.canal === 'email')?.envios || 0}
            </p>
            <p className="text-sm text-gray-600">E-mails Enviados</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 shadow-lg">
              <Phone className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 mb-1">
              {analiseCanais.filter(c => c.canal.includes('whatsapp')).reduce((sum, c) => sum + c.envios, 0)}
            </p>
            <p className="text-sm text-gray-600">WhatsApp Enviados</p>
          </div>
        </div>
      </div>

      {/* Análise por Canal */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Performance por Canal</h4>
        
        <div className="space-y-4">
          {analiseCanais.map((canal) => (
            <div key={canal.canal} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                {getCanalIcon(canal.canal)}
                <div>
                  <p className="font-medium text-gray-900 capitalize">
                    {canal.canal.replace('_', ' ')}
                  </p>
                  <p className="text-sm text-gray-500">
                    {canal.envios} envios • {canal.sucessos} sucessos
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${canal.taxaSucesso}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-900 w-12 text-right">
                  {canal.taxaSucesso.toFixed(1)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Gráfico de Evolução */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Evolução dos Envios (Últimos 30 dias)</h4>
        
        <div className="h-64 flex items-end justify-between space-x-1">
          {Array.from({ length: 30 }, (_, i) => {
            const envios = Math.floor(Math.random() * 50) + 10;
            const maxValue = 60;
            
            return (
              <div key={i} className="flex-1 flex flex-col items-center space-y-1">
                <div 
                  className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-sm transition-all duration-300 hover:from-blue-600 hover:to-blue-500 cursor-pointer"
                  style={{ height: `${(envios / maxValue) * 100}%` }}
                  title={`${envios} envios`}
                ></div>
                {i % 5 === 0 && (
                  <span className="text-xs text-gray-600">
                    {new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).getDate()}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function getCanalIcon(canal: string) {
  switch (canal) {
    case 'email': return <Mail className="w-4 h-4 text-blue-600" />;
    case 'sms': return <MessageSquare className="w-4 h-4 text-green-600" />;
    case 'whatsapp_oficial': return <Phone className="w-4 h-4 text-emerald-600" />;
    case 'whatsapp_web': return <MessageSquare className="w-4 h-4 text-teal-600" />;
    default: return <MessageSquare className="w-4 h-4 text-gray-600" />;
  }
}