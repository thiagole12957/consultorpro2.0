// Tipos para sistema de régua de cobrança automática

export interface RegraCobranca {
  id: string;
  empresaId: string;
  filialId: string;
  carteiraCobrancaId: string;
  nome: string;
  descricao: string;
  ativa: boolean;
  configuracoes: {
    diasAntesVencimento: number[];
    diasAposVencimento: number[];
    horarioEnvio: string; // HH:MM
    diasSemana: number[]; // 0-6 (domingo a sábado)
    pausarFinaisSemana: boolean;
    pausarFeriados: boolean;
  };
  canais: CanalCobranca[];
  condicoes: CondicaoCobranca;
  criadoEm: string;
  atualizadoEm: string;
}

export interface CanalCobranca {
  id: string;
  tipo: 'email' | 'sms' | 'whatsapp_oficial' | 'whatsapp_web';
  ativo: boolean;
  configuracao: ConfiguracaoCanal;
  templates: TemplateCobranca[];
}

export interface ConfiguracaoCanal {
  // Email
  remetente?: string;
  nomeRemetente?: string;
  
  // SMS
  provedor?: 'twilio' | 'zenvia' | 'totalvoice';
  apiKey?: string;
  
  // WhatsApp Oficial
  numeroTelefone?: string;
  tokenApi?: string;
  
  // WhatsApp Web
  sessaoId?: string;
  qrCode?: string;
  conectado?: boolean;
  deviceName?: string;
  lastSeen?: string;
  batteryLevel?: number;
}

export interface TemplateCobranca {
  id: string;
  nome: string;
  canal: 'email' | 'sms' | 'whatsapp_oficial' | 'whatsapp_web';
  tipo: 'pre_lembrete' | 'vencimento' | 'pos_vencimento';
  diasTrigger: number; // Negativo para antes, positivo para depois
  assunto?: string; // Para email
  conteudo: string;
  variaveis: string[]; // {{nomeCliente}}, {{valorFatura}}, etc.
  ativo: boolean;
}

export interface CondicaoCobranca {
  valorMinimo?: number;
  valorMaximo?: number;
  clientesEspecificos?: string[];
  segmentosCliente?: string[];
  statusContrato?: string[];
  excluirClientes?: string[];
}

export interface HistoricoCobranca {
  id: string;
  faturaId: string;
  regraCobrancaId: string;
  canalUtilizado: string;
  templateUtilizado: string;
  dataEnvio: string;
  status: 'enviado' | 'entregue' | 'lido' | 'erro';
  tentativas: number;
  observacoes?: string;
}

export interface LogCobranca {
  id: string;
  regraCobrancaId: string;
  dataExecucao: string;
  faturasProcessadas: number;
  enviosRealizados: number;
  sucessos: number;
  erros: number;
  detalhes: string;
}