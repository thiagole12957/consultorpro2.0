// Tipos para sistema de RH

export interface Colaborador {
  id: string;
  empresaId: string;
  filialId: string;
  codigo: string;
  nome: string;
  cpf: string;
  rg: string;
  email: string;
  telefone: string;
  whatsapp?: string;
  endereco: {
    logradouro: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
  };
  dadosPessoais: {
    dataNascimento: string;
    estadoCivil: 'solteiro' | 'casado' | 'divorciado' | 'viuvo' | 'uniao_estavel';
    genero: 'masculino' | 'feminino' | 'outro' | 'nao_informar';
    nacionalidade: string;
    naturalidade: string;
  };
  dadosProfissionais: {
    cargo: string;
    departamentoId: string;
    setorId: string;
    dataAdmissao: string;
    dataDemissao?: string;
    salario: number;
    tipoContrato: 'clt' | 'pj' | 'estagio' | 'terceirizado' | 'freelancer';
    cargaHoraria: number;
    supervisor?: string;
  };
  dadosBancarios?: {
    banco: string;
    agencia: string;
    conta: string;
    tipoConta: 'corrente' | 'poupanca';
    pix?: string;
  };
  documentos: {
    carteiraTrabalho?: string;
    pis?: string;
    tituloEleitor?: string;
    certificadoReservista?: string;
    cnh?: string;
  };
  status: 'ativo' | 'inativo' | 'afastado' | 'ferias' | 'demitido';
  observacoes?: string;
  criadoEm: string;
  atualizadoEm: string;
}

export interface Departamento {
  id: string;
  empresaId: string;
  nome: string;
  descricao: string;
  responsavelId?: string;
  centroCusto: string;
  orcamentoAnual?: number;
  ativo: boolean;
  criadoEm: string;
  atualizadoEm: string;
}

export interface Setor {
  id: string;
  empresaId: string;
  departamentoId: string;
  nome: string;
  descricao: string;
  responsavelId?: string;
  localizacao?: string;
  ativo: boolean;
  criadoEm: string;
  atualizadoEm: string;
}

export interface Cargo {
  id: string;
  empresaId: string;
  nome: string;
  descricao: string;
  nivel: 'junior' | 'pleno' | 'senior' | 'coordenador' | 'gerente' | 'diretor';
  salarioMinimo: number;
  salarioMaximo: number;
  requisitos: string[];
  responsabilidades: string[];
  ativo: boolean;
  criadoEm: string;
}

export interface Ferias {
  id: string;
  colaboradorId: string;
  periodoAquisitivo: {
    inicio: string;
    fim: string;
  };
  diasDireito: number;
  diasUsados: number;
  periodos: PeriodoFerias[];
  status: 'pendente' | 'agendado' | 'em_andamento' | 'concluido';
  criadoEm: string;
}

export interface PeriodoFerias {
  id: string;
  dataInicio: string;
  dataFim: string;
  diasCorridos: number;
  diasUteis: number;
  abono?: number; // Dias vendidos
  observacoes?: string;
}

export interface Afastamento {
  id: string;
  colaboradorId: string;
  tipo: 'medico' | 'acidente' | 'maternidade' | 'paternidade' | 'luto' | 'casamento' | 'outros';
  dataInicio: string;
  dataFim?: string;
  motivo: string;
  documentos: string[];
  status: 'ativo' | 'finalizado' | 'cancelado';
  criadoEm: string;
}

export interface Avaliacao {
  id: string;
  colaboradorId: string;
  avaliadorId: string;
  periodo: string; // YYYY-MM
  tipo: 'mensal' | 'trimestral' | 'semestral' | 'anual';
  criterios: CriterioAvaliacao[];
  notaGeral: number;
  pontosFortesDesenvolvidos: string[];
  areasDesenvolvimento: string[];
  metasProximoPeriodo: string[];
  observacoes?: string;
  status: 'rascunho' | 'finalizada' | 'aprovada';
  criadoEm: string;
}

export interface CriterioAvaliacao {
  id: string;
  nome: string;
  peso: number;
  nota: number; // 1-5
  observacoes?: string;
}