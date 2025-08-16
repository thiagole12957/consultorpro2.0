import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Plus, Lightbulb, DollarSign, TrendingUp, Edit2, Trash2, Target, CheckCircle, X } from 'lucide-react';
import { OportunidadeNegocio } from '../../types/consultoria';

interface OportunidadesNegocioProps {
  clienteId: string;
}

export function OportunidadesNegocio({ clienteId }: OportunidadesNegocioProps) {
  const { oportunidadesNegocio, adicionarOportunidadeNegocio, atualizarOportunidadeNegocio, excluirOportunidadeNegocio } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [oportunidadeEdit, setOportunidadeEdit] = useState<OportunidadeNegocio | null>(null);

  const oportunidadesDoCliente = oportunidadesNegocio.filter(o => o.clienteId === clienteId);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'aprovada': return 'bg-green-100 text-green-700';
      case 'proposta_enviada': return 'bg-blue-100 text-blue-700';
      case 'em_analise': return 'bg-yellow-100 text-yellow-700';
      case 'identificada': return 'bg-gray-100 text-gray-700';
      case 'rejeitada': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getProbabilidadeColor = (probabilidade: string) => {
    switch (probabilidade) {
      case 'alta': return 'bg-green-100 text-green-700';
      case 'media': return 'bg-yellow-100 text-yellow-700';
      case 'baixa': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const transformarEmAcao = (oportunidade: OportunidadeNegocio) => {
    // Lógica para transformar oportunidade em ação
    atualizarOportunidadeNegocio(oportunidade.id, {
      transformadaEmAcao: true,
      status: 'em_analise',
    });
    
    // Aqui você pode adicionar a lógica para criar uma ação automaticamente
    alert('Oportunidade transformada em ação do plano!');
  };

  const valorTotalOportunidades = oportunidadesDoCliente.reduce((sum, o) => sum + o.valorEstimado, 0);
  const oportunidadesAprovadas = oportunidadesDoCliente.filter(o => o.status === 'aprovada').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">Oportunidades de Negócio</h3>
          <p className="text-gray-600">Ideias e oportunidades identificadas</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-yellow-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-yellow-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Nova Oportunidade</span>
        </button>
      </div>

      {/* Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-yellow-500 to-yellow-600 shadow-lg">
              <Lightbulb className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 mb-1">{oportunidadesDoCliente.length}</p>
            <p className="text-sm text-gray-600">Total</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-green-500 to-green-600 shadow-lg">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 mb-1">{oportunidadesAprovadas}</p>
            <p className="text-sm text-gray-600">Aprovadas</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 mb-1">
              R$ {(valorTotalOportunidades / 1000).toFixed(0)}k
            </p>
            <p className="text-sm text-gray-600">Valor Total</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 shadow-lg">
              <Target className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 mb-1">
              {oportunidadesDoCliente.filter(o => o.transformadaEmAcao).length}
            </p>
            <p className="text-sm text-gray-600">Transformadas</p>
          </div>
        </div>
      </div>

      {/* Lista de Oportunidades */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <h4 className="text-lg font-semibold text-gray-900">Lista de Oportunidades</h4>
        </div>
        
        <div className="divide-y divide-gray-100">
          {oportunidadesDoCliente.length > 0 ? (
            oportunidadesDoCliente.map((oportunidade) => (
              <div key={oportunidade.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center text-white">
                        <Lightbulb className="w-5 h-5" />
                      </div>
                      <div>
                        <h5 className="font-semibold text-gray-900">{oportunidade.titulo}</h5>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getProbabilidadeColor(oportunidade.probabilidade)}`}>
                            {oportunidade.probabilidade} probabilidade
                          </span>
                          {oportunidade.transformadaEmAcao && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                              Transformada em Ação
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3">{oportunidade.descricao}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="w-4 h-4 text-green-600" />
                        <div>
                          <span className="text-gray-600">Valor Estimado:</span>
                          <p className="font-semibold text-green-600">
                            R$ {oportunidade.valorEstimado.toLocaleString('pt-BR')}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="w-4 h-4 text-blue-600" />
                        <div>
                          <span className="text-gray-600">Prazo Estimado:</span>
                          <p className="font-medium text-blue-600">
                            {new Date(oportunidade.prazoEstimado).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Target className="w-4 h-4 text-purple-600" />
                        <div>
                          <span className="text-gray-600">Probabilidade:</span>
                          <p className="font-medium text-purple-600 capitalize">
                            {oportunidade.probabilidade}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end space-y-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(oportunidade.status)}`}>
                      {oportunidade.status === 'identificada' ? 'Identificada' :
                       oportunidade.status === 'em_analise' ? 'Em Análise' :
                       oportunidade.status === 'proposta_enviada' ? 'Proposta Enviada' :
                       oportunidade.status === 'aprovada' ? 'Aprovada' : 'Rejeitada'}
                    </span>
                    
                    <div className="flex items-center space-x-2">
                      {!oportunidade.transformadaEmAcao && (
                        <button
                          onClick={() => transformarEmAcao(oportunidade)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Transformar em ação"
                        >
                          <Target className="w-4 h-4" />
                        </button>
                      )}
                      
                      <button
                        onClick={() => {
                          setOportunidadeEdit(oportunidade);
                          setShowModal(true);
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Editar oportunidade"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={() => {
                          if (confirm('Tem certeza que deseja excluir esta oportunidade?')) {
                            excluirOportunidadeNegocio(oportunidade.id);
                          }
                        }}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Excluir oportunidade"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center">
              <Lightbulb className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Nenhuma oportunidade registrada</h4>
              <p className="text-gray-600 mb-4">Registre ideias e oportunidades de negócio para o cliente</p>
              <button
                onClick={() => setShowModal(true)}
                className="bg-yellow-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2 hover:bg-yellow-700 transition-colors mx-auto"
              >
                <Plus className="w-5 h-5" />
                <span>Primeira Oportunidade</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal para Oportunidades */}
      {showModal && (
        <OportunidadeModal
          clienteId={clienteId}
          oportunidade={oportunidadeEdit}
          onClose={() => {
            setShowModal(false);
            setOportunidadeEdit(null);
          }}
        />
      )}
    </div>
  );
}

// Modal para Oportunidades
interface OportunidadeModalProps {
  clienteId: string;
  oportunidade?: OportunidadeNegocio | null;
  onClose: () => void;
}

function OportunidadeModal({ clienteId, oportunidade, onClose }: OportunidadeModalProps) {
  const { adicionarOportunidadeNegocio, atualizarOportunidadeNegocio } = useApp();
  const isEdit = !!oportunidade;
  
  const [formData, setFormData] = useState({
    titulo: oportunidade?.titulo || '',
    descricao: oportunidade?.descricao || '',
    valorEstimado: oportunidade?.valorEstimado || 0,
    probabilidade: oportunidade?.probabilidade || 'media',
    prazoEstimado: oportunidade?.prazoEstimado || '',
    status: oportunidade?.status || 'identificada',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEdit && oportunidade) {
      atualizarOportunidadeNegocio(oportunidade.id, {
        ...formData,
        atualizadoEm: new Date().toISOString().split('T')[0],
      });
    } else {
      const novaOportunidade: OportunidadeNegocio = {
        id: Date.now().toString(),
        clienteId,
        ...formData,
        transformadaEmAcao: false,
        criadoEm: new Date().toISOString().split('T')[0],
        atualizadoEm: new Date().toISOString().split('T')[0],
      };
      adicionarOportunidadeNegocio(novaOportunidade);
    }
    
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {isEdit ? 'Editar Oportunidade' : 'Nova Oportunidade'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Título da Oportunidade *
            </label>
            <input
              type="text"
              required
              value={formData.titulo}
              onChange={(e) => setFormData(prev => ({ ...prev, titulo: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ex: Expansão para nova filial"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descrição *
            </label>
            <textarea
              required
              value={formData.descricao}
              onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Descreva a oportunidade em detalhes..."
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Valor Estimado (R$) *
              </label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={formData.valorEstimado}
                onChange={(e) => setFormData(prev => ({ ...prev, valorEstimado: Number(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Probabilidade
              </label>
              <select
                value={formData.probabilidade}
                onChange={(e) => setFormData(prev => ({ ...prev, probabilidade: e.target.value as OportunidadeNegocio['probabilidade'] }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="baixa">Baixa (0-30%)</option>
                <option value="media">Média (30-70%)</option>
                <option value="alta">Alta (70-100%)</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prazo Estimado
              </label>
              <input
                type="date"
                value={formData.prazoEstimado}
                onChange={(e) => setFormData(prev => ({ ...prev, prazoEstimado: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as OportunidadeNegocio['status'] }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="identificada">Identificada</option>
                <option value="em_analise">Em Análise</option>
                <option value="proposta_enviada">Proposta Enviada</option>
                <option value="aprovada">Aprovada</option>
                <option value="rejeitada">Rejeitada</option>
              </select>
            </div>
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
              className="px-4 py-2 bg-gradient-to-r from-yellow-600 to-yellow-700 text-white rounded-lg hover:from-yellow-700 hover:to-yellow-800 transition-all duration-200 flex items-center space-x-2"
            >
              <Lightbulb className="w-4 h-4" />
              <span>{isEdit ? 'Salvar Oportunidade' : 'Criar Oportunidade'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}