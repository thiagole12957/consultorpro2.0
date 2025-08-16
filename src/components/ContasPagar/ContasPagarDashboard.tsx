import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Plus, Building2, Landmark } from 'lucide-react';
import { ContasPagarView } from '../Contabilidade/ContasPagarView';
import { FornecedoresList } from '../Fornecedores/FornecedoresList';
import { FornecedorModal } from '../Fornecedores/FornecedorModal';
import { ContaBancariaModal } from '../Contabilidade/ContaBancariaModal';
import { ContasBancariasList } from '../Contabilidade/ContasBancariasList';

export function ContasPagarDashboard() {
  const [activeView, setActiveView] = useState<'contas' | 'fornecedores' | 'contas-bancarias'>('contas');
  const [showFornecedorModal, setShowFornecedorModal] = useState(false);
  const [showContaBancariaModal, setShowContaBancariaModal] = useState(false);

  return (
    <div className="p-6">
      {/* Navegação */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setActiveView('contas')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeView === 'contas' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Contas a Pagar
          </button>
          <button
            onClick={() => setActiveView('fornecedores')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeView === 'fornecedores' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Fornecedores
          </button>
          <button
            onClick={() => setActiveView('contas-bancarias')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeView === 'contas-bancarias' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Contas Bancárias
          </button>
        </div>

        {(activeView === 'fornecedores' || activeView === 'contas-bancarias') && (
          <button
            onClick={() => {
              if (activeView === 'fornecedores') {
                setShowFornecedorModal(true);
              } else {
                setShowContaBancariaModal(true);
              }
            }}
            className={`${
              activeView === 'fornecedores' ? 'bg-orange-600 hover:bg-orange-700' : 'bg-blue-600 hover:bg-blue-700'
            } text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors`}
          >
            <Plus className="w-4 h-4" />
            <span>{activeView === 'fornecedores' ? 'Novo Fornecedor' : 'Nova Conta Bancária'}</span>
          </button>
        )}
      </div>

      {/* Conteúdo */}
      {activeView === 'contas' && <ContasPagarView />}
      {activeView === 'fornecedores' && <FornecedoresList />}
      {activeView === 'contas-bancarias' && <ContasBancariasList />}

      {/* Modal Novo Fornecedor */}
      {showFornecedorModal && (
        <FornecedorModal onClose={() => setShowFornecedorModal(false)} />
      )}

      {/* Modal Nova Conta Bancária */}
      {showContaBancariaModal && (
        <ContaBancariaModal onClose={() => setShowContaBancariaModal(false)} />
      )}
    </div>
  );
}