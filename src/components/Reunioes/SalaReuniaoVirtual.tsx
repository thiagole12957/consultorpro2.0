import React, { useState, useEffect } from 'react';
import { 
  Users, Video, Mic, ScreenShare, MessageSquare, Settings, 
  Hand, Star, Crown, Shield, Zap, Layers, Palette, Brain,
  Clock, Calendar, FileText, Download, Share2, Volume2,
  Wifi, Battery, Signal, Monitor, Grid3X3, Maximize,
  Play, Pause, SkipForward, SkipBack, RefreshCw
} from 'lucide-react';

interface SalaReuniaoVirtualProps {
  reuniaoId: string;
  isHost: boolean;
  participantes: any[];
}

export function SalaReuniaoVirtual({ reuniaoId, isHost, participantes }: SalaReuniaoVirtualProps) {
  const [salaStatus, setSalaStatus] = useState({
    participantesOnline: participantes.length,
    duracaoReuniao: 0,
    qualidadeConexao: 'excellent' as 'excellent' | 'good' | 'poor',
    gravacaoAtiva: false,
    transcricaoAtiva: false,
    lousaAtiva: false,
    chatAtivo: false
  });

  const [configuracoesSala, setConfiguracoesSala] = useState({
    permitirCompartilhamento: true,
    permitirChat: true,
    permitirLousaDigital: true,
    gravacaoAutomatica: false,
    transcricaoAutomatica: true,
    qualidadeVideo: '1080p' as '720p' | '1080p' | '4K',
    layoutPadrao: 'grid' as 'grid' | 'speaker' | 'presentation'
  });

  const [estatisticasRede, setEstatisticasRede] = useState({
    latencia: 45,
    jitter: 2,
    perda_pacotes: 0.1,
    largura_banda: 1200,
    fps_video: 30,
    qualidade_audio: 'excellent'
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setSalaStatus(prev => ({
        ...prev,
        duracaoReuniao: prev.duracaoReuniao + 1
      }));
      
      // Simular variações na rede
      setEstatisticasRede(prev => ({
        ...prev,
        latencia: Math.max(20, prev.latencia + (Math.random() - 0.5) * 10),
        jitter: Math.max(0, prev.jitter + (Math.random() - 0.5) * 2),
        perda_pacotes: Math.max(0, prev.perda_pacotes + (Math.random() - 0.5) * 0.5)
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatDuracao = (segundos: number) => {
    const horas = Math.floor(segundos / 3600);
    const minutos = Math.floor((segundos % 3600) / 60);
    const segs = segundos % 60;
    
    if (horas > 0) {
      return `${horas}:${minutos.toString().padStart(2, '0')}:${segs.toString().padStart(2, '0')}`;
    }
    return `${minutos}:${segs.toString().padStart(2, '0')}`;
  };

  const getQualidadeColor = (qualidade: string) => {
    switch (qualidade) {
      case 'excellent': return 'text-green-400';
      case 'good': return 'text-yellow-400';
      case 'poor': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="bg-gray-900 text-white p-6 rounded-xl">
      {/* Header da Sala */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Video className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Sala Virtual Avançada</h2>
            <p className="text-gray-400 text-sm">Reunião ID: {reuniaoId}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {isHost && (
            <div className="flex items-center space-x-2 bg-yellow-600 px-3 py-1 rounded-full">
              <Crown className="w-4 h-4" />
              <span className="text-sm font-medium">Host</span>
            </div>
          )}
          
          <div className="flex items-center space-x-2 text-sm">
            <Clock className="w-4 h-4 text-blue-400" />
            <span>{formatDuracao(salaStatus.duracaoReuniao)}</span>
          </div>
        </div>
      </div>

      {/* Status da Sala */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <Users className="w-5 h-5 text-blue-400" />
            <div>
              <p className="text-lg font-bold">{salaStatus.participantesOnline}</p>
              <p className="text-xs text-gray-400">Participantes Online</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <Wifi className={`w-5 h-5 ${getQualidadeColor(salaStatus.qualidadeConexao)}`} />
            <div>
              <p className="text-lg font-bold capitalize">{salaStatus.qualidadeConexao}</p>
              <p className="text-xs text-gray-400">Qualidade da Conexão</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <Brain className="w-5 h-5 text-purple-400" />
            <div>
              <p className="text-lg font-bold">{salaStatus.transcricaoAtiva ? 'Ativa' : 'Inativa'}</p>
              <p className="text-xs text-gray-400">IA Transcrição</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <Palette className="w-5 h-5 text-green-400" />
            <div>
              <p className="text-lg font-bold">{salaStatus.lousaAtiva ? 'Ativa' : 'Inativa'}</p>
              <p className="text-xs text-gray-400">Lousa Digital</p>
            </div>
          </div>
        </div>
      </div>

      {/* Configurações da Sala */}
      {isHost && (
        <div className="bg-gray-800 rounded-lg p-4 mb-6">
          <h3 className="font-semibold mb-4 flex items-center space-x-2">
            <Settings className="w-5 h-5 text-blue-400" />
            <span>Configurações da Sala (Host)</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Permitir compartilhamento de tela</span>
                <button
                  onClick={() => setConfiguracoesSala(prev => ({ ...prev, permitirCompartilhamento: !prev.permitirCompartilhamento }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    configuracoesSala.permitirCompartilhamento ? 'bg-blue-600' : 'bg-gray-600'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    configuracoesSala.permitirCompartilhamento ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Chat habilitado</span>
                <button
                  onClick={() => setConfiguracoesSala(prev => ({ ...prev, permitirChat: !prev.permitirChat }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    configuracoesSala.permitirChat ? 'bg-blue-600' : 'bg-gray-600'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    configuracoesSala.permitirChat ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Lousa digital</span>
                <button
                  onClick={() => setConfiguracoesSala(prev => ({ ...prev, permitirLousaDigital: !prev.permitirLousaDigital }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    configuracoesSala.permitirLousaDigital ? 'bg-blue-600' : 'bg-gray-600'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    configuracoesSala.permitirLousaDigital ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Gravação automática</span>
                <button
                  onClick={() => setConfiguracoesSala(prev => ({ ...prev, gravacaoAutomatica: !prev.gravacaoAutomatica }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    configuracoesSala.gravacaoAutomatica ? 'bg-blue-600' : 'bg-gray-600'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    configuracoesSala.gravacaoAutomatica ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Transcrição IA</span>
                <button
                  onClick={() => setConfiguracoesSala(prev => ({ ...prev, transcricaoAutomatica: !prev.transcricaoAutomatica }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    configuracoesSala.transcricaoAutomatica ? 'bg-blue-600' : 'bg-gray-600'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    configuracoesSala.transcricaoAutomatica ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
              
              <div>
                <label className="block text-sm mb-1">Qualidade de vídeo</label>
                <select
                  value={configuracoesSala.qualidadeVideo}
                  onChange={(e) => setConfiguracoesSala(prev => ({ ...prev, qualidadeVideo: e.target.value as any }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm"
                >
                  <option value="720p">HD (720p)</option>
                  <option value="1080p">Full HD (1080p)</option>
                  <option value="4K">4K Ultra HD</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Estatísticas de Rede */}
      <div className="bg-gray-800 rounded-lg p-4">
        <h3 className="font-semibold mb-4 flex items-center space-x-2">
          <Signal className="w-5 h-5 text-green-400" />
          <span>Estatísticas de Rede</span>
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="text-center">
            <p className="text-gray-400">Latência</p>
            <p className={`text-lg font-bold ${
              estatisticasRede.latencia < 50 ? 'text-green-400' :
              estatisticasRede.latencia < 100 ? 'text-yellow-400' : 'text-red-400'
            }`}>
              {estatisticasRede.latencia.toFixed(0)}ms
            </p>
          </div>
          
          <div className="text-center">
            <p className="text-gray-400">Jitter</p>
            <p className={`text-lg font-bold ${
              estatisticasRede.jitter < 5 ? 'text-green-400' :
              estatisticasRede.jitter < 10 ? 'text-yellow-400' : 'text-red-400'
            }`}>
              {estatisticasRede.jitter.toFixed(1)}ms
            </p>
          </div>
          
          <div className="text-center">
            <p className="text-gray-400">Perda de Pacotes</p>
            <p className={`text-lg font-bold ${
              estatisticasRede.perda_pacotes < 1 ? 'text-green-400' :
              estatisticasRede.perda_pacotes < 3 ? 'text-yellow-400' : 'text-red-400'
            }`}>
              {estatisticasRede.perda_pacotes.toFixed(1)}%
            </p>
          </div>
          
          <div className="text-center">
            <p className="text-gray-400">Largura de Banda</p>
            <p className="text-lg font-bold text-blue-400">
              {estatisticasRede.largura_banda} kbps
            </p>
          </div>
        </div>
      </div>

      {/* Recursos Avançados */}
      <div className="bg-gray-800 rounded-lg p-4">
        <h3 className="font-semibold mb-4 flex items-center space-x-2">
          <Zap className="w-5 h-5 text-yellow-400" />
          <span>Recursos Avançados Disponíveis</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-2">
              <Brain className="w-6 h-6 text-purple-400" />
              <span className="font-medium">IA Integrada</span>
            </div>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Transcrição em tempo real</li>
              <li>• Resumos automáticos</li>
              <li>• Análise de sentimento</li>
              <li>• Extração de decisões</li>
            </ul>
          </div>
          
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-2">
              <Palette className="w-6 h-6 text-green-400" />
              <span className="font-medium">Lousa Digital</span>
            </div>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Desenho colaborativo</li>
              <li>• Formas geométricas</li>
              <li>• Texto e anotações</li>
              <li>• Salvamento automático</li>
            </ul>
          </div>
          
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-2">
              <ScreenShare className="w-6 h-6 text-blue-400" />
              <span className="font-medium">Compartilhamento</span>
            </div>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Tela completa</li>
              <li>• Aplicativo específico</li>
              <li>• Áudio do sistema</li>
              <li>• Controle remoto</li>
            </ul>
          </div>
          
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-2">
              <FileText className="w-6 h-6 text-orange-400" />
              <span className="font-medium">Documentos</span>
            </div>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Upload em tempo real</li>
              <li>• Visualização integrada</li>
              <li>• Anotações em PDF</li>
              <li>• Sincronização automática</li>
            </ul>
          </div>
          
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-2">
              <Shield className="w-6 h-6 text-red-400" />
              <span className="font-medium">Segurança</span>
            </div>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Criptografia E2E</li>
              <li>• Sala com senha</li>
              <li>• Controle de acesso</li>
              <li>• Auditoria completa</li>
            </ul>
          </div>
          
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-2">
              <Layers className="w-6 h-6 text-cyan-400" />
              <span className="font-medium">Layouts</span>
            </div>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Grade de participantes</li>
              <li>• Modo apresentador</li>
              <li>• Tela dividida</li>
              <li>• Foco automático</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Ações Rápidas */}
      <div className="flex items-center justify-center space-x-4">
        <button className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 py-3 rounded-xl flex items-center space-x-2 hover:from-green-700 hover:to-blue-700 transition-all duration-200 transform hover:scale-105">
          <Play className="w-5 h-5" />
          <span>Iniciar Reunião Avançada</span>
        </button>
        
        <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl flex items-center space-x-2 hover:from-purple-700 hover:to-pink-700 transition-all duration-200 transform hover:scale-105">
          <Brain className="w-5 h-5" />
          <span>Modo IA Completa</span>
        </button>
        
        <button className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-6 py-3 rounded-xl flex items-center space-x-2 hover:from-orange-700 hover:to-red-700 transition-all duration-200 transform hover:scale-105">
          <Palette className="w-5 h-5" />
          <span>Sessão Colaborativa</span>
        </button>
      </div>
    </div>
  );
}