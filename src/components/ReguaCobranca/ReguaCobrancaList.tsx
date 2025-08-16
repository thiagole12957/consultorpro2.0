import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Plus, Edit2, Eye, Play, Pause, Settings, Mail, MessageSquare, Phone, Calendar, Clock, BarChart3, AlertTriangle } from 'lucide-react';
import { ReguaCobrancaModal } from './ReguaCobrancaModal';

export function ReguaCobrancaList() {
  const { regrasCobranca, carteirasCobranca, historicoCobranca, logsCobranca } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [regraEdit, setRegraEdit] = useState(null);

  const getCarteiraCobrancaNome = (carteiraId: string) => {
    const carteira = carteirasCobranca.find(c => c.id === carteiraId);
    return carteira ? `${carteira.nome} (${carteira.tipo === 'bancaria' ? 'Bancária' : 'Interna'})` : 'Carteira não encontrada';
  };

  const getCanalIcon = (tipo: string) => {
    switch (tipo) {
      case 'email': return <Mail className="w-4 h-4 text-blue-600" />;
      case 'sms': return <MessageSquare className="w-4 h-4 text-green-600" />;
      case 'whatsapp_oficial': return <Phone className="w-4 h-4 text-emerald-600" />;
      case 'whatsapp_web': return <MessageSquare className="w-4 h-4 text-teal-600" />;
      default: return <Settings className="w-4 h-4 text-gray-600" />;
    }
  };

  const handleEditRegra = (regra: any) => {
    setRegraEdit(regra);
    setShowModal(true);
  };

  const toggleRegraStatus = (regraId: string, ativa: boolean) => {
    if (confirm(`Deseja ${ativa ? 'ativar' : 'pausar'} esta régua de cobrança?`)) {
      atualizarRegraCobranca(regraId, { ativa, atualizadoEm: new Date().toISOString().split('T')[0] });
    }
  };

  const executarRegraTeste = (regraId: string) => {
    if (confirm('Deseja executar um teste desta régua de cobrança?')) {
      // Lógica para executar teste
      alert('Teste da régua executado com sucesso!');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">Réguas de Cobrança Automática</h3>
          <p className="text-gray-600">Configure cobranças automáticas por carteira</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Nova Régua</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg">
              <Settings className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 mb-1">{regrasCobranca.length}</p>
            <p className="text-sm text-gray-600">Total de Réguas</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-green-500 to-green-600 shadow-lg">
              <Play className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 mb-1">
              {regrasCobranca.filter(r => r.ativa).length}
            </p>
            <p className="text-sm text-gray-600">Ativas</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 shadow-lg">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 mb-1">
              {historicoCobranca.length}
            </p>
            <p className="text-sm text-gray-600">Envios Hoje</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 mb-1">
              {historicoCobranca.filter(h => h.status === 'erro').length}
            </p>
            <p className="text-sm text-gray-600">Erros</p>
          </div>
        </div>
      </div>

      {/* Lista de Réguas */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Régua</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Carteira</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Canais</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Configuração</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Última Execução</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Status</th>
                <th className="text-right py-4 px-6 font-semibold text-gray-900">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {regrasCobranca.length > 0 ? (
                regrasCobranca.map((regra) => {
                  const ultimoLog = logsCobranca
                    .filter(l => l.regraCobrancaId === regra.id)
                    .sort((a, b) => new Date(b.dataExecucao).getTime() - new Date(a.dataExecucao).getTime())[0];

                  return (
                    <tr key={regra.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                            <Settings className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{regra.nome}</p>
                            <p className="text-sm text-gray-500">{regra.descricao}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-gray-700 text-sm">
                          {getCarteiraCobrancaNome(regra.carteiraCobrancaId)}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex space-x-1">
                          {regra.canais.filter(c => c.ativo).map((canal, index) => (
                            <div key={index} className="p-1 rounded" title={canal.tipo}>
                              {getCanalIcon(canal.tipo)}
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-sm text-gray-600">
                          <p>Pré: {regra.configuracoes.diasAntesVencimento.join(', ')} dias</p>
                          <p>Pós: {regra.configuracoes.diasAposVencimento.join(', ')} dias</p>
                          <p>Horário: {regra.configuracoes.horarioEnvio}</p>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        {ultimoLog ? (
                          <div className="text-sm">
                            <p className="text-gray-900">{new Date(ultimoLog.dataExecucao).toLocaleDateString('pt-BR')}</p>
                            <p className="text-gray-500">{ultimoLog.enviosRealizados} envios</p>
                          </div>
                        ) : (
                          <span className="text-gray-500 text-sm">Nunca executada</span>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          regra.ativa ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {regra.ativa ? 'Ativa' : 'Pausada'}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => executarRegraTeste(regra.id)}
                            className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                            title="Executar teste"
                          >
                            <Play className="w-4 h-4" />
                          </button>
                          
                          <button
                            onClick={() => toggleRegraStatus(regra.id, !regra.ativa)}
                            className={`p-2 rounded-lg transition-colors ${
                              regra.ativa 
                                ? 'text-yellow-600 hover:bg-yellow-50' 
                                : 'text-green-600 hover:bg-green-50'
                            }`}
                            title={regra.ativa ? 'Pausar régua' : 'Ativar régua'}
                          >
                            {regra.ativa ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                          </button>
                          
                          <button
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Ver relatórios"
                          >
                            <BarChart3 className="w-4 h-4" />
                          </button>
                          
                          <button
                            onClick={() => handleEditRegra(regra)}
                            className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                            title="Editar régua"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-500">
                    <Settings className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>Nenhuma régua de cobrança encontrada</p>
                    <p className="text-sm mt-2">Crie réguas para automatizar a cobrança</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Próximas Execuções */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-blue-600" />
            <h4 className="text-lg font-semibold text-gray-900">Próximas Execuções</h4>
          </div>
        </div>
        
        <div className="p-6">
          <div className="space-y-3">
            {regrasCobranca.filter(r => r.ativa).slice(0, 5).map((regra) => (
              <div key={regra.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <div>
                    <p className="font-medium text-blue-900">{regra.nome}</p>
                    <p className="text-sm text-blue-700">
                      Próxima execução: Hoje às {regra.configuracoes.horarioEnvio}
                    </p>
                  </div>
                </div>
                <span className="text-sm text-blue-600 font-medium">
                  {regra.canais.filter(c => c.ativo).length} canais
                </span>
              </div>
            ))}
            
            {regrasCobranca.filter(r => r.ativa).length === 0 && (
              <p className="text-gray-500 text-center py-4">Nenhuma régua ativa</p>
            )}
          </div>
        </div>
      </div>

      {showModal && (
        <ReguaCobrancaModal
          regra={regraEdit}
          onClose={() => {
            setShowModal(false);
            setRegraEdit(null);
          }}
        />
      )}
    </div>
  );
}