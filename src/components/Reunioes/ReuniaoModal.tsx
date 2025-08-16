import React, { useState } from 'react';
import { X, Save, Plus, Trash2, Users, Calendar, Clock, Video, MapPin } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { Reuniao, ParticipanteReuniao } from '../../types';

interface ReuniaoModalProps {
  reuniao?: Reuniao | null;
  onClose: () => void;
}

export function ReuniaoModal({ reuniao, onClose }: ReuniaoModalProps) {
  const { adicionarReuniao, atualizarReuniao, clientes, contatos } = useApp();
  const isEdit = !!reuniao;
  
  const [formData, setFormData] = useState({
    objetivo: reuniao?.objetivo || '',
    dataHoraInicio: reuniao?.dataHoraInicio || '',
    dataHoraFim: reuniao?.dataHoraFim || '',
    canal: reuniao?.canal || 'online',
    linkLocal: reuniao?.linkLocal || '',
    pauta: reuniao?.pauta || [''],
    responsavel: reuniao?.responsavel || 'Consultor',
    clienteId: reuniao?.clienteId || '',
    temSenha: reuniao?.configuracoes?.temSenha || false,
    senhaReuniao: reuniao?.configuracoes?.senhaReuniao || '',
    permitirConvidados: reuniao?.configuracoes?.permitirConvidados ?? true,
  });

  const [participantes, setParticipantes] = useState<ParticipanteReuniao[]>(
    reuniao?.participantes || []
  );

  const [novoParticipante, setNovoParticipante] = useState({
    tipo: 'lead' as 'cliente_contato' | 'lead' | 'interno',
    contatoClienteId: '',
    nome: '',
    email: '',
  });

  const generateMeetingLink = () => {
    const meetingId = Math.random().toString(36).substring(2, 15);
    return `${window.location.origin}/reuniao/${meetingId}`;
  };

  const adicionarParticipante = () => {
    if (novoParticipante.tipo === 'cliente_contato' && !novoParticipante.contatoClienteId) {
      alert('Selecione um contato do cliente');
      return;
    }
    
    if (novoParticipante.tipo === 'lead' && (!novoParticipante.nome || !novoParticipante.email)) {
      alert('Preencha nome e email do lead');
      return;
    }

    let nome = novoParticipante.nome;
    let email = novoParticipante.email;

    if (novoParticipante.tipo === 'cliente_contato') {
      const contato = contatos.find(c => c.id === novoParticipante.contatoClienteId);
      if (contato) {
        nome = contato.nome;
        email = contato.email;
      }
    }

    const participante: ParticipanteReuniao = {
      id: Date.now().toString(),
      tipo: novoParticipante.tipo,
      contatoClienteId: novoParticipante.contatoClienteId || undefined,
      nome,
      email,
      confirmado: false,
    };

    setParticipantes(prev => [...prev, participante]);
    setNovoParticipante({
      tipo: 'lead',
      contatoClienteId: '',
      nome: '',
      email: '',
    });
  };

  const removerParticipante = (index: number) => {
    setParticipantes(prev => prev.filter((_, i) => i !== index));
  };

  const adicionarItemPauta = () => {
    setFormData(prev => ({
      ...prev,
      pauta: [...prev.pauta, '']
    }));
  };

  const removerItemPauta = (index: number) => {
    setFormData(prev => ({
      ...prev,
      pauta: prev.pauta.filter((_, i) => i !== index)
    }));
  };

  const atualizarItemPauta = (index: number, valor: string) => {
    setFormData(prev => ({
      ...prev,
      pauta: prev.pauta.map((item, i) => i === index ? valor : item)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (participantes.length === 0) {
      alert('Adicione pelo menos um participante à reunião');
      return;
    }

    const pautaFiltrada = formData.pauta.filter(item => item.trim() !== '');
    
    const dadosReuniao = {
      ...formData,
      pauta: pautaFiltrada,
      participantes,
      linkLocal: formData.canal === 'online' ? (formData.linkLocal || generateMeetingLink()) : formData.linkLocal,
      clienteId: formData.clienteId || '',
      status: 'agendada' as const,
      decisoes: [],
      tarefasGeradas: [],
      anexos: [],
      configuracoes: {
        temSenha: formData.temSenha,
        senhaReuniao: formData.senhaReuniao,
        permitirConvidados: formData.permitirConvidados,
        moderacaoObrigatoria: false,
        gravacaoAutomatica: true,
        transcricaoIA: true,
      },
      convidados: [],
    };

    if (isEdit && reuniao) {
      atualizarReuniao(reuniao.id, dadosReuniao);
    } else {
      const novaReuniao: Reuniao = {
        id: Date.now().toString(),
        ...dadosReuniao,
      };
      adicionarReuniao(novaReuniao);
      
      // Salvar no localStorage para acesso público
      const reunioesExistentes = JSON.parse(localStorage.getItem('reunioes') || '[]');
      reunioesExistentes.push(novaReuniao);
      localStorage.setItem('reunioes', JSON.stringify(reunioesExistentes));
    }
    
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {isEdit ? 'Editar Reunião' : 'Nova Reunião'}
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
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Informações da Reunião</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Objetivo da Reunião *
                </label>
                <input
                  type="text"
                  required
                  value={formData.objetivo}
                  onChange={(e) => setFormData(prev => ({ ...prev, objetivo: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: Reunião de alinhamento do projeto ERP"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data e Hora de Início *
                </label>
                <input
                  type="datetime-local"
                  required
                  value={formData.dataHoraInicio}
                  onChange={(e) => setFormData(prev => ({ ...prev, dataHoraInicio: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data e Hora de Fim *
                </label>
                <input
                  type="datetime-local"
                  required
                  value={formData.dataHoraFim}
                  onChange={(e) => setFormData(prev => ({ ...prev, dataHoraFim: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Reunião
                </label>
                <select
                  value={formData.canal}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    canal: e.target.value as 'online' | 'presencial',
                    linkLocal: e.target.value === 'online' ? generateMeetingLink() : ''
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="online">Online (Videoconferência)</option>
                  <option value="presencial">Presencial</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Responsável
                </label>
                <input
                  type="text"
                  value={formData.responsavel}
                  onChange={(e) => setFormData(prev => ({ ...prev, responsavel: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nome do responsável"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cliente (Opcional)
                </label>
                <select
                  value={formData.clienteId || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, clienteId: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Reunião interna</option>
                  {clientes.map(cliente => (
                    <option key={cliente.id} value={cliente.id}>
                      {cliente.nome} - {cliente.empresa}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {formData.canal === 'online' && formData.linkLocal && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Video className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900">Link da Videoconferência:</span>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="url"
                    value={formData.linkLocal}
                    onChange={(e) => setFormData(prev => ({ ...prev, linkLocal: e.target.value }))}
                    className="flex-1 px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, linkLocal: generateMeetingLink() }))}
                    className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    Gerar Novo
                  </button>
                  <button
                    type="button"
                    onClick={() => navigator.clipboard.writeText(formData.linkLocal)}
                    className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                  >
                    Copiar
                  </button>
                </div>
                <p className="text-xs text-blue-600 mt-2">
                  💡 Compartilhe este link com os participantes. Eles poderão entrar como convidados.
                </p>
              </div>
            )}

            {formData.canal === 'presencial' && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Local da Reunião
                </label>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={formData.linkLocal}
                    onChange={(e) => setFormData(prev => ({ ...prev, linkLocal: e.target.value }))}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Endereço do local da reunião"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Configurações de Segurança */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Configurações de Segurança</h3>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="permitirConvidados"
                  checked={formData.permitirConvidados}
                  onChange={(e) => setFormData(prev => ({ ...prev, permitirConvidados: e.target.checked }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="permitirConvidados" className="ml-2 block text-sm text-gray-900">
                  Permitir entrada de convidados (sem login)
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="temSenha"
                  checked={formData.temSenha}
                  onChange={(e) => setFormData(prev => ({ ...prev, temSenha: e.target.checked }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="temSenha" className="ml-2 block text-sm text-gray-900">
                  Proteger reunião com senha
                </label>
              </div>
              
              {formData.temSenha && (
                <div className="ml-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Senha da Reunião
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={formData.senhaReuniao}
                      onChange={(e) => setFormData(prev => ({ ...prev, senhaReuniao: e.target.value }))}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Digite uma senha"
                      maxLength={10}
                    />
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ 
                        ...prev, 
                        senhaReuniao: Math.random().toString(36).substring(2, 8).toUpperCase() 
                      }))}
                      className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                    >
                      Gerar
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Compartilhe esta senha apenas com os participantes autorizados
                  </p>
                </div>
              )}
            </div>
          </div>
          {/* Participantes */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Participantes</h3>
              <span className="text-sm text-gray-500">{participantes.length} participantes</span>
            </div>

            {/* Adicionar Participante */}
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <h4 className="font-medium text-gray-900 mb-3">Adicionar Participante</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div>
                  <select
                    value={novoParticipante.tipo}
                    onChange={(e) => setNovoParticipante(prev => ({ 
                      ...prev, 
                      tipo: e.target.value as any,
                      contatoClienteId: '',
                      nome: '',
                      email: ''
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  >
                    <option value="lead">Lead/Prospect</option>
                    <option value="cliente_contato">Contato do Cliente</option>
                    <option value="interno">Equipe Interna</option>
                  </select>
                </div>

                {novoParticipante.tipo === 'cliente_contato' ? (
                  <div className="md:col-span-2">
                    <select
                      value={novoParticipante.contatoClienteId}
                      onChange={(e) => setNovoParticipante(prev => ({ ...prev, contatoClienteId: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    >
                      <option value="">Selecione um contato</option>
                      {formData.clienteId ? (
                        contatos
                          .filter(c => c.clienteId === formData.clienteId && c.ativo)
                          .map(contato => (
                            <option key={contato.id} value={contato.id}>
                              {contato.nome} - {contato.funcao} ({contato.setor})
                            </option>
                          ))
                      ) : (
                        <option value="" disabled>Selecione um cliente primeiro</option>
                      )}
                    </select>
                  </div>
                ) : (
                  <>
                    <div>
                      <input
                        type="text"
                        value={novoParticipante.nome}
                        onChange={(e) => setNovoParticipante(prev => ({ ...prev, nome: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        placeholder="Nome completo"
                      />
                    </div>
                    <div>
                      <input
                        type="email"
                        value={novoParticipante.email}
                        onChange={(e) => setNovoParticipante(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        placeholder="email@exemplo.com"
                      />
                    </div>
                  </>
                )}

                <div>
                  <button
                    type="button"
                    onClick={adicionarParticipante}
                    className="w-full bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center justify-center space-x-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Adicionar</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Lista de Participantes */}
            <div className="space-y-2">
              {participantes.map((participante, index) => {
                const contato = participante.contatoClienteId ? 
                  contatos.find(c => c.id === participante.contatoClienteId) : null;
                const cliente = contato ? clientes.find(c => c.id === contato.clienteId) : null;

                return (
                  <div key={participante.id} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {participante.nome.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{participante.nome}</p>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <span>{participante.email}</span>
                          {contato && cliente && (
                            <>
                              <span>•</span>
                              <span>{cliente.empresa}</span>
                              <span>•</span>
                              <span>{contato.funcao}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        participante.tipo === 'cliente_contato' ? 'bg-blue-100 text-blue-700' :
                        participante.tipo === 'lead' ? 'bg-green-100 text-green-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {participante.tipo === 'cliente_contato' ? 'Cliente' :
                         participante.tipo === 'lead' ? 'Lead' : 'Interno'}
                      </span>
                      
                      <button
                        type="button"
                        onClick={() => removerParticipante(index)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pauta */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Pauta da Reunião</h3>
              <button
                type="button"
                onClick={adicionarItemPauta}
                className="bg-green-600 text-white px-3 py-1 rounded-lg flex items-center space-x-1 hover:bg-green-700 transition-colors text-sm"
              >
                <Plus className="w-3 h-3" />
                <span>Adicionar Item</span>
              </button>
            </div>
            
            <div className="space-y-2">
              {formData.pauta.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500 w-6">{index + 1}.</span>
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => atualizarItemPauta(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="Descreva o item da pauta"
                  />
                  <button
                    type="button"
                    onClick={() => removerItemPauta(index)}
                    className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                    disabled={formData.pauta.length === 1}
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
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
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>{isEdit ? 'Salvar Reunião' : 'Agendar Reunião'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}