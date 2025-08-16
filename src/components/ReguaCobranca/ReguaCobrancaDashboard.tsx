import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Plus, Settings, BarChart3, Clock, Mail } from 'lucide-react';
import { ReguaCobrancaList } from './ReguaCobrancaList';
import { HistoricoCobrancaView } from './HistoricoCobrancaView';
import { RelatoriosCobrancaView } from './RelatoriosCobrancaView';
import { ConfiguracoesCobrancaView } from './ConfiguracoesCobrancaView';
import { ReguaCobrancaModal } from './ReguaCobrancaModal';

export function ReguaCobrancaDashboard() {
  const [activeTab, setActiveTab] = useState<'reguas' | 'historico' | 'relatorios' | 'configuracoes'>('reguas');
  const [showModal, setShowModal] = useState(false);

  const tabs = [
    { id: 'reguas', label: 'Réguas de Cobrança', icon: Settings },
    { id: 'historico', label: 'Histórico de Envios', icon: Clock },
    { id: 'relatorios', label: 'Relatórios', icon: BarChart3 },
    { id: 'configuracoes', label: 'Configurações Globais', icon: Mail },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'reguas':
        return <ReguaCobrancaList />;
      case 'historico':
        return <HistoricoCobrancaView />;
      case 'relatorios':
        return <RelatoriosCobrancaView />;
      case 'configuracoes':
        return <ConfiguracoesCobrancaView />;
      default:
        return <ReguaCobrancaList />;
    }
  };

  const getHeaderInfo = () => {
    switch (activeTab) {
      case 'reguas':
        return { title: 'Réguas de Cobrança', subtitle: 'Configure cobranças automáticas', showAdd: true };
      case 'historico':
        return { title: 'Histórico de Envios', subtitle: 'Acompanhe envios realizados' };
      case 'relatorios':
        return { title: 'Relatórios de Cobrança', subtitle: 'Analytics e performance' };
      case 'configuracoes':
        return { title: 'Configurações Globais', subtitle: 'Configurações gerais do sistema' };
      default:
        return { title: 'Régua de Cobrança', subtitle: '' };
    }
  };

  const headerInfo = getHeaderInfo();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{headerInfo.title}</h2>
          <p className="text-gray-600">{headerInfo.subtitle}</p>
        </div>
        {headerInfo.showAdd && (
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Nova Régua</span>
          </button>
        )}
      </div>

      {/* Navegação por Abas */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center space-x-2 ${
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

        {/* Conteúdo das Abas */}
        <div className="p-6">
          {renderContent()}
        </div>
      </div>

      {/* Modal Nova Régua */}
      {showModal && (
        <ReguaCobrancaModal onClose={() => setShowModal(false)} />
      )}
    </div>
  );
}