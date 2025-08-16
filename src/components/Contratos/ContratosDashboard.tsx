import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Plus, FileText, CreditCard, Package, DollarSign } from 'lucide-react';
import { ContratosList } from './ContratosList';
import { ContratoModal } from './ContratoModal';
import { FaturamentoContrato } from './FaturamentoContrato';
import { FaturasContrato } from './FaturasContrato';
import { ProdutosContrato } from './ProdutosContrato';

export function ContratosDashboard() {
  const [activeTab, setActiveTab] = useState<'contratos' | 'faturamento' | 'faturas' | 'produtos'>('contratos');
  const [showModal, setShowModal] = useState(false);

  const tabs = [
    { id: 'contratos', label: 'Contratos', icon: FileText },
    { id: 'faturamento', label: 'Faturamento', icon: DollarSign },
    { id: 'faturas', label: 'Faturas', icon: CreditCard },
    { id: 'produtos', label: 'Produtos do Contrato', icon: Package },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'contratos':
        return <ContratosList />;
      case 'faturamento':
        return <FaturamentoContrato />;
      case 'faturas':
        return <FaturasContrato />;
      case 'produtos':
        return <ProdutosContrato />;
      default:
        return <ContratosList />;
    }
  };

  const getHeaderInfo = () => {
    switch (activeTab) {
      case 'contratos':
        return { title: 'Gestão de Contratos', subtitle: 'Gerencie contratos e acordos comerciais', showAdd: true };
      case 'faturamento':
        return { title: 'Faturamento de Contratos', subtitle: 'Configure faturamento automático' };
      case 'faturas':
        return { title: 'Faturas dos Contratos', subtitle: 'Faturas geradas pelos contratos' };
      case 'produtos':
        return { title: 'Produtos dos Contratos', subtitle: 'Produtos e serviços vinculados aos contratos' };
      default:
        return { title: 'Contratos', subtitle: '' };
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
            <span>Novo Contrato</span>
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

      {/* Modal Novo Contrato */}
      {showModal && (
        <ContratoModal onClose={() => setShowModal(false)} />
      )}
    </div>
  );
}