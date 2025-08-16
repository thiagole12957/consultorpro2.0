import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Plus, Video, Calendar, Users, Clock, Brain, FileText, Play, Search, Filter, Target, X, Lock, UserPlus, Copy } from 'lucide-react';
import { VideoConferencia } from './VideoConferencia';
import { VideoConferenciaAvancada } from './VideoConferenciaAvancada';
import { ReuniaoModal } from './ReuniaoModal';
import { FerramentasColaborativas } from './FerramentasColaborativas';
import { SalaReuniaoVirtual } from './SalaReuniaoVirtual';

export function ReunioesDashboard() {
  const { reunioes, clientes, contatos, adicionarReuniao } = useApp();
  const [showVideoConferencia, setShowVideoConferencia] = useState(false);
  const [showVideoAvancada, setShowVideoAvancada] = useState(false);
  const [reuniaoAtiva, setReuniaoAtiva] = useState<string | null>(null);
  const [showReuniaoModal, setShowReuniaoModal] = useState(false);
  const [showFerramentasColaborativas, setShowFerramentasColaborativas] = useState(false);
  const [showSalaVirtual, setShowSalaVirtual] = useState(false);
  const [filtroStatus, setFiltroStatus] = useState('todas');
  const [busca, setBusca] = useState('');

  const iniciarVideoConferencia = (reuniaoId: string) => {
    setReuniaoAtiva(reuniaoId);
    setShowVideoConferencia(true);
  };

  const iniciarVideoAvancada = (reuniaoId: string) => {
    setReuniaoAtiva(reuniaoId);
    setShowVideoAvancada(true);
  };

  const encerrarVideoConferencia = () => {
    setShowVideoConferencia(false);
    setShowVideoAvancada(false);
    setShowFerramentasColaborativas(false);
    setShowSalaVirtual(false);
    setReuniaoAtiva(null);
  };

  const criarReuniaoRapida = () => {
    const novaReuniao = {
      id: Date.now().toString(),
      clienteId: '',
      dataHoraInicio: new Date().toISOString(),
      dataHoraFim: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      canal: 'online' as const,
      linkLocal: `${window.location.origin}/reuniao/${Date.now()}`,
      objetivo: 'Reunião Rápida',
      pauta: ['Discussão geral'],
      participantes: [{
        id: 'host',
        tipo: 'interno' as const,
        nome: 'Você',
        email: 'admin@consultorpro.com',
        confirmado: true,
      }],
      responsavel: 'Sistema',
      status: 'agendada' as const,
      decisoes: [],
      tarefasGeradas: [],
      anexos: []
    };
    
    adicionarReuniao(novaReuniao);
    // Abrir reunião em nova aba
    window.open(novaReuniao.linkLocal, '_blank');
  };
  const criarReuniaoAvancada = () => {
    const novaReuniao = {
      id: Date.now().toString(),
      clienteId: '',
      dataHoraInicio: new Date().toISOString(),
      dataHoraFim: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 horas
      canal: 'online' as const,
      linkLocal: `${window.location.origin}/reuniao/${Date.now()}`,
      objetivo: 'Reunião Avançada com IA e Lousa Digital',
      pauta: ['Apresentação com lousa digital', 'Discussão colaborativa', 'Decisões com IA'],
      participantes: [{
        id: 'host',
        tipo: 'interno' as const,
        nome: 'Você (Host)',
        email: 'admin@consultorpro.com',
        confirmado: true,
      }],
      responsavel: 'Sistema Avançado',
      status: 'agendada' as const,
      decisoes: [],
      tarefasGeradas: [],
      anexos: []
    };
    
    adicionarReuniao(novaReuniao);
    // Abrir reunião avançada em nova aba
    window.open(novaReuniao.linkLocal, '_blank');
  };


  const getClienteNome = (clienteId: string) => {
    const cliente = clientes.find(c => c.id === clienteId);
    return cliente ? cliente.empresa : 'Reunião Interna';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'agendada': return 'bg-blue-100 text-blue-700';
      case 'realizada': return 'bg-green-100 text-green-700';
      case 'cancelada': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const reunioesFiltradas = reunioes.filter(reuniao => {
    const matchStatus = filtroStatus === 'todas' || reuniao.status === filtroStatus;
    const matchBusca = busca === '' || 
      reuniao.objetivo.toLowerCase().includes(busca.toLowerCase()) ||
      getClienteNome(reuniao.clienteId).toLowerCase().includes(busca.toLowerCase());
    
    return matchStatus && matchBusca;
  });

  if (showVideoConferencia && reuniaoAtiva) {
    const reuniao = reunioes.find(r => r.id === reuniaoAtiva);
    return (
      <VideoConferencia
        reuniaoId={reuniaoAtiva}
        participantes={reuniao?.participantes.map(p => p.nome) || ['Você']}
        onEncerrar={encerrarVideoConferencia}
      />
    );
  }

  if (showVideoAvancada && reuniaoAtiva) {
    const reuniao = reunioes.find(r => r.id === reuniaoAtiva);
    return (
      <VideoConferenciaAvancada
        reuniaoId={reuniaoAtiva}
        participantes={reuniao?.participantes.map(p => p.nome) || ['Você']}
        onEncerrar={encerrarVideoConferencia}
      />
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Reuniões & IA</h2>
          <p className="text-gray-600">Videoconferências avançadas com IA, lousa digital e muito mais</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={criarReuniaoAvancada}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
          >
            <Brain className="w-4 h-4" />
            <span>Reunião Avançada</span>
          </button>
          <button
            onClick={() => setShowFerramentasColaborativas(true)}
            className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:from-green-700 hover:to-emerald-700 transition-all duration-200"
          >
            <Target className="w-4 h-4" />
            <span>Enquetes</span>
          </button>
          <button
            onClick={() => setShowSalaVirtual(true)}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:from-indigo-700 hover:to-purple-700 transition-all duration-200"
          >
            <Users className="w-4 h-4" />
            <span>Sala Virtual</span>
          </button>
          <button
            onClick={criarReuniaoRapida}
            className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-700 transition-colors"
          >
            <Video className="w-4 h-4" />
            <span>Reunião Rápida</span>
          </button>
          <button
            onClick={() => setShowReuniaoModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Agendar Reunião</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg">
              <Calendar className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 mb-1">
              {reunioes.filter(r => r.status === 'agendada').length}
            </p>
            <p className="text-sm text-gray-600">Agendadas</p>
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
              {reunioes.filter(r => r.status === 'realizada').length}
            </p>
            <p className="text-sm text-gray-600">Realizadas</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 shadow-lg">
              <Brain className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 mb-1">
              {reunioes.filter(r => r.resumoIA).length}
            </p>
            <p className="text-sm text-gray-600">Com IA</p>
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
              {reunioes.reduce((acc, r) => acc + r.participantes.length, 0)}
            </p>
            <p className="text-sm text-gray-600">Participantes</p>
          </div>
        </div>
      </div>

      {/* Filtros e Busca */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Buscar reuniões..."
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={filtroStatus}
              onChange={(e) => setFiltroStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="todas">Todas</option>
              <option value="agendada">Agendadas</option>
              <option value="realizada">Realizadas</option>
              <option value="cancelada">Canceladas</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de Reuniões */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            {filtroStatus === 'agendada' ? 'Próximas Reuniões' : 
             filtroStatus === 'realizada' ? 'Reuniões Realizadas' : 'Todas as Reuniões'}
          </h3>
        </div>
        <div className="divide-y divide-gray-100">
          {reunioesFiltradas.length > 0 ? (
            reunioesFiltradas
              .sort((a, b) => new Date(b.dataHoraInicio).getTime() - new Date(a.dataHoraInicio).getTime())
              .map((reuniao) => (
                <div key={reuniao.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white">
                        {reuniao.canal === 'online' ? <Video className="w-6 h-6" /> : <Users className="w-6 h-6" />}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{reuniao.objetivo}</h4>
                        <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(reuniao.dataHoraInicio).toLocaleDateString('pt-BR')}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>
                              {new Date(reuniao.dataHoraInicio).toLocaleTimeString('pt-BR', { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users className="w-4 h-4" />
                            <span>{reuniao.participantes.length} participantes</span>
                          </div>
                          <span className="text-gray-500">•</span>
                          <span>{getClienteNome(reuniao.clienteId)}</span>
                          {reuniao.resumoIA && (
                            <>
                              <span className="text-gray-500">•</span>
                              <span className="flex items-center space-x-1 text-purple-600">
                                <Brain className="w-4 h-4" />
                                <span>Com IA</span>
                              </span>
                            </>
                          )}
                          {reuniao.configuracoes?.temSenha && (
                            <>
                              <span className="text-gray-500">•</span>
                              <span className="flex items-center space-x-1 text-yellow-600">
                                <Lock className="w-4 h-4" />
                                <span>Protegida</span>
                              </span>
                            </>
                          )}
                          {reuniao.configuracoes?.permitirConvidados && (
                            <>
                              <span className="text-gray-500">•</span>
                              <span className="flex items-center space-x-1 text-green-600">
                                <UserPlus className="w-4 h-4" />
                                <span>Convidados</span>
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(reuniao.status)}`}>
                        {reuniao.status === 'agendada' ? 'Agendada' :
                         reuniao.status === 'realizada' ? 'Realizada' : 'Cancelada'}
                      </span>
                      
                      {reuniao.status === 'agendada' && (
                        <button
                          onClick={() => window.open(reuniao.linkLocal, '_blank')}
                          className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-700 transition-colors"
                        >
                          <Play className="w-4 h-4" />
                          <span>Iniciar</span>
                        </button>
                      )}
                      
                      {reuniao.status === 'agendada' && (
                        <button 
                          onClick={() => window.open(reuniao.linkLocal, '_blank')}
                          className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-3 py-1 rounded-lg flex items-center space-x-1 hover:from-purple-700 hover:to-blue-700 transition-all duration-200 text-sm"
                        >
                          <Brain className="w-3 h-3" />
                          <span>Avançada</span>
                        </button>
                      )}
                      
                      {reuniao.status === 'agendada' && (
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(reuniao.linkLocal);
                            alert('Link copiado! Compartilhe com os participantes.');
                          }}
                          className="bg-blue-600 text-white px-3 py-1 rounded-lg flex items-center space-x-1 hover:bg-blue-700 transition-colors text-sm"
                        >
                          <Copy className="w-3 h-3" />
                          <span>Copiar Link</span>
                        </button>
                      )}
                      
                      {reuniao.status === 'realizada' && reuniao.resumoIA && (
                        <button
                          onClick={() => {
                            alert(`Resumo da Reunião:\n\n${reuniao.resumoIA}`);
                          }}
                          className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-purple-700 transition-colors"
                        >
                          <Brain className="w-4 h-4" />
                          <span>Ver Resumo IA</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Participantes */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-700">Participantes:</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {reuniao.participantes.map((participante, index) => {
                        const contato = participante.contatoClienteId ? 
                          contatos.find(c => c.id === participante.contatoClienteId) : null;
                        const cliente = contato ? clientes.find(c => c.id === contato.clienteId) : null;
                        
                        return (
                          <div key={index} className="flex items-center space-x-2 bg-gray-100 px-3 py-1 rounded-full">
                            <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-xs">
                              {participante.nome.split(' ').map(n => n[0]).join('').slice(0, 2)}
                            </div>
                            <span className="text-sm text-gray-700">{participante.nome}</span>
                            {cliente && (
                              <span className="text-xs text-gray-500">({cliente.empresa})</span>
                            )}
                            {participante.confirmado && (
                              <div className="w-2 h-2 bg-green-500 rounded-full" title="Confirmado"></div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Pauta */}
                  {reuniao.pauta.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center space-x-2 mb-2">
                        <FileText className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-700">Pauta:</span>
                      </div>
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
              ))
          ) : (
            <div className="p-8 text-center text-gray-500">
              <Video className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhuma reunião encontrada</h3>
              <p className="text-gray-600 mb-4">
                {busca ? 'Tente ajustar os filtros de busca' : 'Comece agendando sua primeira reunião'}
              </p>
              <button
                onClick={() => setShowReuniaoModal(true)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors mx-auto"
              >
                <Plus className="w-5 h-5" />
                <span>Agendar Primeira Reunião</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal Nova Reunião */}
      {showReuniaoModal && (
        <ReuniaoModal onClose={() => setShowReuniaoModal(false)} />
      )}

      {/* Modal Ferramentas Colaborativas */}
      {showFerramentasColaborativas && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Ferramentas Colaborativas</h2>
              <button
                onClick={() => setShowFerramentasColaborativas(false)}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <FerramentasColaborativas 
                reuniaoId="demo-colaborativa" 
                isHost={true}
              />
            </div>
          </div>
        </div>
      )}

      {/* Modal Sala Virtual */}
      {showSalaVirtual && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Sala Virtual Avançada</h2>
              <button
                onClick={() => setShowSalaVirtual(false)}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <SalaReuniaoVirtual 
                reuniaoId="demo-sala-virtual" 
                isHost={true}
                participantes={['Você', 'João Silva', 'Maria Santos', 'Carlos Oliveira']}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}