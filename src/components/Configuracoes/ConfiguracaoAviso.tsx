import React from 'react';
import { AlertTriangle, Settings, ArrowRight } from 'lucide-react';

interface ConfiguracaoAvisoProps {
  onAbrirConfiguracoes: () => void;
}

export function ConfiguracaoAviso({ onAbrirConfiguracoes }: ConfiguracaoAvisoProps) {
  return (
    <div className="fixed top-4 right-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4 shadow-lg z-50 max-w-sm">
      <div className="flex items-start space-x-3">
        <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h4 className="font-medium text-yellow-900 mb-1">Configuração Necessária</h4>
          <p className="text-sm text-yellow-800 mb-3">
            Configure o Supabase e OpenAI para usar todas as funcionalidades do sistema.
          </p>
          <button
            onClick={onAbrirConfiguracoes}
            className="bg-yellow-600 text-white px-3 py-2 rounded-lg hover:bg-yellow-700 transition-colors flex items-center space-x-2 text-sm"
          >
            <Settings className="w-4 h-4" />
            <span>Configurar Agora</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}