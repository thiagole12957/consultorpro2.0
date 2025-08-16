import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Edit2, Eye, FileText, Copy, Download, Settings, Code, Users } from 'lucide-react';
import { ModeloContratoModal } from './ModeloContratoModal';

export function ModeloContratoList() {
  const { modelosContrato } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [modeloEdit, setModeloEdit] = useState(null);

  const getCategoriaColor = (categoria: string) => {
    switch (categoria) {
      case 'consultoria': return 'bg-blue-100 text-blue-700';
      case 'software': return 'bg-purple-100 text-purple-700';
      case 'suporte': return 'bg-green-100 text-green-700';
      case 'misto': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handleEditModelo = (modelo: any) => {
    setModeloEdit(modelo);
    setShowModal(true);
  };

  const duplicarModelo = (modelo: any) => {
    if (confirm('Deseja duplicar este modelo de contrato?')) {
      // Lógica para duplicar modelo
      console.log('Duplicando modelo:', modelo.id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 mb-1">{modelosContrato.length}</p>
            <p className="text-sm text-gray-600">Total de Modelos</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-green-500 to-green-600 shadow-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 mb-1">
              {modelosContrato.filter(m => m.ativo).length}
            </p>
            <p className="text-sm text-gray-600">Modelos Ativos</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 shadow-lg">
              <Code className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 mb-1">
              {modelosContrato.reduce((acc, m) => acc + m.variaveis.length, 0)}
            </p>
            <p className="text-sm text-gray-600">Total de Variáveis</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg">
              <Settings className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 mb-1">
              {modelosContrato.reduce((acc, m) => acc + m.clausulas.length, 0)}
            </p>
            <p className="text-sm text-gray-600">Total de Cláusulas</p>
          </div>
        </div>
      </div>

      {/* Lista de Modelos */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Modelo</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Categoria</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Variáveis</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Cláusulas</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Configurações</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Status</th>
                <th className="text-right py-4 px-6 font-semibold text-gray-900">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {modelosContrato.length > 0 ? (
                modelosContrato.map((modelo) => (
                  <tr key={modelo.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{modelo.nome}</p>
                          <p className="text-sm text-gray-500">
                            {modelo.conteudo.length > 100 ? 
                              `${modelo.conteudo.substring(0, 100)}...` : 
                              modelo.conteudo}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoriaColor(modelo.categoria)}`}>
                        {modelo.categoria === 'consultoria' ? 'Consultoria' :
                         modelo.categoria === 'software' ? 'Software' :
                         modelo.categoria === 'suporte' ? 'Suporte' : 'Misto'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <Code className="w-4 h-4 text-blue-600" />
                        <span className="font-medium text-gray-900">{modelo.variaveis.length}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <Settings className="w-4 h-4 text-green-600" />
                        <span className="font-medium text-gray-900">{modelo.clausulas.length}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex space-x-1">
                        {modelo.configuracoes.assinaturaDigital && (
                          <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">Digital</span>
                        )}
                        {modelo.configuracoes.versionamento && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">Versão</span>
                        )}
                        {modelo.configuracoes.aprovacaoObrigatoria && (
                          <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs">Aprovação</span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        modelo.ativo ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {modelo.ativo ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => duplicarModelo(modelo)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Duplicar modelo"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                          title="Download PDF"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Ver detalhes"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEditModelo(modelo)}
                          className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                          title="Editar modelo"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-500">
                    <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>Nenhum modelo de contrato encontrado</p>
                    <p className="text-sm mt-2">Crie modelos para agilizar a criação de contratos</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <ModeloContratoModal
          modelo={modeloEdit}
          onClose={() => {
            setShowModal(false);
            setModeloEdit(null);
          }}
        />
      )}
    </div>
  );
}