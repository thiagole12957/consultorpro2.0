import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Eye, Edit2, Package, DollarSign, TrendingUp, Tag } from 'lucide-react';
import { ProdutoModal } from './ProdutoModal';

export function ProdutosList() {
  const { produtos } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [produtoEdit, setProdutoEdit] = useState(null);

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'Software': return 'bg-blue-100 text-blue-700';
      case 'Consultoria': return 'bg-green-100 text-green-700';
      case 'Suporte': return 'bg-orange-100 text-orange-700';
      case 'Treinamento': return 'bg-purple-100 text-purple-700';
      case 'Hardware': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handleEditProduto = (produto: any) => {
    setProdutoEdit(produto);
    setShowModal(true);
  };

  return (
    <div className="p-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Produto/Serviço</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Tipo</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Categoria</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Preço Unitário</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Custo</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Margem</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Fornecedor</th>
                <th className="text-right py-4 px-6 font-semibold text-gray-900">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {produtos.map((produto) => (
                <tr key={produto.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                        <Package className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{produto.nome}</p>
                        <p className="text-sm text-gray-500">
                          {produto.unidadeMedida}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTipoColor(produto.tipo)}`}>
                      {produto.tipo}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center">
                      <Tag className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="text-gray-900">{produto.categoria}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center">
                      <DollarSign className="w-4 h-4 mr-1 text-green-600" />
                      <span className="font-semibold text-gray-900">
                        R$ {produto.precoUnitario.toLocaleString('pt-BR')}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-red-600 font-medium">
                      R$ {produto.custoUnitario.toLocaleString('pt-BR')}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center">
                      <TrendingUp className="w-4 h-4 mr-1 text-blue-600" />
                      <span className="font-medium text-blue-900">
                        {produto.margemLucro.toFixed(1)}%
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-gray-700">{produto.fornecedor || '-'}</span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Ver detalhes"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEditProduto(produto)}
                        className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                        title="Editar produto"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <ProdutoModal
          produto={produtoEdit}
          onClose={() => {
            setShowModal(false);
            setProdutoEdit(null);
          }}
        />
      )}
    </div>
  );
}