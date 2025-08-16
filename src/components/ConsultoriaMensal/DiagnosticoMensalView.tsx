import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Plus, Edit2, AlertTriangle, CheckCircle, TrendingUp, Lightbulb, Target, Eye, X, Trash2 } from 'lucide-react';
import { DiagnosticoMensal } from '../../types/consultoria';

interface DiagnosticoMensalViewProps {
  clienteId: string;
  mesAno: string;
}

export function DiagnosticoMensalView({ clienteId, mesAno }: DiagnosticoMensalViewProps) {
  const { diagnosticosMensais, adicionarDiagnosticoMensal, atualizarDiagnosticoMensal } = useApp();
  const [showModal, setShowModal] = useState(false);

  const diagnosticoAtual = diagnosticosMensais.find(d => 
    d.consultoriaMensalId && d.consultoriaMensalId.includes(mesAno)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">Diagnóstico Mensal</h3>
          <p className="text-gray-600">Análise SWOT e insights para {mesAno}</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-orange-700 transition-colors"
        >
          {diagnosticoAtual ? <Edit2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          <span>{diagnosticoAtual ? 'Editar Diagnóstico' : 'Criar Diagnóstico'}</span>
        </button>
      </div>

      {diagnosticoAtual ? (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pontos Fortes */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 rounded-lg bg-green-100">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900">Pontos Fortes</h4>
              </div>
              <div className="space-y-2">
                {diagnosticoAtual.pontosFortes.map((ponto, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm text-gray-700">{ponto}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Pontos Fracos */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 rounded-lg bg-red-100">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900">Pontos Fracos</h4>
              </div>
              <div className="space-y-2">
                {diagnosticoAtual.pontosFracos.map((ponto, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm text-gray-700">{ponto}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Oportunidades */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 rounded-lg bg-blue-100">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900">Oportunidades</h4>
              </div>
              <div className="space-y-2">
                {diagnosticoAtual.oportunidades.map((oportunidade, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm text-gray-700">{oportunidade}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Ameaças */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 rounded-lg bg-yellow-100">
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900">Ameaças</h4>
              </div>
              <div className="space-y-2">
                {diagnosticoAtual.ameacas.map((ameaca, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm text-gray-700">{ameaca}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Problemas Detectados */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 rounded-lg bg-red-100">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900">Problemas Detectados</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {diagnosticoAtual.problemasDetectados.map((problema, index) => (
                <div key={index} className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-red-800">{problema}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Insights de Melhoria */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 rounded-lg bg-purple-100">
                <Lightbulb className="w-5 h-5 text-purple-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900">Insights de Melhoria</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {diagnosticoAtual.insightsMelhoria.map((insight, index) => (
                <div key={index} className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <Lightbulb className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-purple-800">{insight}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="bg-white rounded-xl p-8 text-center">
          <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h4 className="text-lg font-semibold text-gray-900 mb-2">Diagnóstico não realizado</h4>
          <p className="text-gray-600 mb-4">Crie um diagnóstico SWOT para este período</p>
          <button
            onClick={() => setShowModal(true)}
            className="bg-orange-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2 hover:bg-orange-700 transition-colors mx-auto"
          >
            <Plus className="w-5 h-5" />
            <span>Criar Diagnóstico</span>
          </button>
        </div>
      )}

      {/* Modal para Diagnóstico */}
      {showModal && (
        <DiagnosticoModal
          clienteId={clienteId}
          mesAno={mesAno}
          diagnostico={diagnosticoAtual}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}

// Modal para Diagnóstico
interface DiagnosticoModalProps {
  clienteId: string;
  mesAno: string;
  diagnostico?: DiagnosticoMensal | null;
  onClose: () => void;
}

function DiagnosticoModal({ clienteId, mesAno, diagnostico, onClose }: DiagnosticoModalProps) {
  const { adicionarDiagnosticoMensal, atualizarDiagnosticoMensal } = useApp();
  const isEdit = !!diagnostico;
  
  const [formData, setFormData] = useState({
    pontosFortes: diagnostico?.pontosFortes || [''],
    pontosFracos: diagnostico?.pontosFracos || [''],
    oportunidades: diagnostico?.oportunidades || [''],
    ameacas: diagnostico?.ameacas || [''],
    problemasDetectados: diagnostico?.problemasDetectados || [''],
    insightsMelhoria: diagnostico?.insightsMelhoria || [''],
  });

  const adicionarItem = (campo: keyof typeof formData) => {
    setFormData(prev => ({
      ...prev,
      [campo]: [...prev[campo], '']
    }));
  };

  const removerItem = (campo: keyof typeof formData, index: number) => {
    setFormData(prev => ({
      ...prev,
      [campo]: prev[campo].filter((_, i) => i !== index)
    }));
  };

  const atualizarItem = (campo: keyof typeof formData, index: number, valor: string) => {
    setFormData(prev => ({
      ...prev,
      [campo]: prev[campo].map((item, i) => i === index ? valor : item)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Filtrar itens vazios
    const dadosLimpos = {
      pontosFortes: formData.pontosFortes.filter(item => item.trim() !== ''),
      pontosFracos: formData.pontosFracos.filter(item => item.trim() !== ''),
      oportunidades: formData.oportunidades.filter(item => item.trim() !== ''),
      ameacas: formData.ameacas.filter(item => item.trim() !== ''),
      problemasDetectados: formData.problemasDetectados.filter(item => item.trim() !== ''),
      insightsMelhoria: formData.insightsMelhoria.filter(item => item.trim() !== ''),
    };
    
    if (isEdit && diagnostico) {
      atualizarDiagnosticoMensal(diagnostico.id, {
        ...dadosLimpos,
        atualizadoEm: new Date().toISOString().split('T')[0],
      });
    } else {
      const novoDiagnostico: DiagnosticoMensal = {
        id: Date.now().toString(),
        consultoriaMensalId: `${clienteId}-${mesAno}`,
        ...dadosLimpos,
        criadoEm: new Date().toISOString().split('T')[0],
        atualizadoEm: new Date().toISOString().split('T')[0],
      };
      adicionarDiagnosticoMensal(novoDiagnostico);
    }
    
    onClose();
  };

  const renderSecao = (
    titulo: string,
    campo: keyof typeof formData,
    icon: React.ReactNode,
    cor: string
  ) => (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {icon}
          <h4 className="font-medium text-gray-900">{titulo}</h4>
        </div>
        <button
          type="button"
          onClick={() => adicionarItem(campo)}
          className={`text-sm ${cor} hover:underline`}
        >
          + Adicionar
        </button>
      </div>
      
      <div className="space-y-2">
        {formData[campo].map((item, index) => (
          <div key={index} className="flex items-center space-x-2">
            <input
              type="text"
              value={item}
              onChange={(e) => atualizarItem(campo, index, e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              placeholder={`Digite um item para ${titulo.toLowerCase()}`}
            />
            <button
              type="button"
              onClick={() => removerItem(campo, index)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              disabled={formData[campo].length === 1}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                {isEdit ? 'Editar Diagnóstico' : 'Novo Diagnóstico SWOT'}
              </h2>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {renderSecao(
                  'Pontos Fortes',
                  'pontosFortes',
                  <CheckCircle className="w-5 h-5 text-green-600" />,
                  'text-green-600'
                )}
                
                {renderSecao(
                  'Pontos Fracos',
                  'pontosFracos',
                  <AlertTriangle className="w-5 h-5 text-red-600" />,
                  'text-red-600'
                )}
                
                {renderSecao(
                  'Oportunidades',
                  'oportunidades',
                  <TrendingUp className="w-5 h-5 text-blue-600" />,
                  'text-blue-600'
                )}
                
                {renderSecao(
                  'Ameaças',
                  'ameacas',
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />,
                  'text-yellow-600'
                )}
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {renderSecao(
                  'Problemas Detectados',
                  'problemasDetectados',
                  <AlertTriangle className="w-5 h-5 text-red-600" />,
                  'text-red-600'
                )}
                
                {renderSecao(
                  'Insights de Melhoria',
                  'insightsMelhoria',
                  <Lightbulb className="w-5 h-5 text-purple-600" />,
                  'text-purple-600'
                )}
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg hover:from-orange-700 hover:to-orange-800 transition-all duration-200 flex items-center space-x-2"
                >
                  <Target className="w-4 h-4" />
                  <span>{isEdit ? 'Salvar Diagnóstico' : 'Criar Diagnóstico'}</span>
                </button>
              </div>
            </form>
          </div>
     </div>
  );
}