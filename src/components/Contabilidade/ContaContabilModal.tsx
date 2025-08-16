import React, { useState } from 'react';
import { X, Save } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { ContaContabil } from '../../types';

interface ContaContabilModalProps {
  conta?: ContaContabil | null;
  onClose: () => void;
}

export function ContaContabilModal({ conta, onClose }: ContaContabilModalProps) {
  const { contasContabeis, adicionarContaContabil, atualizarContaContabil } = useApp();
  const isEdit = !!conta;
  
  const [formData, setFormData] = useState({
    codigo: conta?.codigo || '',
    nome: conta?.nome || '',
    tipo: conta?.tipo || 'Ativo',
    subtipo: conta?.subtipo || 'Grupo',
    contaPai: conta?.contaPai || '',
    natureza: conta?.natureza || 'Devedora',
    ativa: conta?.ativa ?? true,
  });

  const calcularNivel = (contaPaiId: string): number => {
    if (!contaPaiId) return 1;
    const contaPai = contasContabeis.find(c => c.id === contaPaiId);
    return contaPai ? contaPai.nivel + 1 : 1;
  };

  const gerarProximoCodigo = (contaPaiId: string): string => {
    if (!contaPaiId) {
      // Conta raiz - próximo número disponível
      const contasRaiz = contasContabeis.filter(c => !c.contaPai && c.codigo.length === 1);
      const ultimoCodigo = Math.max(...contasRaiz.map(c => parseInt(c.codigo) || 0), 0);
      return (ultimoCodigo + 1).toString();
    }
    
    const contaPai = contasContabeis.find(c => c.id === contaPaiId);
    if (!contaPai) return '';
    
    const contasFilhas = contasContabeis.filter(c => c.contaPai === contaPaiId);
    const codigosPai = contaPai.codigo;
    
    // Encontrar próximo subcódigo disponível
    let proximoNumero = 1;
    while (true) {
      const novoCodigo = `${codigosPai}.${proximoNumero}`;
      if (!contasFilhas.some(c => c.codigo === novoCodigo)) {
        return novoCodigo;
      }
      proximoNumero++;
    }
  };

  const getContasPossiveis = () => {
    if (isEdit) {
      // Não pode ser pai de si mesmo ou de suas filhas
      return contasContabeis.filter(c => 
        c.id !== conta?.id && 
        !c.codigo.startsWith(conta?.codigo + '.') &&
        c.subtipo !== 'Conta' && 
        c.subtipo !== 'Analitica'
      );
    }
    
    return contasContabeis.filter(c => 
      c.subtipo !== 'Conta' && 
      c.subtipo !== 'Analitica'
    );
  };

  const handleContaPaiChange = (contaPaiId: string) => {
    setFormData(prev => ({
      ...prev,
      contaPai: contaPaiId,
      codigo: contaPaiId ? gerarProximoCodigo(contaPaiId) : gerarProximoCodigo(''),
    }));
    
    // Ajustar natureza baseada no tipo da conta pai
    if (contaPaiId) {
      const contaPai = contasContabeis.find(c => c.id === contaPaiId);
      if (contaPai) {
        setFormData(prev => ({
          ...prev,
          tipo: contaPai.tipo,
          natureza: contaPai.natureza,
        }));
      }
    }
  };

  const handleTipoChange = (tipo: string) => {
    setFormData(prev => ({
      ...prev,
      tipo: tipo as ContaContabil['tipo'],
      natureza: ['Ativo', 'Despesa'].includes(tipo) ? 'Devedora' : 'Credora',
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const nivel = calcularNivel(formData.contaPai);
    
    if (isEdit && conta) {
      atualizarContaContabil(conta.id, {
        ...formData,
        nivel,
      });
    } else {
      const novaConta: ContaContabil = {
        id: Date.now().toString(),
        ...formData,
        nivel,
      };
      adicionarContaContabil(novaConta);
    }
    
    onClose();
  };

  const subtipos = ['Grupo', 'Subgrupo', 'Conta', 'Analitica'];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {isEdit ? 'Editar Conta Contábil' : 'Nova Conta Contábil'}
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
              Conta Pai (Opcional)
            </label>
            <select
              value={formData.contaPai}
              onChange={(e) => handleContaPaiChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Conta Raiz (Nível 1)</option>
              {getContasPossiveis().map(contaPossivel => (
                <option key={contaPossivel.id} value={contaPossivel.id}>
                  {contaPossivel.codigo} - {contaPossivel.nome}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Código *
              </label>
              <input
                type="text"
                required
                value={formData.codigo}
                onChange={(e) => setFormData(prev => ({ ...prev, codigo: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                placeholder="Ex: 1.1.1"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nível
              </label>
              <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-center font-semibold text-blue-600">
                {calcularNivel(formData.contaPai)}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome da Conta *
            </label>
            <input
              type="text"
              required
              value={formData.nome}
              onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ex: Caixa e Equivalentes de Caixa"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo *
              </label>
              <select
                required
                value={formData.tipo}
                onChange={(e) => handleTipoChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Ativo">Ativo</option>
                <option value="Passivo">Passivo</option>
                <option value="Patrimonio">Patrimônio Líquido</option>
                <option value="Receita">Receita</option>
                <option value="Despesa">Despesa</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subtipo *
              </label>
              <select
                required
                value={formData.subtipo}
                onChange={(e) => setFormData(prev => ({ ...prev, subtipo: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {subtipos.map(subtipo => (
                  <option key={subtipo} value={subtipo}>{subtipo}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Natureza *
            </label>
            <div className="grid grid-cols-2 gap-4">
              <label className="flex items-center space-x-2 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="natureza"
                  value="Devedora"
                  checked={formData.natureza === 'Devedora'}
                  onChange={(e) => setFormData(prev => ({ ...prev, natureza: e.target.value as 'Devedora' | 'Credora' }))}
                  className="text-blue-600"
                />
                <span className="text-sm">Devedora (D)</span>
              </label>
              
              <label className="flex items-center space-x-2 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="natureza"
                  value="Credora"
                  checked={formData.natureza === 'Credora'}
                  onChange={(e) => setFormData(prev => ({ ...prev, natureza: e.target.value as 'Devedora' | 'Credora' }))}
                  className="text-green-600"
                />
                <span className="text-sm">Credora (C)</span>
              </label>
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="ativa"
              checked={formData.ativa}
              onChange={(e) => setFormData(prev => ({ ...prev, ativa: e.target.checked }))}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="ativa" className="ml-2 block text-sm text-gray-900">
              Conta Ativa
            </label>
          </div>

          {/* Informações de Ajuda */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Dicas:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• <strong>Grupo/Subgrupo:</strong> Contas sintéticas para organização</li>
              <li>• <strong>Conta/Analítica:</strong> Contas que recebem lançamentos</li>
              <li>• <strong>Código:</strong> Use numeração sequencial (1, 1.1, 1.1.1)</li>
              <li>• <strong>Natureza:</strong> Definida automaticamente pelo tipo</li>
            </ul>
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
              <span>{isEdit ? 'Salvar' : 'Criar Conta'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}