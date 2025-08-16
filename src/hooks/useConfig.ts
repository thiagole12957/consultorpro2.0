import { useState, useEffect } from 'react';
import { ConfigService } from '../services/configService';

// Hook para gerenciar configurações do sistema
export function useConfig() {
  const [configuracoes, setConfiguracoes] = useState({
    supabase: {
      url: '',
      anonKey: '',
      serviceRoleKey: '',
    },
    openai: {
      apiKey: '',
      model: 'gpt-4',
      maxTokens: 1000,
    },
    sistema: {
      nomeEmpresa: 'ConsultorPro',
      logoUrl: '',
      timezone: 'America/Sao_Paulo',
      idioma: 'pt-BR',
    },
    seguranca: {
      sessaoExpiraMinutos: 480,
      tentativasLoginMax: 5,
      logDetalhado: true,
    }
  });

  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    carregarConfiguracoes();
  }, []);

  const carregarConfiguracoes = () => {
    setCarregando(true);
    
    try {
      const configCarregadas = {
        supabase: {
          url: ConfigService.carregar('VITE_SUPABASE_URL', ''),
          anonKey: ConfigService.carregar('VITE_SUPABASE_ANON_KEY', ''),
          serviceRoleKey: ConfigService.carregar('VITE_SUPABASE_SERVICE_ROLE_KEY', ''),
        },
        openai: {
          apiKey: ConfigService.carregar('OPENAI_API_KEY', ''),
          model: ConfigService.carregar('OPENAI_MODEL', 'gpt-4'),
          maxTokens: ConfigService.carregar('OPENAI_MAX_TOKENS', 1000),
        },
        sistema: {
          nomeEmpresa: ConfigService.carregar('SISTEMA_NOME_EMPRESA', 'ConsultorPro'),
          logoUrl: ConfigService.carregar('SISTEMA_LOGO_URL', ''),
          timezone: ConfigService.carregar('SISTEMA_TIMEZONE', 'America/Sao_Paulo'),
          idioma: ConfigService.carregar('SISTEMA_IDIOMA', 'pt-BR'),
        },
        seguranca: {
          sessaoExpiraMinutos: ConfigService.carregar('SEGURANCA_SESSAO_EXPIRA', 480),
          tentativasLoginMax: ConfigService.carregar('SEGURANCA_TENTATIVAS_MAX', 5),
          logDetalhado: ConfigService.carregar('SEGURANCA_LOG_DETALHADO', true),
        }
      };
      
      setConfiguracoes(configCarregadas);
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
    } finally {
      setCarregando(false);
    }
  };

  const salvarConfiguracao = async (secao: string, dados: any) => {
    try {
      Object.entries(dados).forEach(([chave, valor]) => {
        const chaveCompleta = secao === 'supabase' ? `VITE_SUPABASE_${chave.toUpperCase()}` :
                             secao === 'openai' ? `OPENAI_${chave.toUpperCase()}` :
                             secao === 'sistema' ? `SISTEMA_${chave.toUpperCase()}` :
                             `SEGURANCA_${chave.toUpperCase()}`;
        
        ConfigService.salvar(chaveCompleta.replace('VITE_SUPABASE_ANONKEY', 'VITE_SUPABASE_ANON_KEY'), valor);
      });
      
      // Recarregar configurações
      carregarConfiguracoes();
      
      return true;
    } catch (error) {
      console.error('Erro ao salvar configuração:', error);
      return false;
    }
  };

  const testarConexoes = async () => {
    const resultados = {
      supabase: false,
      openai: false,
    };

    try {
      // Testar Supabase
      if (configuracoes.supabase.url && configuracoes.supabase.anonKey) {
        resultados.supabase = await ConfigService.testarSupabase(
          configuracoes.supabase.url,
          configuracoes.supabase.anonKey
        );
      }

      // Testar OpenAI
      if (configuracoes.openai.apiKey) {
        resultados.openai = await ConfigService.testarOpenAI(configuracoes.openai.apiKey);
      }
    } catch (error) {
      console.error('Erro ao testar conexões:', error);
    }

    return resultados;
  };

  const resetarConfiguracoes = () => {
    ConfigService.limparTodas();
    carregarConfiguracoes();
  };

  const exportarConfiguracoes = () => {
    return ConfigService.exportar();
  };

  const importarConfiguracoes = (configJson: string) => {
    try {
      ConfigService.importar(configJson);
      carregarConfiguracoes();
      return true;
    } catch (error) {
      console.error('Erro ao importar configurações:', error);
      return false;
    }
  };

  const validarConfiguracoes = () => {
    return ConfigService.validarConfiguracoes();
  };

  return {
    configuracoes,
    carregando,
    salvarConfiguracao,
    testarConexoes,
    resetarConfiguracoes,
    exportarConfiguracoes,
    importarConfiguracoes,
    validarConfiguracoes,
    carregarConfiguracoes,
  };
}