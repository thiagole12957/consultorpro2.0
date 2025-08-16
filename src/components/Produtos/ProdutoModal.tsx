import React, { useState } from 'react';
import { X, Save } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { Produto } from '../../types';

interface ProdutoModalProps {
  produto?: Produto | null;
  onClose: () => void;
}

export function ProdutoModal({ produto, onClose }: ProdutoModalProps) {
  const { adicionarProduto, atualizarProduto, contasContabeis, licencas } = useApp();
  const isEdit = !!produto;
  
  const [formData, setFormData] = useState({
    nome: produto?.nome || '',
    tipo: produto?.tipo || 'Software',
    categoria: produto?.categoria || '',
    descricao: produto?.descricao || '',
    precoUnitario: produto?.precoUnitario || 0,
    unidadeMedida: produto?.unidadeMedida || 'unidade',
    fornecedor: produto?.fornecedor || '',
    custoUnitario: produto?.custoUnitario || 0,
    ativo: produto?.ativo ?? true,
    codigoNCM: produto?.codigoNCM || '',
    aliquotaICMS: produto?.aliquotaICMS || 0,
    aliquotaIPI: produto?.aliquotaIPI || 0,
    contaReceitaId: produto?.contaReceitaId || '',
    contaCustoId: produto?.contaCustoId || '',
    licencaId: produto?.licencaId || '',
  });

  const calcularMargem = () => {
    if (formData.precoUnitario > 0) {
      return ((formData.precoUnitario - formData.custoUnitario) / formData.precoUnitario) * 100;
    }
    return 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const margemLucro = calcularMargem();
    
    if (isEdit && produto) {
      atualizarProduto(produto.id, {
        ...formData,
        margemLucro,
      });
    } else {
      const novoProduto: Produto = {
        id: Date.now().toString(),
        ...formData,
        margemLucro,
        criadoEm: new Date().toISOString().split('T')[0],
      };
      adicionarProduto(novoProduto);
    }
    
    onClose();
  };

  const contasReceita = contasContabeis.filter(c => c.tipo === 'Receita' && (c.subtipo === 'Conta' || c.subtipo === 'Analitica'));
  const contasCusto = contasContabeis.filter(c => c.tipo === 'Despesa' && (c.subtipo === 'Conta' || c.subtipo === 'Analitica'));
  const licencasDisponiveis = licencas.filter(l => !l.produtoId || (isEdit && l.produtoId === produto?.id));

  const tipos = ['Software', 'Consultoria', 'Suporte', 'Treinamento', 'Hardware'];
  const unidades = ['unidade', 'hora', 'mês', 'ano', 'usuário', 'licença'];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {isEdit ? 'Editar Produto' : 'Novo Produto'}
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
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Informações Básicas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome do Produto *
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
                  Tipo *
                </label>
                <select
                  required
                  value={formData.tipo}
                  onChange={(e) => setFormData(prev => ({ ...prev, tipo: e.target.value as Produto['tipo'] }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {tipos.map(tipo => (
                    <option key={tipo} value={tipo}>{tipo}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categoria
                </label>
                <input
                  type="text"
                  value={formData.categoria}
                  onChange={(e) => setFormData(prev => ({ ...prev, categoria: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Unidade de Medida
                </label>
                <select
                  value={formData.unidadeMedida}
                  onChange={(e) => setFormData(prev => ({ ...prev, unidadeMedida: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {unidades.map(unidade => (
                    <option key={unidade} value={unidade}>{unidade}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="mt-4">
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
          </div>

          {/* Preços e Custos */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Preços e Custos</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Preço Unitário *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.precoUnitario}
                  onChange={(e) => setFormData(prev => ({ ...prev, precoUnitario: Number(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Custo Unitário
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.custoUnitario}
                  onChange={(e) => setFormData(prev => ({ ...prev, custoUnitario: Number(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-blue-900">Margem de Lucro:</span>
                <span className="text-lg font-bold text-blue-600">
                  {calcularMargem().toFixed(1)}%
                </span>
              </div>
            </div>
          </div>

          {/* Fornecedor */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fornecedor
            </label>
            <input
              type="text"
              value={formData.fornecedor}
              onChange={(e) => setFormData(prev => ({ ...prev, fornecedor: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Licença Vinculada (apenas para Software) */}
          {formData.tipo === 'Software' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Licença Vinculada
              </label>
              <select
                value={formData.licencaId}
                onChange={(e) => setFormData(prev => ({ ...prev, licencaId: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Selecione uma licença</option>
                {licencasDisponiveis.map(licenca => (
                  <option key={licenca.id} value={licenca.id}>
                    {licenca.software} - {licenca.usuarios} usuários
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Contas Contábeis */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contas Contábeis</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Conta de Receita *
                </label>
                <select
                  required
                  value={formData.contaReceitaId}
                  onChange={(e) => setFormData(prev => ({ ...prev, contaReceitaId: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Selecione a conta de receita</option>
                  {contasReceita.map(conta => (
                    <option key={conta.id} value={conta.id}>
                      {conta.codigo} - {conta.nome}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Conta de Custo *
                </label>
                <select
                  required
                  value={formData.contaCustoId}
                  onChange={(e) => setFormData(prev => ({ ...prev, contaCustoId: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Selecione a conta de custo</option>
                  {contasCusto.map(conta => (
                    <option key={conta.id} value={conta.id}>
                      {conta.codigo} - {conta.nome}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Impostos */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Informações Fiscais</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Código NCM
                </label>
                <input
                  type="text"
                  value={formData.codigoNCM}
                  onChange={(e) => setFormData(prev => ({ ...prev, codigoNCM: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0000.00.00"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Alíquota ICMS (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={formData.aliquotaICMS}
                  onChange={(e) => setFormData(prev => ({ ...prev, aliquotaICMS: Number(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Alíquota IPI (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={formData.aliquotaIPI}
                  onChange={(e) => setFormData(prev => ({ ...prev, aliquotaIPI: Number(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
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
              Produto Ativo
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
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>{isEdit ? 'Salvar' : 'Criar Produto'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}