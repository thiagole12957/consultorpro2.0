import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Plus, Edit2, Trash2, CheckCircle, Clock, AlertTriangle, User, Calendar, Target, X } from 'lucide-react';
import { AcaoConsultoria } from '../../types/consultoria';

// Função utilitária para determinar a cor da prioridade baseada no impacto e esforço
const getPrioridadeColor = (impacto: string, esforco: string) => {
  if (impacto === 'alto' && esforco === 'baixo') return 'bg-green-100 text-green-700 border-green-300';
  if (impacto === 'alto' && esforco === 'alto') return 'bg-blue-100 text-blue-700 border-blue-300';
  if (impacto === 'baixo' && esforco === 'baixo') return 'bg-yellow-100 text-yellow-700 border-yellow-300';
  return 'bg-gray-100 text-gray-700 border-gray-300';
};

interface PlanoAcaoViewProps {
  clienteId: string;
  mesAno: string;
}

export function PlanoAcaoView({ clienteId, mesAno }: PlanoAcaoViewProps) {
  const { acoesConsultoria, adicionarAcaoConsultoria, atualizarAcaoConsultoria, excluirAcaoConsultoria, diagnosticosMensais, metasMensais } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [acaoEdit, setAcaoEdit] = useState<AcaoConsultoria | null>(null);

  const acoesDoMes = acoesConsultoria.filter(a => 
    a.consultoriaMensalId && a.consultoriaMensalId.includes(mesAno)
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'concluido': return 'bg-green-100 text-green-700';
      case 'em_andamento': return 'bg-blue-100 text-blue-700';
      case 'atrasado': return 'bg-red-100 text-red-700';
      case 'nao_iniciado': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'concluido': return <CheckCircle className="w-4 h-4" />;
      case 'em_andamento': return <Clock className="w-4 h-4" />;
      case 'atrasado': return <AlertTriangle className="w-4 h-4" />;
      case 'nao_iniciado': return <Target className="w-4 h-4" />;
      default: return <Target className="w-4 h-4" />;
    }
  };

  const isAtrasada = (prazo: string) => {
    return new Date(prazo) < new Date() && prazo !== '';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">Plano de Ação</h3>
          <p className="text-gray-600">Ações estratégicas para {mesAno}</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Nova Ação</span>
        </button>
      </div>

      {/* Resumo das Ações */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-green-500 to-green-600 shadow-lg">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 mb-1">
              {acoesDoMes.filter(a => a.status === 'concluido').length}
            </p>
            <p className="text-sm text-gray-600">Concluídas</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg">
              <Clock className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 mb-1">
              {acoesDoMes.filter(a => a.status === 'em_andamento').length}
            </p>
            <p className="text-sm text-gray-600">Em Andamento</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-red-500 to-red-600 shadow-lg">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 mb-1">
              {acoesDoMes.filter(a => a.status === 'atrasado' || isAtrasada(a.prazo)).length}
            </p>
            <p className="text-sm text-gray-600">Atrasadas</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-gray-500 to-gray-600 shadow-lg">
              <Target className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 mb-1">{acoesDoMes.length}</p>
            <p className="text-sm text-gray-600">Total de Ações</p>
          </div>
        </div>
      </div>

      {/* Lista de Ações */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <h4 className="text-lg font-semibold text-gray-900">Ações do Período</h4>
        </div>
        
        <div className="divide-y divide-gray-100">
          {acoesDoMes.length > 0 ? (
            acoesDoMes.map((acao) => (
              <div key={acao.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className={`p-2 rounded-lg ${getStatusColor(acao.status).replace('text-', 'text-white bg-').split(' ')[1]}`}>
                        {getStatusIcon(acao.status)}
                      </div>
                      <div>
                        <h5 className="font-semibold text-gray-900">{acao.descricao}</h5>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`px-2 py-1 rounded border ${getPrioridadeColor(acao.impacto, acao.esforco)}`}>
                            {acao.impacto} impacto • {acao.esforco} esforço
                          </span>
                          <span className="text-xs text-gray-500 capitalize">
                            {acao.quadrante.replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-gray-600">Resp. Cliente:</p>
                          <p className="font-medium text-gray-900">{acao.responsavelCliente}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-blue-400" />
                        <div>
                          <p className="text-gray-600">Resp. Consultoria:</p>
                          <p className="font-medium text-blue-900">{acao.responsavelConsultoria}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-gray-600">Prazo:</p>
                          <p className={`font-medium ${
                            isAtrasada(acao.prazo) ? 'text-red-600' : 'text-gray-900'
                          }`}>
                            {acao.prazo ? new Date(acao.prazo).toLocaleDateString('pt-BR') : 'Não definido'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {acao.observacoes && (
                      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-700">{acao.observacoes}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(acao.status)}`}>
                      {acao.status === 'concluido' ? 'Concluída' :
                       acao.status === 'em_andamento' ? 'Em Andamento' :
                       acao.status === 'atrasado' ? 'Atrasada' : 'Não Iniciada'}
                    </span>
                    
                    <button
                      onClick={() => {
                        setAcaoEdit(acao);
                        setShowModal(true);
                      }}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    
                    <button
                      onClick={() => {
                        if (confirm('Tem certeza que deseja excluir esta ação?')) {
                          excluirAcaoConsultoria(acao.id);
                        }
                      }}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center">
              <Target className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Nenhuma ação definida</h4>
              <p className="text-gray-600 mb-4">Crie ações baseadas no diagnóstico realizado</p>
              <button
                onClick={() => setShowModal(true)}
                className="bg-green-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2 hover:bg-green-700 transition-colors mx-auto"
              >
                <Plus className="w-5 h-5" />
                <span>Primeira Ação</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal para Ações */}
      {showModal && (
        <AcaoConsultoriaModal
          clienteId={clienteId}
          mesAno={mesAno}
          acao={acaoEdit}
          onClose={() => {
            setShowModal(false);
            setAcaoEdit(null);
          }}
        />
      )}
    </div>
  );
}

// Modal para Ações
interface AcaoConsultoriaModalProps {
  clienteId: string;
  mesAno: string;
  acao?: AcaoConsultoria | null;
  onClose: () => void;
}

function AcaoConsultoriaModal({ clienteId, mesAno, acao, onClose }: AcaoConsultoriaModalProps) {
  const { adicionarAcaoConsultoria, atualizarAcaoConsultoria, diagnosticosMensais, metasMensais } = useApp();
  const isEdit = !!acao;
  
  const [formData, setFormData] = useState({
    descricao: acao?.descricao || '',
    responsavelCliente: acao?.responsavelCliente || '',
    responsavelConsultoria: acao?.responsavelConsultoria || '',
    prazo: acao?.prazo || '',
    status: acao?.status || 'nao_iniciado',
    impacto: acao?.impacto || 'medio',
    esforco: acao?.esforco || 'medio',
    diagnosticoId: acao?.diagnosticoId || '',
    metaId: acao?.metaId || '',
    observacoes: acao?.observacoes || '',
  });

  const calcularQuadrante = (impacto: string, esforco: string): AcaoConsultoria['quadrante'] => {
    if (impacto === 'alto' && esforco === 'baixo') return 'quick_wins';
    if (impacto === 'alto' && esforco === 'alto') return 'projetos';
    if (impacto === 'baixo' && esforco === 'baixo') return 'fill_ins';
    return 'thankless';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const quadrante = calcularQuadrante(formData.impacto, formData.esforco);
    
    if (isEdit && acao) {
      atualizarAcaoConsultoria(acao.id, {
        ...formData,
        quadrante,
        atualizadoEm: new Date().toISOString().split('T')[0],
      });
    } else {
      const novaAcao: AcaoConsultoria = {
        id: Date.now().toString(),
        consultoriaMensalId: `${clienteId}-${mesAno}`,
        ...formData,
        quadrante,
        criadoEm: new Date().toISOString().split('T')[0],
        atualizadoEm: new Date().toISOString().split('T')[0],
      };
      adicionarAcaoConsultoria(novaAcao);
    }
    
    onClose();
  };

  const diagnosticosDisponiveis = diagnosticosMensais.filter(d => 
    d.consultoriaMensalId && d.consultoriaMensalId.includes(mesAno)
  );

  const metasDisponiveis = metasMensais.filter(m => 
    m.consultoriaMensalId && m.consultoriaMensalId.includes(mesAno)
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {isEdit ? 'Editar Ação' : 'Nova Ação do Plano'}
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
              Descrição da Ação *
            </label>
            <textarea
              required
              value={formData.descricao}
              onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Descreva a ação a ser executada..."
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Responsável (Cliente) *
              </label>
              <input
                type="text"
                required
                value={formData.responsavelCliente}
                onChange={(e) => setFormData(prev => ({ ...prev, responsavelCliente: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nome do responsável no cliente"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Responsável (Consultoria) *
              </label>
              <input
                type="text"
                required
                value={formData.responsavelConsultoria}
                onChange={(e) => setFormData(prev => ({ ...prev, responsavelConsultoria: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nome do consultor responsável"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prazo
              </label>
              <input
                type="date"
                value={formData.prazo}
                onChange={(e) => setFormData(prev => ({ ...prev, prazo: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as AcaoConsultoria['status'] }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="nao_iniciado">Não Iniciado</option>
                <option value="em_andamento">Em Andamento</option>
                <option value="concluido">Concluído</option>
                <option value="atrasado">Atrasado</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Impacto
              </label>
              <select
                value={formData.impacto}
                onChange={(e) => setFormData(prev => ({ ...prev, impacto: e.target.value as AcaoConsultoria['impacto'] }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="baixo">Baixo</option>
                <option value="medio">Médio</option>
                <option value="alto">Alto</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Esforço
              </label>
              <select
                value={formData.esforco}
                onChange={(e) => setFormData(prev => ({ ...prev, esforco: e.target.value as AcaoConsultoria['esforco'] }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="baixo">Baixo</option>
                <option value="medio">Médio</option>
                <option value="alto">Alto</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vinculado ao Diagnóstico
              </label>
              <select
                value={formData.diagnosticoId}
                onChange={(e) => setFormData(prev => ({ ...prev, diagnosticoId: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Não vinculado</option>
                {diagnosticosDisponiveis.map(diagnostico => (
                  <option key={diagnostico.id} value={diagnostico.id}>
                    Diagnóstico {diagnostico.criadoEm}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vinculado à Meta
              </label>
              <select
                value={formData.metaId}
                onChange={(e) => setFormData(prev => ({ ...prev, metaId: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Não vinculado</option>
                {metasDisponiveis.map(meta => (
                  <option key={meta.id} value={meta.id}>
                    {meta.descricao}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Observações
            </label>
            <textarea
              value={formData.observacoes}
              onChange={(e) => setFormData(prev => ({ ...prev, observacoes: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Observações adicionais sobre a ação..."
            />
          </div>
          
          {/* Preview do Quadrante */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm font-medium text-gray-700 mb-2">Quadrante da Matriz:</p>
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              getPrioridadeColor(formData.impacto, formData.esforco)
            }`}>
              {calcularQuadrante(formData.impacto, formData.esforco) === 'quick_wins' ? '🚀 Quick Wins' :
               calcularQuadrante(formData.impacto, formData.esforco) === 'projetos' ? '📋 Projetos' :
               calcularQuadrante(formData.impacto, formData.esforco) === 'fill_ins' ? '⚡ Fill Ins' :
               '❌ Thankless'}
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
              className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 flex items-center space-x-2"
            >
              <Target className="w-4 h-4" />
              <span>{isEdit ? 'Salvar Ação' : 'Criar Ação'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}