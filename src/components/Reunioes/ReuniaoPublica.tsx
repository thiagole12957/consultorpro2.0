import React, { useState, useEffect } from 'react';
import { Video, Users, Lock, UserPlus, Building2, Briefcase, Mail, Phone } from 'lucide-react';
import { VideoConferencia } from './VideoConferencia';
import { VideoConferenciaAvancada } from './VideoConferenciaAvancada';

interface ReuniaoPublicaProps {
  reuniaoId: string;
}

interface DadosConvidado {
  nome: string;
  empresa: string;
  funcao: string;
  email: string;
  telefone: string;
}

export function ReuniaoPublica({ reuniaoId }: ReuniaoPublicaProps) {
  const [reuniao, setReuniao] = useState<any>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string>('');
  const [etapa, setEtapa] = useState<'verificacao' | 'senha' | 'dados-convidado' | 'reuniao'>('verificacao');
  const [senhaInformada, setSenhaInformada] = useState('');
  const [dadosConvidado, setDadosConvidado] = useState<DadosConvidado>({
    nome: '',
    empresa: '',
    funcao: '',
    email: '',
    telefone: ''
  });
  const [tipoReuniao, setTipoReuniao] = useState<'simples' | 'avancada'>('simples');

  useEffect(() => {
    verificarReuniao();
  }, [reuniaoId]);

  const verificarReuniao = async () => {
    setCarregando(true);
    setErro(''); // Limpar erro anterior
    
    try {
      // Simular busca da reunião
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Dados simulados da reunião
      const reuniaoData = {
        id: reuniaoId,
        objetivo: 'Reunião de Alinhamento do Projeto ERP',
        dataHoraInicio: new Date().toISOString(),
        dataHoraFim: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
        canal: 'online',
        linkLocal: window.location.href,
        responsavel: 'João Silva - Consultor',
        empresa: 'HD Soluções ISP',
        temSenha: false, // Por padrão sem senha - será verificado no banco
        senhaReuniao: '123456',
        participantesEsperados: 5,
        status: 'agendada',
        configuracoes: {
          permitirConvidados: true,
          moderacaoObrigatoria: false,
          gravacaoAutomatica: true,
          transcricaoIA: true
        }
      };
      
      // Buscar reunião real do contexto se disponível
      try {
        const reuniaoReal = JSON.parse(localStorage.getItem('reunioes') || '[]')
          .find((r: any) => r.id === reuniaoId);
      
        if (reuniaoReal) {
          reuniaoData.objetivo = reuniaoReal.objetivo;
          reuniaoData.responsavel = reuniaoReal.responsavel;
          reuniaoData.temSenha = reuniaoReal.configuracoes?.temSenha || false;
          reuniaoData.senhaReuniao = reuniaoReal.configuracoes?.senhaReuniao || '';
        }
      } catch (parseError) {
        console.log('Erro ao buscar reunião do localStorage, usando dados padrão');
      }
      
      setReuniao(reuniaoData);
      
      // Verificar se usuário está logado (simulação)
      try {
        const usuarioLogado = localStorage.getItem('usuario_logado');
      
        if (usuarioLogado) {
          // Usuário logado - entrar direto na reunião
          setEtapa('reuniao');
        } else if (reuniaoData.temSenha) {
          // Reunião com senha - pedir senha primeiro
          setEtapa('senha');
        } else {
          // Reunião sem senha - pedir dados do convidado
          setEtapa('dados-convidado');
        }
      } catch (storageError) {
        // Se houver erro no localStorage, assumir que não está logado
        if (reuniaoData.temSenha) {
          setEtapa('senha');
        } else {
          setEtapa('dados-convidado');
        }
      }
      
    } catch (error) {
      console.error('Erro ao verificar reunião:', error);
      setErro('Reunião não encontrada ou link inválido');
    } finally {
      setCarregando(false);
    }
  };

  const verificarSenha = () => {
    if (!reuniao) {
      setErro('Dados da reunião não carregados');
      return;
    }
    
    const senhaCorreta = reuniao.senhaReuniao?.trim() || '';
    const senhaDigitada = senhaInformada.trim();
    
    console.log('Verificando senha:', { senhaDigitada, senhaCorreta }); // Debug
    
    if (senhaDigitada === senhaCorreta) {
      setEtapa('dados-convidado');
      setErro(''); // Limpar erro anterior
    } else {
      setErro('Senha incorreta. Tente novamente.');
    }
  };

  const entrarComoConvidado = () => {
    if (!dadosConvidado.nome || !dadosConvidado.empresa || !dadosConvidado.funcao) {
      setErro('Preencha todos os campos obrigatórios');
      return;
    }
    
    setErro(''); // Limpar erro anterior
    
    // Salvar dados do convidado
    try {
      localStorage.setItem('convidado_reuniao', JSON.stringify({
        ...dadosConvidado,
        reuniaoId,
        dataEntrada: new Date().toISOString()
      }));
    } catch (storageError) {
      console.warn('Erro ao salvar dados do convidado:', storageError);
    }
    
    setEtapa('reuniao');
  };

  const sairReuniao = () => {
    try {
      localStorage.removeItem('convidado_reuniao');
    } catch (error) {
      console.warn('Erro ao limpar dados do convidado:', error);
    }
    window.close(); // Tentar fechar a aba
    // Se não conseguir fechar, redirecionar para página inicial
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = '/';
    }
  };

  if (carregando) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-8 text-center">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-white mb-2">Carregando reunião...</h2>
          <p className="text-blue-200">Verificando dados da reunião</p>
        </div>
      </div>
    );
  }

  if (erro && !reuniao) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-red-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 text-center max-w-md w-full">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Video className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Reunião não encontrada</h2>
          <p className="text-gray-600 mb-4">{erro}</p>
          <button
            onClick={() => window.location.href = '/'}
            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
          >
            Voltar ao Sistema
          </button>
        </div>
      </div>
    );
  }
  
  // Se não há reunião carregada ainda, mostrar loading
  if (!reuniao) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-8 text-center">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-white mb-2">Carregando reunião...</h2>
          <p className="text-blue-200">Verificando dados da reunião</p>
        </div>
      </div>
    );
  }

  if (etapa === 'reuniao') {
    const participantes = [
      dadosConvidado.nome || 'Usuário',
      'João Silva (Host)',
      'Maria Santos',
      'Carlos Oliveira'
    ];

    if (tipoReuniao === 'avancada') {
      return (
        <VideoConferenciaAvancada
          reuniaoId={reuniaoId}
          participantes={participantes}
          onEncerrar={sairReuniao}
        />
      );
    }

    return (
      <VideoConferencia
        reuniaoId={reuniaoId}
        participantes={participantes}
        onEncerrar={sairReuniao}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-2xl shadow-2xl w-full max-w-md border border-white border-opacity-30">
        {/* Header da Reunião */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-2xl p-6 text-white">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
              <Video className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Entrar na Reunião</h2>
              <p className="text-blue-100 text-sm">ConsultorPro</p>
            </div>
          </div>
          
          {reuniao && (
            <div className="space-y-2 text-sm text-blue-100">
              <p><strong>Reunião:</strong> {reuniao.objetivo}</p>
              <p><strong>Responsável:</strong> {reuniao.responsavel}</p>
              <p><strong>Empresa:</strong> {reuniao.empresa}</p>
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span>{reuniao.participantesEsperados} participantes esperados</span>
              </div>
            </div>
          )}
        </div>

        <div className="p-6">
          {/* Etapa: Verificação de Senha */}
          {etapa === 'senha' && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-8 h-8 text-yellow-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Reunião Protegida</h3>
                <p className="text-gray-600">Esta reunião requer senha para acesso</p>
                {reuniao.senhaReuniao && (
                  <p className="text-xs text-gray-500 mt-2">
                    Dica para teste: {reuniao.senhaReuniao}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Senha da Reunião
                </label>
                <input
                  type="password"
                  value={senhaInformada}
                  onChange={(e) => setSenhaInformada(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && verificarSenha()}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-lg tracking-widest"
                  placeholder="••••••"
                  maxLength={10}
                  autoFocus
                />
              </div>

              {erro && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-800">{erro}</p>
                </div>
              )}

              <button
                onClick={verificarSenha}
                disabled={!senhaInformada}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Verificar Senha
              </button>
            </div>
          )}

          {/* Etapa: Dados do Convidado */}
          {etapa === 'dados-convidado' && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <UserPlus className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Dados do Participante</h3>
                <p className="text-gray-600">Informe seus dados para entrar como convidado</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome Completo *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Users className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      required
                      value={dadosConvidado.nome}
                      onChange={(e) => setDadosConvidado(prev => ({ ...prev, nome: e.target.value }))}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Seu nome completo"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Empresa *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Building2 className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      required
                      value={dadosConvidado.empresa}
                      onChange={(e) => setDadosConvidado(prev => ({ ...prev, empresa: e.target.value }))}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Nome da sua empresa"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Função/Cargo *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Briefcase className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      required
                      value={dadosConvidado.funcao}
                      onChange={(e) => setDadosConvidado(prev => ({ ...prev, funcao: e.target.value }))}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Seu cargo ou função"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    E-mail (Opcional)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      value={dadosConvidado.email}
                      onChange={(e) => setDadosConvidado(prev => ({ ...prev, email: e.target.value }))}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="seu.email@empresa.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Telefone (Opcional)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      value={dadosConvidado.telefone}
                      onChange={(e) => setDadosConvidado(prev => ({ ...prev, telefone: e.target.value }))}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                </div>
              </div>

              {erro && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    <p className="text-sm text-red-800">{erro}</p>
                  </div>
                </div>
              )}

              {/* Seleção do Tipo de Reunião */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-3">Escolha o tipo de reunião:</h4>
                <div className="space-y-2">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="tipoReuniao"
                      value="simples"
                      checked={tipoReuniao === 'simples'}
                      onChange={(e) => setTipoReuniao(e.target.value as 'simples' | 'avancada')}
                      className="text-blue-600"
                    />
                    <div>
                      <span className="font-medium text-blue-900">Reunião Simples</span>
                      <p className="text-sm text-blue-700">Videoconferência básica com chat</p>
                    </div>
                  </label>
                  
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="tipoReuniao"
                      value="avancada"
                      checked={tipoReuniao === 'avancada'}
                      onChange={(e) => setTipoReuniao(e.target.value as 'simples' | 'avancada')}
                      className="text-blue-600"
                    />
                    <div>
                      <span className="font-medium text-blue-900">Reunião Avançada</span>
                      <p className="text-sm text-blue-700">Com IA, lousa digital e ferramentas colaborativas</p>
                    </div>
                  </label>
                </div>
              </div>

              <button
                onClick={entrarComoConvidado}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 focus:ring-4 focus:ring-green-500 focus:ring-opacity-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Entrar na Reunião
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 pb-6">
          <div className="text-center text-sm text-gray-500">
            <p>Powered by ConsultorPro</p>
            <p className="text-xs mt-1">Sistema de Gestão Empresarial</p>
          </div>
        </div>
      </div>
    </div>
  );
}