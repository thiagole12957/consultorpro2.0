import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Plus, Target, TrendingUp, Edit2, Trash2, CheckCircle, Clock, AlertTriangle, X } from 'lucide-react';
import { MetaMensal } from '../../types/consultoria';

interface MetasMensaisProps {
  clienteId: string;
  mesAno: string;
}

export function MetasMensais({ clienteId, mesAno }: MetasMensaisProps) {
  const { metasMensais, adicionarMetaMensal, atualizarMetaMensal, excluirMetaMensal } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [metaEdit, setMetaEdit] = useState<MetaMensal | null>(null);

  const metasDoMes = metasMensais.filter(m => 
    m.consultoriaMensalId && m.consultoriaMensalId.includes(mesAno)
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'cumprida': return 'bg-green-100 text-green-700';
      case 'em_andamento': return 'bg-blue-100 text-blue-700';
      case 'nao_atingida': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'cumprida': return <CheckCircle className="w-4 h-4" />;
      case 'em_andamento': return <Clock className="w-4 h-4" />;
      case 'nao_atingida': return <AlertTriangle className="w-4 h-4" />;
      default: return <Target className="w-4 h-4" />;
    }
  };

  const calcularProgresso = (meta: MetaMensal) => {
    if (meta.valorMeta === 0) return 0;
    return Math.min((meta.valorAtual / meta.valorMeta) * 100, 100);
  };

  const formatarValor = (valor: number, unidade: string) => {
    switch (unidade) {
      case 'percentual':
        return `${valor.toFixed(1)}%`;
      case 'valor':
        return `R$ ${valor.toLocaleString('pt-BR')}`;
      default:
        return valor.toString();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">Metas Mensais</h3>
          <p className="text-gray-600">Defina e acompanhe metas para {mesAno}</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Nova Meta</span>
        </button>
      </div>

      {/* Resumo das Metas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg">
              <Target className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 mb-1">{metasDoMes.length}</p>
            <p className="text-sm text-gray-600">Total de Metas</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-green-500 to-green-600 shadow-lg">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 mb-1">
              {metasDoMes.filter(m => m.status === 'cumprida').length}
            </p>
            <p className="text-sm text-gray-600">Cumpridas</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-yellow-500 to-yellow-600 shadow-lg">
              <Clock className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 mb-1">
              {metasDoMes.filter(m => m.status === 'em_andamento').length}
            </p>
            <p className="text-sm text-gray-600">Em Andamento</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-red-500 to-red-600 shadow-lg">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 mb-1">
              {metasDoMes.filter(m => m.status === 'nao_atingida').length}
            </p>
            <p className="text-sm text-gray-600">Não Atingidas</p>
          </div>
        </div>
      </div>

      {/* Lista de Metas */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <h4 className="text-lg font-semibold text-gray-900">Metas do Período</h4>
        </div>
        
        <div className="divide-y divide-gray-100">
          {metasDoMes.length > 0 ? (
            metasDoMes.map((meta) => {
              const progresso = calcularProgresso(meta);
              
              return (
                <div key={meta.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className={`p-2 rounded-lg ${getStatusColor(meta.status).replace('text-', 'text-white bg-').split(' ')[1]}`}>
                          {getStatusIcon(meta.status)}
                        </div>
                        <div>
                          <h5 className="font-semibold text-gray-900">{meta.descricao}</h5>
                          <p className="text-sm text-gray-500 capitalize">{meta.tipo.replace('_', ' ')}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        <div>
                          <p className="text-sm text-gray-600">Meta</p>
                          <p className="font-semibold text-gray-900">
                            {formatarValor(meta.valorMeta, meta.unidade)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Atual</p>
                          <p className="font-semibold text-blue-600">
                            {formatarValor(meta.valorAtual, meta.unidade)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Progresso</p>
                          <div className="flex items-center space-x-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full transition-all duration-300 ${
                                  progresso >= 100 ? 'bg-green-500' :
                                  progresso >= 75 ? 'bg-blue-500' :
                                  progresso >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${Math.min(progresso, 100)}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium text-gray-900">
                              {progresso.toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(meta.status)}`}>
                        {meta.status === 'cumprida' ? 'Cumprida' :
                         meta.status === 'em_andamento' ? 'Em Andamento' : 'Não Atingida'}
                      </span>
                      
                      <button
                        onClick={() => {
                          setMetaEdit(meta);
                          setShowModal(true);
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={() => {
                          if (confirm('Tem certeza que deseja excluir esta meta?')) {
                            excluirMetaMensal(meta.id);
                          }
                        }}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center">
              <Target className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Nenhuma meta definida</h4>
              <p className="text-gray-600 mb-4">Defina metas para acompanhar o progresso da consultoria</p>
              <button
                onClick={() => setShowModal(true)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors mx-auto"
              >
                <Plus className="w-5 h-5" />
                <span>Definir Primeira Meta</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal para Metas */}
      {showModal && (
        <MetaMensalModal
          clienteId={clienteId}
          mesAno={mesAno}
          meta={metaEdit}
          onClose={() => {
            setShowModal(false);
            setMetaEdit(null);
          }}
        />
      )}
    </div>
  );
}

// Modal para Metas
interface MetaMensalModalProps {
  clienteId: string;
  mesAno: string;
  meta?: MetaMensal | null;
  onClose: () => void;
}

function MetaMensalModal({ clienteId, mesAno, meta, onClose }: MetaMensalModalProps) {
  const { adicionarMetaMensal, atualizarMetaMensal } = useApp();
  const isEdit = !!meta;
  
  const [formData, setFormData] = useState({
    tipo: meta?.tipo || 'crescimento_clientes',
    descricao: meta?.descricao || '',
    valorMeta: meta?.valorMeta || 0,
    valorAtual: meta?.valorAtual || 0,
    unidade: meta?.unidade || 'numero',
    status: meta?.status || 'em_andamento',
    prazo: meta?.prazo || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEdit && meta) {
      atualizarMetaMensal(meta.id, formData);
    } else {
      const novaMeta: MetaMensal = {
        id: Date.now().toString(),
        consultoriaMensalId: `${clienteId}-${mesAno}`,
        ...formData,
        criadoEm: new Date().toISOString().split('T')[0],
      };
      adicionarMetaMensal(novaMeta);
    }
    
    onClose();
  };

  const tiposMeta = [
    { value: 'crescimento_clientes', label: 'Crescimento de Clientes' },
    { value: 'reducao_inadimplencia', label: 'Redução da Inadimplência' },
    { value: 'aumento_ticket', label: 'Aumento do Ticket Médio' },
    { value: 'vendas', label: 'Vendas' },
    { value: 'upgrades', label: 'Upgrades de Planos' },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {isEdit ? 'Editar Meta' : 'Nova Meta Mensal'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Meta *
            </label>
            <select
              required
              value={formData.tipo}
              onChange={(e) => setFormData(prev => ({ ...prev, tipo: e.target.value as MetaMensal['tipo'] }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {tiposMeta.map(tipo => (
                <option key={tipo.value} value={tipo.value}>{tipo.label}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descrição da Meta *
            </label>
            <input
              type="text"
              required
              value={formData.descricao}
              onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ex: Aumentar base de clientes em 10%"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Valor da Meta *
              </label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={formData.valorMeta}
                onChange={(e) => setFormData(prev => ({ ...prev, valorMeta: Number(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Valor Atual
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.valorAtual}
                onChange={(e) => setFormData(prev => ({ ...prev, valorAtual: Number(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Unidade
              </label>
              <select
                value={formData.unidade}
                onChange={(e) => setFormData(prev => ({ ...prev, unidade: e.target.value as MetaMensal['unidade'] }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="numero">Número</option>
                <option value="percentual">Percentual</option>
                <option value="valor">Valor (R$)</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as MetaMensal['status'] }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="em_andamento">Em Andamento</option>
                <option value="cumprida">Cumprida</option>
                <option value="nao_atingida">Não Atingida</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Prazo
            </label>
            <input
              type="date"
              value={formData.prazo}
              onChange={(e) => setFormData(prev => ({ ...prev, prazo: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              <Target className="w-4 h-4" />
              <span>{isEdit ? 'Salvar Meta' : 'Criar Meta'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}