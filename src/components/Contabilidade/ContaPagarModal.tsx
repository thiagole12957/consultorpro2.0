import React, { useState } from 'react';
import { X, Save, Upload, Trash2, Paperclip } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { ContaPagar } from '../../types';

interface ContaPagarModalProps {
  conta?: ContaPagar | null;
  onClose: () => void;
}

export function ContaPagarModal({ conta, onClose }: ContaPagarModalProps) {
  const { adicionarContaPagar, atualizarContaPagar, contasContabeis, gerarLancamentoPagamento, fornecedores, contasBancarias, empresaSelecionada, filiais, empresas } = useApp();
  const isEdit = !!conta;
  
  const [formData, setFormData] = useState({
    empresaId: conta?.empresaId || empresaSelecionada?.id || '',
    filialId: conta?.filialId || '',
    fornecedorId: conta?.fornecedorId || '',
    descricao: conta?.descricao || '',
    valor: conta?.valor || 0,
    dataVencimento: conta?.dataVencimento || '',
    dataPagamento: conta?.dataPagamento || '',
    status: conta?.status || 'Pendente',
    categoria: conta?.categoria || 'Fornecedor',
    contaContabilId: conta?.contaContabilId || '',
    documento: conta?.documento || '',
    observacoes: conta?.observacoes || '',
    isRecorrente: conta?.isRecorrente || false,
    frequenciaRecorrencia: conta?.frequenciaRecorrencia || 'Mensal',
    formaPagamento: conta?.formaPagamento || 'PIX',
    contaBancariaId: conta?.contaBancariaId || '',
    numeroNF: conta?.numeroNF || '',
    chaveNFe: conta?.chaveNFe || '',
    valorPago: conta?.valorPago || 0,
    jurosMulta: conta?.jurosMulta || 0,
    desconto: conta?.desconto || 0,
    centroCusto: conta?.centroCusto || '',
    aprovadoPor: conta?.aprovadoPor || '',
    dataAprovacao: conta?.dataAprovacao || '',
  });

  const [anexos, setAnexos] = useState<string[]>(conta?.anexos || []);
  const [novoAnexo, setNovoAnexo] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.empresaId || !formData.filialId) {
      alert('Selecione a empresa e filial para a conta');
      return;
    }
    
    if (isEdit && conta) {
      const statusAnterior = conta.status;
      atualizarContaPagar(conta.id, {
        ...formData,
        anexos,
      });
      
      // Se mudou para "Pago", gerar lançamento contábil
      if (statusAnterior !== 'Pago' && formData.status === 'Pago') {
        const contaAtualizada = { ...conta, ...formData, anexos };
        gerarLancamentoPagamento(contaAtualizada);
      }
    } else {
      const novaConta: ContaPagar = {
        id: Date.now().toString(),
        ...formData,
        anexos,
        criadoEm: new Date().toISOString().split('T')[0],
      };
      adicionarContaPagar(novaConta);
      
      // Se já está marcada como paga, gerar lançamento
      if (formData.status === 'Pago') {
        gerarLancamentoPagamento(novaConta);
      }
    }
    
    onClose();
  };

  const filiaisDisponiveis = filiais.filter(f => 
    f.empresaId === formData.empresaId && f.ativa && f.configuracoes.permiteCompras
  );

  const fornecedoresEmpresa = fornecedores.filter(f => 
    f.empresaId === formData.empresaId && f.ativo
  );

  const contasBancariasFilial = contasBancarias.filter(cb => 
    cb.empresaId === formData.empresaId && cb.filialId === formData.filialId && cb.ativa
  );
  const adicionarAnexo = () => {
    if (novoAnexo.trim()) {
      setAnexos(prev => [...prev, novoAnexo.trim()]);
      setNovoAnexo('');
    }
  };

  const removerAnexo = (index: number) => {
    setAnexos(prev => prev.filter((_, i) => i !== index));
  };

  const contasDespesa = contasContabeis.filter(c => c.tipo === 'Despesa' && (c.subtipo === 'Conta' || c.subtipo === 'Analitica'));
  const centrosCusto = ['Administrativo', 'Comercial', 'TI', 'Operacional', 'Financeiro'];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {isEdit ? 'Editar Conta a Pagar' : 'Nova Conta a Pagar'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Seleção de Empresa e Filial */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-3">Empresa e Filial</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Empresa *
                </label>
                <select
                  required
                  value={formData.empresaId}
                  onChange={(e) => setFormData(prev => ({ ...prev, empresaId: e.target.value, filialId: '', fornecedorId: '', contaBancariaId: '' }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Selecione a empresa</option>
                  {empresas.filter(e => e.ativa).map(empresa => (
                    <option key={empresa.id} value={empresa.id}>
                      {empresa.nomeFantasia}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Filial *
                </label>
                <select
                  required
                  value={formData.filialId}
                  onChange={(e) => setFormData(prev => ({ ...prev, filialId: e.target.value, contaBancariaId: '' }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={!formData.empresaId}
                >
                  <option value="">Selecione a filial</option>
                  {filiaisDisponiveis.map(filial => (
                    <option key={filial.id} value={filial.id}>
                      {filial.nome} {filial.isMatriz ? '(Matriz)' : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Informações Básicas */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Informações Básicas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fornecedor *
                </label>
                <select
                  required
                  value={formData.fornecedorId}
                  onChange={(e) => setFormData(prev => ({ ...prev, fornecedorId: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={!formData.empresaId}
                >
                  <option value="">Selecione um fornecedor</option>
                  {fornecedoresEmpresa.map(fornecedor => (
                      <option key={fornecedor.id} value={fornecedor.id}>
                        {fornecedor.nome} - {fornecedor.cnpj}
                      </option>
                    ))}
                </select>
                {!formData.empresaId && (
                  <p className="text-sm text-gray-500 mt-1">Selecione uma empresa primeiro</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categoria *
                </label>
                <select
                  required
                  value={formData.categoria}
                  onChange={(e) => setFormData(prev => ({ ...prev, categoria: e.target.value as ContaPagar['categoria'] }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Fornecedor">Fornecedor</option>
                  <option value="Licenca">Licença</option>
                  <option value="Servico">Serviço</option>
                  <option value="Imposto">Imposto</option>
                  <option value="Outros">Outros</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descrição *
              </label>
              <input
                type="text"
                required
                value={formData.descricao}
                onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Descrição da despesa"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Conta Contábil *
              </label>
              <select
                required
                value={formData.contaContabilId}
                onChange={(e) => setFormData(prev => ({ ...prev, contaContabilId: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Selecione a conta contábil</option>
                {contasDespesa.map(conta => (
                  <option key={conta.id} value={conta.id}>
                    {conta.codigo} - {conta.nome}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Valores e Datas */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Valores e Datas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Valor Original *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.valor}
                  onChange={(e) => setFormData(prev => ({ ...prev, valor: Number(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Centro de Custo
                </label>
                <select
                  value={formData.centroCusto}
                  onChange={(e) => setFormData(prev => ({ ...prev, centroCusto: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Selecione o centro de custo</option>
                  {centrosCusto.map(centro => (
                    <option key={centro} value={centro}>{centro}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data de Vencimento *
                </label>
                <input
                  type="date"
                  required
                  value={formData.dataVencimento}
                  onChange={(e) => setFormData(prev => ({ ...prev, dataVencimento: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as ContaPagar['status'] }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Pendente">Pendente</option>
                  <option value="Pago">Pago</option>
                  <option value="Vencida">Vencida</option>
                  <option value="Cancelada">Cancelada</option>
                </select>
              </div>
            </div>

            {/* Valores Adicionais para Pagamento */}
            {formData.status === 'Pago' && (
              <div className="mt-4 p-4 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-900 mb-3">Detalhes do Pagamento</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Valor Pago
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.valorPago}
                      onChange={(e) => setFormData(prev => ({ ...prev, valorPago: Number(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Juros/Multa
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.jurosMulta}
                      onChange={(e) => setFormData(prev => ({ ...prev, jurosMulta: Number(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Desconto
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.desconto}
                      onChange={(e) => setFormData(prev => ({ ...prev, desconto: Number(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Data de Pagamento
                    </label>
                    <input
                      type="date"
                      value={formData.dataPagamento}
                      onChange={(e) => setFormData(prev => ({ ...prev, dataPagamento: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Forma de Pagamento
                    </label>
                    <select
                      value={formData.formaPagamento}
                      onChange={(e) => setFormData(prev => ({ ...prev, formaPagamento: e.target.value as ContaPagar['formaPagamento'] }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="PIX">PIX</option>
                      <option value="TED">TED</option>
                      <option value="Boleto">Boleto</option>
                      <option value="Debito">Débito Automático</option>
                      <option value="Cartao">Cartão</option>
                      <option value="Dinheiro">Dinheiro</option>
                    </select>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Conta Bancária Utilizada
                  </label>
                  <select
                    value={formData.contaBancariaId}
                    onChange={(e) => setFormData(prev => ({ ...prev, contaBancariaId: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={!formData.filialId}
                  >
                    <option value="">Selecione uma conta</option>
                    {contasBancariasFilial.map(conta => (
                        <option key={conta.id} value={conta.id}>
                          {conta.nome} - {conta.banco} (Saldo: R$ {conta.saldoAtual.toLocaleString('pt-BR')})
                        </option>
                      ))}
                  </select>
                  {!formData.filialId && (
                    <p className="text-sm text-gray-500 mt-1">Selecione uma filial primeiro</p>
                  )}
                </div>

                {/* Resumo do Pagamento */}
                <div className="mt-4 p-3 bg-white border border-green-200 rounded-lg">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Valor Original:</span>
                        <span className="font-medium">R$ {formData.valor.toLocaleString('pt-BR')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Juros/Multa:</span>
                        <span className="text-red-600">+ R$ {formData.jurosMulta.toLocaleString('pt-BR')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Desconto:</span>
                        <span className="text-green-600">- R$ {formData.desconto.toLocaleString('pt-BR')}</span>
                      </div>
                    </div>
                    <div className="border-l border-gray-200 pl-4">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-700">Total a Pagar:</span>
                        <span className="text-lg font-bold text-green-600">
                          R$ {(formData.valor + formData.jurosMulta - formData.desconto).toLocaleString('pt-BR')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Informações Fiscais */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Informações Fiscais</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Documento
                </label>
                <input
                  type="text"
                  value={formData.documento}
                  onChange={(e) => setFormData(prev => ({ ...prev, documento: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Número da nota fiscal, boleto, etc."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Número da NF
                </label>
                <input
                  type="text"
                  value={formData.numeroNF}
                  onChange={(e) => setFormData(prev => ({ ...prev, numeroNF: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="123456"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Chave NFe
                </label>
                <input
                  type="text"
                  value={formData.chaveNFe}
                  onChange={(e) => setFormData(prev => ({ ...prev, chaveNFe: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="44 dígitos da chave de acesso"
                />
              </div>
            </div>
          </div>

          {/* Anexos */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Anexos e Documentos</h3>
            
            <div className="space-y-3">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={novoAnexo}
                  onChange={(e) => setNovoAnexo(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), adicionarAnexo())}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nome do arquivo ou URL do documento"
                />
                <button
                  type="button"
                  onClick={adicionarAnexo}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <Upload className="w-4 h-4" />
                  <span>Adicionar</span>
                </button>
              </div>
              
              {anexos.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">Arquivos anexados:</p>
                  {anexos.map((anexo, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Paperclip className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-700">{anexo}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removerAnexo(index)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-600">Arraste arquivos aqui ou clique para fazer upload</p>
                <p className="text-xs text-gray-500 mt-1">PDF, DOC, XLS, IMG (máx. 10MB cada)</p>
              </div>
            </div>
          </div>

          {/* Configurações de Recorrência */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Configurações de Recorrência</h3>
            
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="isRecorrente"
                checked={formData.isRecorrente}
                onChange={(e) => setFormData(prev => ({ ...prev, isRecorrente: e.target.checked }))}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="isRecorrente" className="ml-2 block text-sm font-medium text-gray-900">
                Despesa Recorrente (gerar automaticamente)
              </label>
            </div>
            
            {formData.isRecorrente && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-blue-50 rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Frequência *
                  </label>
                  <select
                    required
                    value={formData.frequenciaRecorrencia}
                    onChange={(e) => setFormData(prev => ({ ...prev, frequenciaRecorrencia: e.target.value as ContaPagar['frequenciaRecorrencia'] }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Mensal">Mensal</option>
                    <option value="Bimestral">Bimestral</option>
                    <option value="Trimestral">Trimestral</option>
                    <option value="Semestral">Semestral</option>
                    <option value="Anual">Anual</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Forma de Pagamento Padrão
                  </label>
                  <select
                    value={formData.formaPagamento}
                    onChange={(e) => setFormData(prev => ({ ...prev, formaPagamento: e.target.value as ContaPagar['formaPagamento'] }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="PIX">PIX</option>
                    <option value="TED">TED</option>
                    <option value="Boleto">Boleto</option>
                    <option value="Debito">Débito Automático</option>
                    <option value="Cartao">Cartão</option>
                    <option value="Dinheiro">Dinheiro</option>
                  </select>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Conta Bancária Padrão
                  </label>
                  <select
                    value={formData.contaBancariaId}
                    onChange={(e) => setFormData(prev => ({ ...prev, contaBancariaId: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={!formData.filialId}
                  >
                    <option value="">Selecione uma conta</option>
                    {contasBancariasFilial.map(conta => (
                        <option key={conta.id} value={conta.id}>
                          {conta.nome} - {conta.banco} (Saldo: R$ {conta.saldoAtual.toLocaleString('pt-BR')})
                        </option>
                      ))}
                  </select>
                  {!formData.filialId && (
                    <p className="text-sm text-gray-500 mt-1">Selecione uma filial primeiro</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Aprovação */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Controle de Aprovação</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Aprovado Por
                </label>
                <input
                  type="text"
                  value={formData.aprovadoPor}
                  onChange={(e) => setFormData(prev => ({ ...prev, aprovadoPor: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nome do aprovador"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data de Aprovação
                </label>
                <input
                  type="date"
                  value={formData.dataAprovacao}
                  onChange={(e) => setFormData(prev => ({ ...prev, dataAprovacao: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Observações */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Observações
            </label>
            <textarea
              value={formData.observacoes}
              onChange={(e) => setFormData(prev => ({ ...prev, observacoes: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Observações adicionais sobre a despesa..."
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
              className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-200 flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>{isEdit ? 'Salvar Alterações' : 'Criar Conta'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}