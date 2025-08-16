import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { FileSearch, User, Calendar, Activity, AlertTriangle, CheckCircle, Eye, Filter } from 'lucide-react';

interface LogAuditoria {
  id: string;
  usuario: string;
  acao: string;
  modulo: string;
  detalhes: string;
  timestamp: string;
  ip: string;
  resultado: 'Sucesso' | 'Erro' | 'Aviso';
}

export function AuditoriaDashboard() {
  const [logs] = useState<LogAuditoria[]>([
    {
      id: '1',
      usuario: 'admin@consultorpro.com',
      acao: 'Criação de Cliente',
      modulo: 'Clientes',
      detalhes: 'Cliente "TechCorp Ltda" criado com sucesso',
      timestamp: '2024-01-15T10:30:00Z',
      ip: '192.168.1.100',
      resultado: 'Sucesso'
    },
    {
      id: '2',
      usuario: 'admin@consultorpro.com',
      acao: 'Atualização de Contrato',
      modulo: 'Contratos',
      detalhes: 'Contrato #1 - valor alterado de R$ 120.000 para R$ 150.000',
      timestamp: '2024-01-15T11:15:00Z',
      ip: '192.168.1.100',
      resultado: 'Sucesso'
    },
    {
      id: '3',
      usuario: 'admin@consultorpro.com',
      acao: 'Tentativa de Login',
      modulo: 'Autenticação',
      detalhes: 'Falha na autenticação - senha incorreta',
      timestamp: '2024-01-15T09:45:00Z',
      ip: '192.168.1.105',
      resultado: 'Erro'
    },
    {
      id: '4',
      usuario: 'admin@consultorpro.com',
      acao: 'Geração de Fatura',
      modulo: 'Faturas',
      detalhes: 'Fatura FAT-2024-001 gerada para cliente TechCorp',
      timestamp: '2024-01-15T14:20:00Z',
      ip: '192.168.1.100',
      resultado: 'Sucesso'
    },
    {
      id: '5',
      usuario: 'admin@consultorpro.com',
      acao: 'Exclusão de Licença',
      modulo: 'Licenças',
      detalhes: 'Tentativa de exclusão de licença ativa bloqueada',
      timestamp: '2024-01-15T16:10:00Z',
      ip: '192.168.1.100',
      resultado: 'Aviso'
    }
  ]);

  const [filtroModulo, setFiltroModulo] = useState('todos');
  const [filtroResultado, setFiltroResultado] = useState('todos');
  const [filtroData, setFiltroData] = useState('hoje');

  const getResultadoColor = (resultado: string) => {
    switch (resultado) {
      case 'Sucesso': return 'bg-green-100 text-green-700';
      case 'Erro': return 'bg-red-100 text-red-700';
      case 'Aviso': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getResultadoIcon = (resultado: string) => {
    switch (resultado) {
      case 'Sucesso': return <CheckCircle className="w-4 h-4" />;
      case 'Erro': return <AlertTriangle className="w-4 h-4" />;
      case 'Aviso': return <AlertTriangle className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const logsFiltrados = logs.filter(log => {
    if (filtroModulo !== 'todos' && log.modulo !== filtroModulo) return false;
    if (filtroResultado !== 'todos' && log.resultado !== filtroResultado) return false;
    return true;
  });

  const estatisticas = {
    totalLogs: logs.length,
    sucessos: logs.filter(l => l.resultado === 'Sucesso').length,
    erros: logs.filter(l => l.resultado === 'Erro').length,
    avisos: logs.filter(l => l.resultado === 'Aviso').length
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Auditoria & Logs</h2>
          <p className="text-gray-600">Monitoramento de atividades do sistema</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-700">
            <FileSearch className="w-4 h-4" />
            <span>Exportar Logs</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg">
              <Activity className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 mb-1">{estatisticas.totalLogs}</p>
            <p className="text-sm text-gray-600">Total de Logs</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-green-500 to-green-600 shadow-lg">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 mb-1">{estatisticas.sucessos}</p>
            <p className="text-sm text-gray-600">Sucessos</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-red-500 to-red-600 shadow-lg">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 mb-1">{estatisticas.erros}</p>
            <p className="text-sm text-gray-600">Erros</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-yellow-500 to-yellow-600 shadow-lg">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 mb-1">{estatisticas.avisos}</p>
            <p className="text-sm text-gray-600">Avisos</p>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">Filtros:</span>
          </div>
          
          <select
            value={filtroModulo}
            onChange={(e) => setFiltroModulo(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            <option value="todos">Todos os Módulos</option>
            <option value="Clientes">Clientes</option>
            <option value="Contratos">Contratos</option>
            <option value="Faturas">Faturas</option>
            <option value="Licenças">Licenças</option>
            <option value="Autenticação">Autenticação</option>
          </select>

          <select
            value={filtroResultado}
            onChange={(e) => setFiltroResultado(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            <option value="todos">Todos os Resultados</option>
            <option value="Sucesso">Sucesso</option>
            <option value="Erro">Erro</option>
            <option value="Aviso">Aviso</option>
          </select>

          <select
            value={filtroData}
            onChange={(e) => setFiltroData(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            <option value="hoje">Hoje</option>
            <option value="semana">Esta Semana</option>
            <option value="mes">Este Mês</option>
            <option value="todos">Todos</option>
          </select>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Logs de Auditoria</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Data/Hora</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Usuário</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Ação</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Módulo</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Detalhes</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">IP</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Resultado</th>
                <th className="text-right py-4 px-6 font-semibold text-gray-900">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {logsFiltrados.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {new Date(log.timestamp).toLocaleDateString('pt-BR')}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(log.timestamp).toLocaleTimeString('pt-BR')}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-900">{log.usuario}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm font-medium text-gray-900">{log.acao}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                      {log.modulo}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <p className="text-sm text-gray-600 max-w-xs truncate" title={log.detalhes}>
                      {log.detalhes}
                    </p>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm text-gray-500 font-mono">{log.ip}</span>
                  </td>
                  <td className="py-4 px-6">
                    <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getResultadoColor(log.resultado)}`}>
                      {getResultadoIcon(log.resultado)}
                      <span>{log.resultado}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Atividades Recentes */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Atividades Suspeitas</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-900">Múltiplas tentativas de login falharam</p>
                <p className="text-xs text-red-700">IP: 192.168.1.105 - 3 tentativas em 5 minutos</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-yellow-900">Acesso fora do horário comercial</p>
                <p className="text-xs text-yellow-700">Usuário: admin@consultorpro.com - 23:45</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}