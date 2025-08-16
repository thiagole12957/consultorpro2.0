import React, { useState, useEffect } from 'react';
import { X, Save, Building2, CreditCard, Settings, Webhook } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { CarteiraCobranca } from '../../types';

interface CarteiraCobrancaModalProps {
  carteira?: CarteiraCobranca;
  onClose: () => void;
}

export function CarteiraCobrancaModal({ carteira, onClose }: CarteiraCobrancaModalProps) {
  const { empresas, filiais, contasBancarias, contasContabeis, adicionarCarteiraCobranca, atualizarCarteiraCobranca, empresaSelecionada } = useApp();
  const isEdit = !!carteira;
  
  const [formData, setFormData] = useState({
    empresaId: carteira?.empresaId || empresaSelecionada?.id || '',
    filialId: carteira?.filialId || '',
    nome: carteira?.nome || '',
    tipo: carteira?.tipo || 'interna',
    contaCaixaId: carteira?.contaCaixaId || '',
    contaBancariaId: carteira?.contaBancariaId || '',
    integracaoBanco: carteira?.integracaoBanco || {
      tipo: 'manual',
      clientId: '',
      clientSecret: '',
      sandbox: true,
      webhookUrl: '',
    },
    configuracoes: carteira?.configuracoes || {
      gerarBoleto: true,
      gerarPix: true,
      enviarEmail: true,
      enviarWhatsapp: false,
      jurosAtraso: 1,
      multaAtraso: 2,
    },
    ativa: carteira?.ativa ?? true,
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.empresaId || !formData.filialId) {
      alert('Selecione a empresa e filial para a carteira');
      return;
    }
    
    if (isEdit && carteira) {
      atualizarCarteiraCobranca(carteira.id, {
        ...formData,
        atualizadoEm: new Date().toISOString().split('T')[0],
      });
    } else {
      const novaCarteira: CarteiraCobranca = {
        id: Date.now().toString(),
        ...formData,
        criadoEm: new Date().toISOString().split('T')[0],
        atualizadoEm: new Date().toISOString().split('T')[0],
      };
      adicionarCarteiraCobranca(novaCarteira);
    }
    
    onClose();
  };

  const filiaisDisponiveis = filiais.filter(f => 
    f.empresaId === formData.empresaId && f.ativa
  );

  const contasBancariasFilial = contasBancarias.filter(cb => 
    cb.empresaId === formData.empresaId && cb.filialId === formData.filialId && cb.ativa
  );

  // Filtrar contas baseado no tipo de carteira
  const contasFiltradas = contasBancariasFilial.filter(cb => {
    if (formData.tipo === 'interna') {
      return cb.tipo === 'Caixa';
    } else {
      return cb.tipo === 'Corrente' || cb.tipo === 'Poupanca';
    }
  });


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {isEdit ? 'Editar Carteira de Cobrança' : 'Nova Carteira de Cobrança'}
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
                  onChange={(e) => setFormData(prev => ({ ...prev, empresaId: e.target.value, filialId: '' }))}
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
                  onChange={(e) => setFormData(prev => ({ ...prev, filialId: e.target.value }))}
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome da Carteira *
              </label>
              <input
                type="text"
                required
                value={formData.nome}
                onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: Carteira Principal"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Carteira *
              </label>
              <select
                required
                value={formData.tipo}
                onChange={(e) => setFormData(prev => ({ ...prev, tipo: e.target.value as 'interna' | 'bancaria' }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="interna">Interna (Caixa)</option>
                <option value="bancaria">Bancária</option>
              </select>
            </div>
          </div>

          {/* Conta Vinculada */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {formData.tipo === 'interna' ? 'Conta de Caixa *' : 'Conta Bancária *'}
            </label>
            <select
              required
              value={formData.contaBancariaId}
              onChange={(e) => setFormData(prev => ({ ...prev, contaBancariaId: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={!formData.filialId}
            >
              <option value="">
                {formData.tipo === 'interna' ? 'Selecione um caixa' : 'Selecione uma conta bancária'}
              </option>
              {contasFiltradas.map(conta => (
                <option key={conta.id} value={conta.id}>
                  {conta.nome} - {conta.banco} ({conta.tipo})
                </option>
              ))}
            </select>
            {!formData.filialId && (
              <p className="text-sm text-gray-500 mt-1">Selecione uma filial primeiro</p>
            )}
            {formData.filialId && contasFiltradas.length === 0 && (
              <p className="text-sm text-orange-600 mt-1">
                {formData.tipo === 'interna' 
                  ? 'Nenhum caixa cadastrado. Cadastre um caixa em Contas Bancárias primeiro.' 
                  : 'Nenhuma conta bancária cadastrada. Cadastre uma conta primeiro.'}
              </p>
            )}
          </div>

          {/* Integração Bancária */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Integração Bancária</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Integração
              </label>
              <select
                value={formData.integracaoBanco.tipo}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  integracaoBanco: { ...prev.integracaoBanco, tipo: e.target.value as any }
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="manual">Manual</option>
                <option value="efi_gerencianet">EFI Gerencianet</option>
                <option value="banco_assas">Banco Asaas</option>
              </select>
            </div>

            {formData.integracaoBanco.tipo !== 'manual' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Client ID
                  </label>
                  <input
                    type="text"
                    value={formData.integracaoBanco.clientId}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      integracaoBanco: { ...prev.integracaoBanco, clientId: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Client Secret
                  </label>
                  <input
                    type="password"
                    value={formData.integracaoBanco.clientSecret}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      integracaoBanco: { ...prev.integracaoBanco, clientSecret: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Webhook URL
                  </label>
                  <input
                    type="url"
                    value={formData.integracaoBanco.webhookUrl}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      integracaoBanco: { ...prev.integracaoBanco, webhookUrl: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://seusite.com/webhook"
                  />
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="sandbox"
                    checked={formData.integracaoBanco.sandbox}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      integracaoBanco: { ...prev.integracaoBanco, sandbox: e.target.checked }
                    }))}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="sandbox" className="ml-2 block text-sm text-gray-900">
                    Modo Sandbox (Testes)
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Configurações de Cobrança */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Configurações de Cobrança</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Gerar Boleto</span>
                <input
                  type="checkbox"
                  checked={formData.configuracoes.gerarBoleto}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    configuracoes: { ...prev.configuracoes, gerarBoleto: e.target.checked }
                  }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Gerar PIX</span>
                <input
                  type="checkbox"
                  checked={formData.configuracoes.gerarPix}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    configuracoes: { ...prev.configuracoes, gerarPix: e.target.checked }
                  }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Enviar E-mail</span>
                <input
                  type="checkbox"
                  checked={formData.configuracoes.enviarEmail}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    configuracoes: { ...prev.configuracoes, enviarEmail: e.target.checked }
                  }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Enviar WhatsApp</span>
                <input
                  type="checkbox"
                  checked={formData.configuracoes.enviarWhatsapp}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    configuracoes: { ...prev.configuracoes, enviarWhatsapp: e.target.checked }
                  }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Juros de Atraso (% ao mês)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={formData.configuracoes.jurosAtraso}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    configuracoes: { ...prev.configuracoes, jurosAtraso: Number(e.target.value) }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Multa de Atraso (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={formData.configuracoes.multaAtraso}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    configuracoes: { ...prev.configuracoes, multaAtraso: Number(e.target.value) }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
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
              Carteira Ativa
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
              <span>{isEdit ? 'Salvar Carteira' : 'Criar Carteira'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}