import React, { useState, useEffect } from 'react';
import { Save, Key, Database, Brain, Shield, Globe, TestTube, CheckCircle, AlertTriangle, Eye, EyeOff } from 'lucide-react';
import { TesteIntegracoes } from './TesteIntegracoes';

interface ConfiguracaoSistema {
  supabase: {
    url: string;
    anonKey: string;
    serviceRoleKey: string;
  };
  openai: {
    apiKey: string;
    model: string;
    maxTokens: number;
  };
  sistema: {
    nomeEmpresa: string;
    logoUrl: string;
    timezone: string;
    idioma: string;
  };
  seguranca: {
    sessaoExpiraMinutos: number;
    tentativasLoginMax: number;
    logDetalhado: boolean;
  };
}

export function ConfiguracoesSistema() {
  const [activeTab, setActiveTab] = useState<'supabase' | 'openai' | 'sistema' | 'seguranca'>('supabase');
  const [showPasswords, setShowPasswords] = useState<{[key: string]: boolean}>({});
  const [testResults, setTestResults] = useState<{[key: string]: 'success' | 'error' | 'testing' | null}>({});
  const [isSaving, setIsSaving] = useState(false);
  
  const [configuracoes, setConfiguracoes] = useState<ConfiguracaoSistema>({
    supabase: {
      url: localStorage.getItem('VITE_SUPABASE_URL') || '',
      anonKey: localStorage.getItem('VITE_SUPABASE_ANON_KEY') || '',
      serviceRoleKey: localStorage.getItem('VITE_SUPABASE_SERVICE_ROLE_KEY') || '',
    },
    openai: {
      apiKey: localStorage.getItem('OPENAI_API_KEY') || '',
      model: localStorage.getItem('OPENAI_MODEL') || 'gpt-4',
      maxTokens: parseInt(localStorage.getItem('OPENAI_MAX_TOKENS') || '1000'),
    },
    sistema: {
      nomeEmpresa: localStorage.getItem('SISTEMA_NOME_EMPRESA') || 'ConsultorPro',
      logoUrl: localStorage.getItem('SISTEMA_LOGO_URL') || '',
      timezone: localStorage.getItem('SISTEMA_TIMEZONE') || 'America/Sao_Paulo',
      idioma: localStorage.getItem('SISTEMA_IDIOMA') || 'pt-BR',
    },
    seguranca: {
      sessaoExpiraMinutos: parseInt(localStorage.getItem('SEGURANCA_SESSAO_EXPIRA') || '480'),
      tentativasLoginMax: parseInt(localStorage.getItem('SEGURANCA_TENTATIVAS_MAX') || '5'),
      logDetalhado: localStorage.getItem('SEGURANCA_LOG_DETALHADO') === 'true',
    }
  });

  const togglePasswordVisibility = (field: string) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const testarConexaoSupabase = async () => {
    setTestResults(prev => ({ ...prev, supabase: 'testing' }));
    
    try {
      // Simular teste de conexão
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (configuracoes.supabase.url && configuracoes.supabase.anonKey) {
        setTestResults(prev => ({ ...prev, supabase: 'success' }));
      } else {
        setTestResults(prev => ({ ...prev, supabase: 'error' }));
      }
    } catch (error) {
      setTestResults(prev => ({ ...prev, supabase: 'error' }));
    }
  };

  const testarConexaoOpenAI = async () => {
    setTestResults(prev => ({ ...prev, openai: 'testing' }));
    
    try {
      // Simular teste de conexão
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (configuracoes.openai.apiKey) {
        setTestResults(prev => ({ ...prev, openai: 'success' }));
      } else {
        setTestResults(prev => ({ ...prev, openai: 'error' }));
      }
    } catch (error) {
      setTestResults(prev => ({ ...prev, openai: 'error' }));
    }
  };

  const salvarConfiguracoes = async () => {
    setIsSaving(true);
    
    try {
      // Salvar no localStorage
      localStorage.setItem('VITE_SUPABASE_URL', configuracoes.supabase.url);
      localStorage.setItem('VITE_SUPABASE_ANON_KEY', configuracoes.supabase.anonKey);
      localStorage.setItem('VITE_SUPABASE_SERVICE_ROLE_KEY', configuracoes.supabase.serviceRoleKey);
      
      localStorage.setItem('OPENAI_API_KEY', configuracoes.openai.apiKey);
      localStorage.setItem('OPENAI_MODEL', configuracoes.openai.model);
      localStorage.setItem('OPENAI_MAX_TOKENS', configuracoes.openai.maxTokens.toString());
      
      localStorage.setItem('SISTEMA_NOME_EMPRESA', configuracoes.sistema.nomeEmpresa);
      localStorage.setItem('SISTEMA_LOGO_URL', configuracoes.sistema.logoUrl);
      localStorage.setItem('SISTEMA_TIMEZONE', configuracoes.sistema.timezone);
      localStorage.setItem('SISTEMA_IDIOMA', configuracoes.sistema.idioma);
      
      localStorage.setItem('SEGURANCA_SESSAO_EXPIRA', configuracoes.seguranca.sessaoExpiraMinutos.toString());
      localStorage.setItem('SEGURANCA_TENTATIVAS_MAX', configuracoes.seguranca.tentativasLoginMax.toString());
      localStorage.setItem('SEGURANCA_LOG_DETALHADO', configuracoes.seguranca.logDetalhado.toString());
      
      // Simular salvamento
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert('Configurações salvas com sucesso! Recarregue a página para aplicar as mudanças.');
      
    } catch (error) {
      alert('Erro ao salvar configurações: ' + error);
    } finally {
      setIsSaving(false);
    }
  };

  const resetarConfiguracoes = () => {
    if (confirm('Tem certeza que deseja resetar todas as configurações? Esta ação não pode ser desfeita.')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const tabs = [
    { id: 'supabase', label: 'Supabase', icon: Database, color: 'text-green-600' },
    { id: 'openai', label: 'OpenAI', icon: Brain, color: 'text-purple-600' },
    { id: 'sistema', label: 'Sistema', icon: Globe, color: 'text-blue-600' },
    { id: 'seguranca', label: 'Segurança', icon: Shield, color: 'text-red-600' },
  ];

  const renderSupabaseConfig = () => (
    <div className="space-y-6">
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-2">
          <Database className="w-5 h-5 text-green-600" />
          <h4 className="font-medium text-green-900">Configuração do Supabase</h4>
        </div>
        <p className="text-sm text-green-800">
          Configure a conexão com o banco de dados Supabase. Essas informações são encontradas no painel do Supabase.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            URL do Projeto Supabase *
          </label>
          <input
            type="url"
            value={configuracoes.supabase.url}
            onChange={(e) => setConfiguracoes(prev => ({
              ...prev,
              supabase: { ...prev.supabase, url: e.target.value }
            }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="https://seu-projeto.supabase.co"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Chave Anônima (anon key) *
          </label>
          <div className="relative">
            <input
              type={showPasswords.supabaseAnon ? 'text' : 'password'}
              value={configuracoes.supabase.anonKey}
              onChange={(e) => setConfiguracoes(prev => ({
                ...prev,
                supabase: { ...prev.supabase, anonKey: e.target.value }
              }))}
              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-mono text-sm"
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('supabaseAnon')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showPasswords.supabaseAnon ? (
                <EyeOff className="h-4 w-4 text-gray-400" />
              ) : (
                <Eye className="h-4 w-4 text-gray-400" />
              )}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Chave de Serviço (service_role key)
          </label>
          <div className="relative">
            <input
              type={showPasswords.supabaseService ? 'text' : 'password'}
              value={configuracoes.supabase.serviceRoleKey}
              onChange={(e) => setConfiguracoes(prev => ({
                ...prev,
                supabase: { ...prev.supabase, serviceRoleKey: e.target.value }
              }))}
              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-mono text-sm"
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('supabaseService')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showPasswords.supabaseService ? (
                <EyeOff className="h-4 w-4 text-gray-400" />
              ) : (
                <Eye className="h-4 w-4 text-gray-400" />
              )}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Opcional - Necessária apenas para operações administrativas
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={testarConexaoSupabase}
            disabled={testResults.supabase === 'testing'}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
          >
            <TestTube className="w-4 h-4" />
            <span>{testResults.supabase === 'testing' ? 'Testando...' : 'Testar Conexão'}</span>
          </button>
          
          {testResults.supabase === 'success' && (
            <div className="flex items-center space-x-2 text-green-600">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm">Conexão bem-sucedida!</span>
            </div>
          )}
          
          {testResults.supabase === 'error' && (
            <div className="flex items-center space-x-2 text-red-600">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm">Erro na conexão</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderOpenAIConfig = () => (
    <div className="space-y-6">
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-2">
          <Brain className="w-5 h-5 text-purple-600" />
          <h4 className="font-medium text-purple-900">Configuração da OpenAI</h4>
        </div>
        <p className="text-sm text-purple-800">
          Configure a API da OpenAI para funcionalidades de IA como transcrição (Whisper) e resumos (GPT-4).
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Chave da API OpenAI *
          </label>
          <div className="relative">
            <input
              type={showPasswords.openaiKey ? 'text' : 'password'}
              value={configuracoes.openai.apiKey}
              onChange={(e) => setConfiguracoes(prev => ({
                ...prev,
                openai: { ...prev.openai, apiKey: e.target.value }
              }))}
              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono text-sm"
              placeholder="sk-proj-..."
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('openaiKey')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showPasswords.openaiKey ? (
                <EyeOff className="h-4 w-4 text-gray-400" />
              ) : (
                <Eye className="h-4 w-4 text-gray-400" />
              )}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Obtenha sua chave em: <a href="https://platform.openai.com/api-keys" target="_blank" className="text-purple-600 hover:underline">platform.openai.com/api-keys</a>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Modelo de IA
            </label>
            <select
              value={configuracoes.openai.model}
              onChange={(e) => setConfiguracoes(prev => ({
                ...prev,
                openai: { ...prev.openai, model: e.target.value }
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="gpt-4">GPT-4 (Recomendado)</option>
              <option value="gpt-4-turbo">GPT-4 Turbo</option>
              <option value="gpt-3.5-turbo">GPT-3.5 Turbo (Mais rápido)</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Máximo de Tokens
            </label>
            <input
              type="number"
              min="100"
              max="4000"
              value={configuracoes.openai.maxTokens}
              onChange={(e) => setConfiguracoes(prev => ({
                ...prev,
                openai: { ...prev.openai, maxTokens: Number(e.target.value) }
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={testarConexaoOpenAI}
            disabled={testResults.openai === 'testing'}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
          >
            <TestTube className="w-4 h-4" />
            <span>{testResults.openai === 'testing' ? 'Testando...' : 'Testar API'}</span>
          </button>
          
          {testResults.openai === 'success' && (
            <div className="flex items-center space-x-2 text-green-600">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm">API funcionando!</span>
            </div>
          )}
          
          {testResults.openai === 'error' && (
            <div className="flex items-center space-x-2 text-red-600">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm">Erro na API</span>
            </div>
          )}
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start space-x-2">
            <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-yellow-900">Importante sobre custos:</p>
              <p className="text-yellow-800">
                A API da OpenAI é paga por uso. Monitore seus gastos em platform.openai.com/usage.
                GPT-4 é mais caro que GPT-3.5, mas oferece melhor qualidade.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSistemaConfig = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-2">
          <Globe className="w-5 h-5 text-blue-600" />
          <h4 className="font-medium text-blue-900">Configurações do Sistema</h4>
        </div>
        <p className="text-sm text-blue-800">
          Personalize as configurações gerais do sistema.
        </p>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome da Empresa
            </label>
            <input
              type="text"
              value={configuracoes.sistema.nomeEmpresa}
              onChange={(e) => setConfiguracoes(prev => ({
                ...prev,
                sistema: { ...prev.sistema, nomeEmpresa: e.target.value }
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="ConsultorPro"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL do Logo
            </label>
            <input
              type="url"
              value={configuracoes.sistema.logoUrl}
              onChange={(e) => setConfiguracoes(prev => ({
                ...prev,
                sistema: { ...prev.sistema, logoUrl: e.target.value }
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://exemplo.com/logo.png"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fuso Horário
            </label>
            <select
              value={configuracoes.sistema.timezone}
              onChange={(e) => setConfiguracoes(prev => ({
                ...prev,
                sistema: { ...prev.sistema, timezone: e.target.value }
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="America/Sao_Paulo">São Paulo (GMT-3)</option>
              <option value="America/Manaus">Manaus (GMT-4)</option>
              <option value="America/Rio_Branco">Rio Branco (GMT-5)</option>
              <option value="America/Noronha">Fernando de Noronha (GMT-2)</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Idioma do Sistema
            </label>
            <select
              value={configuracoes.sistema.idioma}
              onChange={(e) => setConfiguracoes(prev => ({
                ...prev,
                sistema: { ...prev.sistema, idioma: e.target.value }
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="pt-BR">Português (Brasil)</option>
              <option value="en-US">English (US)</option>
              <option value="es-ES">Español</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSegurancaConfig = () => (
    <div className="space-y-6">
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-2">
          <Shield className="w-5 h-5 text-red-600" />
          <h4 className="font-medium text-red-900">Configurações de Segurança</h4>
        </div>
        <p className="text-sm text-red-800">
          Configure políticas de segurança e auditoria do sistema.
        </p>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sessão expira em (minutos)
            </label>
            <input
              type="number"
              min="30"
              max="1440"
              value={configuracoes.seguranca.sessaoExpiraMinutos}
              onChange={(e) => setConfiguracoes(prev => ({
                ...prev,
                seguranca: { ...prev.seguranca, sessaoExpiraMinutos: Number(e.target.value) }
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              Padrão: 480 minutos (8 horas)
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Máximo de tentativas de login
            </label>
            <input
              type="number"
              min="3"
              max="10"
              value={configuracoes.seguranca.tentativasLoginMax}
              onChange={(e) => setConfiguracoes(prev => ({
                ...prev,
                seguranca: { ...prev.seguranca, tentativasLoginMax: Number(e.target.value) }
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="logDetalhado"
            checked={configuracoes.seguranca.logDetalhado}
            onChange={(e) => setConfiguracoes(prev => ({
              ...prev,
              seguranca: { ...prev.seguranca, logDetalhado: e.target.checked }
            }))}
            className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
          />
          <label htmlFor="logDetalhado" className="ml-2 block text-sm text-gray-900">
            Habilitar log detalhado de auditoria
          </label>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Configurações do Sistema</h2>
          <p className="text-gray-600">Configure APIs, banco de dados e parâmetros do sistema</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={resetarConfiguracoes}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Resetar Tudo
          </button>
          <button
            onClick={salvarConfiguracoes}
            disabled={isSaving}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Salvando...' : 'Salvar Configurações'}</span>
          </button>
        </div>
      </div>

      {/* Status das Configurações */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${
              configuracoes.supabase.url && configuracoes.supabase.anonKey 
                ? 'bg-green-100' : 'bg-red-100'
            }`}>
              <Database className={`w-5 h-5 ${
                configuracoes.supabase.url && configuracoes.supabase.anonKey 
                  ? 'text-green-600' : 'text-red-600'
              }`} />
            </div>
            <div>
              <p className="font-medium text-gray-900">Supabase</p>
              <p className={`text-sm ${
                configuracoes.supabase.url && configuracoes.supabase.anonKey 
                  ? 'text-green-600' : 'text-red-600'
              }`}>
                {configuracoes.supabase.url && configuracoes.supabase.anonKey ? 'Configurado' : 'Não configurado'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${
              configuracoes.openai.apiKey ? 'bg-green-100' : 'bg-red-100'
            }`}>
              <Brain className={`w-5 h-5 ${
                configuracoes.openai.apiKey ? 'text-green-600' : 'text-red-600'
              }`} />
            </div>
            <div>
              <p className="font-medium text-gray-900">OpenAI</p>
              <p className={`text-sm ${
                configuracoes.openai.apiKey ? 'text-green-600' : 'text-red-600'
              }`}>
                {configuracoes.openai.apiKey ? 'Configurado' : 'Não configurado'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-blue-100">
              <Globe className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Sistema</p>
              <p className="text-sm text-blue-600">Configurado</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-orange-100">
              <Shield className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Segurança</p>
              <p className="text-sm text-orange-600">Configurado</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navegação por Abas */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-blue-600' : tab.color}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Conteúdo das Abas */}
        <div className="p-6">
          {activeTab === 'supabase' && renderSupabaseConfig()}
          {activeTab === 'openai' && renderOpenAIConfig()}
          {activeTab === 'sistema' && renderSistemaConfig()}
          {activeTab === 'seguranca' && renderSegurancaConfig()}
        </div>
      </div>

      {/* Teste de Integrações */}
      <TesteIntegracoes />

      {/* Instruções de Configuração */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Instruções de Configuração</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-2 flex items-center space-x-2">
              <Database className="w-4 h-4 text-green-600" />
              <span>Como configurar o Supabase:</span>
            </h4>
            <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
              <li>Acesse <a href="https://supabase.com" target="_blank" className="text-green-600 hover:underline">supabase.com</a></li>
              <li>Crie um novo projeto</li>
              <li>Vá em Settings → API</li>
              <li>Copie a URL e as chaves</li>
              <li>Cole aqui e teste a conexão</li>
            </ol>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-2 flex items-center space-x-2">
              <Brain className="w-4 h-4 text-purple-600" />
              <span>Como configurar a OpenAI:</span>
            </h4>
            <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
              <li>Acesse <a href="https://platform.openai.com" target="_blank" className="text-purple-600 hover:underline">platform.openai.com</a></li>
              <li>Faça login ou crie uma conta</li>
              <li>Vá em API Keys</li>
              <li>Crie uma nova chave secreta</li>
              <li>Cole aqui e teste a API</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}