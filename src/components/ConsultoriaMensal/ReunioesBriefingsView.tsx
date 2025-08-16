import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Plus, Calendar, Users, FileText, Video, Upload, Download, Eye, X, Trash2 } from 'lucide-react';

interface ReunioesBriefingsViewProps {
  clienteId: string;
  mesAno: string;
}

export function ReunioesBriefingsView({ clienteId, mesAno }: ReunioesBriefingsViewProps) {
  const { reunioes, briefingsReuniao } = useApp();
  const [showBriefingModal, setShowBriefingModal] = useState(false);
  const [reuniaoSelecionada, setReuniaoSelecionada] = useState<string>('');

  // Filtrar reuniões do cliente no período
  const reunioesDoMes = reunioes.filter(r => {
    if (r.clienteId !== clienteId) return false;
    const reuniaoMes = new Date(r.dataHoraInicio).toISOString().slice(0, 7);
    return reuniaoMes === mesAno;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'realizada': return 'bg-green-100 text-green-700';
      case 'agendada': return 'bg-blue-100 text-blue-700';
      case 'cancelada': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">Reuniões & Briefings</h3>
          <p className="text-gray-600">Reuniões e documentação para {mesAno}</p>
        </div>
        <div className="flex space-x-3">
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-700 transition-colors">
            <Video className="w-4 h-4" />
            <span>Nova Reunião</span>
          </button>
          <button
            onClick={() => setShowBriefingModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
          >
            <FileText className="w-4 h-4" />
            <span>Novo Briefing</span>
          </button>
        </div>
      </div>

      {/* Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg">
              <Calendar className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 mb-1">{reunioesDoMes.length}</p>
            <p className="text-sm text-gray-600">Total de Reuniões</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-green-500 to-green-600 shadow-lg">
              <Video className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 mb-1">
              {reunioesDoMes.filter(r => r.status === 'realizada').length}
            </p>
            <p className="text-sm text-gray-600">Realizadas</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 shadow-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 mb-1">
              {briefingsReuniao.length}
            </p>
            <p className="text-sm text-gray-600">Briefings</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 mb-1">
              {reunioesDoMes.reduce((acc, r) => acc + r.participantes.length, 0)}
            </p>
            <p className="text-sm text-gray-600">Participantes</p>
          </div>
        </div>
      </div>

      {/* Lista de Reuniões */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <h4 className="text-lg font-semibold text-gray-900">Reuniões do Período</h4>
        </div>
        
        <div className="divide-y divide-gray-100">
          {reunioesDoMes.length > 0 ? (
            reunioesDoMes.map((reuniao) => {
              const briefing = briefingsReuniao.find(b => b.reuniaoId === reuniao.id);
              
              return (
                <div key={reuniao.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white">
                          <Video className="w-5 h-5" />
                        </div>
                        <div>
                          <h5 className="font-semibold text-gray-900">{reuniao.objetivo}</h5>
                          <div className="flex items-center space-x-2 mt-1 text-sm text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(reuniao.dataHoraInicio).toLocaleDateString('pt-BR')}</span>
                            <span>•</span>
                            <Users className="w-4 h-4" />
                            <span>{reuniao.participantes.length} participantes</span>
                          </div>
                        </div>
                      </div>
                      
                      {briefing && (
                        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                          <div className="flex items-center space-x-2 mb-2">
                            <FileText className="w-4 h-4 text-blue-600" />
                            <span className="font-medium text-blue-900">Briefing Disponível</span>
                          </div>
                          <div className="text-sm text-blue-800">
                            <p>{briefing.topicosDiscutidos.length} tópicos • {briefing.decisoesTomadas.length} decisões • {briefing.proximosPassos.length} próximos passos</p>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col items-end space-y-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(reuniao.status)}`}>
                        {reuniao.status === 'realizada' ? 'Realizada' :
                         reuniao.status === 'agendada' ? 'Agendada' : 'Cancelada'}
                      </span>
                      
                      <div className="flex items-center space-x-2">
                        {briefing ? (
                          <button
                            onClick={() => {
                              setReuniaoSelecionada(reuniao.id);
                              setShowBriefingModal(true);
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Ver briefing"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setReuniaoSelecionada(reuniao.id);
                              setShowBriefingModal(true);
                            }}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Criar briefing"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        )}
                        
                        <button
                          className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                          title="Download anexos"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Pauta da Reunião */}
                  {reuniao.pauta.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <h6 className="font-medium text-gray-700 mb-2">Pauta:</h6>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {reuniao.pauta.slice(0, 3).map((item, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                            <span>{item}</span>
                          </li>
                        ))}
                        {reuniao.pauta.length > 3 && (
                          <li className="text-gray-500 text-xs">
                            +{reuniao.pauta.length - 3} itens adicionais
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center">
              <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Nenhuma reunião no período</h4>
              <p className="text-gray-600">Agende reuniões para documentar o progresso da consultoria</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Briefing */}
      {showBriefingModal && (
        <BriefingModal
          reuniaoId={reuniaoSelecionada}
          onClose={() => {
            setShowBriefingModal(false);
            setReuniaoSelecionada('');
          }}
        />
      )}
    </div>
  );
}

// Modal para Briefing
interface BriefingModalProps {
  reuniaoId: string;
  onClose: () => void;
}

function BriefingModal({ reuniaoId, onClose }: BriefingModalProps) {
  const { briefingsReuniao, adicionarBriefingReuniao, atualizarBriefingReuniao, reunioes } = useApp();
  
  const briefingExistente = briefingsReuniao.find(b => b.reuniaoId === reuniaoId);
  const reuniao = reunioes.find(r => r.id === reuniaoId);
  const isEdit = !!briefingExistente;
  
  const [formData, setFormData] = useState({
    topicosDiscutidos: briefingExistente?.topicosDiscutidos || [''],
    decisoesTomadas: briefingExistente?.decisoesTomadas || [''],
    proximosPassos: briefingExistente?.proximosPassos || [''],
    observacoes: briefingExistente?.observacoes || '',
  });

  const adicionarItem = (campo: keyof typeof formData) => {
    if (Array.isArray(formData[campo])) {
      setFormData(prev => ({
        ...prev,
        [campo]: [...(prev[campo] as string[]), '']
      }));
    }
  };

  const removerItem = (campo: keyof typeof formData, index: number) => {
    if (Array.isArray(formData[campo])) {
      setFormData(prev => ({
        ...prev,
        [campo]: (prev[campo] as string[]).filter((_, i) => i !== index)
      }));
    }
  };

  const atualizarItem = (campo: keyof typeof formData, index: number, valor: string) => {
    if (Array.isArray(formData[campo])) {
      setFormData(prev => ({
        ...prev,
        [campo]: (prev[campo] as string[]).map((item, i) => i === index ? valor : item)
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const dadosLimpos = {
      topicosDiscutidos: formData.topicosDiscutidos.filter(item => item.trim() !== ''),
      decisoesTomadas: formData.decisoesTomadas.filter(item => item.trim() !== ''),
      proximosPassos: formData.proximosPassos.filter(item => item.trim() !== ''),
      observacoes: formData.observacoes,
    };
    
    if (isEdit && briefingExistente) {
      atualizarBriefingReuniao(briefingExistente.id, dadosLimpos);
    } else {
      const novoBriefing = {
        id: Date.now().toString(),
        reuniaoId,
        ...dadosLimpos,
        anexos: [],
        criadoEm: new Date().toISOString().split('T')[0],
      };
      adicionarBriefingReuniao(novoBriefing);
    }
    
    onClose();
  };

  const renderSecao = (
    titulo: string,
    campo: 'topicosDiscutidos' | 'decisoesTomadas' | 'proximosPassos',
    placeholder: string
  ) => (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-gray-900">{titulo}</h4>
        <button
          type="button"
          onClick={() => adicionarItem(campo)}
          className="text-blue-600 hover:text-blue-700 text-sm"
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
              placeholder={placeholder}
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
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {isEdit ? 'Editar Briefing' : 'Novo Briefing'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {reuniao && (
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <h3 className="font-medium text-gray-900">{reuniao.objetivo}</h3>
            <p className="text-sm text-gray-600">
              {new Date(reuniao.dataHoraInicio).toLocaleDateString('pt-BR')} • {reuniao.participantes.length} participantes
            </p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {renderSecao('Tópicos Discutidos', 'topicosDiscutidos', 'Digite um tópico discutido')}
          {renderSecao('Decisões Tomadas', 'decisoesTomadas', 'Digite uma decisão tomada')}
          {renderSecao('Próximos Passos', 'proximosPassos', 'Digite um próximo passo')}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Observações Gerais
            </label>
            <textarea
              value={formData.observacoes}
              onChange={(e) => setFormData(prev => ({ ...prev, observacoes: e.target.value }))}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Observações adicionais sobre a reunião..."
            />
          </div>
          
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            <p className="text-sm text-gray-600">Arraste arquivos aqui ou clique para fazer upload</p>
            <p className="text-xs text-gray-500 mt-1">Apresentações, atas, documentos (PDF, DOC, PPT)</p>
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
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center space-x-2"
            >
              <FileText className="w-4 h-4" />
              <span>{isEdit ? 'Salvar Briefing' : 'Criar Briefing'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}