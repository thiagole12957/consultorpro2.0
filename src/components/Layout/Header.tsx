import React from 'react';
import { Plus, Menu, ArrowLeft } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

interface HeaderProps {
  title: string;
  subtitle: string;
  onAddClick?: () => void;
  onMenuClick: () => void;
}

export function Header({ title, subtitle, onAddClick, onMenuClick }: HeaderProps) {
  const { clienteSelecionado, setClienteSelecionado, empresaSelecionada, setEmpresaSelecionada, filialAtiva } = useApp();

  const handleBackClick = () => {
    if (clienteSelecionado) {
      setClienteSelecionado(null);
    } else if (empresaSelecionada) {
      setEmpresaSelecionada(null);
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Menu button para mobile */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Botão voltar quando cliente selecionado */}
          {(clienteSelecionado || empresaSelecionada) && (
            <button
              onClick={handleBackClick}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium">Voltar</span>
            </button>
          )}

          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{title}</h1>
            {subtitle && (
              <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
            )}
            {filialAtiva && (
              <p className="text-xs text-blue-600 mt-1">
                {filialAtiva.nome} {filialAtiva.isMatriz ? '(Matriz)' : ''}
              </p>
            )}
          </div>
        </div>

        {/* Botão de adicionar */}
        {onAddClick && (
          <button
            onClick={onAddClick}
            className="bg-blue-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors text-sm sm:text-base"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Adicionar</span>
          </button>
        )}
      </div>
    </header>
  );
}