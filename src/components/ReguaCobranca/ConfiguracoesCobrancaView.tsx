import React, { useState } from 'react';
import { Save, Mail, MessageSquare, Phone, Settings, Key, Globe, Shield } from 'lucide-react';

export function ConfiguracoesCobrancaView() {
  const [configuracoes, setConfiguracoes] = useState({
    email: {
      servidor: 'smtp.gmail.com',
      porta: 587,
      usuario: '',
      senha: '',
      ssl: true,
      assinatura: 'Equipe Financeira\nConsultorPro',
    },
    sms: {
      provedor: 'twilio',
      apiKey: '',
      apiSecret: '',
      numeroRemetente: '',
    },
    whatsappOficial: {
      numeroTelefone: '',
      tokenApi: '',
      webhookUrl: '',
      verificado: false,
    },
    whatsappWeb: {
      sessaoAtiva: false,
      ultimaConexao: '',
      qrCodeUrl: '',
    },
    geral: {
      tentativasMaximas: 3,
      intervaloTentativas: 60, // minutos
      pausarAposErros: 5,
      logDetalhado: true,
      notificarErros: true,
      emailNotificacao: '',
    }
  });

  const handleSave = () => {
    // Lógica para salvar configurações
    alert('Configurações salvas com sucesso!');
  };

  const testarConexaoEmail = () => {
    alert('Testando conexão de e-mail...');
  };

  const testarConexaoSMS = () => {
    alert('Testando conexão SMS...');
  };

  const conectarWhatsAppWeb = () => {
    alert('Gerando QR Code para WhatsApp Web...');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">Configurações Globais</h3>
          <p className="text-gray-600">Configure integrações e parâmetros gerais</p>
        </div>
        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
        >
          <Save className="w-4 h-4" />
          <span>Salvar Configurações</span>
        </button>
      </div>

      {/* Configurações de E-mail */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 rounded-lg bg-blue-100">
            <Mail className="w-5 h-5 text-blue-600" />
          </div>
          <h4 className="text-lg font-semibold text-gray-900">Configurações de E-mail</h4>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Servidor SMTP
            </label>
            <input
              type="text"
              value={configuracoes.email.servidor}
              onChange={(e) => setConfiguracoes(prev => ({
                ...prev,
                email: { ...prev.email, servidor: e.target.value }
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Porta
            </label>
            <input
              type="number"
              value={configuracoes.email.porta}
              onChange={(e) => setConfiguracoes(prev => ({
                ...prev,
                email: { ...prev.email, porta: Number(e.target.value) }
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Usuário
            </label>
            <input
              type="email"
              value={configuracoes.email.usuario}
              onChange={(e) => setConfiguracoes(prev => ({
                ...prev,
                email: { ...prev.email, usuario: e.target.value }
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="seu-email@gmail.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Senha/Token
            </label>
            <input
              type="password"
              value={configuracoes.email.senha}
              onChange={(e) => setConfiguracoes(prev => ({
                ...prev,
                email: { ...prev.email, senha: e.target.value }
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Assinatura Padrão
          </label>
          <textarea
            value={configuracoes.email.assinatura}
            onChange={(e) => setConfiguracoes(prev => ({
              ...prev,
              email: { ...prev.email, assinatura: e.target.value }
            }))}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div className="mt-4 flex items-center space-x-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="emailSSL"
              checked={configuracoes.email.ssl}
              onChange={(e) => setConfiguracoes(prev => ({
                ...prev,
                email: { ...prev.email, ssl: e.target.checked }
              }))}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="emailSSL" className="ml-2 block text-sm text-gray-900">
              Usar SSL/TLS
            </label>
          </div>
          
          <button
            onClick={testarConexaoEmail}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            Testar Conexão
          </button>
        </div>
      </div>

      {/* Configurações de SMS */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 rounded-lg bg-green-100">
            <MessageSquare className="w-5 h-5 text-green-600" />
          </div>
          <h4 className="text-lg font-semibold text-gray-900">Configurações de SMS</h4>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Provedor
            </label>
            <select
              value={configuracoes.sms.provedor}
              onChange={(e) => setConfiguracoes(prev => ({
                ...prev,
                sms: { ...prev.sms, provedor: e.target.value }
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="twilio">Twilio</option>
              <option value="zenvia">Zenvia</option>
              <option value="totalvoice">TotalVoice</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Número Remetente
            </label>
            <input
              type="tel"
              value={configuracoes.sms.numeroRemetente}
              onChange={(e) => setConfiguracoes(prev => ({
                ...prev,
                sms: { ...prev.sms, numeroRemetente: e.target.value }
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="+5511999999999"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              API Key
            </label>
            <input
              type="password"
              value={configuracoes.sms.apiKey}
              onChange={(e) => setConfiguracoes(prev => ({
                ...prev,
                sms: { ...prev.sms, apiKey: e.target.value }
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              API Secret
            </label>
            <input
              type="password"
              value={configuracoes.sms.apiSecret}
              onChange={(e) => setConfiguracoes(prev => ({
                ...prev,
                sms: { ...prev.sms, apiSecret: e.target.value }
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <div className="mt-4">
          <button
            onClick={testarConexaoSMS}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
          >
            Testar Conexão SMS
          </button>
        </div>
      </div>

      {/* Configurações de WhatsApp */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 rounded-lg bg-emerald-100">
            <Phone className="w-5 h-5 text-emerald-600" />
          </div>
          <h4 className="text-lg font-semibold text-gray-900">Configurações de WhatsApp</h4>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* WhatsApp Business API */}
          <div className="space-y-4">
            <h5 className="font-medium text-gray-900">WhatsApp Business API</h5>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Número do Telefone
              </label>
              <input
                type="tel"
                value={configuracoes.whatsappOficial.numeroTelefone}
                onChange={(e) => setConfiguracoes(prev => ({
                  ...prev,
                  whatsappOficial: { ...prev.whatsappOficial, numeroTelefone: e.target.value }
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="+5511999999999"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Token da API
              </label>
              <input
                type="password"
                value={configuracoes.whatsappOficial.tokenApi}
                onChange={(e) => setConfiguracoes(prev => ({
                  ...prev,
                  whatsappOficial: { ...prev.whatsappOficial, tokenApi: e.target.value }
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Webhook URL
              </label>
              <input
                type="url"
                value={configuracoes.whatsappOficial.webhookUrl}
                onChange={(e) => setConfiguracoes(prev => ({
                  ...prev,
                  whatsappOficial: { ...prev.whatsappOficial, webhookUrl: e.target.value }
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://seusite.com/webhook/whatsapp"
              />
            </div>
            
            <div className={`p-3 rounded-lg ${
              configuracoes.whatsappOficial.verificado 
                ? 'bg-green-50 border border-green-200' 
                : 'bg-yellow-50 border border-yellow-200'
            }`}>
              <p className={`text-sm font-medium ${
                configuracoes.whatsappOficial.verificado ? 'text-green-900' : 'text-yellow-900'
              }`}>
                Status: {configuracoes.whatsappOficial.verificado ? 'Verificado' : 'Não Verificado'}
              </p>
            </div>
          </div>
          
          {/* WhatsApp Web */}
          <div className="space-y-4">
            <h5 className="font-medium text-gray-900">WhatsApp Web</h5>
            
            <div className={`p-4 rounded-lg border-2 border-dashed ${
              configuracoes.whatsappWeb.sessaoAtiva 
                ? 'border-green-300 bg-green-50' 
                : 'border-gray-300 bg-gray-50'
            }`}>
              <div className="text-center">
                {configuracoes.whatsappWeb.sessaoAtiva ? (
                  <div>
                    <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Phone className="w-6 h-6 text-white" />
                    </div>
                    <p className="font-medium text-green-900">Conectado</p>
                    <p className="text-sm text-green-700">
                      Última conexão: {configuracoes.whatsappWeb.ultimaConexao || 'Agora'}
                    </p>
                  </div>
                ) : (
                  <div>
                    <div className="w-12 h-12 bg-gray-400 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Phone className="w-6 h-6 text-white" />
                    </div>
                    <p className="font-medium text-gray-900">Desconectado</p>
                    <p className="text-sm text-gray-600 mb-3">
                      Clique para gerar QR Code
                    </p>
                    <button
                      onClick={conectarWhatsAppWeb}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Conectar WhatsApp Web
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Configurações Gerais */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 rounded-lg bg-gray-100">
            <Settings className="w-5 h-5 text-gray-600" />
          </div>
          <h4 className="text-lg font-semibold text-gray-900">Configurações Gerais</h4>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tentativas Máximas por Envio
            </label>
            <input
              type="number"
              min="1"
              max="10"
              value={configuracoes.geral.tentativasMaximas}
              onChange={(e) => setConfiguracoes(prev => ({
                ...prev,
                geral: { ...prev.geral, tentativasMaximas: Number(e.target.value) }
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Intervalo entre Tentativas (minutos)
            </label>
            <input
              type="number"
              min="1"
              max="1440"
              value={configuracoes.geral.intervaloTentativas}
              onChange={(e) => setConfiguracoes(prev => ({
                ...prev,
                geral: { ...prev.geral, intervaloTentativas: Number(e.target.value) }
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pausar Régua Após X Erros
            </label>
            <input
              type="number"
              min="1"
              max="50"
              value={configuracoes.geral.pausarAposErros}
              onChange={(e) => setConfiguracoes(prev => ({
                ...prev,
                geral: { ...prev.geral, pausarAposErros: Number(e.target.value) }
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              E-mail para Notificações
            </label>
            <input
              type="email"
              value={configuracoes.geral.emailNotificacao}
              onChange={(e) => setConfiguracoes(prev => ({
                ...prev,
                geral: { ...prev.geral, emailNotificacao: e.target.value }
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="admin@empresa.com"
            />
          </div>
        </div>
        
        <div className="mt-4 space-y-3">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="logDetalhado"
              checked={configuracoes.geral.logDetalhado}
              onChange={(e) => setConfiguracoes(prev => ({
                ...prev,
                geral: { ...prev.geral, logDetalhado: e.target.checked }
              }))}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="logDetalhado" className="ml-2 block text-sm text-gray-900">
              Log detalhado de envios
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="notificarErros"
              checked={configuracoes.geral.notificarErros}
              onChange={(e) => setConfiguracoes(prev => ({
                ...prev,
                geral: { ...prev.geral, notificarErros: e.target.checked }
              }))}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="notificarErros" className="ml-2 block text-sm text-gray-900">
              Notificar erros por e-mail
            </label>
          </div>
        </div>
      </div>

      {/* Segurança e Compliance */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 rounded-lg bg-red-100">
            <Shield className="w-5 h-5 text-red-600" />
          </div>
          <h4 className="text-lg font-semibold text-gray-900">Segurança e Compliance</h4>
        </div>
        
        <div className="space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <Shield className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-yellow-900">Importante - LGPD</p>
                <p className="text-yellow-800">
                  Certifique-se de que todos os clientes consentiram em receber comunicações de cobrança. 
                  Mantenha registros de consentimento e ofereça opção de descadastro.
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <Key className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-blue-900">Criptografia</p>
                <p className="text-blue-800">
                  Todas as credenciais são armazenadas com criptografia AES-256. 
                  Tokens e senhas nunca são expostos nos logs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}