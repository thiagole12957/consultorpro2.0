import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Plus, CreditCard, FileText } from 'lucide-react';
import { CarteiraCobrancaList } from './CarteiraCobrancaList';
import { ModeloContratoList } from './ModeloContratoList';
import { CarteiraCobrancaModal } from './CarteiraCobrancaModal';
import { ModeloContratoModal } from './ModeloContratoModal';

export function CarteiraCobrancaDashboard() {
  const [activeTab, setActiveTab] = useState<'carteiras' | 'modelos'>('carteiras');
  const [showCarteiraModal, setShowCarteiraModal] = useState(false);
  const [showModeloModal, setShowModeloModal] = useState(false);

  const tabs = [
    { id: 'carteiras', label: 'Carteiras de Cobrança', icon: CreditCard },
    { id: 'modelos', label: 'Modelos de Contrato', icon: FileText },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'carteiras':
        return <CarteiraCobrancaList />;
      case 'modelos':
        return <ModeloContratoList />;
      default:
        return <CarteiraCobrancaList />;
    }
  };

  const getHeaderInfo = () => {
    switch (activeTab) {
      case 'carteiras':
        return { title: 'Carteiras de Cobrança', subtitle: 'Gerencie carteiras internas e bancárias', showAdd: true };
      case 'modelos':
        return { title: 'Modelos de Contrato', subtitle: 'Templates e modelos para contratos', showAdd: true };
      default:
        return { title: 'Carteira de Cobrança', subtitle: '' };
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
            onClick={() => {
              if (activeTab === 'carteiras') {
                setShowCarteiraModal(true);
              } else {
                setShowModeloModal(true);
              }
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>{activeTab === 'carteiras' ? 'Nova Carteira' : 'Novo Modelo'}</span>
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

      {/* Modais */}
      {showCarteiraModal && (
        <CarteiraCobrancaModal onClose={() => setShowCarteiraModal(false)} />
      )}

      {showModeloModal && (
        <ModeloContratoModal onClose={() => setShowModeloModal(false)} />
      )}
    </div>
  );
}