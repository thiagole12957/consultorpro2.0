import React, { useState } from 'react';
import { X, Save } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { Contrato } from '../../types';

interface ContratoModalProps {
  contrato?: Contrato | null;
  onClose: () => void;
}

export function ContratoModal({ contrato, onClose }: ContratoModalProps) {
  const { 
    adicionarContrato, 
    atualizarContrato, 
    clientes, 
    planosVenda, 
    modelosContrato,
    carteirasCobranca,
    empresaSelecionada, 
    filiais, 
    empresas 
  } = useApp();
  const isEdit = !!contrato;
  
  const [formData, setFormData] = useState({
    empresaId: contrato?.empresaId || empresaSelecionada?.id || '',
    filialId: contrato?.filialId || '',
    clienteId: contrato?.clienteId || '',
    nome: contrato?.nome || '',
    planoVendaId: contrato?.planoVendaId || '',
    modeloContratoId: contrato?.modeloContratoId || '',
    carteiraCobrancaId: contrato?.carteiraCobrancaId || '',
    diaVencimento: contrato?.diaVencimento || 10,
    valor: contrato?.valor || 0,
    dataInicio: contrato?.dataInicio || '',
    dataFim: contrato?.dataFim || '',
    status: contrato?.status || 'Em Negociação',
    dataAtivacao: contrato?.dataAtivacao || '',
    tipo: contrato?.tipo || 'Consultoria',
    renovacaoAutomatica: contrato?.renovacaoAutomatica || false,
    observacoes: contrato?.observacoes || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.empresaId || !formData.filialId) {
      alert('Selecione a empresa e filial para o contrato');
      return;
    }
    
    if (isEdit && contrato) {
      atualizarContrato(contrato.id, formData);
    } else {
      const novoContrato: Contrato = {
        id: Date.now().toString(),
        ...formData,
      };
      adicionarContrato(novoContrato);
    }
    
    onClose();
  };

  const filiaisDisponiveis = filiais.filter(f => 
    f.empresaId === formData.empresaId && f.ativa && f.configuracoes.permiteVendas
  );

  const clientesFilial = clientes.filter(c => 
    c.empresaId === formData.empresaId && c.filialId === formData.filialId
  );

  const carteirasFilial = carteirasCobranca.filter(c => 
    c.empresaId === formData.empresaId && c.filialId === formData.filialId && c.ativa
  );

  const modelosDisponiveis = modelosContrato.filter(m => 
    m.empresaId === formData.empresaId && m.ativo
  );

  const planoSelecionado = planosVenda.find(p => p.id === formData.planoVendaId);

  // Auto-preencher dados do plano de venda
  React.useEffect(() => {
    if (planoSelecionado && !isEdit) {
      setFormData(prev => ({
        ...prev,
        nome: planoSelecionado.nome,
        valor: planoSelecionado.valorTotal,
      }));
    }
  }, [planoSelecionado, isEdit]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {isEdit ? 'Editar Contrato' : 'Novo Contrato'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
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
                  onChange={(e) => setFormData(prev => ({ ...prev, empresaId: e.target.value, filialId: '', clienteId: '' }))}
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
                  onChange={(e) => setFormData(prev => ({ ...prev, filialId: e.target.value, clienteId: '' }))}
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
            {!formData.filialId && (
              <p className="text-sm text-gray-500 mt-1">Selecione uma filial primeiro</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome do Contrato *
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
              Plano de Venda *
            </label>
            <select
              required
              value={formData.planoVendaId}
              onChange={(e) => setFormData(prev => ({ ...prev, planoVendaId: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={!formData.clienteId}
            >
              <option value="">Selecione um plano de venda</option>
              {planosVenda.map(plano => (
                <option key={plano.id} value={plano.id}>
                  {plano.nome} - R$ {plano.valorTotal.toLocaleString('pt-BR')}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Modelo de Contrato *
            </label>
            <select
              required
              value={formData.modeloContratoId}
              onChange={(e) => setFormData(prev => ({ ...prev, modeloContratoId: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Selecione um modelo</option>
              {modelosDisponiveis.map(modelo => (
                <option key={modelo.id} value={modelo.id}>
                  {modelo.nome} ({modelo.categoria})
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Carteira de Cobrança *
            </label>
            <select
              required
              value={formData.carteiraCobrancaId}
              onChange={(e) => setFormData(prev => ({ ...prev, carteiraCobrancaId: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={!formData.filialId}
            >
              <option value="">Selecione uma carteira</option>
              {carteirasFilial.map(carteira => (
                <option key={carteira.id} value={carteira.id}>
                  {carteira.nome} ({carteira.tipo === 'bancaria' ? 'Bancária' : 'Interna'})
                </option>
              ))}
            </select>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo
              </label>
              <select
                value={formData.tipo}
                onChange={(e) => setFormData(prev => ({ ...prev, tipo: e.target.value as Contrato['tipo'] }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Consultoria">Consultoria</option>
                <option value="Software">Software</option>
                <option value="Suporte">Suporte</option>
                <option value="Misto">Misto</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dia do Vencimento *
              </label>
              <select
                required
                value={formData.diaVencimento}
                onChange={(e) => setFormData(prev => ({ ...prev, diaVencimento: Number(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {Array.from({ length: 28 }, (_, i) => i + 1).map(dia => (
                  <option key={dia} value={dia}>Dia {dia}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as Contrato['status'] }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Em Negociação">Em Negociação</option>
                <option value="Ativo">Ativo</option>
                <option value="Vencido">Vencido</option>
                <option value="Cancelado">Cancelado</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Valor Total
            </label>
            <input
              type="number"
              min="0"
              value={formData.valor}
              onChange={(e) => setFormData(prev => ({ ...prev, valor: Number(e.target.value) }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data de Início
              </label>
              <input
                type="date"
                value={formData.dataInicio}
                onChange={(e) => setFormData(prev => ({ ...prev, dataInicio: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data de Fim
              </label>
              <input
                type="date"
                value={formData.dataFim}
                onChange={(e) => setFormData(prev => ({ ...prev, dataFim: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data de Ativação
            </label>
            <div className="flex space-x-2">
              <input
                type="date"
                value={formData.dataAtivacao}
                onChange={(e) => setFormData(prev => ({ ...prev, dataAtivacao: e.target.value }))}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, dataAtivacao: new Date().toISOString().split('T')[0] }))}
                className="px-3 py-2 bg-blue-100 border border-l-0 border-gray-300 rounded-r-lg hover:bg-blue-200 transition-colors text-sm"
              >
                Hoje
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Data em que o contrato entra em vigor (deixe vazio para ativação manual)
            </p>
          </div>
          
          {/* Resumo do Plano */}
          {planoSelecionado && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Resumo do Plano de Venda</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-blue-700">Valor Total:</span>
                  <p className="font-semibold text-blue-900">R$ {planoSelecionado.valorTotal.toLocaleString('pt-BR')}</p>
                </div>
                <div>
                  <span className="text-blue-700">Itens:</span>
                  <p className="font-semibold text-blue-900">{planoSelecionado.itens.length} produtos/serviços</p>
                </div>
                <div>
                  <span className="text-blue-700">Margem:</span>
                  <p className="font-semibold text-blue-900">{planoSelecionado.margemLucro.toFixed(1)}%</p>
                </div>
              </div>
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Observações
            </label>
            <textarea
              value={formData.observacoes}
              onChange={(e) => setFormData(prev => ({ ...prev, observacoes: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Observações específicas do contrato..."
            />
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="renovacaoAutomatica"
              checked={formData.renovacaoAutomatica}
              onChange={(e) => setFormData(prev => ({ ...prev, renovacaoAutomatica: e.target.checked }))}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="renovacaoAutomatica" className="ml-2 block text-sm text-gray-900">
              Renovação Automática
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
              <span>{isEdit ? 'Salvar' : 'Criar Contrato'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}