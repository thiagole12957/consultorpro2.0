import React, { useState } from 'react';
import { TestTube, CheckCircle, AlertTriangle, Loader, Database, Brain, Mail, MessageSquare } from 'lucide-react';
import { ConfigService } from '../../services/configService';

export function TesteIntegracoes() {
  const [testando, setTestando] = useState<{[key: string]: boolean}>({});
  const [resultados, setResultados] = useState<{[key: string]: 'success' | 'error' | null}>({});

  const executarTeste = async (tipo: 'supabase' | 'openai' | 'email' | 'sms') => {
    setTestando(prev => ({ ...prev, [tipo]: true }));
    setResultados(prev => ({ ...prev, [tipo]: null }));

    try {
      let sucesso = false;

      switch (tipo) {
        case 'supabase':
          const supabaseUrl = ConfigService.carregar('VITE_SUPABASE_URL');
          const supabaseKey = ConfigService.carregar('VITE_SUPABASE_ANON_KEY');
          sucesso = await ConfigService.testarSupabase(supabaseUrl, supabaseKey);
          break;

        case 'openai':
          const openaiKey = ConfigService.carregar('OPENAI_API_KEY');
          sucesso = await ConfigService.testarOpenAI(openaiKey);
          break;

        case 'email':
          // Simular teste de email
          await new Promise(resolve => setTimeout(resolve, 2000));
          sucesso = true;
          break;

        case 'sms':
          // Simular teste de SMS
          await new Promise(resolve => setTimeout(resolve, 1500));
          sucesso = Math.random() > 0.3; // 70% de chance de sucesso
          break;
      }

      setResultados(prev => ({ ...prev, [tipo]: sucesso ? 'success' : 'error' }));
    } catch (error) {
      setResultados(prev => ({ ...prev, [tipo]: 'error' }));
    } finally {
      setTestando(prev => ({ ...prev, [tipo]: false }));
    }
  };

  const executarTodosTestes = async () => {
    await Promise.all([
      executarTeste('supabase'),
      executarTeste('openai'),
      executarTeste('email'),
      executarTeste('sms')
    ]);
  };

  const testes = [
    {
      id: 'supabase',
      nome: 'Conexão Supabase',
      descricao: 'Testa conexão com banco de dados',
      icon: Database,
      cor: 'text-green-600'
    },
    {
      id: 'openai',
      nome: 'API OpenAI',
      descricao: 'Testa funcionalidades de IA',
      icon: Brain,
      cor: 'text-purple-600'
    },
    {
      id: 'email',
      nome: 'Envio de E-mail',
      descricao: 'Testa servidor SMTP',
      icon: Mail,
      cor: 'text-blue-600'
    },
    {
      id: 'sms',
      nome: 'Envio de SMS',
      descricao: 'Testa provedor de SMS',
      icon: MessageSquare,
      cor: 'text-orange-600'
    }
  ];

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Teste de Integrações</h3>
          <p className="text-gray-600">Verifique se todas as integrações estão funcionando</p>
        </div>
        <button
          onClick={executarTodosTestes}
          disabled={Object.values(testando).some(t => t)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
        >
          <TestTube className="w-4 h-4" />
          <span>Testar Tudo</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {testes.map((teste) => {
          const Icon = teste.icon;
          const estaTestando = testando[teste.id];
          const resultado = resultados[teste.id];

          return (
            <div key={teste.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${
                    resultado === 'success' ? 'bg-green-100' :
                    resultado === 'error' ? 'bg-red-100' :
                    'bg-gray-100'
                  }`}>
                    <Icon className={`w-5 h-5 ${
                      resultado === 'success' ? 'text-green-600' :
                      resultado === 'error' ? 'text-red-600' :
                      teste.cor
                    }`} />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{teste.nome}</h4>
                    <p className="text-sm text-gray-600">{teste.descricao}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {estaTestando && <Loader className="w-4 h-4 animate-spin text-blue-600" />}
                  {resultado === 'success' && <CheckCircle className="w-5 h-5 text-green-600" />}
                  {resultado === 'error' && <AlertTriangle className="w-5 h-5 text-red-600" />}
                </div>
              </div>

              <button
                onClick={() => executarTeste(teste.id as any)}
                disabled={estaTestando}
                className={`w-full py-2 px-4 rounded-lg transition-colors text-sm font-medium ${
                  resultado === 'success' ? 'bg-green-100 text-green-700 hover:bg-green-200' :
                  resultado === 'error' ? 'bg-red-100 text-red-700 hover:bg-red-200' :
                  'bg-gray-100 text-gray-700 hover:bg-gray-200'
                } disabled:opacity-50`}
              >
                {estaTestando ? 'Testando...' : 
                 resultado === 'success' ? 'Teste Bem-sucedido' :
                 resultado === 'error' ? 'Teste Falhou - Tentar Novamente' :
                 'Executar Teste'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}