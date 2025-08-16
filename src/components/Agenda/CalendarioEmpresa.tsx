import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Calendar, Users, Video, Clock, Filter, Search, ChevronLeft, ChevronRight, Eye, Crown, Building2 } from 'lucide-react';
import { EventoAgenda } from '../../types/agenda';

export function CalendarioEmpresa() {
  const { eventosAgenda = [], usuarios = [], reunioes = [], clientes = [], empresaSelecionada } = useApp();
  const [dataAtual, setDataAtual] = useState(new Date());
  const [filtroUsuario, setFiltroUsuario] = useState('todos');
  const [filtroTipo, setFiltroTipo] = useState('todos');
  const [busca, setBusca] = useState('');

  // Combinar eventos da agenda e reuniões de todos os usuários
  const todosEventos = [
    // Eventos da agenda
    ...eventosAgenda,
    // Reuniões convertidas em eventos
    ...reunioes.map(reuniao => ({
      id: `reuniao-${reuniao.id}`,
      usuarioId: reuniao.responsavel || 'sistema',
      titulo: `📹 ${reuniao.objetivo}`,
      descricao: `Reunião ${reuniao.canal}\nParticipantes: ${reuniao.participantes.length}`,
      dataInicio: reuniao.dataHoraInicio,
      dataFim: reuniao.dataHoraFim,
      tipoEvento: 'reuniao' as const,
      prioridade: 'alta' as const,
      status: reuniao.status === 'agendada' ? 'agendado' as const : 
               reuniao.status === 'realizada' ? 'realizado' as const : 'cancelado' as const,
      local: reuniao.linkLocal,
      clienteId: reuniao.clienteId,
      reuniaoId: reuniao.id,
      cor: '#8B5CF6',
      categoria: 'Reunião',
      notificacoes: [],
      criadoEm: new Date().toISOString(),
      atualizadoEm: new Date().toISOString(),
    } as EventoAgenda))
  ];

  const eventosFiltrados = todosEventos.filter(evento => {
    const matchUsuario = filtroUsuario === 'todos' || evento.usuarioId === filtroUsuario;
    const matchTipo = filtroTipo === 'todos' || evento.tipoEvento === filtroTipo;
    const matchBusca = busca === '' || 
      evento.titulo.toLowerCase().includes(busca.toLowerCase()) ||
      evento.descricao?.toLowerCase().includes(busca.toLowerCase());
    
    return matchUsuario && matchTipo && matchBusca;
  });

  const navegarMes = (direcao: 'anterior' | 'proximo') => {
    const novaData = new Date(dataAtual);
    novaData.setMonth(novaData.getMonth() + (direcao === 'proximo' ? 1 : -1));
    setDataAtual(novaData);
  };

  const irParaHoje = () => {
    setDataAtual(new Date());
  };

  const getUsuarioNome = (usuarioId: string) => {
    const usuario = usuarios.find(u => u.id === usuarioId);
    return usuario ? usuario.nome : 'Sistema';
  };

  const getClienteNome = (clienteId?: string) => {
    if (!clienteId) return '';
    const cliente = clientes.find(c => c.id === clienteId);
    return cliente ? cliente.empresa : '';
  };

  const renderCalendarioMes = () => {
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
                className={`min-h-[120px] p-2 border-r border-b border-gray-200 last:border-r-0 ${
                  !isCurrentMonth ? 'bg-gray-50 text-gray-400' : ''
                } ${isToday ? 'bg-blue-50' : ''}`}
              >
                <div className={`text-sm font-medium mb-2 ${
                  isToday ? 'text-blue-600' : isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                }`}>
                  {dia.getDate()}
                </div>
                
                <div className="space-y-1">
                  {eventosNoDia.slice(0, 3).map((evento) => {
                    const usuario = usuarios.find(u => u.id === evento.usuarioId);
                    
                    return (
                      <div
                        key={evento.id}
                        className="text-xs p-1 rounded border-l-2 cursor-pointer hover:shadow-sm transition-shadow"
                        style={{ 
                          borderLeftColor: evento.cor,
                          backgroundColor: `${evento.cor}15`
                        }}
                        title={`${evento.titulo}\nUsuário: ${getUsuarioNome(evento.usuarioId)}\n${evento.descricao || ''}`}
                      >
                        <div className="font-medium truncate">{evento.titulo}</div>
                        <div className="text-gray-600 flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>
                            {new Date(evento.dataInicio).toLocaleTimeString('pt-BR', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </span>
                        </div>
                        <div className="text-gray-500 truncate">
                          {getUsuarioNome(evento.usuarioId)}
                        </div>
                      </div>
                    );
                  })}
                  
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

  const eventosHoje = eventosFiltrados.filter(evento => {
    const hoje = new Date().toDateString();
    const eventoData = new Date(evento.dataInicio).toDateString();
    return hoje === eventoData;
  });

  const reunioesHoje = eventosHoje.filter(e => e.tipoEvento === 'reuniao').length;
  const compromissosHoje = eventosHoje.filter(e => e.tipoEvento === 'compromisso').length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Calendário da Empresa</h2>
          <p className="text-gray-600">
            Visão unificada de todos os eventos e reuniões - {empresaSelecionada?.nomeFantasia || 'Todas as empresas'}
          </p>
        </div>
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
            <div className="p-3 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 shadow-lg">
              <Video className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 mb-1">{reunioesHoje}</p>
            <p className="text-sm text-gray-600">Reuniões Hoje</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-green-500 to-green-600 shadow-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 mb-1">{compromissosHoje}</p>
            <p className="text-sm text-gray-600">Compromissos Hoje</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg">
              <Building2 className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 mb-1">{usuarios.length}</p>
            <p className="text-sm text-gray-600">Usuários Ativos</p>
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
                onClick={() => navegarMes('anterior')}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <h3 className="text-lg font-semibold text-gray-900 min-w-[200px] text-center">
                {dataAtual.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
              </h3>
              
              <button
                onClick={() => navegarMes('proximo')}
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
                  value={filtroUsuario}
                  onChange={(e) => setFiltroUsuario(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  <option value="todos">Todos os Usuários</option>
                  {usuarios.map(usuario => (
                    <option key={usuario.id} value={usuario.id}>
                      {usuario.nome}
                    </option>
                  ))}
                </select>
              </div>

              <select
                value={filtroTipo}
                onChange={(e) => setFiltroTipo(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                <option value="todos">Todos os Tipos</option>
                <option value="reuniao">Reuniões</option>
                <option value="compromisso">Compromissos</option>
                <option value="tarefa">Tarefas</option>
                <option value="lembrete">Lembretes</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Principal */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Calendário Principal */}
        <div className="xl:col-span-3">
          {renderCalendarioMes()}
        </div>

        {/* Sidebar com Eventos de Hoje */}
        <div className="space-y-6">
          {/* Eventos de Hoje */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-2 mb-4">
              <Calendar className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Hoje</h3>
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                {eventosHoje.length}
              </span>
            </div>
            
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {eventosHoje.length > 0 ? (
                eventosHoje
                  .sort((a, b) => new Date(a.dataInicio).getTime() - new Date(b.dataInicio).getTime())
                  .map((evento) => (
                    <div key={evento.id} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: evento.cor }}
                          ></div>
                          <span className="font-medium text-gray-900 text-sm">{evento.titulo}</span>
                        </div>
                        {evento.tipoEvento === 'reuniao' && (
                          <Video className="w-4 h-4 text-purple-600" />
                        )}
                      </div>
                      
                      <div className="text-xs text-gray-600 space-y-1">
                        <div className="flex items-center space-x-1">
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
                        </div>
                        
                        <div className="flex items-center space-x-1">
                          <Users className="w-3 h-3" />
                          <span>{getUsuarioNome(evento.usuarioId)}</span>
                        </div>
                        
                        {evento.clienteId && (
                          <div className="flex items-center space-x-1">
                            <Building2 className="w-3 h-3" />
                            <span>{getClienteNome(evento.clienteId)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
              ) : (
                <p className="text-gray-500 text-sm text-center py-4">Nenhum evento hoje</p>
              )}
            </div>
          </div>

          {/* Resumo por Usuário */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-2 mb-4">
              <Users className="w-5 h-5 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900">Por Usuário</h3>
            </div>
            
            <div className="space-y-3">
              {usuarios.slice(0, 5).map((usuario) => {
                const eventosUsuario = eventosFiltrados.filter(e => e.usuarioId === usuario.id);
                const reunioesUsuario = eventosUsuario.filter(e => e.tipoEvento === 'reuniao').length;
                
                return (
                  <div key={usuario.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {usuario.nome.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{usuario.nome}</p>
                        <p className="text-xs text-gray-500">{eventosUsuario.length} eventos</p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-sm font-medium text-purple-600">{reunioesUsuario}</p>
                      <p className="text-xs text-gray-500">reuniões</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Próximas Reuniões */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-2 mb-4">
              <Video className="w-5 h-5 text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-900">Próximas Reuniões</h3>
            </div>
            
            <div className="space-y-3">
              {eventosFiltrados
                .filter(e => e.tipoEvento === 'reuniao' && new Date(e.dataInicio) > new Date())
                .sort((a, b) => new Date(a.dataInicio).getTime() - new Date(b.dataInicio).getTime())
                .slice(0, 5)
                .map((evento) => (
                  <div key={evento.id} className="p-3 bg-purple-50 rounded-lg">
                    <div className="flex items-center space-x-2 mb-1">
                      <Video className="w-4 h-4 text-purple-600" />
                      <span className="font-medium text-gray-900 text-sm">{evento.titulo.replace('📹 ', '')}</span>
                    </div>
                    <div className="text-xs text-gray-600 space-y-1">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(evento.dataInicio).toLocaleDateString('pt-BR')}</span>
                        <Clock className="w-3 h-3 ml-2" />
                        <span>
                          {new Date(evento.dataInicio).toLocaleTimeString('pt-BR', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="w-3 h-3" />
                        <span>{getUsuarioNome(evento.usuarioId)}</span>
                        {evento.clienteId && (
                          <>
                            <span>•</span>
                            <span>{getClienteNome(evento.clienteId)}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              
              {eventosFiltrados.filter(e => e.tipoEvento === 'reuniao' && new Date(e.dataInicio) > new Date()).length === 0 && (
                <p className="text-gray-500 text-sm text-center py-4">Nenhuma reunião próxima</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}