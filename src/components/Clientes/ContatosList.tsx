import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Plus, Edit2, Trash2, Mail, Phone, User, Briefcase, Award } from 'lucide-react';
import { ContatosModal } from './ContatosModal';

interface ContatosListProps {
  clienteId: string;
}

export function ContatosList({ clienteId }: ContatosListProps) {
  const { contatos, excluirContato } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [contatoEdit, setContatoEdit] = useState(null);

  const clienteContatos = contatos.filter(c => c.clienteId === clienteId && c.ativo);

  const handleEditContato = (contato: any) => {
    setContatoEdit(contato);
    setShowModal(true);
  };

  const handleExcluirContato = (contatoId: string) => {
    if (confirm('Tem certeza que deseja excluir este contato?')) {
      excluirContato(contatoId);
    }
  };

  const getSetorColor = (setor: string) => {
    const cores = {
      'TI': 'bg-blue-100 text-blue-700',
      'Financeiro': 'bg-green-100 text-green-700',
      'Comercial': 'bg-purple-100 text-purple-700',
      'Marketing': 'bg-pink-100 text-pink-700',
      'RH': 'bg-orange-100 text-orange-700',
      'Operações': 'bg-cyan-100 text-cyan-700',
    };
    return cores[setor as keyof typeof cores] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Contatos do Cliente</h3>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Contato</span>
        </button>
      </div>

      {/* Lista de Contatos */}
      {clienteContatos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {clienteContatos.map((contato) => (
            <div key={contato.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {contato.nome.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{contato.nome}</h4>
                    <p className="text-sm text-gray-600">{contato.funcao}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => handleEditContato(contato)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Editar contato"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleExcluirContato(contato.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Excluir contato"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span>{contato.email}</span>
                </div>
                
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Phone className="w-4 h-4" />
                  <span>{contato.whatsapp}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Briefcase className="w-4 h-4 text-gray-400" />
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSetorColor(contato.setor)}`}>
                    {contato.setor}
                  </span>
                </div>

                {contato.habilidades.length > 0 && (
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <Award className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-700">Habilidades:</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {contato.habilidades.slice(0, 3).map((habilidade, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                        >
                          {habilidade}
                        </span>
                      ))}
                      {contato.habilidades.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                          +{contato.habilidades.length - 3} mais
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <User className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>Nenhum contato cadastrado</p>
          <p className="text-sm mt-2">Adicione contatos para facilitar o agendamento de reuniões</p>
        </div>
      )}

      {showModal && (
        <ContatosModal
          clienteId={clienteId}
          contato={contatoEdit}
          onClose={() => {
            setShowModal(false);
            setContatoEdit(null);
          }}
        />
      )}
    </div>
  );
}