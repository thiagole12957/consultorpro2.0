// Serviço para gerenciar configurações do sistema

export class ConfigService {
  private static readonly CONFIG_PREFIX = 'CONSULTORPRO_CONFIG_';

  // Salvar configuração
  static salvar(chave: string, valor: any): void {
    try {
      const valorString = typeof valor === 'string' ? valor : JSON.stringify(valor);
      localStorage.setItem(this.CONFIG_PREFIX + chave, valorString);
    } catch (error) {
      console.error('Erro ao salvar configuração:', error);
      throw new Error('Não foi possível salvar a configuração');
    }
  }

  // Carregar configuração
  static carregar(chave: string, valorPadrao: any = null): any {
    try {
      const valor = localStorage.getItem(this.CONFIG_PREFIX + chave);
      if (valor === null) return valorPadrao;
      
      // Tentar fazer parse JSON, se falhar retornar como string
      try {
        return JSON.parse(valor);
      } catch {
        return valor;
      }
    } catch (error) {
      console.error('Erro ao carregar configuração:', error);
      return valorPadrao;
    }
  }

  // Remover configuração
  static remover(chave: string): void {
    localStorage.removeItem(this.CONFIG_PREFIX + chave);
  }

  // Limpar todas as configurações
  static limparTodas(): void {
    const keys = Object.keys(localStorage).filter(key => 
      key.startsWith(this.CONFIG_PREFIX)
    );
    keys.forEach(key => localStorage.removeItem(key));
  }

  // Exportar configurações
  static exportar(): string {
    const configuracoes: { [key: string]: any } = {};
    
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(this.CONFIG_PREFIX)) {
        const chaveConfig = key.replace(this.CONFIG_PREFIX, '');
        configuracoes[chaveConfig] = this.carregar(chaveConfig);
      }
    });
    
    return JSON.stringify(configuracoes, null, 2);
  }

  // Importar configurações
  static importar(configJson: string): void {
    try {
      const configuracoes = JSON.parse(configJson);
      
      Object.entries(configuracoes).forEach(([chave, valor]) => {
        this.salvar(chave, valor);
      });
    } catch (error) {
      console.error('Erro ao importar configurações:', error);
      throw new Error('Formato de configuração inválido');
    }
  }

  // Validar configurações obrigatórias
  static validarConfiguracoes(): { valido: boolean; erros: string[] } {
    const erros: string[] = [];
    
    // Validar Supabase
    const supabaseUrl = this.carregar('VITE_SUPABASE_URL');
    const supabaseKey = this.carregar('VITE_SUPABASE_ANON_KEY');
    
    if (!supabaseUrl) {
      erros.push('URL do Supabase não configurada');
    }
    
    if (!supabaseKey) {
      erros.push('Chave anônima do Supabase não configurada');
    }
    
    // Validar OpenAI (opcional para algumas funcionalidades)
    const openaiKey = this.carregar('OPENAI_API_KEY');
    if (!openaiKey) {
      erros.push('Chave da OpenAI não configurada (funcionalidades de IA não funcionarão)');
    }
    
    return {
      valido: erros.length === 0,
      erros
    };
  }

  // Testar conexão com Supabase
  static async testarSupabase(url: string, anonKey: string): Promise<boolean> {
    try {
      const response = await fetch(`${url}/rest/v1/`, {
        headers: {
          'apikey': anonKey,
          'Authorization': `Bearer ${anonKey}`
        }
      });
      
      return response.status === 200;
    } catch (error) {
      console.error('Erro ao testar Supabase:', error);
      return false;
    }
  }

  // Testar conexão com OpenAI
  static async testarOpenAI(apiKey: string): Promise<boolean> {
    try {
      const response = await fetch('https://api.openai.com/v1/models', {
        headers: {
          'Authorization': `Bearer ${apiKey}`
        }
      });
      
      return response.status === 200;
    } catch (error) {
      console.error('Erro ao testar OpenAI:', error);
      return false;
    }
  }

  // Configurações específicas para desenvolvimento
  static configurarDesenvolvimento(): void {
    // Configurações padrão para desenvolvimento local
    this.salvar('SISTEMA_NOME_EMPRESA', 'ConsultorPro - Desenvolvimento');
    this.salvar('SISTEMA_TIMEZONE', 'America/Sao_Paulo');
    this.salvar('SISTEMA_IDIOMA', 'pt-BR');
    this.salvar('SEGURANCA_SESSAO_EXPIRA', '480');
    this.salvar('SEGURANCA_TENTATIVAS_MAX', '5');
    this.salvar('SEGURANCA_LOG_DETALHADO', 'true');
  }

  // Configurações específicas para produção
  static configurarProducao(): void {
    // Configurações mais restritivas para produção
    this.salvar('SEGURANCA_SESSAO_EXPIRA', '240'); // 4 horas
    this.salvar('SEGURANCA_TENTATIVAS_MAX', '3');
    this.salvar('SEGURANCA_LOG_DETALHADO', 'true');
  }
}