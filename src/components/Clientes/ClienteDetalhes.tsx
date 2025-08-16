import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Building2, Mail, Phone, Calendar, DollarSign, TrendingUp, Users, FileText, Key, Video } from 'lucide-react';
import { ContatosList } from './ContatosList';
import { ReunioesBriefings } from './ReunioesBriefings';
import { DiagnosticoPlanejamento } from './DiagnosticoPlanejamento';
import { PerformanceMensal } from './PerformanceMensal';

export function ClienteDetalhes() {
  const { clienteSelecionado, contratos, faturas, licencas, reunioes } = useApp();
  const [activeTab, setActiveTab] = useState('overview');

  if (!clienteSelecionado) {
    return null;
  }

  const cliente = clienteSelecionado;
  
  // Dados relacionados ao cliente
  const clienteContratos = contratos.filter(c => c.clienteId === cliente.id);
  const clienteFaturas = faturas.filter(f => f.clienteId === cliente.id);
  const clienteLicencas = licencas.filter(l => l.clienteId === cliente.id);
  const clienteReunioes = reunioes.filter(r => r.clienteId === cliente.id);

  const valorTotalContratos = clienteContratos.reduce((sum, c) => sum + c.valor, 0);
  const faturasPendentes = clienteFaturas.filter(f => f.status === 'Pendente').length;
  const licencasAtivas = clienteLicencas.filter(l => l.status === 'Ativa').length;
  const reunioesRealizadas = clienteReunioes.filter(r => r.status === 'realizada').length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ativo': return 'bg-green-100 text-green-700';
      case 'Prospect': return 'bg-blue-100 text-blue-700';
      case 'Inativo': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Métricas do Cliente */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-green-500 to-green-600 shadow-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 mb-1">{clienteContratos.length}</p>
            <p className="text-sm text-gray-600">Contratos</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 mb-1">
              R$ {(valorTotalContratos / 1000).toFixed(0)}k
            </p>
            <p className="text-sm text-gray-600">Valor Total</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 shadow-lg">
              <Key className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 mb-1">{licencasAtivas}</p>
            <p className="text-sm text-gray-600">Licenças Ativas</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg">
              <Video className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 mb-1">{reunioesRealizadas}</p>
            <p className="text-sm text-gray-600">Reuniões</p>
          </div>
        </div>
      </div>

      {/* Informações do Cliente */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-start space-x-6">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-2xl">
            {cliente.empresa.split(' ').map(word => word[0]).join('').slice(0, 2)}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-4">
              <h2 className="text-2xl font-bold text-gray-900">{cliente.empresa}</h2>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(cliente.status)}`}>
                {cliente.status}
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">Contato:</span>
                  <span className="font-medium text-gray-900">{cliente.nome}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">E-mail:</span>
                  <span className="text-gray-900">{cliente.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">Telefone:</span>
                  <span className="text-gray-900">{cliente.telefone}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Building2 className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">Segmento:</span>
                  <span className="text-gray-900">{cliente.segmento}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">Tamanho:</span>
                  <span className="text-gray-900">{cliente.tamanho}</span>
                </div>
                {cliente.dataConversao && (
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">Conversão:</span>
                    <span className="text-gray-900">{new Date(cliente.dataConversao).toLocaleDateString('pt-BR')}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contratos Ativos */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Contratos Ativos</h3>
        {clienteContratos.length > 0 ? (
          <div className="space-y-3">
            {clienteContratos.map((contrato) => (
              <div key={contrato.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{contrato.nome}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(contrato.dataInicio).toLocaleDateString('pt-BR')} - {new Date(contrato.dataFim).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">
                    R$ {contrato.valor.toLocaleString('pt-BR')}
                  </p>
                  <p className="text-sm text-gray-600">{contrato.tipo}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">Nenhum contrato ativo</p>
        )}
      </div>

      {/* Faturas Recentes */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Faturas Recentes</h3>
        {clienteFaturas.length > 0 ? (
          <div className="space-y-3">
            {clienteFaturas.slice(0, 5).map((fatura) => (
              <div key={fatura.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{fatura.numero}</p>
                  <p className="text-sm text-gray-600">
                    Vencimento: {new Date(fatura.dataVencimento).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    R$ {fatura.valor.toLocaleString('pt-BR')}
                  </p>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    fatura.status === 'Pago' ? 'bg-green-100 text-green-700' :
                    fatura.status === 'Pendente' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {fatura.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">Nenhuma fatura encontrada</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header do Cliente */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-start space-x-6">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-2xl">
            {cliente.empresa.split(' ').map(word => word[0]).join('').slice(0, 2)}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-4">
              <h2 className="text-2xl font-bold text-gray-900">{cliente.empresa}</h2>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(cliente.status)}`}>
                {cliente.status}
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">Contato:</span>
                  <span className="font-medium text-gray-900">{cliente.nome}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">E-mail:</span>
                  <span className="text-gray-900">{cliente.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">Telefone:</span>
                  <span className="text-gray-900">{cliente.telefone}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Building2 className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">Segmento:</span>
                  <span className="text-gray-900">{cliente.segmento}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">Tamanho:</span>
                  <span className="text-gray-900">{cliente.tamanho}</span>
                </div>
                {cliente.dataConversao && (
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">Conversão:</span>
                    <span className="text-gray-900">{new Date(cliente.dataConversao).toLocaleDateString('pt-BR')}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navegação por Abas */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Visão Geral
            </button>
            <button
              onClick={() => setActiveTab('contatos')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'contatos'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Contatos
            </button>
            <button
              onClick={() => setActiveTab('reunioes')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'reunioes'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Reuniões
            </button>
            <button
              onClick={() => setActiveTab('diagnostico')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'diagnostico'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Diagnóstico
            </button>
            <button
              onClick={() => setActiveTab('performance')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'performance'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Performance
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'contatos' && <ContatosList clienteId={cliente.id} />}
          {activeTab === 'reunioes' && <ReunioesBriefings clienteId={cliente.id} />}
          {activeTab === 'diagnostico' && <DiagnosticoPlanejamento clienteId={cliente.id} />}
          {activeTab === 'performance' && <PerformanceMensal clienteId={cliente.id} />}
        </div>
      </div>
    </div>
  );
}