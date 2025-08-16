import React, { useState, useEffect, useRef } from 'react';
import { Video, VideoOff, Mic, MicOff, Phone, Users, MessageSquare, Settings, Monitor, Grid3X3, Maximize, Volume2, VolumeX, SwordIcon as Record, Brain, FileText } from 'lucide-react';
import { TranscriptionService } from '../../services/transcriptionService';
import { useApp } from '../../contexts/AppContext';

interface VideoConferenciaProps {
  reuniaoId: string;
  participantes: string[];
  onEncerrar: () => void;
}

export function VideoConferencia({ reuniaoId, participantes, onEncerrar }: VideoConferenciaProps) {
  const { atualizarReuniao } = useApp();
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [transcricao, setTranscricao] = useState('');
  const [resumoIA, setResumoIA] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'speaker' | 'sidebar'>('grid');
  const [mensagemChat, setMensagemChat] = useState('');
  const [mensagensChat, setMensagensChat] = useState<Array<{id: string, autor: string, mensagem: string, hora: string}>>([]);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const transcriptionServiceRef = useRef<TranscriptionService | null>(null);

  useEffect(() => {
    iniciarCamera();
    return () => {
      pararCamera();
    };
  }, []);

  const iniciarCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      // Inicializar serviço de transcrição
      transcriptionServiceRef.current = new TranscriptionService((texto) => {
        setTranscricao(prev => prev + '\n' + texto);
      });

    } catch (error) {
      console.error('Erro ao acessar câmera:', error);
    }
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

  const toggleRecording = async () => {
    if (!transcriptionServiceRef.current || !streamRef.current) return;

    if (isRecording) {
      // Parar gravação
      const transcricaoCompleta = await transcriptionServiceRef.current.stopTranscription();
      setIsRecording(false);
      
      // Gerar resumo com IA
      if (transcricao) {
        const resumo = await transcriptionServiceRef.current.generateSummary(
          transcricao, 
          `Reunião ID: ${reuniaoId} com participantes: ${participantes.join(', ')}`
        );
        setResumoIA(resumo);
        
        // Atualizar reunião no contexto
        atualizarReuniao(reuniaoId, {
          status: 'realizada',
          transcricaoCompleta: transcricao,
          resumoIA: resumo,
          duracaoMinutos: Math.floor((Date.now() - Date.parse(new Date().toISOString())) / 60000)
        });
      }
    } else {
      // Iniciar gravação
      await transcriptionServiceRef.current.startTranscription(streamRef.current);
      setIsRecording(true);
    }
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

  return (
    <div className="fixed inset-0 bg-gray-900 z-50">
      {/* Header */}
      <div className="bg-gray-800 text-white p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Video className="w-5 h-5 text-blue-400" />
            <span className="font-semibold">Reunião ID: {reuniaoId}</span>
          </div>
          {isRecording && (
            <div className="flex items-center space-x-2 text-red-400">
              <Record className="w-4 h-4 animate-pulse" />
              <span className="text-sm">Gravando com IA</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-300">{participantes.length} participantes</span>
          <button
            onClick={() => setViewMode(viewMode === 'grid' ? 'speaker' : 'grid')}
            className="p-2 text-gray-300 hover:text-white transition-colors"
          >
            {viewMode === 'grid' ? <Monitor className="w-5 h-5" /> : <Grid3X3 className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-80px)]">
        {/* Video Area */}
        <div className="flex-1 relative bg-gray-900">
          {/* Main Video */}
          <div className="w-full h-full flex items-center justify-center">
            <video
              ref={videoRef}
              autoPlay
              muted
              className="w-full h-full object-cover rounded-lg"
            />
            
            {!isVideoOn && (
              <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                <div className="text-center text-white">
                  <VideoOff className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <p>Câmera desligada</p>
                </div>
              </div>
            )}
          </div>

          {/* Participants Grid (quando em modo grid) */}
          {viewMode === 'grid' && (
            <div className="absolute bottom-4 right-4 grid grid-cols-2 gap-2">
              {participantes.slice(1, 5).map((participante, index) => (
                <div key={index} className="w-32 h-24 bg-gray-700 rounded-lg flex items-center justify-center">
                  <div className="text-center text-white">
                    <Users className="w-6 h-6 mx-auto mb-1 text-gray-400" />
                    <p className="text-xs">{participante}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Transcrição em tempo real */}
          {transcricao && (
            <div className="absolute bottom-4 left-4 max-w-md bg-black bg-opacity-70 text-white p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Brain className="w-4 h-4 text-purple-400" />
                <span className="text-sm font-medium">Transcrição IA</span>
              </div>
              <div className="text-sm max-h-32 overflow-y-auto">
                {transcricao.split('\n').slice(-3).map((linha, index) => (
                  <p key={index} className="mb-1">{linha}</p>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Chat Sidebar */}
        {showChat && (
          <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">Chat da Reunião</h3>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {mensagensChat.map((msg) => (
                <div key={msg.id} className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-900">{msg.autor}</span>
                    <span className="text-xs text-gray-500">{msg.hora}</span>
                  </div>
                  <p className="text-sm text-gray-700">{msg.mensagem}</p>
                </div>
              ))}
            </div>
            
            <div className="p-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={mensagemChat}
                  onChange={(e) => setMensagemChat(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && enviarMensagem()}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="Digite sua mensagem..."
                />
                <button
                  onClick={enviarMensagem}
                  className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Enviar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
        <div className="bg-gray-800 rounded-full px-6 py-3 flex items-center space-x-4">
          <button
            onClick={toggleAudio}
            className={`p-3 rounded-full transition-colors ${
              isAudioOn ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-red-600 text-white hover:bg-red-700'
            }`}
          >
            {isAudioOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
          </button>
          
          <button
            onClick={toggleVideo}
            className={`p-3 rounded-full transition-colors ${
              isVideoOn ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-red-600 text-white hover:bg-red-700'
            }`}
          >
            {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
          </button>
          
          <button
            onClick={toggleRecording}
            className={`p-3 rounded-full transition-colors ${
              isRecording ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-gray-700 text-white hover:bg-gray-600'
            }`}
          >
            <Brain className="w-5 h-5" />
          </button>
          
          <button
            onClick={() => setShowChat(!showChat)}
            className="p-3 rounded-full bg-gray-700 text-white hover:bg-gray-600 transition-colors"
          >
            <MessageSquare className="w-5 h-5" />
          </button>
          
          <button
            onClick={encerrarReuniao}
            className="p-3 rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors"
          >
            <Phone className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Resumo IA Modal */}
      {resumoIA && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center space-x-2">
                <Brain className="w-6 h-6 text-purple-600" />
                <h3 className="text-xl font-semibold text-gray-900">Resumo Gerado por IA</h3>
              </div>
            </div>
            <div className="p-6">
              <div className="prose max-w-none">
                <pre className="whitespace-pre-wrap text-sm text-gray-700 bg-gray-50 p-4 rounded-lg">
                  {resumoIA}
                </pre>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setResumoIA('')}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Fechar
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
                <FileText className="w-4 h-4" />
                <span>Salvar Resumo</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}