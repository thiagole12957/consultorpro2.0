import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Plus, Calendar, Clock, Users, Bell, Filter, Search, ChevronLeft, ChevronRight, Grid3X3, List, Eye } from 'lucide-react';
import { EventoModal } from './EventoModal';
import { CalendarioView } from './CalendarioView';
import { AgendaView } from './AgendaView';
import { EventoAgenda } from '../../types/agenda';

export function AgendaDashboard() {
  const { eventosAgenda = [], usuarioLogado, reunioes = [] } = useApp();
  const [showEventoModal, setShowEventoModal] = useState(false);
  const [eventoEdit, setEventoEdit] = useState<EventoAgenda | null>(null);
  const [visualizacao, setVisualizacao] = useState<'mes' | 'semana' | 'dia' | 'agenda'>('mes');
  const [dataAtual, setDataAtual] = useState(new Date());
  const [filtroCategoria, setFiltroCategoria] = useState('todas');
  const [busca, setBusca] = useState('');

  const eventosUsuario = eventosAgenda.filter(e => e.usuarioId === usuarioLogado?.id);
  
  const eventosHoje = eventosUsuario.filter(evento => {
    const hoje = new Date().toDateString();
    const eventoData = new Date(evento.dataInicio).toDateString();
    return hoje === eventoData;
  });

  const proximosEventos = eventosUsuario
    .filter(evento => new Date(evento.dataInicio) > new Date())
    .sort((a, b) => new Date(a.dataInicio).getTime() - new Date(b.dataInicio).getTime())
    .slice(0, 5);

  const reunioesAgendadas = reunioes.filter(r => r.status === 'agendada').length;

  const handleEditEvento = (evento: EventoAgenda) => {
    setEventoEdit(evento);
    setShowEventoModal(true);
  };

  const navegarData = (direcao: 'anterior' | 'proximo') => {
    const novaData = new Date(dataAtual);
    
    switch (visualizacao) {
      case 'dia':
        novaData.setDate(novaData.getDate() + (direcao === 'proximo' ? 1 : -1));
        break;
      case 'semana':
        novaData.setDate(novaData.getDate() + (direcao === 'proximo' ? 7 : -7));
        break;
      case 'mes':
        novaData.setMonth(novaData.getMonth() + (direcao === 'proximo' ? 1 : -1));
        break;
    }
    
    setDataAtual(novaData);
  };

  const irParaHoje = () => {
    setDataAtual(new Date());
  };

  const getTituloData = () => {
    const opcoes: Intl.DateTimeFormatOptions = {};
    
    switch (visualizacao) {
      case 'dia':
        opcoes.weekday = 'long';
        opcoes.day = 'numeric';
        opcoes.month = 'long';
        opcoes.year = 'numeric';
        break;
      case 'semana':
        const inicioSemana = new Date(dataAtual);
        inicioSemana.setDate(dataAtual.getDate() - dataAtual.getDay());
        const fimSemana = new Date(inicioSemana);
        fimSemana.setDate(inicioSemana.getDate() + 6);
        return `${inicioSemana.getDate()} - ${fimSemana.getDate()} de ${fimSemana.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}`;
      case 'mes':
        opcoes.month = 'long';
        opcoes.year = 'numeric';
        break;
      default:
        return 'Agenda';
    }
    
    return dataAtual.toLocaleDateString('pt-BR', opcoes);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Agenda Pessoal</h2>
          <p className="text-gray-600">Organize seus compromissos e reuniões</p>
        </div>
        <button
          onClick={() => setShowEventoModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Evento</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg">
              <Calendar className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 mb-1">{eventosHoje.length}</p>
            <p className="text-sm text-gray-600">Eventos Hoje</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-green-500 to-green-600 shadow-lg">
              <Clock className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 mb-1">{proximosEventos.length}</p>
            <p className="text-sm text-gray-600">Próximos Eventos</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 shadow-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 mb-1">{reunioesAgendadas}</p>
            <p className="text-sm text-gray-600">Reuniões Agendadas</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg">
              <Bell className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 mb-1">
              {eventosUsuario.filter(e => e.notificacoes.some(n => n.ativa)).length}
            </p>
            <p className="text-sm text-gray-600">Com Notificação</p>
          </div>
        </div>
      </div>

      {/* Controles de Navegação */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Navegação de Data */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => navegarData('anterior')}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <h3 className="text-lg font-semibold text-gray-900 min-w-[200px] text-center">
                {getTituloData()}
              </h3>
              
              <button
                onClick={() => navegarData('proximo')}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              
              <button
                onClick={irParaHoje}
                className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                Hoje
              </button>
            </div>

            {/* Filtros */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <Search className="w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="Buscar eventos..."
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <select
                  value={filtroCategoria}
                  onChange={(e) => setFiltroCategoria(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  <option value="todas">Todas as Categorias</option>
                  <option value="reuniao">Reuniões</option>
                  <option value="compromisso">Compromissos</option>
                  <option value="tarefa">Tarefas</option>
                  <option value="lembrete">Lembretes</option>
                </select>
              </div>
            </div>
          </div>

          {/* Seletor de Visualização */}
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setVisualizacao('dia')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                visualizacao === 'dia' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Dia
            </button>
            <button
              onClick={() => setVisualizacao('semana')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                visualizacao === 'semana' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Semana
            </button>
            <button
              onClick={() => setVisualizacao('mes')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                visualizacao === 'mes' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Mês
            </button>
            <button
              onClick={() => setVisualizacao('agenda')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                visualizacao === 'agenda' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <List className="w-4 h-4 inline mr-1" />
              Lista
            </button>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Calendário/Agenda Principal */}
        <div className="xl:col-span-3">
          {visualizacao === 'agenda' ? (
            <AgendaView 
              eventos={eventosUsuario}
              dataAtual={dataAtual}
              filtroCategoria={filtroCategoria}
              busca={busca}
              onEditEvento={handleEditEvento}
            />
          ) : (
            <CalendarioView 
              eventos={eventosUsuario}
              dataAtual={dataAtual}
              visualizacao={visualizacao}
              filtroCategoria={filtroCategoria}
              busca={busca}
              onEditEvento={handleEditEvento}
              onNovoEvento={(data) => {
                setEventoEdit({
                  id: '',
                  usuarioId: usuarioLogado?.id || '',
                  titulo: '',
                  dataInicio: data,
                  dataFim: data,
                  tipoEvento: 'compromisso',
                  prioridade: 'media',
                  status: 'agendado',
                  notificacoes: [],
                  cor: '#3B82F6',
                  categoria: 'Geral',
                  criadoEm: '',
                  atualizadoEm: ''
                } as EventoAgenda);
                setShowEventoModal(true);
              }}
            />
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Eventos de Hoje */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-2 mb-4">
              <Calendar className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Hoje</h3>
            </div>
            
            <div className="space-y-3">
              {eventosHoje.length > 0 ? (
                eventosHoje.map((evento) => (
                  <div key={evento.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: evento.cor }}
                    ></div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 text-sm">{evento.titulo}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(evento.dataInicio).toLocaleTimeString('pt-BR', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>
                    <button
                      onClick={() => handleEditEvento(evento)}
                      className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                    >
                      <Eye className="w-3 h-3" />
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm text-center py-4">Nenhum evento hoje</p>
              )}
            </div>
          </div>

          {/* Próximos Eventos */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-2 mb-4">
              <Clock className="w-5 h-5 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900">Próximos</h3>
            </div>
            
            <div className="space-y-3">
              {proximosEventos.length > 0 ? (
                proximosEventos.map((evento) => (
                  <div key={evento.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: evento.cor }}
                    ></div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 text-sm">{evento.titulo}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(evento.dataInicio).toLocaleDateString('pt-BR')} às{' '}
                        {new Date(evento.dataInicio).toLocaleTimeString('pt-BR', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>
                    <button
                      onClick={() => handleEditEvento(evento)}
                      className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                    >
                      <Eye className="w-3 h-3" />
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm text-center py-4">Nenhum evento próximo</p>
              )}
            </div>
          </div>

          {/* Reuniões Integradas */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-2 mb-4">
              <Users className="w-5 h-5 text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-900">Reuniões</h3>
            </div>
            
            <div className="space-y-3">
              {reunioes
                .filter(r => r.status === 'agendada')
                .slice(0, 3)
                .map((reuniao) => (
                  <div key={reuniao.id} className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                    <Users className="w-4 h-4 text-purple-600" />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 text-sm">{reuniao.objetivo}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(reuniao.dataHoraInicio).toLocaleDateString('pt-BR')} às{' '}
                        {new Date(reuniao.dataHoraInicio).toLocaleTimeString('pt-BR', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              
              {reunioesAgendadas === 0 && (
                <p className="text-gray-500 text-sm text-center py-4">Nenhuma reunião agendada</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal Novo Evento */}
      {showEventoModal && (
        <EventoModal
          evento={eventoEdit}
          onClose={() => {
            setShowEventoModal(false);
            setEventoEdit(null);
          }}
        />
      )}
    </div>
  );
}