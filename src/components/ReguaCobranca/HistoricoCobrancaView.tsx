import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Calendar, Mail, MessageSquare, Phone, CheckCircle, AlertTriangle, Clock, Eye, Filter, Search } from 'lucide-react';

export function HistoricoCobrancaView() {
  const { historicoCobranca, regrasCobranca, faturas, clientes } = useApp();
  const [filtroCanal, setFiltroCanal] = useState('todos');
  const [filtroStatus, setFiltroStatus] = useState('todos');
  const [filtroData, setFiltroData] = useState('hoje');
  const [busca, setBusca] = useState('');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'entregue': return 'bg-green-100 text-green-700';
      case 'enviado': return 'bg-blue-100 text-blue-700';
      case 'lido': return 'bg-purple-100 text-purple-700';
      case 'erro': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'entregue': return <CheckCircle className="w-4 h-4" />;
      case 'enviado': return <Clock className="w-4 h-4" />;
      case 'lido': return <Eye className="w-4 h-4" />;
      case 'erro': return <AlertTriangle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getCanalIcon = (canal: string) => {
    switch (canal) {
      case 'email': return <Mail className="w-4 h-4 text-blue-600" />;
      case 'sms': return <MessageSquare className="w-4 h-4 text-green-600" />;
      case 'whatsapp_oficial': return <Phone className="w-4 h-4 text-emerald-600" />;
      case 'whatsapp_web': return <MessageSquare className="w-4 h-4 text-teal-600" />;
      default: return <MessageSquare className="w-4 h-4 text-gray-600" />;
    }
  };

  const getFaturaNome = (faturaId: string) => {
    const fatura = faturas.find(f => f.id === faturaId);
    if (!fatura) return 'Fatura não encontrada';
    
    const cliente = clientes.find(c => c.id === fatura.clienteId);
    return `${fatura.numero} - ${cliente?.empresa || 'Cliente'}`;
  };

  const getRegraNome = (regraId: string) => {
    const regra = regrasCobranca.find(r => r.id === regraId);
    return regra ? regra.nome : 'Régua não encontrada';
  };

  const historicoFiltrado = historicoCobranca.filter(item => {
    const matchCanal = filtroCanal === 'todos' || item.canalUtilizado === filtroCanal;
    const matchStatus = filtroStatus === 'todos' || item.status === filtroStatus;
    const matchBusca = busca === '' || 
      getFaturaNome(item.faturaId).toLowerCase().includes(busca.toLowerCase()) ||
      getRegraNome(item.regraCobrancaId).toLowerCase().includes(busca.toLowerCase());
    
    return matchCanal && matchStatus && matchBusca;
  });

  const estatisticas = {
    totalEnvios: historicoCobranca.length,
    sucessos: historicoCobranca.filter(h => h.status === 'entregue' || h.status === 'lido').length,
    erros: historicoCobranca.filter(h => h.status === 'erro').length,
    pendentes: historicoCobranca.filter(h => h.status === 'enviado').length,
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg">
              <Mail className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 mb-1">{estatisticas.totalEnvios}</p>
            <p className="text-sm text-gray-600">Total de Envios</p>
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
              <Clock className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 mb-1">{estatisticas.pendentes}</p>
            <p className="text-sm text-gray-600">Pendentes</p>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
          <div className="flex items-center space-x-2">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              placeholder="Buscar por fatura ou régua..."
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={filtroCanal}
              onChange={(e) => setFiltroCanal(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="todos">Todos os Canais</option>
              <option value="email">E-mail</option>
              <option value="sms">SMS</option>
              <option value="whatsapp_oficial">WhatsApp API</option>
              <option value="whatsapp_web">WhatsApp Web</option>
            </select>
          </div>

          <select
            value={filtroStatus}
            onChange={(e) => setFiltroStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            <option value="todos">Todos os Status</option>
            <option value="enviado">Enviado</option>
            <option value="entregue">Entregue</option>
            <option value="lido">Lido</option>
            <option value="erro">Erro</option>
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

      {/* Lista de Histórico */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Data/Hora</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Fatura</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Régua</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Canal</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Template</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Tentativas</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Status</th>
                <th className="text-right py-4 px-6 font-semibold text-gray-900">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {historicoFiltrado.length > 0 ? (
                historicoFiltrado.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {new Date(item.dataEnvio).toLocaleDateString('pt-BR')}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(item.dataEnvio).toLocaleTimeString('pt-BR')}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm text-gray-900">{getFaturaNome(item.faturaId)}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm text-gray-700">{getRegraNome(item.regraCobrancaId)}</span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        {getCanalIcon(item.canalUtilizado)}
                        <span className="text-sm text-gray-700 capitalize">
                          {item.canalUtilizado.replace('_', ' ')}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm text-gray-600">{item.templateUtilizado}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`text-sm font-medium ${
                        item.tentativas > 1 ? 'text-orange-600' : 'text-gray-900'
                      }`}>
                        {item.tentativas}x
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                        {getStatusIcon(item.status)}
                        <span className="capitalize">{item.status}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-gray-500">
                    <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>Nenhum envio encontrado</p>
                    <p className="text-sm mt-2">
                      {busca ? 'Tente ajustar os filtros de busca' : 'Os envios aparecerão aqui quando as réguas forem executadas'}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}