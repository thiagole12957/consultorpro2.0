import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Plus, Package, Calendar } from 'lucide-react';
import { VendasList } from './VendasList';
import { CondicaoPagamentoList } from './CondicaoPagamentoList';
import { VendaModal } from './VendaModal';
import { CondicaoPagamentoModal } from './CondicaoPagamentoModal';

export function VendasDashboard() {
  const [activeView, setActiveView] = useState<'vendas' | 'condicoes'>('vendas');
  const [showVendaModal, setShowVendaModal] = useState(false);
  const [showCondicaoModal, setShowCondicaoModal] = useState(false);

  return (
    <div className="p-6">
      {/* Navegação */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setActiveView('vendas')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeView === 'vendas' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Package className="w-4 h-4" />
              <span>Vendas</span>
            </div>
          </button>
          
          <button
            onClick={() => setActiveView('condicoes')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeView === 'condicoes' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>Condições de Pagamento</span>
            </div>
          </button>
        </div>

        <button
          onClick={() => {
            if (activeView === 'vendas') {
              setShowVendaModal(true);
            } else {
              setShowCondicaoModal(true);
            }
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>{activeView === 'vendas' ? 'Nova Venda' : 'Nova Condição'}</span>
        </button>
      </div>

      {/* Conteúdo */}
      {activeView === 'vendas' && <VendasList />}
      {activeView === 'condicoes' && <CondicaoPagamentoList />}

      {/* Modais */}
      {showVendaModal && (
        <VendaModal onClose={() => setShowVendaModal(false)} />
      )}

      {showCondicaoModal && (
        <CondicaoPagamentoModal onClose={() => setShowCondicaoModal(false)} />
      )}
    </div>
  );
}