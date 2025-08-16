import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Plus, Edit2, Trash2, Package, DollarSign, Tag, Eye } from 'lucide-react';
import { ProdutoContratoModal } from './ProdutoContratoModal';

interface ProdutoContrato {
  id: string;
  contratoId: string;
  produtoId?: string; // Opcional para produtos manuais
  nome: string;
  descricao: string;
  quantidade: number;
  valorUnitario: number;
  valorTotal: number;
  tipo: 'plano_venda' | 'manual';
  ativo: boolean;
  criadoEm: string;
}

export function ProdutosContrato() {
  const { contratos, clientes, planosVenda, produtos } = useApp();
  const [contratoSelecionado, setContratoSelecionado] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [produtoEdit, setProdutoEdit] = useState<ProdutoContrato | null>(null);
  const [produtosContrato, setProdutosContrato] = useState<ProdutoContrato[]>([]);

  const contrato = contratos.find(c => c.id === contratoSelecionado);
  const cliente = contrato ? clientes.find(c => c.id === contrato.clienteId) : null;
  const planoVenda = contrato?.planoVendaId ? planosVenda.find(p => p.id === contrato.planoVendaId) : null;

  // Carregar produtos do plano de venda quando contrato for selecionado
  React.useEffect(() => {
    if (contrato && planoVenda) {
      const produtosDoPlano: ProdutoContrato[] = planoVenda.itens.map(item => {
        const produto = produtos.find(p => p.id === item.produtoId);
        return {
          id: `plano-${item.id}`,
          contratoId: contrato.id,
          produtoId: item.produtoId,
          nome: produto?.nome || 'Produto não encontrado',
          descricao: produto?.descricao || '',
          quantidade: item.quantidade,
          valorUnitario: item.precoUnitario,
          valorTotal: item.valorTotal,
          tipo: 'plano_venda',
          ativo: true,
          criadoEm: contrato.dataInicio || new Date().toISOString().split('T')[0],
        };
      });
      
      // Manter produtos manuais existentes
      const produtosManuais = produtosContrato.filter(p => p.contratoId === contrato.id && p.tipo === 'manual');
      
      setProdutosContrato([...produtosDoPlano, ...produtosManuais]);
    } else {
      setProdutosContrato([]);
    }
  }, [contratoSelecionado, contrato, planoVenda, produtos]);

  const adicionarProdutoManual = (novoProduto: Omit<ProdutoContrato, 'id' | 'criadoEm'>) => {
    const produto: ProdutoContrato = {
      ...novoProduto,
      id: Date.now().toString(),
      criadoEm: new Date().toISOString().split('T')[0],
    };
    setProdutosContrato(prev => [...prev, produto]);
  };

  const atualizarProdutoManual = (produtoId: string, dadosAtualizados: Partial<ProdutoContrato>) => {
    setProdutosContrato(prev => 
      prev.map(p => p.id === produtoId ? { ...p, ...dadosAtualizados } : p)
    );
  };

  const excluirProdutoManual = (produtoId: string) => {
    if (confirm('Tem certeza que deseja excluir este produto do contrato?')) {
      setProdutosContrato(prev => prev.filter(p => p.id !== produtoId));
    }
  };

  const handleEditProduto = (produto: ProdutoContrato) => {
    if (produto.tipo === 'plano_venda') {
      alert('Produtos do plano de venda não podem ser editados. Edite o plano de venda original.');
      return;
    }
    setProdutoEdit(produto);
    setShowModal(true);
  };

  const produtosAtivos = produtosContrato.filter(p => p.ativo);
  const valorTotalProdutos = produtosAtivos.reduce((sum, p) => sum + p.valorTotal, 0);

  return (
    <div className="space-y-6">
      {/* Seleção de Contrato */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Produtos e Serviços do Contrato</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Selecione o Contrato
            </label>
            <select
              value={contratoSelecionado}
              onChange={(e) => setContratoSelecionado(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Selecione um contrato</option>
              {contratos.map(contrato => {
                const cliente = clientes.find(cl => cl.id === contrato.clienteId);
                return (
                  <option key={contrato.id} value={contrato.id}>
                    {contrato.nome} - {cliente?.empresa}
                  </option>
                );
              })}
            </select>
          </div>
          
          {contrato && (
            <div className="flex items-end">
              <button
                onClick={() => setShowModal(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Produto Manual</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Resumo dos Produtos */}
      {contrato && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg">
                <Package className="w-6 h-6 text-white" />
              </div>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 mb-1">{produtosAtivos.length}</p>
              <p className="text-sm text-gray-600">Produtos Ativos</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-gradient-to-r from-green-500 to-green-600 shadow-lg">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 mb-1">
                R$ {(valorTotalProdutos / 1000).toFixed(0)}k
              </p>
              <p className="text-sm text-gray-600">Valor Total</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 shadow-lg">
                <Tag className="w-6 h-6 text-white" />
              </div>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 mb-1">
                {produtosContrato.filter(p => p.tipo === 'plano_venda').length}
              </p>
              <p className="text-sm text-gray-600">Do Plano</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg">
                <Edit2 className="w-6 h-6 text-white" />
              </div>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 mb-1">
                {produtosContrato.filter(p => p.tipo === 'manual').length}
              </p>
              <p className="text-sm text-gray-600">Manuais</p>
            </div>
          </div>
        </div>
      )}

      {/* Lista de Produtos */}
      {contrato && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-semibold text-gray-900">
                Lista de Produtos - {contrato.nome}
              </h4>
              <span className="text-sm text-gray-500">
                Cliente: {cliente?.empresa}
              </span>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Produto/Serviço</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Origem</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Quantidade</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Valor Unit.</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Valor Total</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Status</th>
                  <th className="text-right py-4 px-6 font-semibold text-gray-900">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {produtosContrato.length > 0 ? (
                  produtosContrato.map((produto) => (
                    <tr key={produto.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                            <Package className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{produto.nome}</p>
                            <p className="text-sm text-gray-500">{produto.descricao}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          produto.tipo === 'plano_venda' 
                            ? 'bg-blue-100 text-blue-700' 
                            : 'bg-green-100 text-green-700'
                        }`}>
                          {produto.tipo === 'plano_venda' ? 'Plano de Venda' : 'Manual'}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-medium text-gray-900">{produto.quantidade}</span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center">
                          <DollarSign className="w-4 h-4 mr-1 text-green-600" />
                          <span className="font-semibold text-gray-900">
                            R$ {produto.valorUnitario.toLocaleString('pt-BR')}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-semibold text-green-600">
                          R$ {produto.valorTotal.toLocaleString('pt-BR')}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          produto.ativo ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {produto.ativo ? 'Ativo' : 'Inativo'}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Ver detalhes"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          
                          {produto.tipo === 'manual' && (
                            <>
                              <button
                                onClick={() => handleEditProduto(produto)}
                                className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                                title="Editar produto"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => excluirProdutoManual(produto.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Excluir produto"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-gray-500">
                      <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>Nenhum produto encontrado para este contrato</p>
                      {contrato && (
                        <p className="text-sm mt-2">
                          {planoVenda ? 'Produtos serão carregados do plano de venda' : 'Adicione produtos manualmente'}
                        </p>
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Resumo Financeiro */}
      {contrato && produtosContrato.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Resumo Financeiro dos Produtos</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600">Produtos do Plano</p>
              <p className="text-2xl font-bold text-blue-600">
                R$ {produtosContrato
                  .filter(p => p.tipo === 'plano_venda' && p.ativo)
                  .reduce((sum, p) => sum + p.valorTotal, 0)
                  .toLocaleString('pt-BR')}
              </p>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600">Produtos Manuais</p>
              <p className="text-2xl font-bold text-green-600">
                R$ {produtosContrato
                  .filter(p => p.tipo === 'manual' && p.ativo)
                  .reduce((sum, p) => sum + p.valorTotal, 0)
                  .toLocaleString('pt-BR')}
              </p>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-sm text-gray-600">Total Geral</p>
              <p className="text-2xl font-bold text-purple-600">
                R$ {valorTotalProdutos.toLocaleString('pt-BR')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Estado sem contrato selecionado */}
      {!contratoSelecionado && (
        <div className="bg-white rounded-xl p-8 text-center">
          <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Selecione um Contrato</h3>
          <p className="text-gray-600">Escolha um contrato para visualizar seus produtos e serviços</p>
        </div>
      )}

      {/* Modal Produto Manual */}
      {showModal && (
        <ProdutoContratoModal
          contratoId={contratoSelecionado}
          produto={produtoEdit}
          onSave={(produto) => {
            if (produtoEdit) {
              atualizarProdutoManual(produtoEdit.id, produto);
            } else {
              adicionarProdutoManual(produto);
            }
            setShowModal(false);
            setProdutoEdit(null);
          }}
          onClose={() => {
            setShowModal(false);
            setProdutoEdit(null);
          }}
        />
      )}
    </div>
  );
}