import React, { useState } from 'react';
import { X, Save, Plus, Trash2 } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { PlanoVenda, ItemPlanoVenda } from '../../types';

interface PlanoVendaModalProps {
  plano?: PlanoVenda | null;
  onClose: () => void;
}

export function PlanoVendaModal({ plano, onClose }: PlanoVendaModalProps) {
  const { adicionarPlanoVenda, atualizarPlanoVenda, clientes, contratos, produtos, licencas } = useApp();
  const isEdit = !!plano;
  
  const [formData, setFormData] = useState({
    nome: plano?.nome || '',
    descricao: plano?.descricao || '',
    dataValidade: plano?.dataValidade || '',
    status: plano?.status || 'Rascunho',
    observacoes: plano?.observacoes || '',
  });

  const [itens, setItens] = useState<ItemPlanoVenda[]>(plano?.itens || []);

  const adicionarItem = () => {
    const novoItem: ItemPlanoVenda = {
      id: Date.now().toString(),
      produtoId: '',
      quantidade: 1,
      precoUnitario: 0,
      custoUnitario: 0,
      desconto: 0,
      valorTotal: 0,
      custoTotal: 0,
    };
    setItens([...itens, novoItem]);
  };

  const removerItem = (index: number) => {
    setItens(itens.filter((_, i) => i !== index));
  };

  const atualizarItem = (index: number, campo: string, valor: any) => {
    const novosItens = [...itens];
    novosItens[index] = { ...novosItens[index], [campo]: valor };
    
    // Recalcular valores quando necessário
    if (['quantidade', 'precoUnitario', 'custoUnitario', 'desconto'].includes(campo)) {
      const item = novosItens[index];
      const valorBruto = item.quantidade * item.precoUnitario;
      const valorDesconto = valorBruto * (item.desconto / 100);
      item.valorTotal = valorBruto - valorDesconto;
      item.custoTotal = item.quantidade * item.custoUnitario;
    }
    
    // Auto-preencher preços do produto
    if (campo === 'produtoId') {
      const produto = produtos.find(p => p.id === valor);
      if (produto) {
        novosItens[index].precoUnitario = produto.precoUnitario;
        novosItens[index].custoUnitario = produto.custoUnitario;
        const valorBruto = novosItens[index].quantidade * produto.precoUnitario;
        novosItens[index].valorTotal = valorBruto;
        novosItens[index].custoTotal = novosItens[index].quantidade * produto.custoUnitario;
      }
    }
    
    setItens(novosItens);
  };

  const calcularTotais = () => {
    const valorTotal = itens.reduce((sum, item) => sum + item.valorTotal, 0);
    const custoTotal = itens.reduce((sum, item) => sum + item.custoTotal, 0);
    const margemLucro = valorTotal > 0 ? ((valorTotal - custoTotal) / valorTotal) * 100 : 0;
    
    return { valorTotal, custoTotal, margemLucro };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const { valorTotal, custoTotal, margemLucro } = calcularTotais();
    
    if (isEdit && plano) {
      atualizarPlanoVenda(plano.id, {
        ...formData,
        itens,
        valorTotal,
        custoTotal,
        margemLucro,
        atualizadoEm: new Date().toISOString().split('T')[0],
      });
    } else {
      const novoPlano: PlanoVenda = {
        id: Date.now().toString(),
        ...formData,
        itens,
        valorTotal,
        custoTotal,
        margemLucro,
        criadoEm: new Date().toISOString().split('T')[0],
        atualizadoEm: new Date().toISOString().split('T')[0],
      };
      adicionarPlanoVenda(novoPlano);
    }
    
    onClose();
  };

  const { valorTotal, custoTotal, margemLucro } = calcularTotais();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {isEdit ? 'Editar Plano de Venda' : 'Novo Plano de Venda'}
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome do Plano *
              </label>
              <input
                type="text"
                required
                value={formData.nome}
                onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data de Validade
              </label>
              <input
                type="date"
                value={formData.dataValidade}
                onChange={(e) => setFormData(prev => ({ ...prev, dataValidade: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
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
            />
          </div>

          {/* Itens do Plano */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Itens do Plano</h3>
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
                        {produtos.map(produto => (
                          <option key={produto.id} value={produto.id}>
                            {produto.nome} - {produto.tipo}
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
                        Preço Unit.
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.precoUnitario}
                        onChange={(e) => atualizarItem(index, 'precoUnitario', Number(e.target.value))}
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
                  
                  <div className="mt-3 pt-3 border-t border-gray-200 grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Valor Total: </span>
                      <span className="font-semibold text-green-600">
                        R$ {item.valorTotal.toLocaleString('pt-BR')}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Custo Total: </span>
                      <span className="font-semibold text-red-600">
                        R$ {item.custoTotal.toLocaleString('pt-BR')}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Margem: </span>
                      <span className="font-semibold text-blue-600">
                        {item.valorTotal > 0 ? (((item.valorTotal - item.custoTotal) / item.valorTotal) * 100).toFixed(1) : 0}%
                      </span>
                    </div>
                  </div>

                  {/* Licença vinculada para produtos de software */}
                  {produtos.find(p => p.id === item.produtoId)?.tipo === 'Software' && (
                    <div className="mt-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Licença Vinculada
                      </label>
                      <select
                        value={item.licencaId || ''}
                        onChange={(e) => atualizarItem(index, 'licencaId', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Selecione uma licença</option>
                        {licencas
                          .filter(l => l.clienteId === formData.clienteId)
                          .map(licenca => (
                            <option key={licenca.id} value={licenca.id}>
                              {licenca.software} - {licenca.usuarios} usuários
                            </option>
                          ))}
                      </select>
                    </div>
                  )}
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
                <p className="text-2xl font-bold text-green-600">
                  R$ {valorTotal.toLocaleString('pt-BR')}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Custo Total</p>
                <p className="text-2xl font-bold text-red-600">
                  R$ {custoTotal.toLocaleString('pt-BR')}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Lucro Bruto</p>
                <p className="text-2xl font-bold text-blue-600">
                  R$ {(valorTotal - custoTotal).toLocaleString('pt-BR')}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Margem</p>
                <p className="text-2xl font-bold text-purple-600">
                  {margemLucro.toFixed(1)}%
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
              <span>{isEdit ? 'Salvar' : 'Criar Plano'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}