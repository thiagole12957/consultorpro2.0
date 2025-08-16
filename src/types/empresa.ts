// Tipos para sistema multi-empresa e multi-filial

export interface Empresa {
  id: string;
  razaoSocial: string;
  nomeFantasia: string;
  cnpj: string;
  inscricaoEstadual?: string;
  inscricaoMunicipal?: string;
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
  dadosBancarios?: {
    banco: string;
    agencia: string;
    conta: string;
    tipoConta: 'Corrente' | 'Poupança';
  };
  configuracoes: {
    moeda: string;
    timezone: string;
    formatoData: string;
    logoUrl?: string;
  };
  ativa: boolean;
  criadoEm: string;
  atualizadoEm: string;
}

export interface Filial {
  id: string;
  empresaId: string;
  codigo: string;
  nome: string;
  isMatriz: boolean;
  cnpj?: string; // Opcional para filiais que usam o mesmo CNPJ da matriz
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
  responsavel: {
    nome: string;
    email: string;
    telefone: string;
    cargo: string;
  };
  configuracoes: {
    permiteVendas: boolean;
    permiteCompras: boolean;
    permiteEstoque: boolean;
    centroCusto: string;
  };
  ativa: boolean;
  criadoEm: string;
  atualizadoEm: string;
}

export interface UsuarioEmpresa {
  id: string;
  usuarioId: string;
  empresaId: string;
  filialId?: string; // Opcional - se não informado, acesso a todas as filiais
  perfil: 'admin' | 'gerente' | 'operador' | 'consultor';
  permissoes: {
    clientes: boolean;
    contratos: boolean;
    financeiro: boolean;
    contabilidade: boolean;
    relatorios: boolean;
    configuracoes: boolean;
  };
  ativo: boolean;
  criadoEm: string;
}