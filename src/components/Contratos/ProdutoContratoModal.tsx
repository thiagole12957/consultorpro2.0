import React, { useState } from 'react';
import { X, Save } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

interface ProdutoContrato {
  id: string;
  contratoId: string;
  produtoId?: string;
  nome: string;
  descricao: string;
  quantidade: number;
  valorUnitario: number;
  valorTotal: number;
  tipo: 'plano_venda' | 'manual';
  ativo: boolean;
  criadoEm: string;
}

interface ProdutoContratoModalProps {
  contratoId: string;
  produto?: ProdutoContrato | null;
  onSave: (produto: Omit<ProdutoContrato, 'id' | 'criadoEm'>) => void;
  onClose: () => void;
}

export function ProdutoContratoModal({ contratoId, produto, onSave, onClose }: ProdutoContratoModalProps) {
  const { produtos } = useApp();
  const isEdit = !!produto;
  
  const [formData, setFormData] = useState({
    produtoId: produto?.produtoId || '',
    nome: produto?.nome || '',
    descricao: produto?.descricao || '',
    quantidade: produto?.quantidade || 1,
    valorUnitario: produto?.valorUnitario || 0,
    ativo: produto?.ativo ?? true,
  });

  const calcularValorTotal = () => {
    return formData.quantidade * formData.valorUnitario;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const produtoData = {
      contratoId,
      ...formData,
      valorTotal: calcularValorTotal(),
      tipo: 'manual' as const,
    };
    
    onSave(produtoData);
  };

  const handleProdutoChange = (produtoId: string) => {
    const produto = produtos.find(p => p.id === produtoId);
    if (produto) {
      setFormData(prev => ({
        ...prev,
        produtoId,
        nome: produto.nome,
        descricao: produto.descricao,
        valorUnitario: produto.precoUnitario,
      }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {isEdit ? 'Editar Produto do Contrato' : 'Adicionar Produto Manual'}
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
              Produto Base (Opcional)
            </label>
            <select
              value={formData.produtoId}
              onChange={(e) => handleProdutoChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Produto personalizado</option>
              {produtos.filter(p => p.ativo).map(produto => (
                <option key={produto.id} value={produto.id}>
                  {produto.nome} - R$ {produto.precoUnitario.toLocaleString('pt-BR')}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome do Produto/Serviço *
            </label>
            <input
              type="text"
              required
              value={formData.nome}
              onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Nome do produto ou serviço"
            />
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
              placeholder="Descrição detalhada do produto/serviço"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantidade *
              </label>
              <input
                type="number"
                required
                min="1"
                value={formData.quantidade}
                onChange={(e) => setFormData(prev => ({ ...prev, quantidade: Number(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Valor Unitário *
              </label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={formData.valorUnitario}
                onChange={(e) => setFormData(prev => ({ ...prev, valorUnitario: Number(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          {/* Valor Total Calculado */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-blue-900">Valor Total:</span>
              <span className="text-lg font-bold text-blue-600">
                R$ {calcularValorTotal().toLocaleString('pt-BR')}
              </span>
            </div>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="ativo"
              checked={formData.ativo}
              onChange={(e) => setFormData(prev => ({ ...prev, ativo: e.target.checked }))}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="ativo" className="ml-2 block text-sm text-gray-900">
              Produto Ativo no Contrato
            </label>
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
              className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>{isEdit ? 'Salvar Alterações' : 'Adicionar Produto'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}