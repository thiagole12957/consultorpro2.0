import React, { useState } from 'react';
import { X, Save, Plus, Trash2, Calculator } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { Venda, ItemVenda } from '../../types/vendas';

interface VendaModalProps {
  venda?: Venda | null;
  onClose: () => void;
}

export function VendaModal({ venda, onClose }: VendaModalProps) {
  const { 
    adicionarVenda, 
    atualizarVenda, 
    clientes, 
    produtos, 
    condicoesPagamento,
    empresaSelecionada, 
    filiais 
  } = useApp();
  const isEdit = !!venda;
  
  const [formData, setFormData] = useState({
    filialId: venda?.filialId || '',
    clienteId: venda?.clienteId || '',
    numero: venda?.numero || '',
    dataVenda: venda?.dataVenda || new Date().toISOString().split('T')[0],
    desconto: venda?.desconto || 0,
    status: venda?.status || 'Orcamento',
    condicaoPagamentoId: venda?.condicaoPagamentoId || '',
    observacoes: venda?.observacoes || '',
    vendedor: venda?.vendedor || '',
    comissao: venda?.comissao || 0,
  });

  const [itens, setItens] = useState<ItemVenda[]>(venda?.itens || []);

  const adicionarItem = () => {
    const novoItem: ItemVenda = {
      id: Date.now().toString(),
      produtoId: '',
      descricao: '',
      quantidade: 1,
      valorUnitario: 0,
      desconto: 0,
      valorTotal: 0,
      contaReceitaId: '',
    };
    setItens([...itens, novoItem]);
  };

  const removerItem = (index: number) => {
    setItens(itens.filter((_, i) => i !== index));
  };

  const atualizarItem = (index: number, campo: string, valor: any) => {
    const novosItens = [...itens];
    novosItens[index] = { ...novosItens[index], [campo]: valor };
    
    // Recalcular valores
    if (['quantidade', 'valorUnitario', 'desconto'].includes(campo)) {
      const item = novosItens[index];
      const valorBruto = item.quantidade * item.valorUnitario;
      const valorDesconto = valorBruto * (item.desconto / 100);
      item.valorTotal = valorBruto - valorDesconto;
    }
    
    // Auto-preencher dados do produto
    if (campo === 'produtoId') {
      const produto = produtos.find(p => p.id === valor);
      if (produto) {
        novosItens[index].descricao = produto.nome;
        novosItens[index].valorUnitario = produto.precoUnitario;
        novosItens[index].contaReceitaId = produto.contaReceitaId;
        const valorBruto = novosItens[index].quantidade * produto.precoUnitario;
        novosItens[index].valorTotal = valorBruto;
      }
    }
    
    setItens(novosItens);
  };

  const calcularTotais = () => {
    const valorTotal = itens.reduce((sum, item) => sum + item.valorTotal, 0);
    const valorFinal = valorTotal - formData.desconto;
    return { valorTotal, valorFinal };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!empresaSelecionada) {
      alert('Selecione uma empresa primeiro');
      return;
    }

    if (itens.length === 0) {
      alert('Adicione pelo menos um item à venda');
      return;
    }
    
    const { valorTotal, valorFinal } = calcularTotais();
    
    if (isEdit && venda) {
      atualizarVenda(venda.id, {
        ...formData,
        itens,
        valorTotal,
        valorFinal,
        atualizadoEm: new Date().toISOString().split('T')[0],
      });
    } else {
      const novaVenda: Venda = {
        id: Date.now().toString(),
        empresaId: empresaSelecionada.id,
        ...formData,
        numero: formData.numero || `VND-${Date.now()}`,
        itens,
        valorTotal,
        valorFinal,
        criadoEm: new Date().toISOString().split('T')[0],
        atualizadoEm: new Date().toISOString().split('T')[0],
      };
      adicionarVenda(novaVenda);
    }
    
    onClose();
  };

  const filiaisDisponiveis = filiais.filter(f => 
    f.empresaId === empresaSelecionada?.id && f.ativa && f.configuracoes.permiteVendas
  );

  const clientesFilial = clientes.filter(c => 
    c.empresaId === empresaSelecionada?.id && c.filialId === formData.filialId
  );

  const condicoesPagamentoEmpresa = condicoesPagamento.filter(c => 
    c.empresaId === empresaSelecionada?.id && c.ativa
  );

  const { valorTotal, valorFinal } = calcularTotais();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {isEdit ? 'Editar Venda' : 'Nova Venda'}
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
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Informações da Venda</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Filial *
                </label>
                <select
                  required
                  value={formData.filialId}
                  onChange={(e) => setFormData(prev => ({ ...prev, filialId: e.target.value, clienteId: '' }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Selecione a filial</option>
                  {filiaisDisponiveis.map(filial => (
                    <option key={filial.id} value={filial.id}>
                      {filial.nome} {filial.isMatriz ? '(Matriz)' : ''}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cliente *
                </label>
                <select
                  required
                  value={formData.clienteId}
                  onChange={(e) => setFormData(prev => ({ ...prev, clienteId: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={!formData.filialId}
                >
                  <option value="">Selecione um cliente</option>
                  {clientesFilial.map(cliente => (
                    <option key={cliente.id} value={cliente.id}>
                      {cliente.nome} - {cliente.empresa}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Número da Venda
                </label>
                <input
                  type="text"
                  value={formData.numero}
                  onChange={(e) => setFormData(prev => ({ ...prev, numero: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Será gerado automaticamente se vazio"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data da Venda *
                </label>
                <input
                  type="date"
                  required
                  value={formData.dataVenda}
                  onChange={(e) => setFormData(prev => ({ ...prev, dataVenda: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Condição de Pagamento *
                </label>
                <select
                  required
                  value={formData.condicaoPagamentoId}
                  onChange={(e) => setFormData(prev => ({ ...prev, condicaoPagamentoId: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Selecione a condição</option>
                  {condicoesPagamentoEmpresa.map(condicao => (
                    <option key={condicao.id} value={condicao.id}>
                      {condicao.nome} ({condicao.parcelas.length}x)
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as Venda['status'] }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Orcamento">Orçamento</option>
                  <option value="Aprovada">Aprovada</option>
                  <option value="Faturada">Faturada</option>
                  <option value="Cancelada">Cancelada</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vendedor
                </label>
                <input
                  type="text"
                  value={formData.vendedor}
                  onChange={(e) => setFormData(prev => ({ ...prev, vendedor: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nome do vendedor"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Comissão (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={formData.comissao}
                  onChange={(e) => setFormData(prev => ({ ...prev, comissao: Number(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Itens da Venda */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Itens da Venda</h3>
              <button
                type="button"
                onClick={adicionarItem}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Adicionar Item</span>
              </button>
            </div>

            <div className="space-y-4">
              {itens.map((item, index) => (
                <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Produto/Serviço *
                      </label>
                      <select
                        required
                        value={item.produtoId}
                        onChange={(e) => atualizarItem(index, 'produtoId', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Selecione um produto</option>
                        {produtos.filter(p => p.ativo).map(produto => (
                          <option key={produto.id} value={produto.id}>
                            {produto.nome} - R$ {produto.precoUnitario.toLocaleString('pt-BR')}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Quantidade
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={item.quantidade}
                        onChange={(e) => atualizarItem(index, 'quantidade', Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Valor Unit.
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.valorUnitario}
                        onChange={(e) => atualizarItem(index, 'valorUnitario', Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Desconto %
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        value={item.desconto}
                        onChange={(e) => atualizarItem(index, 'desconto', Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div className="flex items-end">
                      <button
                        type="button"
                        onClick={() => removerItem(index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Remover item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-gray-200 text-right">
                    <span className="text-sm text-gray-600">Total do Item: </span>
                    <span className="font-semibold text-green-600">
                      R$ {item.valorTotal.toLocaleString('pt-BR')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Resumo Financeiro */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumo Financeiro</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-sm text-gray-600">Valor Total</p>
                <p className="text-2xl font-bold text-blue-600">
                  R$ {valorTotal.toLocaleString('pt-BR')}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Desconto</p>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.desconto}
                  onChange={(e) => setFormData(prev => ({ ...prev, desconto: Number(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center"
                />
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Valor Final</p>
                <p className="text-2xl font-bold text-green-600">
                  R$ {valorFinal.toLocaleString('pt-BR')}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Comissão</p>
                <p className="text-xl font-bold text-purple-600">
                  R$ {((valorFinal * formData.comissao) / 100).toLocaleString('pt-BR')}
                </p>
              </div>
            </div>
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
              placeholder="Observações da venda..."
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
              <span>{isEdit ? 'Salvar Venda' : 'Criar Venda'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}