import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Plus, Video, Calendar, Users, FileText, Brain, Play } from 'lucide-react';
import { ReuniaoModal } from '../Reunioes/ReuniaoModal';

interface ReunioesBriefingsProps {
  clienteId: string;
}

export function ReunioesBriefings({ clienteId }: ReunioesBriefingsProps) {
  const { reunioes, contatos, clientes, adicionarReuniao } = useApp();
  const [showReuniaoModal, setShowReuniaoModal] = useState(false);

  const clienteReunioes = reunioes.filter(r => r.clienteId === clienteId);
  const clienteContatos = contatos.filter(c => c.clienteId === clienteId && c.ativo);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'agendada': return 'bg-blue-100 text-blue-700';
      case 'realizada': return 'bg-green-100 text-green-700';
      case 'cancelada': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const criarReuniaoRapida = () => {
    const novaReuniao = {
      id: Date.now().toString(),
      clienteId,
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Reuniões & Briefings</h3>
          <p className="text-gray-600">Histórico de reuniões e documentos</p>
        </div>
        <div className="flex space-x-3">
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
            <span>Agendar</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg">
              <Calendar className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 mb-1">
              {clienteReunioes.filter(r => r.status === 'agendada').length}
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
              {clienteReunioes.filter(r => r.status === 'realizada').length}
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
              {clienteReunioes.filter(r => r.resumoIA).length}
            </p>
            <p className="text-sm text-gray-600">Com IA</p>
          </div>
        </div>
      </div>

      {/* Lista de Reuniões */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <h4 className="text-lg font-semibold text-gray-900">Reuniões do Cliente</h4>
        </div>
        <div className="divide-y divide-gray-100">
          {clienteReunioes.length > 0 ? (
            clienteReunioes
              .sort((a, b) => new Date(b.dataHoraInicio).getTime() - new Date(a.dataHoraInicio).getTime())
              .map((reuniao) => (
                <div key={reuniao.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h5 className="font-semibold text-gray-900">{reuniao.objetivo}</h5>
                      <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(reuniao.dataHoraInicio).toLocaleDateString('pt-BR')}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="w-4 h-4" />
                          <span>{reuniao.participantes.length} participantes</span>
                        </div>
                        {reuniao.resumoIA && (
                          <div className="flex items-center space-x-1 text-purple-600">
                            <Brain className="w-4 h-4" />
                            <span>Com IA</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(reuniao.status)}`}>
                        {reuniao.status === 'agendada' ? 'Agendada' :
                         reuniao.status === 'realizada' ? 'Realizada' : 'Cancelada'}
                      </span>
                      
                      {reuniao.status === 'agendada' && (
                        <button className="bg-green-600 text-white px-3 py-1 rounded-lg flex items-center space-x-1 hover:bg-green-700 transition-colors text-sm">
                          <Play className="w-3 h-3" />
                          <span>Iniciar</span>
                        </button>
                      )}
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

                  {/* Resumo IA */}
                  {reuniao.resumoIA && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center space-x-2 mb-2">
                        <Brain className="w-4 h-4 text-purple-600" />
                        <span className="text-sm font-medium text-purple-700">Resumo IA:</span>
                      </div>
                      <div className="bg-purple-50 p-3 rounded-lg">
                        <p className="text-sm text-purple-800 whitespace-pre-line">
                          {reuniao.resumoIA.substring(0, 200)}...
                        </p>
                        <button className="text-purple-600 hover:text-purple-700 text-xs mt-2">
                          Ver resumo completo
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))
          ) : (
            <div className="p-8 text-center text-gray-500">
              <Video className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Nenhuma reunião encontrada</h4>
              <p className="text-gray-600 mb-4">Agende a primeira reunião com este cliente</p>
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

      {showReuniaoModal && (
        <ReuniaoModal onClose={() => setShowReuniaoModal(false)} />
      )}
    </div>
  );
}