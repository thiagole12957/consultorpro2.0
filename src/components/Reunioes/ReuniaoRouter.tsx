import React from 'react';
import { useParams } from 'react-router-dom';
import { ReuniaoPublica } from './ReuniaoPublica';

export function ReuniaoRouter() {
  const { reuniaoId } = useParams<{ reuniaoId: string }>();

  if (!reuniaoId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-red-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 text-center max-w-md w-full">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Link Inválido</h2>
          <p className="text-gray-600 mb-4">O link da reunião não é válido</p>
          <button
            onClick={() => window.location.href = '/'}
            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
          >
            Voltar ao Sistema
          </button>
        </div>
      </div>
    );
  }

  return <ReuniaoPublica reuniaoId={reuniaoId} />;
}