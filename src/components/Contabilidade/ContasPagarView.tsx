import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Plus, Eye, Edit2, Calendar, DollarSign, User, FileText, CreditCard, Download, Repeat, Building2, Filter, Search, AlertTriangle, CheckCircle, Clock, Paperclip } from 'lucide-react';
import { ContaPagarModal } from './ContaPagarModal';
import { PagamentoModal } from './PagamentoModal';

export function ContasPagarView() {
  const { contasPagar, contasContabeis, fornecedores, contasBancarias, pagamentosConta, realizarPagamento, gerarRecorrencia } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [contaEdit, setContaEdit] = useState(null);
  const [showPagamentoModal, setShowPagamentoModal] = useState(false);
  const [contaPagamento, setContaPagamento] = useState(null);
  const [filtroStatus, setFiltroStatus] = useState('todos');
  const [filtroCategoria, setFiltroCategoria] = useState('todos');
  const [filtroVencimento, setFiltroVencimento] = useState('todos');
  const [busca, setBusca] = useState('');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pago': return 'bg-green-100 text-green-700';
      case 'Pendente': return 'bg-yellow-100 text-yellow-700';
      case 'Vencida': return 'bg-red-100 text-red-700';
      case 'Cancelada': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getCategoriaColor = (categoria: string) => {
    switch (categoria) {
      case 'Fornecedor': return 'bg-blue-100 text-blue-700';
      case 'Licenca': return 'bg-purple-100 text-purple-700';
      case 'Servico': return 'bg-green-100 text-green-700';
      case 'Imposto': return 'bg-red-100 text-red-700';
      case 'Outros': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getContaNome = (contaId: string) => {
    const conta = contasContabeis.find(c => c.id === contaId);
    return conta ? `${conta.codigo} - ${conta.nome}` : 'Conta não encontrada';
  };

  const getFornecedorNome = (fornecedorId: string) => {
    const fornecedor = fornecedores.find(f => f.id === fornecedorId);
    return fornecedor ? fornecedor.nome : 'Fornecedor não encontrado';
  };

  const isVencida = (dataVencimento: string) => {
    return new Date(dataVencimento) < new Date();
  };

  const isVenceHoje = (dataVencimento: string) => {
    const hoje = new Date().toDateString();
    const vencimento = new Date(dataVencimento).toDateString();
    return hoje === vencimento;
  };

  const isVenceEm7Dias = (dataVencimento: string) => {
    const hoje = new Date();
    const vencimento = new Date(dataVencimento);
    const diasRestantes = Math.ceil((vencimento.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
    return diasRestantes <= 7 && diasRestantes > 0;
  };

  const handleEditConta = (conta: any) => {
    setContaEdit(conta);
    setShowModal(true);
  };

  const handleRealizarPagamento = (conta: any) => {
    setContaPagamento(conta);
    setShowPagamentoModal(true);
  };

  const handleGerarRecorrencia = (contaId: string) => {
    if (confirm('Deseja gerar a próxima conta recorrente?')) {
      gerarRecorrencia(contaId);
    }
  };

  const contasFiltradas = contasPagar.filter(conta => {
    const matchStatus = filtroStatus === 'todos' || conta.status === filtroStatus;
    const matchCategoria = filtroCategoria === 'todos' || conta.categoria === filtroCategoria;
    const matchBusca = busca === '' || 
      conta.descricao.toLowerCase().includes(busca.toLowerCase()) ||
      getFornecedorNome(conta.fornecedorId).toLowerCase().includes(busca.toLowerCase()) ||
      conta.documento?.toLowerCase().includes(busca.toLowerCase());
    
    let matchVencimento = true;
    if (filtroVencimento === 'vencidas') {
      matchVencimento = isVencida(conta.dataVencimento) && conta.status === 'Pendente';
    } else if (filtroVencimento === 'hoje') {
      matchVencimento = isVenceHoje(conta.dataVencimento) && conta.status === 'Pendente';
    } else if (filtroVencimento === '7dias') {
      matchVencimento = isVenceEm7Dias(conta.dataVencimento) && conta.status === 'Pendente';
    }
    
    return matchStatus && matchCategoria && matchBusca && matchVencimento;
  });

  const totalPendente = contasPagar
    .filter(c => c.status === 'Pendente')
    .reduce((sum, c) => sum + c.valor, 0);

  const totalVencidas = contasPagar
    .filter(c => c.status === 'Vencida' || (c.status === 'Pendente' && isVencida(c.dataVencimento)))
    .reduce((sum, c) => sum + c.valor, 0);

  const totalPago = contasPagar
    .filter(c => c.status === 'Pago')
    .reduce((sum, c) => sum + (c.valorPago || c.valor), 0);

  const contasVencemHoje = contasPagar.filter(c => 
    c.status === 'Pendente' && isVenceHoje(c.dataVencimento)
  ).length;

  const contasVencem7Dias = contasPagar.filter(c => 
    c.status === 'Pendente' && isVenceEm7Dias(c.dataVencimento)
  ).length;

  const contasRecorrentes = contasPagar.filter(c => c.isRecorrente).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Contas a Pagar</h2>
          <p className="text-gray-600">Controle completo de despesas e pagamentos</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-red-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Nova Conta</span>
        </button>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-yellow-500 to-yellow-600 shadow-lg">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Pendentes</p>
              <p className="text-sm font-medium text-gray-900">
                {contasPagar.filter(c => c.status === 'Pendente').length}
              </p>
            </div>
          </div>
          <div>
            <p className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
              R$ {(totalPendente / 1000).toFixed(0)}k
            </p>
            <p className="text-sm text-gray-600">Total Pendente</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-red-500 to-red-600 shadow-lg">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Vencidas</p>
              <p className="text-sm font-medium text-red-600">
                {contasPagar.filter(c => isVencida(c.dataVencimento) && c.status === 'Pendente').length}
              </p>
            </div>
          </div>
          <div>
            <p className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
              R$ {(totalVencidas / 1000).toFixed(0)}k
            </p>
            <p className="text-sm text-gray-600">Vencidas</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-green-500 to-green-600 shadow-lg">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Pagas</p>
              <p className="text-sm font-medium text-green-600">
                {contasPagar.filter(c => c.status === 'Pago').length}
              </p>
            </div>
          </div>
          <div>
            <p className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
              R$ {(totalPago / 1000).toFixed(0)}k
            </p>
            <p className="text-sm text-gray-600">Total Pago</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg">
              <Repeat className="w-6 h-6 text-white" />
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Hoje</p>
              <p className="text-sm font-medium text-orange-600">{contasVencemHoje}</p>
            </div>
          </div>
          <div>
            <p className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">{contasRecorrentes}</p>
            <p className="text-sm text-gray-600">Recorrentes</p>
          </div>
        </div>
      </div>

      {/* Alertas de Vencimento */}
      {(contasVencemHoje > 0 || contasVencem7Dias > 0) && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            <h3 className="text-lg font-semibold text-gray-900">Alertas de Vencimento</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {contasVencemHoje > 0 && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Clock className="w-4 h-4 text-red-600" />
                  <span className="font-medium text-red-900">Vencem Hoje</span>
                </div>
                <p className="text-sm text-red-800">{contasVencemHoje} contas vencem hoje</p>
              </div>
            )}
            
            {contasVencem7Dias > 0 && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Calendar className="w-4 h-4 text-yellow-600" />
                  <span className="font-medium text-yellow-900">Próximos 7 Dias</span>
                </div>
                <p className="text-sm text-yellow-800">{contasVencem7Dias} contas vencem em 7 dias</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Filtros Avançados */}
      <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
          <div className="flex items-center space-x-2">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              placeholder="Buscar por descrição, fornecedor ou documento..."
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={filtroStatus}
              onChange={(e) => setFiltroStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="todos">Todos os Status</option>
              <option value="Pendente">Pendente</option>
              <option value="Pago">Pago</option>
              <option value="Vencida">Vencida</option>
              <option value="Cancelada">Cancelada</option>
            </select>
          </div>

          <select
            value={filtroCategoria}
            onChange={(e) => setFiltroCategoria(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            <option value="todos">Todas as Categorias</option>
            <option value="Fornecedor">Fornecedor</option>
            <option value="Licenca">Licença</option>
            <option value="Servico">Serviço</option>
            <option value="Imposto">Imposto</option>
            <option value="Outros">Outros</option>
          </select>

          <select
            value={filtroVencimento}
            onChange={(e) => setFiltroVencimento(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            <option value="todos">Todos os Vencimentos</option>
            <option value="vencidas">Vencidas</option>
            <option value="hoje">Vencem Hoje</option>
            <option value="7dias">Próximos 7 Dias</option>
          </select>
        </div>
      </div>

      {/* Lista de Contas */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Fornecedor</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Descrição</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Categoria</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Valor</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Vencimento</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Status</th>
                <th className="text-right py-4 px-6 font-semibold text-gray-900">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {contasFiltradas.length > 0 ? (
                contasFiltradas.map((conta) => {
                  const diasVencimento = Math.ceil((new Date(conta.dataVencimento).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                  const pagamentosRealizados = pagamentosConta.filter(p => p.contaPagarId === conta.id);
                  
                  return (
                    <tr key={conta.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center text-white font-semibold">
                            <Building2 className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{getFornecedorNome(conta.fornecedorId)}</p>
                            <div className="flex items-center space-x-2 text-sm text-gray-500">
                              {conta.documento && (
                                <>
                                  <span>{conta.documento}</span>
                                  <span>•</span>
                                </>
                              )}
                              {conta.isRecorrente && (
                                <div className="flex items-center space-x-1">
                                  <Repeat className="w-3 h-3" />
                                  <span>{conta.frequenciaRecorrencia}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div>
                          <span className="text-gray-900">{conta.descricao}</span>
                          {conta.anexos.length > 0 && (
                            <div className="flex items-center space-x-1 mt-1">
                              <Paperclip className="w-3 h-3 text-gray-400" />
                              <span className="text-xs text-gray-500">{conta.anexos.length} anexo(s)</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoriaColor(conta.categoria)}`}>
                          {conta.categoria}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center">
                          <DollarSign className="w-4 h-4 mr-1 text-red-600" />
                          <div>
                            <span className="font-semibold text-gray-900">
                              R$ {conta.valor.toLocaleString('pt-BR')}
                            </span>
                            {conta.valorPago && conta.valorPago !== conta.valor && (
                              <p className="text-xs text-green-600">
                                Pago: R$ {conta.valorPago.toLocaleString('pt-BR')}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className={`flex items-center text-sm ${
                          isVencida(conta.dataVencimento) && conta.status === 'Pendente' 
                            ? 'text-red-600' 
                            : isVenceHoje(conta.dataVencimento) && conta.status === 'Pendente'
                            ? 'text-orange-600'
                            : 'text-gray-600'
                        }`}>
                          <Calendar className="w-4 h-4 mr-1" />
                          <div>
                            <span>{new Date(conta.dataVencimento).toLocaleDateString('pt-BR')}</span>
                            {conta.status === 'Pendente' && (
                              <p className="text-xs">
                                {diasVencimento < 0 ? `${Math.abs(diasVencimento)} dias em atraso` :
                                 diasVencimento === 0 ? 'Vence hoje' :
                                 `${diasVencimento} dias`}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex flex-col space-y-1">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(conta.status)}`}>
                            {conta.status}
                          </span>
                          {conta.status === 'Pago' && conta.dataPagamento && (
                            <span className="text-xs text-gray-500">
                              Pago em {new Date(conta.dataPagamento).toLocaleDateString('pt-BR')}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          {conta.status === 'Pendente' && (
                            <button
                              onClick={() => handleRealizarPagamento(conta)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Realizar pagamento"
                            >
                              <CreditCard className="w-4 h-4" />
                            </button>
                          )}
                          
                          {conta.isRecorrente && conta.status === 'Pago' && (
                            <button
                              onClick={() => handleGerarRecorrencia(conta.id)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Gerar próxima recorrência"
                            >
                              <Repeat className="w-4 h-4" />
                            </button>
                          )}
                          
                          {conta.anexos.length > 0 && (
                            <button
                              className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                              title="Download anexos"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                          )}
                          
                          <button
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Ver detalhes"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          
                          <button
                            onClick={() => handleEditConta(conta)}
                            className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                            title="Editar conta"
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
                    <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>Nenhuma conta encontrada</p>
                    <p className="text-sm mt-2">
                      {busca ? 'Tente ajustar os filtros de busca' : 'Clique em "Nova Conta" para começar'}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Análise por Categoria */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Análise por Categoria</h3>
        <div className="space-y-3">
          {['Fornecedor', 'Licenca', 'Servico', 'Imposto', 'Outros'].map((categoria) => {
            const contasCategoria = contasPagar.filter(c => c.categoria === categoria);
            const totalCategoria = contasCategoria.reduce((sum, c) => sum + c.valor, 0);
            const pendentesCategoria = contasCategoria.filter(c => c.status === 'Pendente').length;
            
            if (contasCategoria.length === 0) return null;
            
            return (
              <div key={categoria} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoriaColor(categoria)}`}>
                    {categoria}
                  </span>
                  <div>
                    <p className="font-medium text-gray-900">{contasCategoria.length} contas</p>
                    <p className="text-sm text-gray-500">{pendentesCategoria} pendentes</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    R$ {totalCategoria.toLocaleString('pt-BR')}
                  </p>
                  <p className="text-sm text-gray-500">
                    {totalCategoria > 0 ? ((totalCategoria / contasPagar.reduce((sum, c) => sum + c.valor, 0)) * 100).toFixed(1) : 0}% do total
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modais */}
      {showModal && (
        <ContaPagarModal
          conta={contaEdit}
          onClose={() => {
            setShowModal(false);
            setContaEdit(null);
          }}
        />
      )}

      {showPagamentoModal && contaPagamento && (
        <PagamentoModal
          conta={contaPagamento}
          onClose={() => {
            setShowPagamentoModal(false);
            setContaPagamento(null);
          }}
        />
      )}
    </div>
  );
}