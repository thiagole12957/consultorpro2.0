import React from 'react';
import { EventoAgenda } from '../../types/agenda';
import { Calendar, Clock, Users, MapPin, Bell, Edit2, Eye } from 'lucide-react';

interface AgendaViewProps {
  eventos: EventoAgenda[];
  dataAtual: Date;
  filtroCategoria: string;
  busca: string;
  onEditEvento: (evento: EventoAgenda) => void;
}

export function AgendaView({ eventos, dataAtual, filtroCategoria, busca, onEditEvento }: AgendaViewProps) {
  
  const eventosFiltrados = eventos.filter(evento => {
    const matchCategoria = filtroCategoria === 'todas' || evento.tipoEvento === filtroCategoria;
    const matchBusca = busca === '' || 
      evento.titulo.toLowerCase().includes(busca.toLowerCase()) ||
      evento.descricao?.toLowerCase().includes(busca.toLowerCase());
    
    return matchCategoria && matchBusca;
  }).sort((a, b) => new Date(a.dataInicio).getTime() - new Date(b.dataInicio).getTime());

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmado': return 'bg-green-100 text-green-700';
      case 'agendado': return 'bg-blue-100 text-blue-700';
      case 'realizado': return 'bg-purple-100 text-purple-700';
      case 'cancelado': return 'bg-red-100 text-red-700';
      case 'adiado': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getPrioridadeIcon = (prioridade: string) => {
    switch (prioridade) {
      case 'urgente': return '🔴';
      case 'alta': return '🟠';
      case 'media': return '🔵';
      case 'baixa': return '🟢';
      default: return '⚪';
    }
  };

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'reuniao': return <Users className="w-4 h-4" />;
      case 'compromisso': return <Calendar className="w-4 h-4" />;
      case 'tarefa': return <Clock className="w-4 h-4" />;
      case 'lembrete': return <Bell className="w-4 h-4" />;
      default: return <Calendar className="w-4 h-4" />;
    }
  };

  const agruparEventosPorData = () => {
    const grupos: { [key: string]: EventoAgenda[] } = {};
    
    eventosFiltrados.forEach(evento => {
      const data = new Date(evento.dataInicio).toDateString();
      if (!grupos[data]) {
        grupos[data] = [];
      }
      grupos[data].push(evento);
    });
    
    return grupos;
  };

  const eventosAgrupados = agruparEventosPorData();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Lista de Eventos</h3>
      </div>
      
      <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
        {Object.keys(eventosAgrupados).length > 0 ? (
          Object.entries(eventosAgrupados).map(([data, eventosNaData]) => (
            <div key={data}>
              {/* Header da Data */}
              <div className="p-4 bg-gray-50 border-b border-gray-200">
                <h4 className="font-semibold text-gray-900">
                  {new Date(data).toLocaleDateString('pt-BR', { 
                    weekday: 'long', 
                    day: 'numeric', 
                    month: 'long' 
                  })}
                </h4>
              </div>
              
              {/* Eventos da Data */}
              <div className="divide-y divide-gray-100">
                {eventosNaData.map((evento) => (
                  <div key={evento.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        <div 
                          className="w-4 h-4 rounded-full mt-1"
                          style={{ backgroundColor: evento.cor }}
                        ></div>
                        
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            {getTipoIcon(evento.tipoEvento)}
                            <h5 className="font-semibold text-gray-900">{evento.titulo}</h5>
                            <span className="text-sm">{getPrioridadeIcon(evento.prioridade)}</span>
                          </div>
                          
                          {evento.descricao && (
                            <p className="text-sm text-gray-600 mb-2">{evento.descricao}</p>
                          )}
                          
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center space-x-1">
                              <Clock className="w-4 h-4" />
                              <span>
                                {new Date(evento.dataInicio).toLocaleTimeString('pt-BR', { 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })} - {new Date(evento.dataFim).toLocaleTimeString('pt-BR', { 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })}
                              </span>
                            </div>
                            
                            {evento.local && (
                              <div className="flex items-center space-x-1">
                                <MapPin className="w-4 h-4" />
                                <span>{evento.local}</span>
                              </div>
                            )}
                            
                            {evento.notificacoes.some(n => n.ativa) && (
                              <div className="flex items-center space-x-1 text-orange-600">
                                <Bell className="w-4 h-4" />
                                <span>Notificação</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(evento.status)}`}>
                          {evento.status === 'agendado' ? 'Agendado' :
                           evento.status === 'confirmado' ? 'Confirmado' :
                           evento.status === 'realizado' ? 'Realizado' :
                           evento.status === 'cancelado' ? 'Cancelado' : 'Adiado'}
                        </span>
                        
                        <button
                          onClick={() => onEditEvento(evento)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-gray-500">
            <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum evento encontrado</h3>
            <p className="text-gray-600">
              {busca ? 'Tente ajustar os filtros de busca' : 'Clique em "Novo Evento" para começar'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}