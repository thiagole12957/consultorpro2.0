import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Plus, Edit2, Trash2, ChevronRight, ChevronDown, FileText, Search } from 'lucide-react';
import { ContaContabilModal } from './ContaContabilModal';

export function PlanoContasView() {
  const { contasContabeis, adicionarContaContabil, atualizarContaContabil, excluirContaContabil } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [contaEdit, setContaEdit] = useState(null);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['1', '2', '3', '4', '5']));
  const [viewMode, setViewMode] = useState<'tree' | 'list'>('tree');
  const [filtroTipo, setFiltroTipo] = useState('todos');
  const [busca, setBusca] = useState('');

  const toggleNode = (contaId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(contaId)) {
      newExpanded.delete(contaId);
    } else {
      newExpanded.add(contaId);
    }
    setExpandedNodes(newExpanded);
  };

  const getContasFilhas = (contaPaiId: string) => {
    return contasContabeis
      .filter(conta => conta.contaPai === contaPaiId)
      .sort((a, b) => a.codigo.localeCompare(b.codigo));
  };

  const getContasRaiz = () => {
    return contasContabeis
      .filter(conta => !conta.contaPai)
      .sort((a, b) => a.codigo.localeCompare(b.codigo));
  };

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'Ativo': return 'bg-blue-100 text-blue-700';
      case 'Passivo': return 'bg-red-100 text-red-700';
      case 'Patrimonio': return 'bg-purple-100 text-purple-700';
      case 'Receita': return 'bg-green-100 text-green-700';
      case 'Despesa': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getNaturezaIcon = (natureza: string) => {
    return natureza === 'Devedora' ? '(D)' : '(C)';
  };

  const handleEditConta = (conta: any) => {
    setContaEdit(conta);
    setShowModal(true);
  };

  const handleExcluirConta = (contaId: string) => {
    const conta = contasContabeis.find(c => c.id === contaId);
    const temFilhas = contasContabeis.some(c => c.contaPai === contaId);
    
    if (temFilhas) {
      alert('Não é possível excluir uma conta que possui contas filhas. Exclua primeiro as contas filhas.');
      return;
    }
    
    if (confirm(`Tem certeza que deseja excluir a conta "${conta?.nome}"?`)) {
      excluirContaContabil(contaId);
    }
  };

  const renderContaTree = (conta: any, nivel: number = 0) => {
    const contasFilhas = getContasFilhas(conta.id);
    const temFilhas = contasFilhas.length > 0;
    const isExpanded = expandedNodes.has(conta.id);
    const isAnalytica = conta.subtipo === 'Conta' || conta.subtipo === 'Analitica';

    return (
      <div key={conta.id}>
        <div 
          className={`flex items-center justify-between p-3 hover:bg-gray-50 transition-colors border-l-4 ${
            isAnalytica ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
          }`}
          style={{ paddingLeft: `${12 + nivel * 24}px` }}
        >
          <div className="flex items-center space-x-2 flex-1">
            {temFilhas ? (
              <button
                onClick={() => toggleNode(conta.id)}
                className="p-1 hover:bg-gray-200 rounded transition-colors"
              >
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4 text-gray-600" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-600" />
                )}
              </button>
            ) : (
              <div className="w-6 h-6 flex items-center justify-center">
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              </div>
            )}
            
            <div className="flex items-center space-x-3 flex-1">
              <div className={`px-2 py-1 rounded text-xs font-mono ${
                isAnalytica ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-700'
              }`}>
                {conta.codigo}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className={`font-medium ${
                    isAnalytica ? 'text-blue-900' : 'text-gray-900'
                  }`}>
                    {conta.nome}
                  </span>
                  <span className="text-xs text-gray-500">
                    {getNaturezaIcon(conta.natureza)}
                  </span>
                  {isAnalytica && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                      Analítica
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-2 mt-1">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTipoColor(conta.tipo)}`}>
                    {conta.tipo}
                  </span>
                  <span className="text-xs text-gray-500">{conta.subtipo}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-1">
            <button
              onClick={() => handleEditConta(conta)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Editar conta"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            
            {!temFilhas && conta.nivel > 1 && (
              <button
                onClick={() => handleExcluirConta(conta.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Excluir conta"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
        
        {temFilhas && isExpanded && (
          <div>
            {contasFilhas.map(contaFilha => renderContaTree(contaFilha, nivel + 1))}
          </div>
        )}
      </div>
    );
  };

  const renderContasList = () => {
    const contasFiltradas = contasContabeis.filter(conta => {
      const matchTipo = filtroTipo === 'todos' || conta.tipo === filtroTipo;
      const matchBusca = busca === '' || 
        conta.nome.toLowerCase().includes(busca.toLowerCase()) ||
        conta.codigo.includes(busca);
      return matchTipo && matchBusca;
    });

    return (
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-4 px-6 font-semibold text-gray-900">Código</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-900">Nome</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-900">Tipo</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-900">Subtipo</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-900">Natureza</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-900">Nível</th>
              <th className="text-right py-4 px-6 font-semibold text-gray-900">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {contasFiltradas.map((conta) => (
              <tr key={conta.id} className="hover:bg-gray-50 transition-colors">
                <td className="py-4 px-6">
                  <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                    {conta.codigo}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-900">{conta.nome}</span>
                    {conta.subtipo === 'Analitica' && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                        Analítica
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTipoColor(conta.tipo)}`}>
                    {conta.tipo}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <span className="text-gray-700">{conta.subtipo}</span>
                </td>
                <td className="py-4 px-6">
                  <span className={`text-sm font-medium ${
                    conta.natureza === 'Devedora' ? 'text-blue-600' : 'text-green-600'
                  }`}>
                    {conta.natureza} {getNaturezaIcon(conta.natureza)}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <span className="text-gray-600">{conta.nivel}</span>
                </td>
                <td className="py-4 px-6 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={() => handleEditConta(conta)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Editar conta"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    
                    {conta.nivel > 1 && !getContasFilhas(conta.id).length && (
                      <button
                        onClick={() => handleExcluirConta(conta.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Excluir conta"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Plano de Contas</h2>
          <p className="text-gray-600">Estrutura contábil da empresa</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => {
              if (confirm('Isso irá resetar o plano de contas para o padrão. Continuar?')) {
                // Reset para plano padrão
                window.location.reload();
              }
            }}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-gray-700 transition-colors"
          >
            <FileText className="w-4 h-4" />
            <span>Resetar Padrão</span>
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Nova Conta</span>
          </button>
        </div>
      </div>

      {/* Controles */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('tree')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'tree' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Árvore
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Lista
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <Search className="w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                placeholder="Buscar conta..."
              />
            </div>

            <select
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="todos">Todos os Tipos</option>
              <option value="Ativo">Ativo</option>
              <option value="Passivo">Passivo</option>
              <option value="Patrimonio">Patrimônio</option>
              <option value="Receita">Receita</option>
              <option value="Despesa">Despesa</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                setExpandedNodes(new Set(contasContabeis.map(c => c.id)));
              }}
              className="text-blue-600 hover:text-blue-700 text-sm"
            >
              Expandir Tudo
            </button>
            <span className="text-gray-300">|</span>
            <button
              onClick={() => setExpandedNodes(new Set())}
              className="text-blue-600 hover:text-blue-700 text-sm"
            >
              Recolher Tudo
            </button>
          </div>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {['Ativo', 'Passivo', 'Patrimonio', 'Receita', 'Despesa'].map((tipo) => {
          const count = contasContabeis.filter(c => c.tipo === tipo).length;
          const analiticas = contasContabeis.filter(c => c.tipo === tipo && (c.subtipo === 'Conta' || c.subtipo === 'Analitica')).length;
          
          return (
            <div key={tipo} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="text-center">
                <p className={`text-lg font-bold ${getTipoColor(tipo).split(' ')[1]}`}>
                  {count}
                </p>
                <p className="text-sm text-gray-600">{tipo}</p>
                <p className="text-xs text-gray-500">{analiticas} analíticas</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Plano de Contas */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              {viewMode === 'tree' ? 'Estrutura Hierárquica' : 'Lista de Contas'}
            </h3>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <FileText className="w-4 h-4" />
              <span>{contasContabeis.length} contas cadastradas</span>
            </div>
          </div>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {viewMode === 'tree' ? (
            <div>
              {getContasRaiz().map(conta => renderContaTree(conta))}
            </div>
          ) : (
            renderContasList()
          )}
        </div>
      </div>

      {/* Legenda */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Legenda</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Tipos de Conta:</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-700">Ativo</span>
                <span className="text-sm text-gray-600">Bens e direitos</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-1 rounded text-xs bg-red-100 text-red-700">Passivo</span>
                <span className="text-sm text-gray-600">Obrigações</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-1 rounded text-xs bg-green-100 text-green-700">Receita</span>
                <span className="text-sm text-gray-600">Entradas de recursos</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-1 rounded text-xs bg-orange-100 text-orange-700">Despesa</span>
                <span className="text-sm text-gray-600">Saídas de recursos</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Natureza:</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="text-blue-600 font-medium">(D)</span>
                <span className="text-sm text-gray-600">Natureza Devedora</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-green-600 font-medium">(C)</span>
                <span className="text-sm text-gray-600">Natureza Credora</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-1 rounded text-xs bg-green-100 text-green-700">Analítica</span>
                <span className="text-sm text-gray-600">Conta que recebe lançamentos</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <ContaContabilModal
          conta={contaEdit}
          onClose={() => {
            setShowModal(false);
            setContaEdit(null);
          }}
        />
      )}
    </div>
  );
}