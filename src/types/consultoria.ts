// Tipos específicos para o Painel de Consultoria Mensal

export interface ConsultoriaMensal {
  id: string;
  clienteId: string;
  mesAno: string; // formato: "2024-01"
  scorePerformance: number; // 0-100
  criadoEm: string;
  atualizadoEm: string;
}

export interface MetaMensal {
  id: string;
  consultoriaMensalId: string;
  tipo: 'crescimento_clientes' | 'reducao_inadimplencia' | 'aumento_ticket' | 'vendas' | 'upgrades';
  descricao: string;
  valorMeta: number;
  valorAtual: number;
  unidade: 'numero' | 'percentual' | 'valor';
  status: 'cumprida' | 'em_andamento' | 'nao_atingida';
  prazo: string;
  criadoEm: string;
}

export interface DiagnosticoMensal {
  id: string;
  consultoriaMensalId: string;
  pontosFortes: string[];
  pontosFracos: string[];
  oportunidades: string[];
  ameacas: string[];
  problemasDetectados: string[];
  insightsMelhoria: string[];
  criadoEm: string;
  atualizadoEm: string;
}

export interface AcaoConsultoria {
  id: string;
  consultoriaMensalId: string;
  diagnosticoId?: string;
  metaId?: string;
  descricao: string;
  responsavelCliente: string;
  responsavelConsultoria: string;
  prazo: string;
  status: 'concluido' | 'em_andamento' | 'atrasado' | 'nao_iniciado';
  impacto: 'baixo' | 'medio' | 'alto';
  esforco: 'baixo' | 'medio' | 'alto';
  quadrante: 'quick_wins' | 'projetos' | 'fill_ins' | 'thankless';
  observacoes?: string;
  criadoEm: string;
  atualizadoEm: string;
}

export interface ProcessoCliente {
  id: string;
  clienteId: string;
  nome: string;
  area: 'Comercial' | 'Suporte' | 'Financeiro' | 'Operacional' | 'RH' | 'TI';
  versao: string;
  objetivo: string;
  escopo: string;
  termos: string[];
  indicadores: IndicadorProcesso[];
  status: 'rascunho' | 'pendente_aprovacao' | 'aprovado' | 'reprovado' | 'obsoleto';
  aprovadoPor?: string;
  dataAprovacao?: string;
  observacoesAprovacao?: string;
  criadoEm: string;
  atualizadoEm: string;
}

export interface EtapaProcesso {
  id: string;
  processoId: string;
  nome: string;
  setor: string;
  responsavel: string;
  descricao: string;
  slaHoras: number;
  ordem: number;
  transicoes: TransicaoEtapa[];
  criadoEm: string;
}

export interface TransicaoEtapa {
  id: string;
  etapaOrigemId: string;
  etapaDestinoId: string;
  condicao: string;
  descricao?: string;
}

export interface IndicadorProcesso {
  id: string;
  nome: string;
  tipo: 'tempo' | 'qualidade' | 'custo' | 'volume';
  meta: number;
  unidade: string;
}

export interface BriefingReuniao {
  id: string;
  reuniaoId: string;
  topicosDiscutidos: string[];
  decisoesTomadas: string[];
  proximosPassos: string[];
  anexos: string[];
  observacoes?: string;
  criadoEm: string;
}

export interface OportunidadeNegocio {
  id: string;
  clienteId: string;
  consultoriaMensalId?: string;
  titulo: string;
  descricao: string;
  valorEstimado: number;
  probabilidade: 'baixa' | 'media' | 'alta';
  prazoEstimado: string;
  status: 'identificada' | 'em_analise' | 'proposta_enviada' | 'aprovada' | 'rejeitada';
  transformadaEmAcao: boolean;
  acaoId?: string;
  criadoEm: string;
  atualizadoEm: string;
}

export interface EventoLinhaTempo {
  id: string;
  clienteId: string;
  tipo: 'reuniao' | 'entrega' | 'resultado' | 'marco' | 'problema' | 'oportunidade';
  titulo: string;
  descricao: string;
  data: string;
  anexos?: string[];
  relacionadoId?: string; // ID do objeto relacionado (reunião, ação, etc.)
  criadoEm: string;
}

export interface RelatorioMensal {
  id: string;
  consultoriaMensalId: string;
  indicadores: any;
  metas: any;
  acoes: any;
  resultados: any;
  proximosPassos: string[];
  observacoes?: string;
  geradoEm: string;
  urlPdf?: string;
}