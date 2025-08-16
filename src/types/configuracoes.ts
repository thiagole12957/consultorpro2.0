// Tipos para configurações do sistema

export interface ConfiguracaoSupabase {
  url: string;
  anonKey: string;
  serviceRoleKey?: string;
}

export interface ConfiguracaoOpenAI {
  apiKey: string;
  model: 'gpt-4' | 'gpt-4-turbo' | 'gpt-3.5-turbo';
  maxTokens: number;
  temperature?: number;
}

export interface ConfiguracaoSistema {
  nomeEmpresa: string;
  logoUrl?: string;
  timezone: string;
  idioma: string;
  versao: string;
}

export interface ConfiguracaoSeguranca {
  sessaoExpiraMinutos: number;
  tentativasLoginMax: number;
  logDetalhado: boolean;
  criptografiaHabilitada: boolean;
  backupAutomatico: boolean;
}

export interface ConfiguracaoEmail {
  servidor: string;
  porta: number;
  usuario: string;
  senha: string;
  ssl: boolean;
  remetentePadrao: string;
}

export interface ConfiguracaoNotificacao {
  emailHabilitado: boolean;
  smsHabilitado: boolean;
  whatsappHabilitado: boolean;
  notificarErros: boolean;
  notificarVencimentos: boolean;
}

export interface ConfiguracaoBackup {
  automatico: boolean;
  frequencia: 'diario' | 'semanal' | 'mensal';
  manterBackups: number;
  incluirAnexos: boolean;
  criptografarBackup: boolean;
}

export interface ConfiguracaoIntegracao {
  webhookUrl?: string;
  apiExterna?: {
    url: string;
    token: string;
    ativa: boolean;
  };
  sincronizacaoAutomatica: boolean;
}