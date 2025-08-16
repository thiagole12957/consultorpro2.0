import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Plus, Calendar, Video, Target, AlertTriangle, Lightbulb, CheckCircle, FileText, X } from 'lucide-react';
import { EventoLinhaTempo } from '../../types/consultoria';

interface LinhaTempoConsultoriaProps {
  clienteId: string;
}

export function LinhaTempoConsultoria({ clienteId }: LinhaTempoConsultoriaProps) {
  const { eventosLinhaTempo, adicionarEventoLinhaTempo } = useApp();
  const [showModal, setShowModal] = useState(false);

  const eventosDoCliente = eventosLinhaTempo
    .filter(e => e.clienteId === clienteId)
    .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'reuniao': return <Video className="w-5 h-5" />;
      case 'entrega': return <FileText className="w-5 h-5" />;
      case 'resultado': return <CheckCircle className="w-5 h-5" />;
      case 'marco': return <Target className="w-5 h-5" />;
      case 'problema': return <AlertTriangle className="w-5 h-5" />;
      case 'oportunidade': return <Lightbulb className="w-5 h-5" />;
      default: return <Calendar className="w-5 h-5" />;
    }
  };

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'reuniao': return 'bg-blue-100 text-blue-600';
      case 'entrega': return 'bg-green-100 text-green-600';
      case 'resultado': return 'bg-purple-100 text-purple-600';
      case 'marco': return 'bg-orange-100 text-orange-600';
      case 'problema': return 'bg-red-100 text-red-600';
      case 'oportunidade': return 'bg-yellow-100 text-yellow-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const agruparEventosPorMes = () => {
    const grupos: { [key: string]: EventoLinhaTempo[] } = {};
    
    eventosDoCliente.forEach(evento => {
      const mesAno = new Date(evento.data).toISOString().slice(0, 7);
      if (!grupos[mesAno]) {
        grupos[mesAno] = [];
      }
      grupos[mesAno].push(evento);
    });
    
    return grupos;
  };

  const eventosAgrupados = agruparEventosPorMes();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">Linha do Tempo da Consultoria</h3>
          <p className="text-gray-600">Histórico de interações e entregas</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Evento</span>
        </button>
      </div>

      {/* Resumo por Tipo */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {['reuniao', 'entrega', 'resultado', 'marco', 'problema', 'oportunidade'].map((tipo) => {
          const count = eventosDoCliente.filter(e => e.tipo === tipo).length;
          
          return (
            <div key={tipo} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className={`p-3 rounded-lg ${getTipoColor(tipo)} mb-3`}>
                {getTipoIcon(tipo)}
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900">{count}</p>
                <p className="text-sm text-gray-600 capitalize">{tipo}s</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Linha do Tempo */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <h4 className="text-lg font-semibold text-gray-900">Histórico de Eventos</h4>
        </div>
        
        <div className="p-6">
          {Object.keys(eventosAgrupados).length > 0 ? (
            <div className="space-y-8">
              {Object.entries(eventosAgrupados).map(([mesAno, eventos]) => (
                <div key={mesAno}>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {mesAno.split('-')[1]}
                    </div>
                    <h5 className="font-semibold text-gray-900">
                      {new Date(mesAno + '-01').toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                    </h5>
                  </div>
                  
                  <div className="ml-4 border-l-2 border-gray-200 pl-6 space-y-4">
                    {eventos.map((evento) => (
                      <div key={evento.id} className="relative">
                        <div className="absolute -left-8 w-4 h-4 bg-white border-2 border-blue-600 rounded-full"></div>
                        
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center space-x-3">
                              <div className={`p-2 rounded-lg ${getTipoColor(evento.tipo)}`}>
                                {getTipoIcon(evento.tipo)}
                              </div>
                              <div>
                                <h6 className="font-medium text-gray-900">{evento.titulo}</h6>
                                <p className="text-sm text-gray-600">
                                  {new Date(evento.data).toLocaleDateString('pt-BR')}
                                </p>
                              </div>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTipoColor(evento.tipo)}`}>
                              {evento.tipo}
                            </span>
                          </div>
                          
                          <p className="text-sm text-gray-700">{evento.descricao}</p>
                          
                          {evento.anexos && evento.anexos.length > 0 && (
                            <div className="mt-3 flex items-center space-x-2">
                              <FileText className="w-4 h-4 text-gray-400" />
                              <span className="text-xs text-gray-500">
                                {evento.anexos.length} anexo(s)
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Linha do tempo vazia</h4>
              <p className="text-gray-600 mb-4">Adicione eventos para criar o histórico da consultoria</p>
              <button
                onClick={() => setShowModal(true)}
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2 hover:bg-indigo-700 transition-colors mx-auto"
              >
                <Plus className="w-5 h-5" />
                <span>Primeiro Evento</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal para Eventos */}
      {showModal && (
        <EventoModal
          clienteId={clienteId}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}

// Modal para Eventos
interface EventoModalProps {
  clienteId: string;
  onClose: () => void;
}

function EventoModal({ clienteId, onClose }: EventoModalProps) {
  const { adicionarEventoLinhaTempo } = useApp();
  
  const [formData, setFormData] = useState({
    tipo: 'reuniao' as EventoLinhaTempo['tipo'],
    titulo: '',
    descricao: '',
    data: new Date().toISOString().split('T')[0],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const novoEvento: EventoLinhaTempo = {
      id: Date.now().toString(),
      clienteId,
      ...formData,
      criadoEm: new Date().toISOString().split('T')[0],
    };
    
    adicionarEventoLinhaTempo(novoEvento);
    onClose();
  };

  const tiposEvento = [
    { value: 'reuniao', label: 'Reunião' },
    { value: 'entrega', label: 'Entrega' },
    { value: 'resultado', label: 'Resultado' },
    { value: 'marco', label: 'Marco' },
    { value: 'problema', label: 'Problema' },
    { value: 'oportunidade', label: 'Oportunidade' },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Novo Evento</h2>
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
              Tipo de Evento *
            </label>
            <select
              required
              value={formData.tipo}
              onChange={(e) => setFormData(prev => ({ ...prev, tipo: e.target.value as EventoLinhaTempo['tipo'] }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {tiposEvento.map(tipo => (
                <option key={tipo.value} value={tipo.value}>{tipo.label}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Título *
            </label>
            <input
              type="text"
              required
              value={formData.titulo}
              onChange={(e) => setFormData(prev => ({ ...prev, titulo: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Título do evento"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data *
            </label>
            <input
              type="date"
              required
              value={formData.data}
              onChange={(e) => setFormData(prev => ({ ...prev, data: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Descreva o evento..."
            />
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
              className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-lg hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200 flex items-center space-x-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Adicionar Evento</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}