// Tipos principais do sistema

export interface Cliente {
  id: string;
  empresaId: string;
  filialId: string;
  nome: string;
  empresa: string;
  email: string;
  telefone: string;
  segmento: string;
  tamanho: 'Pequeno' | 'Médio' | 'Grande';
  status: 'Prospect' | 'Ativo' | 'Inativo';
  dataConversao: string;
  valorTotal: number;
}

export interface ContatoCliente {
  id: string;
  clienteId: string;
  nome: string;
  email: string;
  setor: string;
  whatsapp: string;
  funcao: string;
  habilidades: string[];
  ativo: boolean;
  criadoEm: string;
  atualizadoEm: string;
}

export interface Contrato {
  id: string;
  empresaId: string;
  filialId: string;
  clienteId: string;
  nome: string;
  planoVendaId: string;
  modeloContratoId: string;
  carteiraCobrancaId: string;
  diaVencimento: number;
  valor: number;
  dataInicio: string;
  dataFim: string;
  status: 'Em Negociação' | 'Ativo' | 'Vencido' | 'Cancelado';
  dataAtivacao: string;
  tipo: 'Consultoria' | 'Software' | 'Suporte' | 'Misto';
  renovacaoAutomatica: boolean;
  observacoes: string;
  motivoCancelamento?: string;
  dataCancelamento?: string;
  observacoesCancelamento?: string;
}

export interface Fatura {
  id: string;
  empresaId: string;
  filialId: string;
  clienteId: string;
  contratoId: string;
  numero: string;
  valor: number;
  dataVencimento: string;
  dataPagamento: string;
  status: 'Pendente' | 'Pago' | 'Vencida' | 'Cancelada';
  descricao: string;
  parcela: number;
  totalParcelas: number;
}

export interface Licenca {
  id: string;
  clienteId: string;
  software: string;
  usuarios: number;
  custoMensal: number;
  dataInicio: string;
  dataFim: string;
  status: 'Ativa' | 'Vencida' | 'Cancelada';
  fornecedor: string;
  produtoId: string;
}

export interface PlanoVenda {
  id: string;
  nome: string;
  descricao: string;
  itens: ItemPlanoVenda[];
  valorTotal: number;
  custoTotal: number;
  margemLucro: number;
  dataValidade: string;
  status: 'Rascunho' | 'Enviado' | 'Aprovado' | 'Rejeitado' | 'Convertido';
  observacoes: string;
  contratoId?: string;
  criadoEm: string;
  atualizadoEm: string;
}

export interface ItemPlanoVenda {
  id: string;
  produtoId: string;
  quantidade: number;
  precoUnitario: number;
  custoUnitario: number;
  desconto: number;
  valorTotal: number;
  custoTotal: number;
  licencaId?: string;
}

export interface Produto {
  id: string;
  nome: string;
  tipo: 'Software' | 'Consultoria' | 'Suporte' | 'Treinamento' | 'Hardware';
  categoria: string;
  descricao: string;
  precoUnitario: number;
  unidadeMedida: string;
  fornecedor: string;
  custoUnitario: number;
  margemLucro: number;
  ativo: boolean;
  codigoNCM: string;
  aliquotaICMS: number;
  aliquotaIPI: number;
  contaReceitaId: string;
  contaCustoId: string;
  licencaId?: string;
  criadoEm: string;
}

export interface Reuniao {
  id: string;
  clienteId: string;
  dataHoraInicio: string;
  dataHoraFim: string;
  canal: 'online' | 'presencial';
  linkLocal: string;
  objetivo: string;
  pauta: string[];
  participantes: ParticipanteReuniao[];
  responsavel: string;
  status: 'agendada' | 'realizada' | 'cancelada';
  transcricaoCompleta?: string;
  resumoIA?: string;
  duracaoMinutos?: number;
  decisoes: string[];
  tarefasGeradas: string[];
  anexos: string[];
  configuracoes?: {
    temSenha?: boolean;
    senhaReuniao?: string;
    permitirConvidados?: boolean;
    moderacaoObrigatoria?: boolean;
    gravacaoAutomatica?: boolean;
    transcricaoIA?: boolean;
  };
  convidados?: ConvidadoReuniao[];
}

export interface ParticipanteReuniao {
  id: string;
  tipo: 'cliente_contato' | 'lead' | 'interno';
  contatoClienteId?: string;
  nome: string;
  email: string;
  confirmado: boolean;
}

export interface ConvidadoReuniao {
  id: string;
  nome: string;
  empresa: string;
  funcao: string;
  email?: string;
  telefone?: string;
  dataEntrada: string;
  ipAddress?: string;
}
export interface PerformanceMensal {
  id: string;
  clienteId: string;
  mesAno: string;
  clientesAtivos: number;
  novosClientes: number;
  clientesCancelados: number;
  contratosAtivos: number;
  loginsUnicos: number;
  faturamentoTotal: number;
  inadimplencia: number;
  percentualInadimplencia: number;
  ordensServico: number;
  ordensResolvidasPrazo: number;
  velocidadeMediaMbps: number;
  tempoMedioInstalacao: number;
  taxaChurn: number;
  custoAquisicaoCliente: number;
  nps: number;
  satisfacaoMedia: number;
  ticketMedio: number;
  arpu: number;
  uptime: number;
  chamadosSuporte: number;
  tempoMedioResolucao: number;
  criadoEm: string;
  atualizadoEm: string;
}

export interface ContaContabil {
  id: string;
  codigo: string;
  nome: string;
  tipo: 'Ativo' | 'Passivo' | 'Patrimonio' | 'Receita' | 'Despesa';
  subtipo: 'Grupo' | 'Subgrupo' | 'Conta' | 'Analitica';
  contaPai: string;
  natureza: 'Devedora' | 'Credora';
  nivel: number;
  ativa: boolean;
}

export interface LancamentoContabil {
  id: string;
  data: string;
  historico: string;
  valor: number;
  contaDebito: string;
  contaCredito: string;
  documento: string;
  tipo: 'Receita' | 'Despesa' | 'Transferencia' | 'Ajuste';
  status: 'Provisorio' | 'Definitivo';
  criadoEm: string;
}

export interface Fornecedor {
  id: string;
  empresaId: string;
  nome: string;
  razaoSocial: string;
  cnpj: string;
  inscricaoEstadual?: string;
  email: string;
  telefone: string;
  endereco: {
    logradouro: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
  };
  contato: {
    nome: string;
    cargo: string;
    telefone: string;
    email: string;
  };
  dadosBancarios: {
    banco: string;
    agencia: string;
    conta: string;
    tipoConta: 'Corrente' | 'Poupança';
  };
  observacoes?: string;
  ativo: boolean;
  criadoEm: string;
  atualizadoEm: string;
}

// Exportar tipos de empresa e consultoria
export * from './empresa';
export * from './consultoria';
export * from './vendas';
export * from './auth';
export * from './rh';
export * from './vendas';