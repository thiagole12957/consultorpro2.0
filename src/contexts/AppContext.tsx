import React, { useState } from 'react';
import { 
  Palette, Type, Square, Circle, ArrowRight, Eraser, Save, Download,
  Upload, Share2, Users, MessageSquare, FileText, Image, Video,
  Mic, Camera, Monitor, Grid3X3, Layers, Zap, Brain, Target,
  Clock, Calendar, Star, Bookmark, Tag, Hash, Eye, Lock,
  RefreshCw, RotateCcw, Move, Copy, Trash2, Edit2, Plus
} from 'lucide-react';

interface FerramentasColaborativasProps {
  reuniaoId: string;
  isHost: boolean;
}

export function FerramentasColaborativas({ reuniaoId, isHost }: FerramentasColaborativasProps) {
  const [activeTab, setActiveTab] = useState<'whiteboard' | 'documents' | 'polls' | 'breakout' | 'ai-tools'>('whiteboard');
  
  // Estados da Lousa Digital
  const [whiteboardMode, setWhiteboardMode] = useState<'draw' | 'present' | 'collaborate'>('draw');
  const [selectedTemplate, setSelectedTemplate] = useState('blank');
  const [whiteboardLayers, setWhiteboardLayers] = useState([
    { id: '1', name: 'Camada Principal', visible: true, locked: false },
    { id: '2', name: 'Anotações', visible: true, locked: false }
  ]);
  
  // Estados de Documentos
  const [documentosCompartilhados, setDocumentosCompartilhados] = useState([
    { id: '1', nome: 'Apresentação.pptx', tipo: 'presentation', tamanho: '2.5 MB', autor: 'João Silva' },
    { id: '2', nome: 'Relatório.pdf', tipo: 'document', tamanho: '1.8 MB', autor: 'Maria Santos' }
  ]);
  
  // Estados de Enquetes
  const [enquetes, setEnquetes] = useState([
    {
      id: '1',
      pergunta: 'Qual a prioridade para o próximo trimestre?',
      opcoes: ['Crescimento', 'Eficiência', 'Inovação', 'Qualidade'],
      votos: [3, 2, 5, 1],
      ativa: true
    }
  ]);
  
  // Estados de Salas Simultâneas
  const [salasSimultaneas, setSalasSimultaneas] = useState([
    { id: '1', nome: 'Equipe Técnica', participantes: 4, ativa: true },
    { id: '2', nome: 'Equipe Comercial', participantes: 3, ativa: true }
  ]);

  const templates = [
    { id: 'blank', nome: 'Em Branco', preview: '⬜' },
    { id: 'grid', nome: 'Grade', preview: '⊞' },
    { id: 'kanban', nome: 'Kanban', preview: '📋' },
    { id: 'flowchart', nome: 'Fluxograma', preview: '🔄' },
    { id: 'mindmap', nome: 'Mapa Mental', preview: '🧠' },
    { id: 'timeline', nome: 'Linha do Tempo', preview: '📅' }
  ];

  const renderWhiteboard = () => (
    <div className="space-y-4">
      {/* Toolbar da Lousa */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <h4 className="font-semibold text-gray-900">Lousa Digital Colaborativa</h4>
            <div className="flex space-x-1">
              <button
                onClick={() => setWhiteboardMode('draw')}
                className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                  whiteboardMode === 'draw' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
                }`}
              >
                Desenhar
              </button>
              <button
                onClick={() => setWhiteboardMode('present')}
                className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                  whiteboardMode === 'present' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
                }`}
              >
                Apresentar
              </button>
              <button
                onClick={() => setWhiteboardMode('collaborate')}
                className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                  whiteboardMode === 'collaborate' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
                }`}
              >
                Colaborar
              </button>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
              <Save className="w-4 h-4" />
            </button>
            <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
              <Download className="w-4 h-4" />
            </button>
            <button className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        {/* Templates */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Templates:</label>
          <div className="flex space-x-2">
            {templates.map(template => (
              <button
                key={template.id}
                onClick={() => setSelectedTemplate(template.id)}
                className={`px-3 py-2 rounded-lg text-sm transition-colors flex items-center space-x-2 ${
                  selectedTemplate === template.id 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span>{template.preview}</span>
                <span>{template.nome}</span>
              </button>
            ))}
          </div>
        </div>
        
        {/* Camadas */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Camadas:</label>
          <div className="space-y-2">
            {whiteboardLayers.map(layer => (
              <div key={layer.id} className="flex items-center justify-between bg-white p-2 rounded border">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setWhiteboardLayers(prev => 
                      prev.map(l => l.id === layer.id ? { ...l, visible: !l.visible } : l)
                    )}
                    className={`p-1 rounded ${layer.visible ? 'text-blue-600' : 'text-gray-400'}`}
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <span className="text-sm">{layer.name}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => setWhiteboardLayers(prev => 
                      prev.map(l => l.id === layer.id ? { ...l, locked: !l.locked } : l)
                    )}
                    className={`p-1 rounded ${layer.locked ? 'text-red-600' : 'text-gray-400'}`}
                  >
                    <Lock className="w-4 h-4" />
                  </button>
                  <button className="p-1 text-gray-400 hover:text-gray-600 rounded">
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderDocuments = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-gray-900">Documentos Compartilhados</h4>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors">
          <Upload className="w-4 h-4" />
          <span>Upload</span>
        </button>
      </div>
      
      <div className="space-y-3">
        {documentosCompartilhados.map(doc => (
          <div key={doc.id} className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{doc.nome}</p>
                  <p className="text-sm text-gray-500">{doc.tamanho} • Por {doc.autor}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                  <Eye className="w-4 h-4" />
                </button>
                <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                  <Download className="w-4 h-4" />
                </button>
                <button className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPolls = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-gray-900">Enquetes e Votações</h4>
        <button className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-700 transition-colors">
          <Plus className="w-4 h-4" />
          <span>Nova Enquete</span>
        </button>
      </div>
      
      <div className="space-y-4">
        {enquetes.map(enquete => (
          <div key={enquete.id} className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h5 className="font-medium text-gray-900">{enquete.pergunta}</h5>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                enquete.ativa ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
              }`}>
                {enquete.ativa ? 'Ativa' : 'Encerrada'}
              </span>
            </div>
            
            <div className="space-y-2">
              {enquete.opcoes.map((opcao, index) => {
                const totalVotos = enquete.votos.reduce((sum, v) => sum + v, 0);
                const percentual = totalVotos > 0 ? (enquete.votos[index] / totalVotos) * 100 : 0;
                
                return (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex-1 mr-4">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-700">{opcao}</span>
                        <span className="text-sm font-medium text-gray-900">
                          {enquete.votos[index]} ({percentual.toFixed(1)}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${percentual}%` }}
                        ></div>
                      </div>
                    </div>
                    {enquete.ativa && (
                      <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors">
                        Votar
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderBreakoutRooms = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-gray-900">Salas Simultâneas</h4>
        <button className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-purple-700 transition-colors">
          <Plus className="w-4 h-4" />
          <span>Criar Sala</span>
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {salasSimultaneas.map(sala => (
          <div key={sala.id} className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{sala.nome}</p>
                  <p className="text-sm text-gray-500">{sala.participantes} participantes</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                sala.ativa ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
              }`}>
                {sala.ativa ? 'Ativa' : 'Inativa'}
              </span>
            </div>
            
            <div className="flex space-x-2">
              <button className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors">
                Entrar
              </button>
              <button className="flex-1 bg-gray-600 text-white py-2 rounded-lg text-sm hover:bg-gray-700 transition-colors">
                Monitorar
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-2">
          <Users className="w-5 h-5 text-blue-600" />
          <span className="font-medium text-blue-900">Configurações de Salas</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span>Criação automática</span>
              <input type="checkbox" className="rounded" />
            </div>
            <div className="flex items-center justify-between">
              <span>Rotação automática</span>
              <input type="checkbox" className="rounded" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span>Tempo limite</span>
              <select className="px-2 py-1 border rounded text-xs">
                <option>15 min</option>
                <option>30 min</option>
                <option>60 min</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <span>Máx. participantes</span>
              <select className="px-2 py-1 border rounded text-xs">
                <option>4</option>
                <option>6</option>
                <option>8</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAITools = () => (
    <div className="space-y-4">
      <h4 className="font-semibold text-gray-900 flex items-center space-x-2">
        <Brain className="w-5 h-5 text-purple-600" />
        <span>Ferramentas de IA</span>
      </h4>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h5 className="font-medium text-gray-900">Transcrição Inteligente</h5>
              <p className="text-sm text-gray-600">OpenAI Whisper</p>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Idioma detectado:</span>
              <span className="font-medium">Português (BR)</span>
            </div>
            <div className="flex justify-between">
              <span>Confiança:</span>
              <span className="font-medium text-green-600">98.5%</span>
            </div>
            <div className="flex justify-between">
              <span>Palavras transcritas:</span>
              <span className="font-medium">1,247</span>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h5 className="font-medium text-gray-900">Análise de Sentimento</h5>
              <p className="text-sm text-gray-600">GPT-4 Analysis</p>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Sentimento geral:</span>
              <span className="font-medium text-green-600">Positivo</span>
            </div>
            <div className="flex justify-between">
              <span>Engajamento:</span>
              <span className="font-medium text-blue-600">Alto</span>
            </div>
            <div className="flex justify-between">
              <span>Decisões identificadas:</span>
              <span className="font-medium">7</span>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h5 className="font-medium text-gray-900">Insights Automáticos</h5>
              <p className="text-sm text-gray-600">Machine Learning</p>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <div className="bg-white p-2 rounded border-l-4 border-orange-500">
              <p className="text-orange-800">Tópico mais discutido: Implementação ERP</p>
            </div>
            <div className="bg-white p-2 rounded border-l-4 border-blue-500">
              <p className="text-blue-800">Próximo passo sugerido: Definir cronograma</p>
            </div>
            <div className="bg-white p-2 rounded border-l-4 border-green-500">
              <p className="text-green-800">Consenso alcançado: Orçamento aprovado</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg p-4">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h5 className="font-medium text-gray-900">Geração de Atas</h5>
              <p className="text-sm text-gray-600">Automática</p>
            </div>
          </div>
          <div className="space-y-2">
            <button className="w-full bg-indigo-600 text-white py-2 rounded-lg text-sm hover:bg-indigo-700 transition-colors">
              Gerar Ata Automática
            </button>
            <button className="w-full bg-white border border-indigo-300 text-indigo-600 py-2 rounded-lg text-sm hover:bg-indigo-50 transition-colors">
              Personalizar Template
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6">
          <button
            onClick={() => setActiveTab('whiteboard')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'whiteboard'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Palette className="w-4 h-4" />
              <span>Lousa Digital</span>
            </div>
          </button>
          
          <button
            onClick={() => setActiveTab('documents')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'documents'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>Documentos</span>
            </div>
          </button>
          
          <button
            onClick={() => setActiveTab('polls')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'polls'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Target className="w-4 h-4" />
              <span>Enquetes</span>
            </div>
          </button>
          
          <button
            onClick={() => setActiveTab('breakout')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'breakout'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>Salas Simultâneas</span>
            </div>
          </button>
          
          <button
            onClick={() => setActiveTab('ai-tools')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'ai-tools'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Brain className="w-4 h-4" />
              <span>IA Tools</span>
            </div>
          </button>
        </nav>
      </div>

      <div className="p-6">
        {activeTab === 'whiteboard' && renderWhiteboard()}
        {activeTab === 'documents' && renderDocuments()}
        {activeTab === 'polls' && renderPolls()}
        {activeTab === 'breakout' && renderBreakoutRooms()}
        {activeTab === 'ai-tools' && renderAITools()}
      </div>
    </div>
  );
}