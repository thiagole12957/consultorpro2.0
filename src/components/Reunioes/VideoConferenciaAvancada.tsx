import React, { useState, useEffect, useRef } from 'react';
import { 
  Video, VideoOff, Mic, MicOff, Phone, Users, MessageSquare, Settings, 
  Monitor, Grid3X3, Maximize, Volume2, VolumeX, Brain, FileText, 
  Trash2, Wifi, ScreenShare, Hand, Star, Crown, Shield, Zap, 
  Layers, Palette, Clock, Calendar, Download, Share2, Upload,
  Play, Pause, SkipForward, SkipBack, RefreshCw, Eye, EyeOff,
  Bell, BellOff, Smartphone, Laptop, Battery, Signal, Target,
  CheckCircle, AlertTriangle, Lightbulb, Camera, Headphones,
  Speaker, Lock, Unlock, Copy, Edit2, Plus, Minus, RotateCcw,
  Move, Bookmark, Tag, Hash, Filter, Search, Archive, Folder, Save,
  Square, Circle
} from 'lucide-react';
import { TranscriptionService } from '../../services/transcriptionService';
import { useApp } from '../../contexts/AppContext';
import { FerramentasColaborativas } from './FerramentasColaborativas';
import { SalaReuniaoVirtual } from './SalaReuniaoVirtual';
import { ConfiguracaoAvancada } from './ConfiguracaoAvancada';

interface VideoConferenciaAvancadaProps {
  reuniaoId: string;
  participantes: string[];
  onEncerrar: () => void;
}

export function VideoConferenciaAvancada({ reuniaoId, participantes, onEncerrar }: VideoConferenciaAvancadaProps) {
  const { atualizarReuniao } = useApp();
  
  // Estados principais
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [transcricao, setTranscricao] = useState('');
  const [resumoIA, setResumoIA] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'speaker' | 'sidebar' | 'presentation'>('grid');
  const [mensagemChat, setMensagemChat] = useState('');
  const [mensagensChat, setMensagensChat] = useState<Array<{id: string, autor: string, mensagem: string, hora: string}>>([]);
  
  // Estados avançados
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [showWhiteboard, setShowWhiteboard] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showFerramentasColaborativas, setShowFerramentasColaborativas] = useState(false);
  const [showSalaVirtual, setShowSalaVirtual] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [networkQuality, setNetworkQuality] = useState<'excellent' | 'good' | 'poor'>('excellent');
  const [cpuUsage, setCpuUsage] = useState(25);
  const [memoryUsage, setMemoryUsage] = useState(45);
  
  // Estados de IA
  const [aiInsights, setAiInsights] = useState<string[]>([]);
  const [sentimentAnalysis, setSentimentAnalysis] = useState<'positive' | 'neutral' | 'negative'>('neutral');
  const [engagementLevel, setEngagementLevel] = useState<'high' | 'medium' | 'low'>('medium');
  const [keyTopics, setKeyTopics] = useState<string[]>([]);
  const [decisionsDetected, setDecisionsDetected] = useState<string[]>([]);
  
  // Estados de colaboração
  const [whiteboardContent, setWhiteboardContent] = useState('');
  const [sharedDocuments, setSharedDocuments] = useState<Array<{id: string, name: string, type: string}>>([]);
  const [polls, setPolls] = useState<Array<{id: string, question: string, options: string[], votes: number[]}>>([]);
  const [breakoutRooms, setBreakoutRooms] = useState<Array<{id: string, name: string, participants: string[]}>>([]);
  
  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const transcriptionServiceRef = useRef<TranscriptionService | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    iniciarCamera();
    iniciarMonitoramento();
    return () => {
      pararCamera();
    };
  }, []);

  const iniciarCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          frameRate: { ideal: 30 }
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      // Inicializar serviço de transcrição avançado
      transcriptionServiceRef.current = new TranscriptionService((texto) => {
        setTranscricao(prev => prev + '\n' + texto);
        analisarTextoComIA(texto);
      });

    } catch (error) {
      console.error('Erro ao acessar câmera:', error);
    }
  };

  const iniciarMonitoramento = () => {
    // Monitorar qualidade da rede
    const networkInterval = setInterval(() => {
      // Simular variações na qualidade da rede
      const qualidades: Array<'excellent' | 'good' | 'poor'> = ['excellent', 'good', 'poor'];
      const randomQuality = qualidades[Math.floor(Math.random() * qualidades.length)];
      setNetworkQuality(randomQuality);
      
      // Simular uso de CPU e memória
      setCpuUsage(Math.floor(Math.random() * 30) + 20);
      setMemoryUsage(Math.floor(Math.random() * 20) + 40);
    }, 5000);

    // Monitorar nível de áudio
    const audioInterval = setInterval(() => {
      setAudioLevel(Math.floor(Math.random() * 100));
    }, 100);

    return () => {
      clearInterval(networkInterval);
      clearInterval(audioInterval);
    };
  };

  const analisarTextoComIA = (texto: string) => {
    // Simular análise de IA em tempo real
    if (texto.toLowerCase().includes('decisão') || texto.toLowerCase().includes('decidir')) {
      setDecisionsDetected(prev => [...prev, `Decisão detectada: ${texto.substring(0, 50)}...`]);
    }
    
    if (texto.toLowerCase().includes('problema') || texto.toLowerCase().includes('issue')) {
      setSentimentAnalysis('negative');
    } else if (texto.toLowerCase().includes('ótimo') || texto.toLowerCase().includes('excelente')) {
      setSentimentAnalysis('positive');
    }
    
    // Detectar tópicos-chave
    const topicos = ['ERP', 'implementação', 'cronograma', 'orçamento', 'equipe'];
    topicos.forEach(topico => {
      if (texto.toLowerCase().includes(topico.toLowerCase()) && !keyTopics.includes(topico)) {
        setKeyTopics(prev => [...prev, topico]);
      }
    });
  };

  const pararCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
  };

  const toggleVideo = () => {
    if (streamRef.current) {
      const videoTrack = streamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOn(videoTrack.enabled);
      }
    }
  };

  const toggleAudio = () => {
    if (streamRef.current) {
      const audioTrack = streamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioOn(audioTrack.enabled);
      }
    }
  };

  const toggleScreenShare = async () => {
    try {
      if (!isScreenSharing) {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true
        });
        setIsScreenSharing(true);
        
        // Substituir stream de vídeo
        if (videoRef.current) {
          videoRef.current.srcObject = screenStream;
        }
      } else {
        setIsScreenSharing(false);
        iniciarCamera(); // Voltar para câmera
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === 'NotAllowedError') {
        // Usuário negou permissão para compartilhar tela
        console.log('Usuário cancelou o compartilhamento de tela');
      } else {
        console.error('Erro ao compartilhar tela:', error);
      }
    }
  };

  const toggleRecording = async () => {
    if (!transcriptionServiceRef.current || !streamRef.current) return;

    if (isRecording) {
      // Parar gravação
      const transcricaoCompleta = await transcriptionServiceRef.current.stopTranscription();
      setIsRecording(false);
      
      // Gerar resumo avançado com IA
      if (transcricao) {
        const resumo = await transcriptionServiceRef.current.generateSummary(
          transcricao, 
          `Reunião Avançada ID: ${reuniaoId} com participantes: ${participantes.join(', ')}`
        );
        setResumoIA(resumo);
        
        // Atualizar reunião no contexto
        atualizarReuniao(reuniaoId, {
          status: 'realizada',
          transcricaoCompleta: transcricao,
          resumoIA: resumo,
          duracaoMinutos: Math.floor((Date.now() - Date.parse(new Date().toISOString())) / 60000),
          decisoes: decisionsDetected,
          tarefasGeradas: aiInsights
        });
      }
    } else {
      // Iniciar gravação
      await transcriptionServiceRef.current.startTranscription(streamRef.current);
      setIsRecording(true);
    }
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
    setIsFullscreen(!isFullscreen);
  };

  const enviarMensagem = () => {
    if (mensagemChat.trim()) {
      const novaMensagem = {
        id: Date.now().toString(),
        autor: 'Você',
        mensagem: mensagemChat,
        hora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      };
      setMensagensChat(prev => [...prev, novaMensagem]);
      setMensagemChat('');
    }
  };

  const encerrarReuniao = async () => {
    if (isRecording) {
      await toggleRecording();
    }
    pararCamera();
    onEncerrar();
  };

  const getNetworkIcon = () => {
    switch (networkQuality) {
      case 'excellent': return <Wifi className="w-4 h-4 text-green-400" />;
      case 'good': return <Wifi className="w-4 h-4 text-yellow-400" />;
      case 'poor': return <Wifi className="w-4 h-4 text-red-400" />;
    }
  };

  const getSentimentIcon = () => {
    switch (sentimentAnalysis) {
      case 'positive': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'neutral': return <Target className="w-4 h-4 text-blue-400" />;
      case 'negative': return <AlertTriangle className="w-4 h-4 text-red-400" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 z-50" style={{ minHeight: '100vh' }}>
      {/* Debug Info */}
      <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white p-2 rounded text-xs z-10">
        <div>Reunião Avançada: {reuniaoId}</div>
        <div>Participantes: {participantes.length}</div>
        <div>IA: {isRecording ? 'ATIVA' : 'INATIVA'}</div>
        <div>Qualidade: {networkQuality}</div>
      </div>
      
      {/* Header Avançado */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white p-4 flex items-center justify-between border-b border-gray-700">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-lg">Reunião Avançada</span>
              <p className="text-xs text-gray-300">ID: {reuniaoId}</p>
            </div>
          </div>
          
          {/* Status Indicators */}
          <div className="flex items-center space-x-4">
            {isRecording && (
              <div className="flex items-center space-x-2 bg-red-600 px-3 py-1 rounded-full animate-pulse">
                <Brain className="w-4 h-4" />
                <span className="text-sm font-medium">IA Ativa</span>
              </div>
            )}
            
            <div className="flex items-center space-x-2 bg-gray-700 px-3 py-1 rounded-full">
              {getNetworkIcon()}
              <span className="text-xs capitalize">{networkQuality}</span>
            </div>
            
            <div className="flex items-center space-x-2 bg-gray-700 px-3 py-1 rounded-full">
              {getSentimentIcon()}
              <span className="text-xs capitalize">{sentimentAnalysis}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-300">
            <span>{participantes.length} participantes</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode(viewMode === 'grid' ? 'speaker' : 'grid')}
              className="p-2 text-gray-300 hover:text-white transition-colors"
              title="Alternar layout"
            >
              {viewMode === 'grid' ? <Monitor className="w-5 h-5" /> : <Grid3X3 className="w-5 h-5" />}
            </button>
            
            <button
              onClick={toggleFullscreen}
              className="p-2 text-gray-300 hover:text-white transition-colors"
              title="Tela cheia"
            >
              <Maximize className="w-5 h-5" />
            </button>
            
            <button
              onClick={() => setShowSettings(true)}
              className="p-2 text-gray-300 hover:text-white transition-colors"
              title="Configurações"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex h-[calc(100vh-140px)]">
        {/* Video Principal */}
        <div className="flex-1 relative bg-gray-900">
          <div className="w-full h-full flex items-center justify-center">
            <video
              ref={videoRef}
              autoPlay
              muted
              className="w-full h-full object-cover"
            />
            
            {!isVideoOn && (
              <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                <div className="text-center text-white">
                  <VideoOff className="w-20 h-20 mx-auto mb-4 text-gray-400" />
                  <p className="text-lg">Câmera desligada</p>
                </div>
              </div>
            )}
            
            {isScreenSharing && (
              <div className="absolute top-4 left-4 bg-green-600 text-white px-3 py-1 rounded-full text-sm flex items-center space-x-2">
                <ScreenShare className="w-4 h-4" />
                <span>Compartilhando tela</span>
              </div>
            )}
          </div>

          {/* Grid de Participantes */}
          {viewMode === 'grid' && (
            <div className="absolute bottom-4 right-4 grid grid-cols-2 gap-2">
              {participantes.slice(1, 5).map((participante, index) => (
                <div key={index} className="w-40 h-30 bg-gray-700 rounded-lg flex items-center justify-center border-2 border-gray-600">
                  <div className="text-center text-white">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Users className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-medium">{participante}</p>
                    <div className="flex items-center justify-center space-x-1 mt-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-xs text-gray-300">Online</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Painel de IA em Tempo Real */}
          {transcricao && (
            <div className="absolute bottom-4 left-4 max-w-md bg-black bg-opacity-80 text-white p-4 rounded-xl border border-purple-500">
              <div className="flex items-center space-x-2 mb-3">
                <Brain className="w-5 h-5 text-purple-400" />
                <span className="text-sm font-bold">IA em Tempo Real</span>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                  <span className="text-xs text-purple-300">Analisando</span>
                </div>
              </div>
              
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-purple-300">Transcrição:</span>
                  <div className="max-h-20 overflow-y-auto bg-gray-800 p-2 rounded mt-1">
                    {transcricao.split('\n').slice(-2).map((linha, index) => (
                      <p key={index} className="text-xs text-gray-300">{linha}</p>
                    ))}
                  </div>
                </div>
                
                {keyTopics.length > 0 && (
                  <div>
                    <span className="text-blue-300">Tópicos:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {keyTopics.slice(0, 3).map((topico, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-600 rounded-full text-xs">
                          {topico}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {decisionsDetected.length > 0 && (
                  <div>
                    <span className="text-green-300">Decisões:</span>
                    <p className="text-xs text-green-200 mt-1">
                      {decisionsDetected.length} decisão(ões) detectada(s)
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Indicadores de Performance */}
          <div className="absolute top-4 right-4 bg-black bg-opacity-60 text-white p-3 rounded-lg">
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between space-x-3">
                <span>CPU:</span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 bg-gray-600 rounded-full h-1">
                    <div 
                      className={`h-1 rounded-full transition-all duration-300 ${
                        cpuUsage < 50 ? 'bg-green-400' : cpuUsage < 80 ? 'bg-yellow-400' : 'bg-red-400'
                      }`}
                      style={{ width: `${cpuUsage}%` }}
                    ></div>
                  </div>
                  <span>{cpuUsage}%</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between space-x-3">
                <span>RAM:</span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 bg-gray-600 rounded-full h-1">
                    <div 
                      className={`h-1 rounded-full transition-all duration-300 ${
                        memoryUsage < 60 ? 'bg-green-400' : memoryUsage < 85 ? 'bg-yellow-400' : 'bg-red-400'
                      }`}
                      style={{ width: `${memoryUsage}%` }}
                    ></div>
                  </div>
                  <span>{memoryUsage}%</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between space-x-3">
                <span>Áudio:</span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 bg-gray-600 rounded-full h-1">
                    <div 
                      className="bg-blue-400 h-1 rounded-full transition-all duration-100"
                      style={{ width: `${audioLevel}%` }}
                    ></div>
                  </div>
                  <Volume2 className="w-3 h-3" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar de Ferramentas */}
        <div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col">
          {/* Tabs de Ferramentas */}
          <div className="flex border-b border-gray-700">
            <button
              onClick={() => setShowChat(!showChat)}
              className={`flex-1 p-3 text-center transition-colors ${
                showChat ? 'bg-blue-600 text-white' : 'text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
            >
              <MessageSquare className="w-5 h-5 mx-auto mb-1" />
              <span className="text-xs">Chat</span>
            </button>
            
            <button
              onClick={() => setShowParticipants(!showParticipants)}
              className={`flex-1 p-3 text-center transition-colors ${
                showParticipants ? 'bg-blue-600 text-white' : 'text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
            >
              <Users className="w-5 h-5 mx-auto mb-1" />
              <span className="text-xs">Participantes</span>
            </button>
            
            <button
              onClick={() => setShowFerramentasColaborativas(!showFerramentasColaborativas)}
              className={`flex-1 p-3 text-center transition-colors ${
                showFerramentasColaborativas ? 'bg-blue-600 text-white' : 'text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
            >
              <Palette className="w-5 h-5 mx-auto mb-1" />
              <span className="text-xs">Ferramentas</span>
            </button>
          </div>

          {/* Conteúdo da Sidebar */}
          <div className="flex-1 overflow-y-auto">
            {showChat && (
              <div className="p-4">
                <h4 className="font-semibold text-white mb-3">Chat da Reunião</h4>
                <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                  {mensagensChat.map((msg) => (
                    <div key={msg.id} className="bg-gray-700 p-3 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-white">{msg.autor}</span>
                        <span className="text-xs text-gray-400">{msg.hora}</span>
                      </div>
                      <p className="text-sm text-gray-300">{msg.mensagem}</p>
                    </div>
                  ))}
                </div>
                
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={mensagemChat}
                    onChange={(e) => setMensagemChat(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && enviarMensagem()}
                    className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="Digite sua mensagem..."
                  />
                  <button
                    onClick={enviarMensagem}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Enviar
                  </button>
                </div>
              </div>
            )}

            {showParticipants && (
              <div className="p-4">
                <h4 className="font-semibold text-white mb-3">Participantes ({participantes.length})</h4>
                <div className="space-y-2">
                  {participantes.map((participante, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-700 p-3 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                          {participante.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{participante}</p>
                          <div className="flex items-center space-x-2 text-xs text-gray-400">
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            <span>Online</span>
                          </div>
                        </div>
                      </div>
                      
                      {index === 0 && (
                        <Crown className="w-4 h-4 text-yellow-400" title="Host" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {showFerramentasColaborativas && (
              <div className="p-4">
                <h4 className="font-semibold text-white mb-3">Ferramentas Colaborativas</h4>
                <div className="space-y-3">
                  <button
                    onClick={() => setShowWhiteboard(!showWhiteboard)}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white p-3 rounded-lg flex items-center space-x-2 hover:from-purple-700 hover:to-pink-700 transition-all duration-200"
                  >
                    <Palette className="w-5 h-5" />
                    <span>Lousa Digital</span>
                  </button>
                  
                  <button
                    onClick={() => setShowSalaVirtual(!showSalaVirtual)}
                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-3 rounded-lg flex items-center space-x-2 hover:from-blue-700 hover:to-cyan-700 transition-all duration-200"
                  >
                    <Monitor className="w-5 h-5" />
                    <span>Sala Virtual</span>
                  </button>
                  
                  <button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white p-3 rounded-lg flex items-center space-x-2 hover:from-green-700 hover:to-emerald-700 transition-all duration-200">
                    <Target className="w-5 h-5" />
                    <span>Enquetes</span>
                  </button>
                  
                  <button className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white p-3 rounded-lg flex items-center space-x-2 hover:from-orange-700 hover:to-red-700 transition-all duration-200">
                    <Users className="w-5 h-5" />
                    <span>Salas Simultâneas</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Painel de IA Insights */}
          {(keyTopics.length > 0 || decisionsDetected.length > 0 || aiInsights.length > 0) && (
            <div className="w-80 bg-gradient-to-b from-purple-900 to-blue-900 border-l border-purple-700 p-4 overflow-y-auto">
              <div className="flex items-center space-x-2 mb-4">
                <Brain className="w-6 h-6 text-purple-300" />
                <h4 className="font-bold text-white">Insights de IA</h4>
              </div>
              
              {keyTopics.length > 0 && (
                <div className="mb-4">
                  <h5 className="text-sm font-medium text-purple-200 mb-2">Tópicos Principais:</h5>
                  <div className="flex flex-wrap gap-2">
                    {keyTopics.map((topico, index) => (
                      <span key={index} className="px-2 py-1 bg-purple-600 rounded-full text-xs text-white">
                        {topico}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {decisionsDetected.length > 0 && (
                <div className="mb-4">
                  <h5 className="text-sm font-medium text-green-200 mb-2">Decisões Detectadas:</h5>
                  <div className="space-y-1">
                    {decisionsDetected.slice(-3).map((decisao, index) => (
                      <div key={index} className="bg-green-800 bg-opacity-50 p-2 rounded text-xs text-green-100">
                        {decisao}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="mb-4">
                <h5 className="text-sm font-medium text-blue-200 mb-2">Análise de Sentimento:</h5>
                <div className="flex items-center space-x-2">
                  {getSentimentIcon()}
                  <span className="text-sm text-white capitalize">{sentimentAnalysis}</span>
                  <div className="flex-1 bg-gray-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        sentimentAnalysis === 'positive' ? 'bg-green-400' :
                        sentimentAnalysis === 'neutral' ? 'bg-blue-400' : 'bg-red-400'
                      }`}
                      style={{ width: '75%' }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Barra de Controles Avançada */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-4 border-t border-gray-700">
        <div className="flex items-center justify-between">
          {/* Controles Principais */}
          <div className="flex items-center space-x-3">
            <button
              onClick={toggleAudio}
              className={`p-4 rounded-full transition-all duration-200 ${
                isAudioOn 
                  ? 'bg-gray-700 text-white hover:bg-gray-600 shadow-lg' 
                  : 'bg-red-600 text-white hover:bg-red-700 shadow-lg animate-pulse'
              }`}
            >
              {isAudioOn ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
            </button>
            
            <button
              onClick={toggleVideo}
              className={`p-4 rounded-full transition-all duration-200 ${
                isVideoOn 
                  ? 'bg-gray-700 text-white hover:bg-gray-600 shadow-lg' 
                  : 'bg-red-600 text-white hover:bg-red-700 shadow-lg animate-pulse'
              }`}
            >
              {isVideoOn ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
            </button>
            
            <button
              onClick={toggleScreenShare}
              className={`p-4 rounded-full transition-all duration-200 ${
                isScreenSharing 
                  ? 'bg-green-600 text-white hover:bg-green-700 shadow-lg' 
                  : 'bg-gray-700 text-white hover:bg-gray-600 shadow-lg'
              }`}
            >
              <ScreenShare className="w-6 h-6" />
            </button>
          </div>

          {/* Controles de IA */}
          <div className="flex items-center space-x-3">
            <button
              onClick={toggleRecording}
              className={`p-4 rounded-full transition-all duration-200 ${
                isRecording 
                  ? 'bg-gradient-to-r from-red-600 to-pink-600 text-white hover:from-red-700 hover:to-pink-700 shadow-lg animate-pulse' 
                  : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 shadow-lg'
              }`}
            >
              <Brain className="w-6 h-6" />
            </button>
            
            <div className="flex items-center space-x-2 bg-gray-700 px-4 py-2 rounded-full">
              <Brain className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-white">
                {isRecording ? 'IA Ativa' : 'IA Pronta'}
              </span>
            </div>
          </div>

          {/* Controles de Encerramento */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowSettings(true)}
              className="p-4 rounded-full bg-gray-700 text-white hover:bg-gray-600 transition-all duration-200 shadow-lg"
            >
              <Settings className="w-6 h-6" />
            </button>
            
            <button
              onClick={encerrarReuniao}
              className="p-4 rounded-full bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-lg"
            >
              <Phone className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Modais e Overlays */}
      
      {/* Resumo IA Modal */}
      {resumoIA && (
        <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Resumo Gerado por IA</h3>
                    <p className="text-sm text-gray-600">Análise completa da reunião</p>
                  </div>
                </div>
                <button
                  onClick={() => setResumoIA('')}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Target className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-blue-900">Tópicos Principais</span>
                  </div>
                  <div className="space-y-1">
                    {keyTopics.map((topico, index) => (
                      <span key={index} className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs mr-1 mb-1">
                        {topico}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-green-900">Decisões</span>
                  </div>
                  <p className="text-sm text-green-800">{decisionsDetected.length} decisões detectadas</p>
                </div>
                
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Brain className="w-5 h-5 text-purple-600" />
                    <span className="font-medium text-purple-900">Sentimento</span>
                  </div>
                  <p className="text-sm text-purple-800 capitalize">{sentimentAnalysis}</p>
                </div>
              </div>
              
              <div className="prose max-w-none">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">
                    {resumoIA}
                  </pre>
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setResumoIA('')}
                className="px-6 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Fechar
              </button>
              <button className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Download Completo</span>
              </button>
              <button className="px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 flex items-center space-x-2">
                <FileText className="w-4 h-4" />
                <span>Salvar Ata</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Ferramentas Colaborativas Modal */}
      {showFerramentasColaborativas && (
        <FerramentasColaborativas 
          reuniaoId={reuniaoId} 
          isHost={true}
        />
      )}

      {/* Sala Virtual Modal */}
      {showSalaVirtual && (
        <SalaReuniaoVirtual 
          reuniaoId={reuniaoId} 
          isHost={true}
          participantes={participantes}
        />
      )}

      {/* Configurações Avançadas Modal */}
      {showSettings && (
        <ConfiguracaoAvancada
          onSave={(config) => {
            console.log('Configurações salvas:', config);
            setShowSettings(false);
          }}
          onClose={() => setShowSettings(false)}
        />
      )}

      {/* Lousa Digital Overlay */}
      {showWhiteboard && (
        <div className="absolute inset-0 bg-white bg-opacity-95 flex flex-col">
          <div className="bg-gray-800 text-white p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Palette className="w-6 h-6 text-purple-400" />
              <h3 className="text-lg font-bold">Lousa Digital Colaborativa</h3>
            </div>
            <div className="flex items-center space-x-2">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                <Save className="w-4 h-4 inline mr-2" />
                Salvar
              </button>
              <button
                onClick={() => setShowWhiteboard(false)}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
          
          <div className="flex-1 relative">
            <canvas
              ref={canvasRef}
              className="w-full h-full border-2 border-dashed border-gray-300"
              style={{ cursor: 'crosshair' }}
            />
            
            <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-4">
              <div className="flex items-center space-x-2 mb-3">
                <span className="text-sm font-medium text-gray-700">Ferramentas:</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                <button className="p-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button className="p-2 bg-green-100 text-green-600 rounded hover:bg-green-200 transition-colors">
                  <Square className="w-4 h-4" />
                </button>
                <button className="p-2 bg-purple-100 text-purple-600 rounded hover:bg-purple-200 transition-colors">
                  <Circle className="w-4 h-4" />
                </button>
                <button className="p-2 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notificações de IA */}
      <div className="absolute top-20 right-4 space-y-2">
        {aiInsights.slice(-3).map((insight, index) => (
          <div key={index} className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-3 rounded-lg shadow-lg max-w-sm animate-fade-in">
            <div className="flex items-center space-x-2 mb-1">
              <Lightbulb className="w-4 h-4" />
              <span className="text-sm font-medium">Insight de IA</span>
            </div>
            <p className="text-sm">{insight}</p>
          </div>
        ))}
      </div>
    </div>
  );
}