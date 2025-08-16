import React from 'react';
import { EventoAgenda } from '../../types/agenda';
import { Calendar, Clock, Users, MapPin } from 'lucide-react';

interface CalendarioViewProps {
  eventos: EventoAgenda[];
  dataAtual: Date;
  visualizacao: 'mes' | 'semana' | 'dia';
  filtroCategoria: string;
  busca: string;
  onEditEvento: (evento: EventoAgenda) => void;
  onNovoEvento: (data: string) => void;
}

export function CalendarioView({ 
  eventos, 
  dataAtual, 
  visualizacao, 
  filtroCategoria, 
  busca, 
  onEditEvento, 
  onNovoEvento 
}: CalendarioViewProps) {
  
  const eventosFiltrados = eventos.filter(evento => {
    const matchCategoria = filtroCategoria === 'todas' || evento.tipoEvento === filtroCategoria;
    const matchBusca = busca === '' || 
      evento.titulo.toLowerCase().includes(busca.toLowerCase()) ||
      evento.descricao?.toLowerCase().includes(busca.toLowerCase());
    
    return matchCategoria && matchBusca;
  });

  const getPrioridadeColor = (prioridade: string) => {
    switch (prioridade) {
      case 'urgente': return 'border-l-red-500 bg-red-50';
      case 'alta': return 'border-l-orange-500 bg-orange-50';
      case 'media': return 'border-l-blue-500 bg-blue-50';
      case 'baixa': return 'border-l-green-500 bg-green-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };

  const renderVisualizacaoMes = () => {
    const primeiroDiaMes = new Date(dataAtual.getFullYear(), dataAtual.getMonth(), 1);
    const ultimoDiaMes = new Date(dataAtual.getFullYear(), dataAtual.getMonth() + 1, 0);
    const primeiroDiaCalendario = new Date(primeiroDiaMes);
    primeiroDiaCalendario.setDate(primeiroDiaCalendario.getDate() - primeiroDiaMes.getDay());
    
    const dias = [];
    const dataAtualCalendario = new Date(primeiroDiaCalendario);
    
    for (let i = 0; i < 42; i++) {
      dias.push(new Date(dataAtualCalendario));
      dataAtualCalendario.setDate(dataAtualCalendario.getDate() + 1);
    }

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        {/* Header do Calendário */}
        <div className="grid grid-cols-7 border-b border-gray-200">
          {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((dia) => (
            <div key={dia} className="p-4 text-center font-semibold text-gray-700 border-r border-gray-200 last:border-r-0">
              {dia}
            </div>
          ))}
        </div>
        
        {/* Dias do Calendário */}
        <div className="grid grid-cols-7">
          {dias.map((dia, index) => {
            const isCurrentMonth = dia.getMonth() === dataAtual.getMonth();
            const isToday = dia.toDateString() === new Date().toDateString();
            const eventosNoDia = eventosFiltrados.filter(evento => {
              const eventoData = new Date(evento.dataInicio).toDateString();
              return eventoData === dia.toDateString();
            });

            return (
              <div
                key={index}
                className={`min-h-[120px] p-2 border-r border-b border-gray-200 last:border-r-0 cursor-pointer hover:bg-gray-50 transition-colors ${
                  !isCurrentMonth ? 'bg-gray-50 text-gray-400' : ''
                } ${isToday ? 'bg-blue-50' : ''}`}
                onClick={() => onNovoEvento(dia.toISOString().slice(0, 16))}
              >
                <div className={`text-sm font-medium mb-2 ${
                  isToday ? 'text-blue-600' : isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                }`}>
                  {dia.getDate()}
                </div>
                
                <div className="space-y-1">
                  {eventosNoDia.slice(0, 3).map((evento) => (
                    <div
                      key={evento.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditEvento(evento);
                      }}
                      className={`text-xs p-1 rounded border-l-2 cursor-pointer hover:shadow-sm transition-shadow ${getPrioridadeColor(evento.prioridade)}`}
                      style={{ borderLeftColor: evento.cor }}
                    >
                      <div className="font-medium truncate">{evento.titulo}</div>
                      <div className="text-gray-600">
                        {new Date(evento.dataInicio).toLocaleTimeString('pt-BR', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </div>
                    </div>
                  ))}
                  
                  {eventosNoDia.length > 3 && (
                    <div className="text-xs text-gray-500 text-center">
                      +{eventosNoDia.length - 3} mais
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderVisualizacaoSemana = () => {
    const inicioSemana = new Date(dataAtual);
    inicioSemana.setDate(dataAtual.getDate() - dataAtual.getDay());
    
    const diasSemana = [];
    for (let i = 0; i < 7; i++) {
      const dia = new Date(inicioSemana);
      dia.setDate(inicioSemana.getDate() + i);
      diasSemana.push(dia);
    }

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="grid grid-cols-7 border-b border-gray-200">
          {diasSemana.map((dia) => {
            const isToday = dia.toDateString() === new Date().toDateString();
            
            return (
              <div key={dia.toISOString()} className={`p-4 text-center border-r border-gray-200 last:border-r-0 ${
                isToday ? 'bg-blue-50' : ''
              }`}>
                <div className="font-semibold text-gray-700">
                  {dia.toLocaleDateString('pt-BR', { weekday: 'short' })}
                </div>
                <div className={`text-lg font-bold ${
                  isToday ? 'text-blue-600' : 'text-gray-900'
                }`}>
                  {dia.getDate()}
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="grid grid-cols-7 min-h-[400px]">
          {diasSemana.map((dia) => {
            const eventosNoDia = eventosFiltrados.filter(evento => {
              const eventoData = new Date(evento.dataInicio).toDateString();
              return eventoData === dia.toDateString();
            });

            return (
              <div
                key={dia.toISOString()}
                className="p-2 border-r border-gray-200 last:border-r-0 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => onNovoEvento(dia.toISOString().slice(0, 16))}
              >
                <div className="space-y-1">
                  {eventosNoDia.map((evento) => (
                    <div
                      key={evento.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditEvento(evento);
                      }}
                      className={`text-xs p-2 rounded border-l-2 cursor-pointer hover:shadow-sm transition-shadow ${getPrioridadeColor(evento.prioridade)}`}
                      style={{ borderLeftColor: evento.cor }}
                    >
                      <div className="font-medium">{evento.titulo}</div>
                      <div className="text-gray-600">
                        {new Date(evento.dataInicio).toLocaleTimeString('pt-BR', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderVisualizacaoDia = () => {
    const eventosNoDia = eventosFiltrados.filter(evento => {
      const eventoData = new Date(evento.dataInicio).toDateString();
      return eventoData === dataAtual.toDateString();
    });

    const horas = Array.from({ length: 24 }, (_, i) => i);

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            {dataAtual.toLocaleDateString('pt-BR', { 
              weekday: 'long', 
              day: 'numeric', 
              month: 'long', 
              year: 'numeric' 
            })}
          </h3>
        </div>
        
        <div className="max-h-[600px] overflow-y-auto">
          {horas.map((hora) => {
            const eventosNaHora = eventosNoDia.filter(evento => {
              const eventoHora = new Date(evento.dataInicio).getHours();
              return eventoHora === hora;
            });

            return (
              <div key={hora} className="flex border-b border-gray-100">
                <div className="w-16 p-3 text-sm text-gray-500 text-right border-r border-gray-200">
                  {hora.toString().padStart(2, '0')}:00
                </div>
                <div 
                  className="flex-1 p-3 min-h-[60px] cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => {
                    const dataEvento = new Date(dataAtual);
                    dataEvento.setHours(hora, 0, 0, 0);
                    onNovoEvento(dataEvento.toISOString().slice(0, 16));
                  }}
                >
                  <div className="space-y-1">
                    {eventosNaHora.map((evento) => (
                      <div
                        key={evento.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditEvento(evento);
                        }}
                        className={`p-2 rounded border-l-4 cursor-pointer hover:shadow-sm transition-shadow ${getPrioridadeColor(evento.prioridade)}`}
                        style={{ borderLeftColor: evento.cor }}
                      >
                        <div className="font-medium text-sm">{evento.titulo}</div>
                        <div className="text-xs text-gray-600 flex items-center space-x-2">
                          <Clock className="w-3 h-3" />
                          <span>
                            {new Date(evento.dataInicio).toLocaleTimeString('pt-BR', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })} - {new Date(evento.dataFim).toLocaleTimeString('pt-BR', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </span>
                          {evento.local && (
                            <>
                              <MapPin className="w-3 h-3" />
                              <span>{evento.local}</span>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {visualizacao === 'mes' && renderVisualizacaoMes()}
      {visualizacao === 'semana' && renderVisualizacaoSemana()}
      {visualizacao === 'dia' && renderVisualizacaoDia()}
    </div>
  );
}