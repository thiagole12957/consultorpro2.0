import React, { useState } from 'react';
import { X, Save, Plus, Trash2, Code, Settings, FileText, Eye } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { ModeloContrato, VariavelContrato, ClausulaContrato } from '../../types';

interface ModeloContratoModalProps {
  modelo?: ModeloContrato | null;
  onClose: () => void;
}

export function ModeloContratoModal({ modelo, onClose }: ModeloContratoModalProps) {
  const { adicionarModeloContrato, atualizarModeloContrato, empresaSelecionada } = useApp();
  const isEdit = !!modelo;
  
  const [formData, setFormData] = useState({
    nome: modelo?.nome || '',
    categoria: modelo?.categoria || 'consultoria',
    conteudo: modelo?.conteudo || '',
    configuracoes: {
      assinaturaDigital: modelo?.configuracoes?.assinaturaDigital ?? true,
      versionamento: modelo?.configuracoes?.versionamento ?? true,
      aprovacaoObrigatoria: modelo?.configuracoes?.aprovacaoObrigatoria ?? false,
      validadeDias: modelo?.configuracoes?.validadeDias || 30,
    },
    ativo: modelo?.ativo ?? true,
  });

  const [variaveis, setVariaveis] = useState<VariavelContrato[]>(modelo?.variaveis || []);
  const [clausulas, setClausulas] = useState<ClausulaContrato[]>(modelo?.clausulas || []);
  const [activeTab, setActiveTab] = useState<'conteudo' | 'variaveis' | 'clausulas' | 'configuracoes'>('conteudo');

  const adicionarVariavel = () => {
    const novaVariavel: VariavelContrato = {
      id: Date.now().toString(),
      nome: '',
      tipo: 'texto',
      obrigatoria: false,
      valorPadrao: '',
      descricao: '',
    };
    setVariaveis([...variaveis, novaVariavel]);
  };

  const removerVariavel = (index: number) => {
    setVariaveis(variaveis.filter((_, i) => i !== index));
  };

  const atualizarVariavel = (index: number, campo: string, valor: any) => {
    const novasVariaveis = [...variaveis];
    novasVariaveis[index] = { ...novasVariaveis[index], [campo]: valor };
    setVariaveis(novasVariaveis);
  };

  const adicionarClausula = () => {
    const novaClausula: ClausulaContrato = {
      id: Date.now().toString(),
      titulo: '',
      conteudo: '',
      obrigatoria: false,
      ordem: clausulas.length + 1,
      categoria: 'geral',
    };
    setClausulas([...clausulas, novaClausula]);
  };

  const removerClausula = (index: number) => {
    setClausulas(clausulas.filter((_, i) => i !== index));
  };

  const atualizarClausula = (index: number, campo: string, valor: any) => {
    const novasClausulas = [...clausulas];
    novasClausulas[index] = { ...novasClausulas[index], [campo]: valor };
    setClausulas(novasClausulas);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!empresaSelecionada) {
      alert('Selecione uma empresa primeiro');
      return;
    }
    
    if (isEdit && modelo) {
      atualizarModeloContrato(modelo.id, {
        ...formData,
        variaveis,
        clausulas,
        atualizadoEm: new Date().toISOString().split('T')[0],
      });
    } else {
      const novoModelo: ModeloContrato = {
        id: Date.now().toString(),
        empresaId: empresaSelecionada.id,
        ...formData,
        variaveis,
        clausulas,
        criadoEm: new Date().toISOString().split('T')[0],
        atualizadoEm: new Date().toISOString().split('T')[0],
      };
      adicionarModeloContrato(novoModelo);
    }
    
    onClose();
  };

  const inserirVariavelNoConteudo = (nomeVariavel: string) => {
    const novoConteudo = formData.conteudo + `{{${nomeVariavel}}}`;
    setFormData(prev => ({ ...prev, conteudo: novoConteudo }));
  };

  const renderConteudo = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Conteúdo do Contrato *
        </label>
        <textarea
          required
          value={formData.conteudo}
          onChange={(e) => setFormData(prev => ({ ...prev, conteudo: e.target.value }))}
          rows={15}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
          placeholder="Digite o conteúdo do contrato. Use {{nomeVariavel}} para inserir variáveis dinâmicas."
        />
      </div>
      
      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">Variáveis Disponíveis:</h4>
        <div className="flex flex-wrap gap-2">
          {variaveis.map((variavel) => (
            <button
              key={variavel.id}
              type="button"
              onClick={() => inserirVariavelNoConteudo(variavel.nome)}
              className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm hover:bg-blue-200 transition-colors"
            >
              {`{{${variavel.nome}}}`}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderVariaveis = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-gray-900">Variáveis do Contrato</h4>
        <button
          type="button"
          onClick={adicionarVariavel}
          className="bg-blue-600 text-white px-3 py-1 rounded-lg flex items-center space-x-1 hover:bg-blue-700 transition-colors text-sm"
        >
          <Plus className="w-3 h-3" />
          <span>Variável</span>
        </button>
      </div>
      
      <div className="space-y-3">
        {variaveis.map((variavel, index) => (
          <div key={variavel.id} className="border border-gray-200 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome da Variável *
                </label>
                <input
                  type="text"
                  required
                  value={variavel.nome}
                  onChange={(e) => atualizarVariavel(index, 'nome', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="nomeCliente"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo *
                </label>
                <select
                  required
                  value={variavel.tipo}
                  onChange={(e) => atualizarVariavel(index, 'tipo', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  <option value="texto">Texto</option>
                  <option value="numero">Número</option>
                  <option value="data">Data</option>
                  <option value="moeda">Moeda</option>
                  <option value="lista">Lista</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Valor Padrão
                </label>
                <input
                  type="text"
                  value={variavel.valorPadrao}
                  onChange={(e) => atualizarVariavel(index, 'valorPadrao', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
              
              <div className="flex items-end space-x-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id={`obrigatoria-${index}`}
                    checked={variavel.obrigatoria}
                    onChange={(e) => atualizarVariavel(index, 'obrigatoria', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor={`obrigatoria-${index}`} className="ml-2 text-sm text-gray-900">
                    Obrigatória
                  </label>
                </div>
                <button
                  type="button"
                  onClick={() => removerVariavel(index)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="mt-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descrição
              </label>
              <input
                type="text"
                value={variavel.descricao}
                onChange={(e) => atualizarVariavel(index, 'descricao', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                placeholder="Descrição da variável"
              />
            </div>
            
            {variavel.tipo === 'lista' && (
              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Opções (separadas por vírgula)
                </label>
                <input
                  type="text"
                  value={variavel.opcoes?.join(', ') || ''}
                  onChange={(e) => atualizarVariavel(index, 'opcoes', e.target.value.split(',').map(s => s.trim()))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="Opção 1, Opção 2, Opção 3"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderClausulas = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-gray-900">Cláusulas do Contrato</h4>
        <button
          type="button"
          onClick={adicionarClausula}
          className="bg-green-600 text-white px-3 py-1 rounded-lg flex items-center space-x-1 hover:bg-green-700 transition-colors text-sm"
        >
          <Plus className="w-3 h-3" />
          <span>Cláusula</span>
        </button>
      </div>
      
      <div className="space-y-3">
        {clausulas.map((clausula, index) => (
          <div key={clausula.id} className="border border-gray-200 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Título da Cláusula *
                </label>
                <input
                  type="text"
                  required
                  value={clausula.titulo}
                  onChange={(e) => atualizarClausula(index, 'titulo', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categoria
                </label>
                <select
                  value={clausula.categoria}
                  onChange={(e) => atualizarClausula(index, 'categoria', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  <option value="geral">Geral</option>
                  <option value="pagamento">Pagamento</option>
                  <option value="entrega">Entrega</option>
                  <option value="responsabilidade">Responsabilidade</option>
                  <option value="rescisao">Rescisão</option>
                </select>
              </div>
              
              <div className="flex items-end space-x-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id={`clausula-obrigatoria-${index}`}
                    checked={clausula.obrigatoria}
                    onChange={(e) => atualizarClausula(index, 'obrigatoria', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor={`clausula-obrigatoria-${index}`} className="ml-2 text-sm text-gray-900">
                    Obrigatória
                  </label>
                </div>
                <button
                  type="button"
                  onClick={() => removerClausula(index)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Conteúdo da Cláusula *
              </label>
              <textarea
                required
                value={clausula.conteudo}
                onChange={(e) => atualizarClausula(index, 'conteudo', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                placeholder="Conteúdo da cláusula..."
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderConfiguracoes = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="assinaturaDigital"
              checked={formData.configuracoes.assinaturaDigital}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                configuracoes: { ...prev.configuracoes, assinaturaDigital: e.target.checked }
              }))}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="assinaturaDigital" className="ml-2 block text-sm text-gray-900">
              Assinatura Digital Obrigatória
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="versionamento"
              checked={formData.configuracoes.versionamento}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                configuracoes: { ...prev.configuracoes, versionamento: e.target.checked }
              }))}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="versionamento" className="ml-2 block text-sm text-gray-900">
              Controle de Versionamento
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="aprovacaoObrigatoria"
              checked={formData.configuracoes.aprovacaoObrigatoria}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                configuracoes: { ...prev.configuracoes, aprovacaoObrigatoria: e.target.checked }
              }))}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="aprovacaoObrigatoria" className="ml-2 block text-sm text-gray-900">
              Aprovação Obrigatória
            </label>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Validade do Contrato (dias)
          </label>
          <input
            type="number"
            min="1"
            max="3650"
            value={formData.configuracoes.validadeDias}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              configuracoes: { ...prev.configuracoes, validadeDias: Number(e.target.value) }
            }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {isEdit ? 'Editar Modelo de Contrato' : 'Novo Modelo de Contrato'}
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
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Informações do Modelo</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome do Modelo *
                </label>
                <input
                  type="text"
                  required
                  value={formData.nome}
                  onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: Contrato de Consultoria Padrão"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categoria *
                </label>
                <select
                  required
                  value={formData.categoria}
                  onChange={(e) => setFormData(prev => ({ ...prev, categoria: e.target.value as ModeloContrato['categoria'] }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="consultoria">Consultoria</option>
                  <option value="software">Software</option>
                  <option value="suporte">Suporte</option>
                  <option value="misto">Misto</option>
                </select>
              </div>
            </div>
          </div>

          {/* Navegação por Abas */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              <button
                type="button"
                onClick={() => setActiveTab('conteudo')}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors flex items-center space-x-2 ${
                  activeTab === 'conteudo'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Conteúdo</span>
              </button>
              
              <button
                type="button"
                onClick={() => setActiveTab('variaveis')}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors flex items-center space-x-2 ${
                  activeTab === 'variaveis'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Code className="w-4 h-4" />
                <span>Variáveis ({variaveis.length})</span>
              </button>
              
              <button
                type="button"
                onClick={() => setActiveTab('clausulas')}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors flex items-center space-x-2 ${
                  activeTab === 'clausulas'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Settings className="w-4 h-4" />
                <span>Cláusulas ({clausulas.length})</span>
              </button>
              
              <button
                type="button"
                onClick={() => setActiveTab('configuracoes')}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors flex items-center space-x-2 ${
                  activeTab === 'configuracoes'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Settings className="w-4 h-4" />
                <span>Configurações</span>
              </button>
            </nav>
          </div>

          {/* Conteúdo das Abas */}
          <div>
            {activeTab === 'conteudo' && renderConteudo()}
            {activeTab === 'variaveis' && renderVariaveis()}
            {activeTab === 'clausulas' && renderClausulas()}
            {activeTab === 'configuracoes' && renderConfiguracoes()}
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
              Modelo Ativo
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
              <span>{isEdit ? 'Salvar Modelo' : 'Criar Modelo'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}