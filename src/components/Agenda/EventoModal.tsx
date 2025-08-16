import React, { useState } from 'react';
import { X, Save, Calendar, Clock, Users, Bell, Repeat, MapPin, Tag, Plus } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { EventoAgenda, NotificacaoEvento, RecorrenciaEvento } from '../../types/agenda';

interface EventoModalProps {
  evento?: EventoAgenda | null;
  onClose: () => void;
}

export function EventoModal({ evento, onClose }: EventoModalProps) {
  const { adicionarEventoAgenda, atualizarEventoAgenda, usuarioLogado, clientes, reunioes } = useApp();
  const isEdit = !!evento;
  
  const [formData, setFormData] = useState({
    titulo: evento?.titulo || '',
    descricao: evento?.descricao || '',
    dataInicio: evento?.dataInicio || new Date().toISOString().slice(0, 16),
    dataFim: evento?.dataFim || new Date(Date.now() + 60 * 60 * 1000).toISOString().slice(0, 16),
    tipoEvento: evento?.tipoEvento || 'compromisso',
    prioridade: evento?.prioridade || 'media',
    status: evento?.status || 'agendado',
    local: evento?.local || '',
    categoria: evento?.categoria || 'Geral',
    cor: evento?.cor || '#3B82F6',
    clienteId: evento?.clienteId || '',
    reuniaoId: evento?.reuniaoId || '',
    observacoes: evento?.observacoes || '',
  });

  const [notificacoes, setNotificacoes] = useState<NotificacaoEvento[]>(
    evento?.notificacoes || [
      {
        id: '1',
        tipo: 'popup',
        antecedenciaMinutos: 15,
        ativa: true
      }
    ]
  );

  const [recorrencia, setRecorrencia] = useState<RecorrenciaEvento | undefined>(evento?.recorrencia);
  const [temRecorrencia, setTemRecorrencia] = useState(!!evento?.recorrencia);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!usuarioLogado) {
      alert('Usuário não logado');
      return;
    }
    
    if (isEdit && evento) {
      atualizarEventoAgenda(evento.id, {
        ...formData,
        notificacoes,
        recorrencia: temRecorrencia ? recorrencia : undefined,
        atualizadoEm: new Date().toISOString(),
      });
    } else {
      const novoEvento: EventoAgenda = {
        id: Date.now().toString(),
        usuarioId: usuarioLogado.id,
        ...formData,
        notificacoes,
        recorrencia: temRecorrencia ? recorrencia : undefined,
        criadoEm: new Date().toISOString(),
        atualizadoEm: new Date().toISOString(),
      };
      adicionarEventoAgenda(novoEvento);
    }
    
    onClose();
  };

  const adicionarNotificacao = () => {
    const novaNotificacao: NotificacaoEvento = {
      id: Date.now().toString(),
      tipo: 'popup',
      antecedenciaMinutos: 15,
      ativa: true
    };
    setNotificacoes([...notificacoes, novaNotificacao]);
  };

  const removerNotificacao = (index: number) => {
    setNotificacoes(notificacoes.filter((_, i) => i !== index));
  };

  const atualizarNotificacao = (index: number, campo: string, valor: any) => {
    const novasNotificacoes = [...notificacoes];
    novasNotificacoes[index] = { ...novasNotificacoes[index], [campo]: valor };
    setNotificacoes(novasNotificacoes);
  };

  const cores = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', 
    '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1'
  ];

  const categorias = ['Geral', 'Trabalho', 'Pessoal', 'Cliente', 'Projeto', 'Reunião', 'Tarefa'];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {isEdit ? 'Editar Evento' : 'Novo Evento'}
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
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Informações do Evento</h3>
            <div className="space-y-4">
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
                  Descrição
                </label>
                <textarea
                  value={formData.descricao}
                  onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Descrição do evento"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data/Hora Início *
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.dataInicio}
                    onChange={(e) => setFormData(prev => ({ ...prev, dataInicio: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data/Hora Fim *
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.dataFim}
                    onChange={(e) => setFormData(prev => ({ ...prev, dataFim: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo
                  </label>
                  <select
                    value={formData.tipoEvento}
                    onChange={(e) => setFormData(prev => ({ ...prev, tipoEvento: e.target.value as EventoAgenda['tipoEvento'] }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="compromisso">Compromisso</option>
                    <option value="reuniao">Reunião</option>
                    <option value="tarefa">Tarefa</option>
                    <option value="lembrete">Lembrete</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prioridade
                  </label>
                  <select
                    value={formData.prioridade}
                    onChange={(e) => setFormData(prev => ({ ...prev, prioridade: e.target.value as EventoAgenda['prioridade'] }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="baixa">Baixa</option>
                    <option value="media">Média</option>
                    <option value="alta">Alta</option>
                    <option value="urgente">Urgente</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as EventoAgenda['status'] }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="agendado">Agendado</option>
                    <option value="confirmado">Confirmado</option>
                    <option value="realizado">Realizado</option>
                    <option value="cancelado">Cancelado</option>
                    <option value="adiado">Adiado</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Categoria
                  </label>
                  <select
                    value={formData.categoria}
                    onChange={(e) => setFormData(prev => ({ ...prev, categoria: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {categorias.map(categoria => (
                      <option key={categoria} value={categoria}>{categoria}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cor
                  </label>
                  <div className="flex space-x-2">
                    {cores.map(cor => (
                      <button
                        key={cor}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, cor }))}
                        className={`w-8 h-8 rounded-full border-2 transition-all ${
                          formData.cor === cor ? 'border-gray-400 scale-110' : 'border-gray-200'
                        }`}
                        style={{ backgroundColor: cor }}
                      />
                    ))}
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Local
                </label>
                <input
                  type="text"
                  value={formData.local}
                  onChange={(e) => setFormData(prev => ({ ...prev, local: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Local do evento"
                />
              </div>
            </div>
          </div>

          {/* Vinculações */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Vinculações</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cliente (Opcional)
                </label>
                <select
                  value={formData.clienteId}
                  onChange={(e) => setFormData(prev => ({ ...prev, clienteId: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Nenhum cliente</option>
                  {clientes.map(cliente => (
                    <option key={cliente.id} value={cliente.id}>
                      {cliente.empresa} - {cliente.nome}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reunião (Opcional)
                </label>
                <select
                  value={formData.reuniaoId}
                  onChange={(e) => setFormData(prev => ({ ...prev, reuniaoId: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Nenhuma reunião</option>
                  {reunioes
                    .filter(r => r.status === 'agendada')
                    .map(reuniao => (
                      <option key={reuniao.id} value={reuniao.id}>
                        {reuniao.objetivo} - {new Date(reuniao.dataHoraInicio).toLocaleDateString('pt-BR')}
                      </option>
                    ))}
                </select>
              </div>
            </div>
          </div>

          {/* Notificações */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Notificações</h3>
              <button
                type="button"
                onClick={adicionarNotificacao}
                className="bg-green-600 text-white px-3 py-1 rounded-lg flex items-center space-x-1 hover:bg-green-700 transition-colors text-sm"
              >
                <Plus className="w-3 h-3" />
                <span>Adicionar</span>
              </button>
            </div>
            
            <div className="space-y-3">
              {notificacoes.map((notificacao, index) => (
                <div key={notificacao.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tipo
                      </label>
                      <select
                        value={notificacao.tipo}
                        onChange={(e) => atualizarNotificacao(index, 'tipo', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      >
                        <option value="popup">Pop-up</option>
                        <option value="email">E-mail</option>
                        <option value="push">Push</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Antecedência (min)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={notificacao.antecedenciaMinutos}
                        onChange={(e) => atualizarNotificacao(index, 'antecedenciaMinutos', Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      />
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id={`notif-${index}`}
                        checked={notificacao.ativa}
                        onChange={(e) => atualizarNotificacao(index, 'ativa', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor={`notif-${index}`} className="ml-2 text-sm text-gray-900">
                        Ativa
                      </label>
                    </div>
                    
                    <div className="flex items-end">
                      <button
                        type="button"
                        onClick={() => removerNotificacao(index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        disabled={notificacoes.length === 1}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recorrência */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <input
                type="checkbox"
                id="temRecorrencia"
                checked={temRecorrencia}
                onChange={(e) => setTemRecorrencia(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="temRecorrencia" className="text-lg font-semibold text-gray-900">
                Evento Recorrente
              </label>
            </div>
            
            {temRecorrencia && (
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tipo de Recorrência
                    </label>
                    <select
                      value={recorrencia?.tipo || 'semanal'}
                      onChange={(e) => setRecorrencia(prev => ({ 
                        ...prev, 
                        tipo: e.target.value as RecorrenciaEvento['tipo'],
                        intervalo: 1 
                      } as RecorrenciaEvento))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    >
                      <option value="diario">Diário</option>
                      <option value="semanal">Semanal</option>
                      <option value="mensal">Mensal</option>
                      <option value="anual">Anual</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      A cada
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="365"
                      value={recorrencia?.intervalo || 1}
                      onChange={(e) => setRecorrencia(prev => ({ 
                        ...prev, 
                        intervalo: Number(e.target.value) 
                      } as RecorrenciaEvento))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Termina em (opcional)
                    </label>
                    <input
                      type="date"
                      value={recorrencia?.dataFim || ''}
                      onChange={(e) => setRecorrencia(prev => ({ 
                        ...prev, 
                        dataFim: e.target.value 
                      } as RecorrenciaEvento))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Máx. ocorrências
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={recorrencia?.ocorrenciasMaximas || ''}
                      onChange={(e) => setRecorrencia(prev => ({ 
                        ...prev, 
                        ocorrenciasMaximas: Number(e.target.value) || undefined 
                      } as RecorrenciaEvento))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      placeholder="Ilimitado"
                    />
                  </div>
                </div>
              </div>
            )}
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
              placeholder="Observações adicionais"
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
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>{isEdit ? 'Salvar Evento' : 'Criar Evento'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}