import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Plus, FileText, Eye, Edit2, Download, CheckCircle, Clock, AlertTriangle, GitBranch, X, Trash2 } from 'lucide-react';
import { ProcessoCliente } from '../../types/consultoria';

interface DocumentacaoProcessosProps {
  clienteId: string;
}

export function DocumentacaoProcessos({ clienteId }: DocumentacaoProcessosProps) {
  const { processosCliente, adicionarProcessoCliente, atualizarProcessoCliente } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [processoEdit, setProcessoEdit] = useState<ProcessoCliente | null>(null);
  const [showFluxograma, setShowFluxograma] = useState<string | null>(null);

  const processosDoCliente = processosCliente.filter(p => p.clienteId === clienteId);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'aprovado': return 'bg-green-100 text-green-700';
      case 'pendente_aprovacao': return 'bg-yellow-100 text-yellow-700';
      case 'rascunho': return 'bg-gray-100 text-gray-700';
      case 'reprovado': return 'bg-red-100 text-red-700';
      case 'obsoleto': return 'bg-gray-100 text-gray-500';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getAreaColor = (area: string) => {
    const cores = {
      'Comercial': 'bg-blue-100 text-blue-700',
      'Suporte': 'bg-green-100 text-green-700',
      'Financeiro': 'bg-yellow-100 text-yellow-700',
      'Operacional': 'bg-purple-100 text-purple-700',
      'RH': 'bg-pink-100 text-pink-700',
      'TI': 'bg-cyan-100 text-cyan-700',
    };
    return cores[area as keyof typeof cores] || 'bg-gray-100 text-gray-700';
  };

  const gerarFluxograma = (processo: ProcessoCliente) => {
    // Simulação de geração de fluxograma
    return `
      digraph "${processo.nome}" {
        rankdir=TB;
        node [shape=box, style=rounded];
        
        inicio [label="Início", shape=ellipse, style=filled, fillcolor=lightgreen];
        etapa1 [label="Etapa 1\\nResponsável: João"];
        etapa2 [label="Etapa 2\\nResponsável: Maria"];
        fim [label="Fim", shape=ellipse, style=filled, fillcolor=lightcoral];
        
        inicio -> etapa1;
        etapa1 -> etapa2 [label="Aprovado?"];
        etapa2 -> fim;
      }
    `;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">Documentação de Processos</h3>
          <p className="text-gray-600">Processos automatizados do cliente</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-purple-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Processo</span>
        </button>
      </div>

      {/* Resumo por Área */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {['Comercial', 'Suporte', 'Financeiro', 'Operacional', 'RH', 'TI'].map((area) => {
          const count = processosDoCliente.filter(p => p.area === area).length;
          const aprovados = processosDoCliente.filter(p => p.area === area && p.status === 'aprovado').length;
          
          return (
            <div key={area} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${getAreaColor(area).replace('text-', 'text-white bg-').split(' ')[1]}`}>
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAreaColor(area)}`}>
                  {area}
                </span>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 mb-1">{count}</p>
                <p className="text-sm text-gray-600">Processos</p>
                <p className="text-xs text-green-600 mt-1">{aprovados} aprovados</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Lista de Processos */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <h4 className="text-lg font-semibold text-gray-900">Processos Documentados</h4>
        </div>
        
        <div className="divide-y divide-gray-100">
          {processosDoCliente.length > 0 ? (
            processosDoCliente.map((processo) => (
              <div key={processo.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className={`p-2 rounded-lg ${getAreaColor(processo.area).replace('text-', 'text-white bg-').split(' ')[1]}`}>
                        <FileText className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h5 className="font-semibold text-gray-900">{processo.nome}</h5>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAreaColor(processo.area)}`}>
                            {processo.area}
                          </span>
                          <span className="text-xs text-gray-500">v{processo.versao}</span>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3">{processo.objetivo}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Escopo:</p>
                        <p className="text-gray-900">{processo.escopo}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Indicadores:</p>
                        <p className="text-gray-900">{processo.indicadores.length} definidos</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end space-y-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(processo.status)}`}>
                      {processo.status === 'aprovado' ? 'Aprovado' :
                       processo.status === 'pendente_aprovacao' ? 'Pendente' :
                       processo.status === 'rascunho' ? 'Rascunho' :
                       processo.status === 'reprovado' ? 'Reprovado' : 'Obsoleto'}
                    </span>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setShowFluxograma(processo.id)}
                        className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                        title="Ver fluxograma"
                      >
                        <GitBranch className="w-4 h-4" />
                      </button>
                      
                      <button
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Exportar PDF"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={() => {
                          setProcessoEdit(processo);
                          setShowModal(true);
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Editar processo"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Termos do Processo */}
                {processo.termos.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h6 className="font-medium text-gray-700 mb-2">Termos Importantes:</h6>
                    <div className="flex flex-wrap gap-2">
                      {processo.termos.slice(0, 5).map((termo, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                          {termo}
                        </span>
                      ))}
                      {processo.termos.length > 5 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                          +{processo.termos.length - 5} mais
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="p-8 text-center">
              <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Nenhum processo documentado</h4>
              <p className="text-gray-600 mb-4">Inicie a documentação dos processos do cliente</p>
              <button
                onClick={() => setShowModal(true)}
                className="bg-purple-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2 hover:bg-purple-700 transition-colors mx-auto"
              >
                <Plus className="w-5 h-5" />
                <span>Primeiro Processo</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Fluxograma */}
      {showFluxograma && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Fluxograma do Processo</h2>
              <button
                onClick={() => setShowFluxograma(null)}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <GitBranch className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Fluxograma</h3>
                <p className="text-gray-600 mb-4">Visualização do processo será gerada aqui</p>
                <div className="bg-white p-4 rounded border-2 border-dashed border-gray-300">
                  <pre className="text-xs text-gray-600 text-left">
                    {gerarFluxograma(processosDoCliente.find(p => p.id === showFluxograma)!)}
                  </pre>
                </div>
                <div className="flex justify-center space-x-3 mt-4">
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    <Download className="w-4 h-4 inline mr-2" />
                    Download PNG
                  </button>
                  <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                    <FileText className="w-4 h-4 inline mr-2" />
                    Exportar POP
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal para Processos */}
      {showModal && (
        <ProcessoModal
          clienteId={clienteId}
          processo={processoEdit}
          onClose={() => {
            setShowModal(false);
            setProcessoEdit(null);
          }}
        />
      )}
    </div>
  );
}

// Modal para Processos
interface ProcessoModalProps {
  clienteId: string;
  processo?: ProcessoCliente | null;
  onClose: () => void;
}

function ProcessoModal({ clienteId, processo, onClose }: ProcessoModalProps) {
  const { adicionarProcessoCliente, atualizarProcessoCliente } = useApp();
  const isEdit = !!processo;
  
  const [formData, setFormData] = useState({
    nome: processo?.nome || '',
    area: processo?.area || 'Comercial',
    versao: processo?.versao || '1.0',
    objetivo: processo?.objetivo || '',
    escopo: processo?.escopo || '',
    termos: processo?.termos || [''],
    status: processo?.status || 'rascunho',
  });

  const [indicadores, setIndicadores] = useState(processo?.indicadores || []);

  const adicionarTermo = () => {
    setFormData(prev => ({
      ...prev,
      termos: [...prev.termos, '']
    }));
  };

  const removerTermo = (index: number) => {
    setFormData(prev => ({
      ...prev,
      termos: prev.termos.filter((_, i) => i !== index)
    }));
  };

  const atualizarTermo = (index: number, valor: string) => {
    setFormData(prev => ({
      ...prev,
      termos: prev.termos.map((termo, i) => i === index ? valor : termo)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const termosLimpos = formData.termos.filter(termo => termo.trim() !== '');
    
    if (isEdit && processo) {
      atualizarProcessoCliente(processo.id, {
        ...formData,
        termos: termosLimpos,
        indicadores,
        atualizadoEm: new Date().toISOString().split('T')[0],
      });
    } else {
      const novoProcesso: ProcessoCliente = {
        id: Date.now().toString(),
        clienteId,
        ...formData,
        termos: termosLimpos,
        indicadores,
        criadoEm: new Date().toISOString().split('T')[0],
        atualizadoEm: new Date().toISOString().split('T')[0],
      };
      adicionarProcessoCliente(novoProcesso);
    }
    
    onClose();
  };

  const areas = ['Comercial', 'Suporte', 'Financeiro', 'Operacional', 'RH', 'TI'];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {isEdit ? 'Editar Processo' : 'Novo Processo'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Informações Básicas */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Informações Básicas</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome do Processo *
                </label>
                <input
                  type="text"
                  required
                  value={formData.nome}
                  onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Área *
                </label>
                <select
                  required
                  value={formData.area}
                  onChange={(e) => setFormData(prev => ({ ...prev, area: e.target.value as ProcessoCliente['area'] }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {areas.map(area => (
                    <option key={area} value={area}>{area}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Versão
                </label>
                <input
                  type="text"
                  value={formData.versao}
                  onChange={(e) => setFormData(prev => ({ ...prev, versao: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="1.0"
                />
              </div>
            </div>
          </div>

          {/* Objetivo e Escopo */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Objetivo *
              </label>
              <textarea
                required
                value={formData.objetivo}
                onChange={(e) => setFormData(prev => ({ ...prev, objetivo: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Escopo *
              </label>
              <textarea
                required
                value={formData.escopo}
                onChange={(e) => setFormData(prev => ({ ...prev, escopo: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Termos */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700">
                Termos Importantes
              </label>
              <button
                type="button"
                onClick={adicionarTermo}
                className="text-blue-600 hover:text-blue-700 text-sm"
              >
                + Adicionar Termo
              </button>
            </div>
            
            <div className="space-y-2">
              {formData.termos.map((termo, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={termo}
                    onChange={(e) => atualizarTermo(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="Digite um termo importante"
                  />
                  <button
                    type="button"
                    onClick={() => removerTermo(index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    disabled={formData.termos.length === 1}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as ProcessoCliente['status'] }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="rascunho">Rascunho</option>
              <option value="pendente_aprovacao">Pendente de Aprovação</option>
              <option value="aprovado">Aprovado</option>
              <option value="reprovado">Reprovado</option>
              <option value="obsoleto">Obsoleto</option>
            </select>
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
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-200 flex items-center space-x-2"
            >
              <FileText className="w-4 h-4" />
              <span>{isEdit ? 'Salvar Processo' : 'Criar Processo'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}