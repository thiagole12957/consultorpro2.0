// Tipos para sistema de agenda

export interface EventoAgenda {
  id: string;
  usuarioId: string;
  titulo: string;
  descricao?: string;
  dataInicio: string;
  dataFim: string;
  tipoEvento: 'reuniao' | 'compromisso' | 'tarefa' | 'lembrete' | 'feriado';
  prioridade: 'baixa' | 'media' | 'alta' | 'urgente';
  status: 'agendado' | 'confirmado' | 'realizado' | 'cancelado' | 'adiado';
  local?: string;
  participantes?: string[];
  notificacoes: NotificacaoEvento[];
  recorrencia?: RecorrenciaEvento;
  reuniaoId?: string; // Link com reunião do sistema
  clienteId?: string;
  cor: string;
  categoria: string;
  anexos?: string[];
  observacoes?: string;
  criadoEm: string;
  atualizadoEm: string;
}

export interface NotificacaoEvento {
  id: string;
  tipo: 'email' | 'popup' | 'push';
  antecedenciaMinutos: number;
  ativa: boolean;
  enviada?: boolean;
  dataEnvio?: string;
}

export interface RecorrenciaEvento {
  tipo: 'diario' | 'semanal' | 'mensal' | 'anual';
  intervalo: number; // A cada X dias/semanas/meses/anos
  diasSemana?: number[]; // Para recorrência semanal (0=domingo, 1=segunda, etc.)
  diaMes?: number; // Para recorrência mensal
  dataFim?: string; // Quando parar a recorrência
  ocorrenciasMaximas?: number; // Ou número máximo de ocorrências
}

export interface CategoriaEvento {
  id: string;
  nome: string;
  cor: string;
  icone: string;
  ativa: boolean;
}

export interface ConfiguracaoAgenda {
  id: string;
  usuarioId: string;
  visualizacaoPadrao: 'mes' | 'semana' | 'dia' | 'agenda';
  horarioInicio: string; // HH:MM
  horarioFim: string; // HH:MM
  diasTrabalhoDaSemana: number[]; // 1-7 (segunda a domingo)
  fusoHorario: string;
  notificacoesPadrao: NotificacaoEvento[];
  integracaoCalendario: {
    google: boolean;
    outlook: boolean;
    apple: boolean;
  };
  configuracoes: {
    mostrarFinaisSemana: boolean;
    mostrarFeriados: boolean;
    permitirSobreposicao: boolean;
    confirmarExclusao: boolean;
  };
}

export interface FeriadoNacional {
  id: string;
  nome: string;
  data: string;
  tipo: 'nacional' | 'estadual' | 'municipal';
  ativo: boolean;
}