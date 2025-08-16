import React, { useState } from 'react';
import { X, Save, Plus, Trash2, Mail, MessageSquare, Phone, Settings, Copy, Wand2 } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { RegraCobranca, CanalCobranca, TemplateCobranca } from '../../types/cobranca';

interface ReguaCobrancaModalProps {
  regra?: RegraCobranca | null;
  onClose: () => void;
}

export function ReguaCobrancaModal({ regra, onClose }: ReguaCobrancaModalProps) {
  const { 
    adicionarRegraCobranca, 
    atualizarRegraCobranca, 
    carteirasCobranca, 
    empresas, 
    filiais, 
    empresaSelecionada 
  } = useApp();
  const isEdit = !!regra;
  
  const [activeTab, setActiveTab] = useState<'basico' | 'canais' | 'condicoes'>('basico');
  
  const [formData, setFormData] = useState({
    empresaId: regra?.empresaId || empresaSelecionada?.id || '',
    filialId: regra?.filialId || '',
    carteiraCobrancaId: regra?.carteiraCobrancaId || '',
    nome: regra?.nome || '',
    descricao: regra?.descricao || '',
    ativa: regra?.ativa ?? true,
    configuracoes: {
      diasAntesVencimento: regra?.configuracoes?.diasAntesVencimento || [7, 3, 1],
      diasAposVencimento: regra?.configuracoes?.diasAposVencimento || [1, 3, 7, 15, 30],
      horarioEnvio: regra?.configuracoes?.horarioEnvio || '09:00',
      diasSemana: regra?.configuracoes?.diasSemana || [1, 2, 3, 4, 5], // Segunda a sexta
      pausarFinaisSemana: regra?.configuracoes?.pausarFinaisSemana ?? true,
      pausarFeriados: regra?.configuracoes?.pausarFeriados ?? true,
    },
    condicoes: {
      valorMinimo: regra?.condicoes?.valorMinimo || 0,
      valorMaximo: regra?.condicoes?.valorMaximo || 0,
      clientesEspecificos: regra?.condicoes?.clientesEspecificos || [],
      segmentosCliente: regra?.condicoes?.segmentosCliente || [],
      statusContrato: regra?.condicoes?.statusContrato || ['Ativo'],
      excluirClientes: regra?.condicoes?.excluirClientes || [],
    }
  });

  const [canais, setCanais] = useState<CanalCobranca[]>(
    regra?.canais || [
      {
        id: 'email',
        tipo: 'email',
        ativo: true,
        configuracao: {
          remetente: 'financeiro@empresa.com',
          nomeRemetente: 'Equipe Financeira',
        },
        templates: []
      },
      {
        id: 'sms',
        tipo: 'sms',
        ativo: false,
        configuracao: {},
        templates: []
      },
      {
        id: 'whatsapp',
        tipo: 'whatsapp_oficial',
        ativo: false,
        configuracao: {},
        templates: []
      }
    ]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.empresaId || !formData.filialId) {
      alert('Selecione a empresa e filial para a régua');
      return;
    }

    // Validar se pelo menos um canal está ativo
    const canaisAtivos = canais.filter(c => c.ativo);
    if (canaisAtivos.length === 0) {
      alert('Ative pelo menos um canal de comunicação');
      return;
    }

    // Validar se canais ativos têm templates
    for (const canal of canaisAtivos) {
      if (canal.templates.length === 0) {
        alert(`Configure pelo menos um template para o canal ${canal.tipo}`);
        return;
      }
    }
    
    if (isEdit && regra) {
      atualizarRegraCobranca(regra.id, {
        ...formData,
        canais,
        atualizadoEm: new Date().toISOString().split('T')[0],
      });
    } else {
      const novaRegra: RegraCobranca = {
        id: Date.now().toString(),
        ...formData,
        canais,
        criadoEm: new Date().toISOString().split('T')[0],
        atualizadoEm: new Date().toISOString().split('T')[0],
      };
      adicionarRegraCobranca(novaRegra);
    }
    
    onClose();
  };

  const filiaisDisponiveis = filiais.filter(f => 
    f.empresaId === formData.empresaId && f.ativa
  );

  const carteirasFilial = carteirasCobranca.filter(c => 
    c.empresaId === formData.empresaId && c.filialId === formData.filialId && c.ativa
  );

  const gerarTemplatesPadrao = (canalId: string) => {
    const canal = canais.find(c => c.id === canalId);
    if (!canal) return;

    const templatesPadrao: TemplateCobranca[] = [];

    // Templates para dias antes do vencimento
    formData.configuracoes.diasAntesVencimento.forEach(dias => {
      if (canal.tipo === 'email') {
        templatesPadrao.push({
          id: `${canalId}-pre-${dias}`,
          nome: `Lembrete ${dias} dias antes`,
          canal: canal.tipo,
          tipo: 'pre_lembrete',
          diasTrigger: -dias,
          assunto: `Lembrete: Fatura vence em ${dias} dias`,
          conteudo: `Olá {{nomeCliente}},\n\nSua fatura {{numeroFatura}} no valor de {{valorFatura}} vence em ${dias} dias ({{dataVencimento}}).\n\nPara evitar juros e multa, realize o pagamento até a data de vencimento.\n\nAtenciosamente,\nEquipe Financeira`,
          variaveis: ['nomeCliente', 'numeroFatura', 'valorFatura', 'dataVencimento'],
          ativo: true
        });
      } else if (canal.tipo === 'sms') {
        templatesPadrao.push({
          id: `${canalId}-pre-${dias}`,
          nome: `SMS ${dias} dias antes`,
          canal: canal.tipo,
          tipo: 'pre_lembrete',
          diasTrigger: -dias,
          conteudo: `{{nomeCliente}}, sua fatura {{numeroFatura}} (R$ {{valorFatura}}) vence em ${dias} dias. Pague até {{dataVencimento}} para evitar juros.`,
          variaveis: ['nomeCliente', 'numeroFatura', 'valorFatura', 'dataVencimento'],
          ativo: true
        });
      } else if (canal.tipo === 'whatsapp_oficial') {
        templatesPadrao.push({
          id: `${canalId}-pre-${dias}`,
          nome: `WhatsApp ${dias} dias antes`,
          canal: canal.tipo,
          tipo: 'pre_lembrete',
          diasTrigger: -dias,
          conteudo: `🔔 *Lembrete de Vencimento*\n\nOlá {{nomeCliente}}! 👋\n\nSua fatura *{{numeroFatura}}* no valor de *R$ {{valorFatura}}* vence em *${dias} dias* ({{dataVencimento}}).\n\n💡 Pague até a data de vencimento para evitar juros e multa.\n\n✅ Dúvidas? Responda esta mensagem!`,
          variaveis: ['nomeCliente', 'numeroFatura', 'valorFatura', 'dataVencimento'],
          ativo: true
        });
      }
    });

    // Templates para dias após vencimento
    formData.configuracoes.diasAposVencimento.forEach(dias => {
      if (canal.tipo === 'email') {
        templatesPadrao.push({
          id: `${canalId}-pos-${dias}`,
          nome: `Cobrança ${dias} dias após`,
          canal: canal.tipo,
          tipo: 'pos_vencimento',
          diasTrigger: dias,
          assunto: `URGENTE: Fatura vencida há ${dias} dias`,
          conteudo: `{{nomeCliente}},\n\nSua fatura {{numeroFatura}} no valor de {{valorFatura}} está vencida há ${dias} dias.\n\nValor original: R$ {{valorFatura}}\nJuros e multa: R$ {{jurosMulta}}\nTotal a pagar: R$ {{valorTotal}}\n\nRegularize sua situação o quanto antes para evitar a suspensão dos serviços.\n\nEquipe Financeira`,
          variaveis: ['nomeCliente', 'numeroFatura', 'valorFatura', 'jurosMulta', 'valorTotal'],
          ativo: true
        });
      } else if (canal.tipo === 'sms') {
        templatesPadrao.push({
          id: `${canalId}-pos-${dias}`,
          nome: `SMS ${dias} dias após`,
          canal: canal.tipo,
          tipo: 'pos_vencimento',
          diasTrigger: dias,
          conteudo: `URGENTE {{nomeCliente}}: Fatura {{numeroFatura}} vencida há ${dias} dias. Total: R$ {{valorTotal}} (com juros). Regularize hoje!`,
          variaveis: ['nomeCliente', 'numeroFatura', 'valorTotal'],
          ativo: true
        });
      } else if (canal.tipo === 'whatsapp_oficial') {
        templatesPadrao.push({
          id: `${canalId}-pos-${dias}`,
          nome: `WhatsApp ${dias} dias após`,
          canal: canal.tipo,
          tipo: 'pos_vencimento',
          diasTrigger: dias,
          conteudo: `🚨 *FATURA VENCIDA*\n\n{{nomeCliente}}, sua fatura está vencida há *${dias} dias*!\n\n📄 Fatura: *{{numeroFatura}}*\n💰 Valor original: *R$ {{valorFatura}}*\n⚠️ Total com juros: *R$ {{valorTotal}}*\n\n🔴 *Regularize hoje para evitar suspensão!*\n\n📞 Dúvidas? Entre em contato conosco.`,
          variaveis: ['nomeCliente', 'numeroFatura', 'valorFatura', 'valorTotal'],
          ativo: true
        });
      }
    });

    // Atualizar canal com templates
    setCanais(prev => prev.map(c => 
      c.id === canalId ? { ...c, templates: templatesPadrao } : c
    ));
  };

  const adicionarTemplate = (canalId: string) => {
    const novoTemplate: TemplateCobranca = {
      id: Date.now().toString(),
      nome: '',
      canal: canais.find(c => c.id === canalId)?.tipo || 'email',
      tipo: 'pre_lembrete',
      diasTrigger: -1,
      assunto: '',
      conteudo: '',
      variaveis: ['nomeCliente', 'numeroFatura', 'valorFatura', 'dataVencimento'],
      ativo: true
    };

    setCanais(prev => prev.map(c => 
      c.id === canalId 
        ? { ...c, templates: [...c.templates, novoTemplate] }
        : c
    ));
  };

  const removerTemplate = (canalId: string, templateId: string) => {
    setCanais(prev => prev.map(c => 
      c.id === canalId 
        ? { ...c, templates: c.templates.filter(t => t.id !== templateId) }
        : c
    ));
  };

  const atualizarTemplate = (canalId: string, templateId: string, dados: Partial<TemplateCobranca>) => {
    setCanais(prev => prev.map(c => 
      c.id === canalId 
        ? { 
            ...c, 
            templates: c.templates.map(t => 
              t.id === templateId ? { ...t, ...dados } : t
            )
          }
        : c
    ));
  };

  const atualizarCanal = (canalId: string, dados: Partial<CanalCobranca>) => {
    setCanais(prev => prev.map(c => 
      c.id === canalId ? { ...c, ...dados } : c
    ));
  };

  const getCanalIcon = (tipo: string) => {
    switch (tipo) {
      case 'email': return <Mail className="w-5 h-5 text-blue-600" />;
      case 'sms': return <MessageSquare className="w-5 h-5 text-green-600" />;
      case 'whatsapp_oficial': return <Phone className="w-5 h-5 text-emerald-600" />;
      default: return <Settings className="w-5 h-5 text-gray-600" />;
    }
  };

  const renderBasico = () => (
    <div className="space-y-6">
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
              onChange={(e) => setFormData(prev => ({ ...prev, empresaId: e.target.value, filialId: '', carteiraCobrancaId: '' }))}
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
              onChange={(e) => setFormData(prev => ({ ...prev, filialId: e.target.value, carteiraCobrancaId: '' }))}
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
            Nome da Régua *
          </label>
          <input
            type="text"
            required
            value={formData.nome}
            onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ex: Régua Padrão - Clientes Premium"
          />
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
          placeholder="Descrição da régua de cobrança..."
        />
      </div>

      {/* Configurações de Execução */}
      <div>
        <h4 className="font-medium text-gray-900 mb-4">Configurações de Execução</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dias ANTES do Vencimento
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.configuracoes.diasAntesVencimento.map((dia, index) => (
                <div key={index} className="flex items-center space-x-1">
                  <input
                    type="number"
                    min="1"
                    max="90"
                    value={dia}
                    onChange={(e) => {
                      const novosDias = [...formData.configuracoes.diasAntesVencimento];
                      novosDias[index] = Number(e.target.value);
                      setFormData(prev => ({
                        ...prev,
                        configuracoes: { ...prev.configuracoes, diasAntesVencimento: novosDias }
                      }));
                    }}
                    className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const novosDias = formData.configuracoes.diasAntesVencimento.filter((_, i) => i !== index);
                      setFormData(prev => ({
                        ...prev,
                        configuracoes: { ...prev.configuracoes, diasAntesVencimento: novosDias }
                      }));
                    }}
                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => {
                  setFormData(prev => ({
                    ...prev,
                    configuracoes: { 
                      ...prev.configuracoes, 
                      diasAntesVencimento: [...prev.configuracoes.diasAntesVencimento, 1] 
                    }
                  }));
                }}
                className="px-2 py-1 bg-blue-100 text-blue-600 rounded text-sm hover:bg-blue-200"
              >
                + Dia
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dias APÓS o Vencimento
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.configuracoes.diasAposVencimento.map((dia, index) => (
                <div key={index} className="flex items-center space-x-1">
                  <input
                    type="number"
                    min="1"
                    max="90"
                    value={dia}
                    onChange={(e) => {
                      const novosDias = [...formData.configuracoes.diasAposVencimento];
                      novosDias[index] = Number(e.target.value);
                      setFormData(prev => ({
                        ...prev,
                        configuracoes: { ...prev.configuracoes, diasAposVencimento: novosDias }
                      }));
                    }}
                    className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const novosDias = formData.configuracoes.diasAposVencimento.filter((_, i) => i !== index);
                      setFormData(prev => ({
                        ...prev,
                        configuracoes: { ...prev.configuracoes, diasAposVencimento: novosDias }
                      }));
                    }}
                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => {
                  setFormData(prev => ({
                    ...prev,
                    configuracoes: { 
                      ...prev.configuracoes, 
                      diasAposVencimento: [...prev.configuracoes.diasAposVencimento, 1] 
                    }
                  }));
                }}
                className="px-2 py-1 bg-red-100 text-red-600 rounded text-sm hover:bg-red-200"
              >
                + Dia
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Horário de Envio
            </label>
            <input
              type="time"
              value={formData.configuracoes.horarioEnvio}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                configuracoes: { ...prev.configuracoes, horarioEnvio: e.target.value }
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="pausarFinaisSemana"
                checked={formData.configuracoes.pausarFinaisSemana}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  configuracoes: { ...prev.configuracoes, pausarFinaisSemana: e.target.checked }
                }))}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="pausarFinaisSemana" className="ml-2 text-sm text-gray-900">
                Pausar nos finais de semana
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="pausarFeriados"
                checked={formData.configuracoes.pausarFeriados}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  configuracoes: { ...prev.configuracoes, pausarFeriados: e.target.checked }
                }))}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="pausarFeriados" className="ml-2 text-sm text-gray-900">
                Pausar em feriados
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCanais = () => (
    <div className="space-y-6">
      {canais.map((canal) => (
        <div key={canal.id} className="border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              {getCanalIcon(canal.tipo)}
              <div>
                <h4 className="font-semibold text-gray-900 capitalize">
                  {canal.tipo.replace('_', ' ')}
                </h4>
                <p className="text-sm text-gray-600">
                  {canal.tipo === 'email' ? 'Envio por e-mail' :
                   canal.tipo === 'sms' ? 'Envio por SMS' :
                   canal.tipo === 'whatsapp_oficial' ? 'WhatsApp Business API' :
                   'WhatsApp Web'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => gerarTemplatesPadrao(canal.id)}
                className="bg-green-600 text-white px-3 py-1 rounded-lg flex items-center space-x-1 hover:bg-green-700 transition-colors text-sm"
              >
                <Wand2 className="w-3 h-3" />
                <span>Gerar Templates</span>
              </button>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id={`canal-${canal.id}`}
                  checked={canal.ativo}
                  onChange={(e) => atualizarCanal(canal.id, { ativo: e.target.checked })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor={`canal-${canal.id}`} className="ml-2 text-sm text-gray-900">
                  Ativo
                </label>
              </div>
            </div>
          </div>

          {canal.ativo && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h5 className="font-medium text-gray-700">Templates de Mensagem</h5>
                <button
                  type="button"
                  onClick={() => adicionarTemplate(canal.id)}
                  className="bg-blue-600 text-white px-3 py-1 rounded-lg flex items-center space-x-1 hover:bg-blue-700 transition-colors text-sm"
                >
                  <Plus className="w-3 h-3" />
                  <span>Template</span>
                </button>
              </div>
              
              <div className="space-y-3">
                {canal.templates.map((template) => (
                  <div key={template.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nome do Template
                        </label>
                        <input
                          type="text"
                          value={template.nome}
                          onChange={(e) => atualizarTemplate(canal.id, template.id, { nome: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          placeholder="Nome do template"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Tipo
                        </label>
                        <select
                          value={template.tipo}
                          onChange={(e) => atualizarTemplate(canal.id, template.id, { tipo: e.target.value as any })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        >
                          <option value="pre_lembrete">Pré-lembrete</option>
                          <option value="vencimento">Vencimento</option>
                          <option value="pos_vencimento">Pós-vencimento</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Dias Trigger
                        </label>
                        <input
                          type="number"
                          value={template.diasTrigger}
                          onChange={(e) => atualizarTemplate(canal.id, template.id, { diasTrigger: Number(e.target.value) })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          placeholder="-7 ou +3"
                        />
                      </div>
                      
                      <div className="flex items-end space-x-2">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id={`template-${template.id}`}
                            checked={template.ativo}
                            onChange={(e) => atualizarTemplate(canal.id, template.id, { ativo: e.target.checked })}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label htmlFor={`template-${template.id}`} className="ml-2 text-sm text-gray-900">
                            Ativo
                          </label>
                        </div>
                        
                        <button
                          type="button"
                          onClick={() => removerTemplate(canal.id, template.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    {canal.tipo === 'email' && (
                      <div className="mb-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Assunto do E-mail
                        </label>
                        <input
                          type="text"
                          value={template.assunto || ''}
                          onChange={(e) => atualizarTemplate(canal.id, template.id, { assunto: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          placeholder="Assunto do e-mail"
                        />
                      </div>
                    )}
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Conteúdo da Mensagem
                      </label>
                      <textarea
                        value={template.conteudo}
                        onChange={(e) => atualizarTemplate(canal.id, template.id, { conteudo: e.target.value })}
                        rows={canal.tipo === 'sms' ? 3 : 5}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        placeholder={
                          canal.tipo === 'sms' 
                            ? 'Mensagem SMS (máx. 160 caracteres)'
                            : 'Conteúdo da mensagem'
                        }
                        maxLength={canal.tipo === 'sms' ? 160 : undefined}
                      />
                      {canal.tipo === 'sms' && (
                        <p className="text-xs text-gray-500 mt-1">
                          {template.conteudo.length}/160 caracteres
                        </p>
                      )}
                    </div>
                    
                    <div className="mt-3">
                      <p className="text-sm font-medium text-gray-700 mb-2">Variáveis disponíveis:</p>
                      <div className="flex flex-wrap gap-2">
                        {['{{nomeCliente}}', '{{numeroFatura}}', '{{valorFatura}}', '{{dataVencimento}}', '{{jurosMulta}}', '{{valorTotal}}'].map((variavel) => (
                          <button
                            key={variavel}
                            type="button"
                            onClick={() => {
                              const novoConteudo = template.conteudo + ' ' + variavel;
                              atualizarTemplate(canal.id, template.id, { conteudo: novoConteudo });
                            }}
                            className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs hover:bg-blue-200 transition-colors"
                          >
                            {variavel}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );

  const renderCondicoes = () => (
    <div className="space-y-6">
      <div>
        <h4 className="font-medium text-gray-900 mb-4">Condições de Aplicação</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Valor Mínimo (R$)
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.condicoes.valorMinimo}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                condicoes: { ...prev.condicoes, valorMinimo: Number(e.target.value) }
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0 = sem limite"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Valor Máximo (R$)
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.condicoes.valorMaximo}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                condicoes: { ...prev.condicoes, valorMaximo: Number(e.target.value) }
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0 = sem limite"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Status de Contrato para Cobrança
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {['Ativo', 'Suspenso', 'Vencido', 'Cancelado'].map((status) => (
            <div key={status} className="flex items-center">
              <input
                type="checkbox"
                id={`status-${status}`}
                checked={formData.condicoes.statusContrato.includes(status)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setFormData(prev => ({
                      ...prev,
                      condicoes: { 
                        ...prev.condicoes, 
                        statusContrato: [...prev.condicoes.statusContrato, status] 
                      }
                    }));
                  } else {
                    setFormData(prev => ({
                      ...prev,
                      condicoes: { 
                        ...prev.condicoes, 
                        statusContrato: prev.condicoes.statusContrato.filter(s => s !== status) 
                      }
                    }));
                  }
                }}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor={`status-${status}`} className="ml-2 text-sm text-gray-900">
                {status}
              </label>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Selecione quais status de contrato devem ser incluídos na cobrança automática
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Segmentos de Cliente
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {['Tecnologia', 'Software', 'Startup', 'Consultoria', 'E-commerce', 'Saúde', 'Educação', 'Financeiro'].map((segmento) => (
            <div key={segmento} className="flex items-center">
              <input
                type="checkbox"
                id={`segmento-${segmento}`}
                checked={formData.condicoes.segmentosCliente.includes(segmento)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setFormData(prev => ({
                      ...prev,
                      condicoes: { 
                        ...prev.condicoes, 
                        segmentosCliente: [...prev.condicoes.segmentosCliente, segmento] 
                      }
                    }));
                  } else {
                    setFormData(prev => ({
                      ...prev,
                      condicoes: { 
                        ...prev.condicoes, 
                        segmentosCliente: prev.condicoes.segmentosCliente.filter(s => s !== segmento) 
                      }
                    }));
                  }
                }}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor={`segmento-${segmento}`} className="ml-2 text-sm text-gray-900">
                {segmento}
              </label>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Deixe vazio para incluir todos os segmentos
        </p>
      </div>
    </div>
  );

  const tabs = [
    { id: 'basico', label: 'Configurações Básicas', icon: Settings },
    { id: 'canais', label: 'Canais e Templates', icon: Mail },
    { id: 'condicoes', label: 'Condições de Aplicação', icon: Shield },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {isEdit ? 'Editar Régua de Cobrança' : 'Nova Régua de Cobrança'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navegação por Abas */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          {/* Conteúdo das Abas */}
          {activeTab === 'basico' && renderBasico()}
          {activeTab === 'canais' && renderCanais()}
          {activeTab === 'condicoes' && renderCondicoes()}
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="ativa"
              checked={formData.ativa}
              onChange={(e) => setFormData(prev => ({ ...prev, ativa: e.target.checked }))}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="ativa" className="ml-2 block text-sm text-gray-900">
              Régua Ativa
            </label>
          </div>
          
          <div className="flex justify-end space-x-3 pt-6 mt-6 border-t border-gray-200">
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
              <span>{isEdit ? 'Salvar Régua' : 'Criar Régua'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}