import React, { useState } from 'react';
import { 
  Settings, Video, Mic, Monitor, Brain, Shield, Zap, 
  Palette, Users, MessageSquare, FileText, Camera,
  Volume2, Headphones, Speaker, Wifi, Battery, Clock,
  Save, RefreshCw, Download, Upload, Share2, Lock,
  Eye, EyeOff, Bell, BellOff, Smartphone, Laptop
} from 'lucide-react';

interface ConfiguracaoAvancadaProps {
  onSave: (config: any) => void;
  onClose: () => void;
}

export function ConfiguracaoAvancada({ onSave, onClose }: ConfiguracaoAvancadaProps) {
  const [activeSection, setActiveSection] = useState<'video' | 'audio' | 'ai' | 'security' | 'interface' | 'network'>('video');
  
  const [configuracoes, setConfiguracoes] = useState({
    video: {
      qualidade: '1080p',
      fps: 30,
      codec: 'H.264',
      autoAjuste: true,
      filtroFundo: 'none',
      correcaoLuz: true,
      estabilizacao: true,
      zoom: 100,
      espelhamento: false
    },
    audio: {
      qualidade: 'high',
      cancelamentoRuido: true,
      supressaoEco: true,
      ganhoAutomatico: true,
      dispositivo: 'default',
      volume: 80,
      microfone: 'default',
      volumeMic: 75,
      monitoramento: false
    },
    ia: {
      transcricaoTempo: true,
      resumoAutomatico: true,
      analisesentimento: true,
      deteccaoIdioma: true,
      extrairDecisoes: true,
      gerarAtas: true,
      alertasInteligentes: true,
      sugestoesMelhoria: true,
      modeloIA: 'gpt-4'
    },
    seguranca: {
      criptografiaE2E: true,
      senhaReuniao: '',
      salaEspera: true,
      aprovacaoHost: true,
      gravacaoSegura: true,
      logAuditoria: true,
      bloqueioTela: false,
      marcaAgua: true
    },
    interface: {
      tema: 'dark',
      layout: 'grid',
      mostrarNomes: true,
      mostrarStatus: true,
      notificacoes: true,
      atalhosTeclado: true,
      modoFoco: false,
      barraFerramentas: 'bottom',
      tamanhoFonte: 'medium'
    },
    rede: {
      adaptacaoAutomatica: true,
      limiteBanda: 'unlimited',
      prioridadeVideo: 'balanced',
      bufferTamanho: 'auto',
      reconexaoAutomatica: true,
      estatisticasRede: true,
      otimizacaoMobile: true,
      compressao: 'auto'
    }
  });

  const handleSave = () => {
    onSave(configuracoes);
    onClose();
  };

  const resetToDefault = () => {
    if (confirm('Restaurar configurações padrão?')) {
      // Reset logic here
      window.location.reload();
    }
  };

  const sections = [
    { id: 'video', label: 'Vídeo', icon: Video },
    { id: 'audio', label: 'Áudio', icon: Mic },
    { id: 'ai', label: 'Inteligência Artificial', icon: Brain },
    { id: 'security', label: 'Segurança', icon: Shield },
    { id: 'interface', label: 'Interface', icon: Monitor },
    { id: 'network', label: 'Rede', icon: Wifi }
  ];

  const renderVideoSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Qualidade de Vídeo</label>
          <select
            value={configuracoes.video.qualidade}
            onChange={(e) => setConfiguracoes(prev => ({
              ...prev,
              video: { ...prev.video, qualidade: e.target.value }
            }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="720p">HD (720p) - Recomendado</option>
            <option value="1080p">Full HD (1080p) - Alta qualidade</option>
            <option value="4K">4K Ultra HD - Máxima qualidade</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Taxa de Quadros (FPS)</label>
          <select
            value={configuracoes.video.fps}
            onChange={(e) => setConfiguracoes(prev => ({
              ...prev,
              video: { ...prev.video, fps: Number(e.target.value) }
            }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value={15}>15 FPS - Economia de banda</option>
            <option value={24}>24 FPS - Padrão cinema</option>
            <option value={30}>30 FPS - Recomendado</option>
            <option value={60}>60 FPS - Ultra suave</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Filtro de Fundo</label>
          <select
            value={configuracoes.video.filtroFundo}
            onChange={(e) => setConfiguracoes(prev => ({
              ...prev,
              video: { ...prev.video, filtroFundo: e.target.value }
            }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="none">Sem filtro</option>
            <option value="blur">Desfoque</option>
            <option value="office">Escritório virtual</option>
            <option value="nature">Natureza</option>
            <option value="custom">Personalizado</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Zoom (%)</label>
          <input
            type="range"
            min="50"
            max="200"
            value={configuracoes.video.zoom}
            onChange={(e) => setConfiguracoes(prev => ({
              ...prev,
              video: { ...prev.video, zoom: Number(e.target.value) }
            }))}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>50%</span>
            <span>{configuracoes.video.zoom}%</span>
            <span>200%</span>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Ajuste automático de qualidade</span>
          <button
            onClick={() => setConfiguracoes(prev => ({
              ...prev,
              video: { ...prev.video, autoAjuste: !prev.video.autoAjuste }
            }))}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              configuracoes.video.autoAjuste ? 'bg-blue-600' : 'bg-gray-200'
            }`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              configuracoes.video.autoAjuste ? 'translate-x-6' : 'translate-x-1'
            }`} />
          </button>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Correção automática de luz</span>
          <button
            onClick={() => setConfiguracoes(prev => ({
              ...prev,
              video: { ...prev.video, correcaoLuz: !prev.video.correcaoLuz }
            }))}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              configuracoes.video.correcaoLuz ? 'bg-blue-600' : 'bg-gray-200'
            }`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              configuracoes.video.correcaoLuz ? 'translate-x-6' : 'translate-x-1'
            }`} />
          </button>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Estabilização de imagem</span>
          <button
            onClick={() => setConfiguracoes(prev => ({
              ...prev,
              video: { ...prev.video, estabilizacao: !prev.video.estabilizacao }
            }))}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              configuracoes.video.estabilizacao ? 'bg-blue-600' : 'bg-gray-200'
            }`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              configuracoes.video.estabilizacao ? 'translate-x-6' : 'translate-x-1'
            }`} />
          </button>
        </div>
      </div>
    </div>
  );

  const renderAudioSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Qualidade de Áudio</label>
          <select
            value={configuracoes.audio.qualidade}
            onChange={(e) => setConfiguracoes(prev => ({
              ...prev,
              audio: { ...prev.audio, qualidade: e.target.value }
            }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="low">Baixa (32 kbps)</option>
            <option value="medium">Média (64 kbps)</option>
            <option value="high">Alta (128 kbps)</option>
            <option value="studio">Estúdio (256 kbps)</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Dispositivo de Áudio</label>
          <select
            value={configuracoes.audio.dispositivo}
            onChange={(e) => setConfiguracoes(prev => ({
              ...prev,
              audio: { ...prev.audio, dispositivo: e.target.value }
            }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="default">Padrão do sistema</option>
            <option value="headphones">Fones de ouvido</option>
            <option value="speakers">Alto-falantes</option>
            <option value="bluetooth">Bluetooth</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Volume de Saída</label>
          <input
            type="range"
            min="0"
            max="100"
            value={configuracoes.audio.volume}
            onChange={(e) => setConfiguracoes(prev => ({
              ...prev,
              audio: { ...prev.audio, volume: Number(e.target.value) }
            }))}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0%</span>
            <span>{configuracoes.audio.volume}%</span>
            <span>100%</span>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Sensibilidade do Microfone</label>
          <input
            type="range"
            min="0"
            max="100"
            value={configuracoes.audio.volumeMic}
            onChange={(e) => setConfiguracoes(prev => ({
              ...prev,
              audio: { ...prev.audio, volumeMic: Number(e.target.value) }
            }))}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0%</span>
            <span>{configuracoes.audio.volumeMic}%</span>
            <span>100%</span>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Cancelamento de ruído</span>
          <button
            onClick={() => setConfiguracoes(prev => ({
              ...prev,
              audio: { ...prev.audio, cancelamentoRuido: !prev.audio.cancelamentoRuido }
            }))}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              configuracoes.audio.cancelamentoRuido ? 'bg-blue-600' : 'bg-gray-200'
            }`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              configuracoes.audio.cancelamentoRuido ? 'translate-x-6' : 'translate-x-1'
            }`} />
          </button>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Supressão de eco</span>
          <button
            onClick={() => setConfiguracoes(prev => ({
              ...prev,
              audio: { ...prev.audio, supressaoEco: !prev.audio.supressaoEco }
            }))}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              configuracoes.audio.supressaoEco ? 'bg-blue-600' : 'bg-gray-200'
            }`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              configuracoes.audio.supressaoEco ? 'translate-x-6' : 'translate-x-1'
            }`} />
          </button>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Ganho automático</span>
          <button
            onClick={() => setConfiguracoes(prev => ({
              ...prev,
              audio: { ...prev.audio, ganhoAutomatico: !prev.audio.ganhoAutomatico }
            }))}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              configuracoes.audio.ganhoAutomatico ? 'bg-blue-600' : 'bg-gray-200'
            }`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              configuracoes.audio.ganhoAutomatico ? 'translate-x-6' : 'translate-x-1'
            }`} />
          </button>
        </div>
      </div>
    </div>
  );

  const renderAISettings = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-3">
          <Brain className="w-5 h-5 text-purple-600" />
          <h4 className="font-medium text-purple-900">Configurações de IA</h4>
        </div>
        <p className="text-sm text-purple-700">
          Configure como a inteligência artificial irá auxiliar durante suas reuniões.
        </p>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm font-medium text-gray-700">Transcrição em tempo real</span>
            <p className="text-xs text-gray-500">Converte fala em texto automaticamente</p>
          </div>
          <button
            onClick={() => setConfiguracoes(prev => ({
              ...prev,
              ia: { ...prev.ia, transcricaoTempo: !prev.ia.transcricaoTempo }
            }))}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              configuracoes.ia.transcricaoTempo ? 'bg-blue-600' : 'bg-gray-200'
            }`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              configuracoes.ia.transcricaoTempo ? 'translate-x-6' : 'translate-x-1'
            }`} />
          </button>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm font-medium text-gray-700">Resumo automático</span>
            <p className="text-xs text-gray-500">Gera resumos inteligentes da reunião</p>
          </div>
          <button
            onClick={() => setConfiguracoes(prev => ({
              ...prev,
              ia: { ...prev.ia, resumoAutomatico: !prev.ia.resumoAutomatico }
            }))}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              configuracoes.ia.resumoAutomatico ? 'bg-blue-600' : 'bg-gray-200'
            }`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              configuracoes.ia.resumoAutomatico ? 'translate-x-6' : 'translate-x-1'
            }`} />
          </button>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm font-medium text-gray-700">Análise de sentimento</span>
            <p className="text-xs text-gray-500">Detecta humor e engajamento</p>
          </div>
          <button
            onClick={() => setConfiguracoes(prev => ({
              ...prev,
              ia: { ...prev.ia, analisesentimento: !prev.ia.analisesentimento }
            }))}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              configuracoes.ia.analisesentimento ? 'bg-blue-600' : 'bg-gray-200'
            }`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              configuracoes.ia.analisesentimento ? 'translate-x-6' : 'translate-x-1'
            }`} />
          </button>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm font-medium text-gray-700">Extração de decisões</span>
            <p className="text-xs text-gray-500">Identifica decisões tomadas automaticamente</p>
          </div>
          <button
            onClick={() => setConfiguracoes(prev => ({
              ...prev,
              ia: { ...prev.ia, extrairDecisoes: !prev.ia.extrairDecisoes }
            }))}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              configuracoes.ia.extrairDecisoes ? 'bg-blue-600' : 'bg-gray-200'
            }`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              configuracoes.ia.extrairDecisoes ? 'translate-x-6' : 'translate-x-1'
            }`} />
          </button>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm font-medium text-gray-700">Geração automática de atas</span>
            <p className="text-xs text-gray-500">Cria atas estruturadas automaticamente</p>
          </div>
          <button
            onClick={() => setConfiguracoes(prev => ({
              ...prev,
              ia: { ...prev.ia, gerarAtas: !prev.ia.gerarAtas }
            }))}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              configuracoes.ia.gerarAtas ? 'bg-blue-600' : 'bg-gray-200'
            }`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              configuracoes.ia.gerarAtas ? 'translate-x-6' : 'translate-x-1'
            }`} />
          </button>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Modelo de IA</label>
        <select
          value={configuracoes.ia.modeloIA}
          onChange={(e) => setConfiguracoes(prev => ({
            ...prev,
            ia: { ...prev.ia, modeloIA: e.target.value }
          }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="gpt-4">GPT-4 - Máxima precisão</option>
          <option value="gpt-3.5">GPT-3.5 - Balanceado</option>
          <option value="claude">Claude - Análise profunda</option>
          <option value="gemini">Gemini - Multimodal</option>
        </select>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-3">
          <Shield className="w-5 h-5 text-red-600" />
          <h4 className="font-medium text-red-900">Configurações de Segurança</h4>
        </div>
        <p className="text-sm text-red-700">
          Proteja suas reuniões com recursos avançados de segurança.
        </p>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm font-medium text-gray-700">Criptografia ponta a ponta</span>
            <p className="text-xs text-gray-500">Máxima segurança para dados sensíveis</p>
          </div>
          <button
            onClick={() => setConfiguracoes(prev => ({
              ...prev,
              seguranca: { ...prev.seguranca, criptografiaE2E: !prev.seguranca.criptografiaE2E }
            }))}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              configuracoes.seguranca.criptografiaE2E ? 'bg-green-600' : 'bg-gray-200'
            }`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              configuracoes.seguranca.criptografiaE2E ? 'translate-x-6' : 'translate-x-1'
            }`} />
          </button>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Senha da reunião</label>
          <input
            type="password"
            value={configuracoes.seguranca.senhaReuniao}
            onChange={(e) => setConfiguracoes(prev => ({
              ...prev,
              seguranca: { ...prev.seguranca, senhaReuniao: e.target.value }
            }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Digite uma senha (opcional)"
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm font-medium text-gray-700">Sala de espera</span>
            <p className="text-xs text-gray-500">Participantes aguardam aprovação do host</p>
          </div>
          <button
            onClick={() => setConfiguracoes(prev => ({
              ...prev,
              seguranca: { ...prev.seguranca, salaEspera: !prev.seguranca.salaEspera }
            }))}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              configuracoes.seguranca.salaEspera ? 'bg-blue-600' : 'bg-gray-200'
            }`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              configuracoes.seguranca.salaEspera ? 'translate-x-6' : 'translate-x-1'
            }`} />
          </button>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm font-medium text-gray-700">Log de auditoria</span>
            <p className="text-xs text-gray-500">Registra todas as ações da reunião</p>
          </div>
          <button
            onClick={() => setConfiguracoes(prev => ({
              ...prev,
              seguranca: { ...prev.seguranca, logAuditoria: !prev.seguranca.logAuditoria }
            }))}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              configuracoes.seguranca.logAuditoria ? 'bg-blue-600' : 'bg-gray-200'
            }`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              configuracoes.seguranca.logAuditoria ? 'translate-x-6' : 'translate-x-1'
            }`} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        <div className="flex h-full">
          {/* Sidebar de Navegação */}
          <div className="w-64 bg-gray-50 border-r border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Configurações Avançadas</h2>
            </div>
            
            <nav className="p-4 space-y-2">
              {sections.map(section => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id as any)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeSection === section.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-sm font-medium">{section.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
          
          {/* Conteúdo Principal */}
          <div className="flex-1 flex flex-col">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">
                  {sections.find(s => s.id === activeSection)?.label}
                </h3>
                <div className="flex space-x-3">
                  <button
                    onClick={resetToDefault}
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Restaurar Padrão</span>
                  </button>
                  <button
                    onClick={onClose}
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Salvar</span>
                  </button>
                </div>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              {activeSection === 'video' && renderVideoSettings()}
              {activeSection === 'audio' && renderAudioSettings()}
              {activeSection === 'ai' && renderAISettings()}
              {activeSection === 'security' && renderSecuritySettings()}
              {activeSection === 'interface' && (
                <div className="text-center py-8">
                  <Monitor className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-600">Configurações de interface em desenvolvimento</p>
                </div>
              )}
              {activeSection === 'network' && (
                <div className="text-center py-8">
                  <Wifi className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-600">Configurações de rede em desenvolvimento</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}