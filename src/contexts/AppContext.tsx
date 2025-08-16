import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useConfig } from '../hooks/useConfig';
import { 
  Cliente, 
  Contrato, 
  Fatura, 
  Licenca, 
  PlanoVenda, 
  Produto, 
  Reuniao, 
  PerformanceMensal,
  ContaContabil,
  LancamentoContabil,
  Fornecedor,
  ContatoCliente
} from '../types';
import { Empresa, Filial } from '../types/empresa';
import { 
  ConsultoriaMensal, 
  MetaMensal, 
  DiagnosticoMensal, 
  AcaoConsultoria,
  ProcessoCliente,
  BriefingReuniao,
  OportunidadeNegocio,
  EventoLinhaTempo,
  RelatorioMensal
} from '../types/consultoria';
import { CondicaoPagamento, Venda } from '../types/vendas';
import { 
  RegraCobranca, 
  HistoricoCobranca, 
  LogCobranca 
} from '../types/cobranca';
import { 
  Usuario, 
  PerfilUsuario, 
  SessaoUsuario, 
  LogAcesso 
} from '../types/auth';
import { 
  Colaborador, 
  Departamento, 
  Setor, 
  Cargo, 
  Ferias, 
  Afastamento, 
  Avaliacao 
} from '../types/rh';

// Tipos adicionais
interface ContaBancaria {
  id: string;
  empresaId: string;
  filialId: string;
  nome: string;
  banco: string;
  agencia: string;
  conta: string;
  tipo: 'Corrente' | 'Poupanca' | 'Caixa';
  saldoAtual: number;
  ativa: boolean;
  contaContabilId: string;
  observacoes?: string;
  criadoEm: string;
}

interface ContaPagar {
  id: string;
  empresaId: string;
  filialId: string;
  fornecedorId: string;
  descricao: string;
  valor: number;
  dataVencimento: string;
  dataPagamento?: string;
  status: 'Pendente' | 'Pago' | 'Vencida' | 'Cancelada';
  categoria: 'Fornecedor' | 'Licenca' | 'Servico' | 'Imposto' | 'Outros';
  contaContabilId: string;
  documento?: string;
  observacoes?: string;
  isRecorrente: boolean;
  frequenciaRecorrencia?: 'Mensal' | 'Bimestral' | 'Trimestral' | 'Semestral' | 'Anual';
  formaPagamento?: 'PIX' | 'TED' | 'Boleto' | 'Debito' | 'Cartao' | 'Dinheiro';
  contaBancariaId?: string;
  numeroNF?: string;
  chaveNFe?: string;
  valorPago?: number;
  jurosMulta?: number;
  desconto?: number;
  centroCusto?: string;
  aprovadoPor?: string;
  dataAprovacao?: string;
  anexos: string[];
  criadoEm: string;
}

interface PagamentoConta {
  id: string;
  contaPagarId: string;
  valor: number;
  dataPagamento: string;
  formaPagamento: 'PIX' | 'TED' | 'Boleto' | 'Debito' | 'Cartao' | 'Dinheiro';
  contaBancariaId: string;
  observacoes?: string;
  comprovante?: string;
}

interface CarteiraCobranca {
  id: string;
  empresaId: string;
  filialId: string;
  nome: string;
  tipo: 'interna' | 'bancaria';
  contaCaixaId?: string;
  contaBancariaId?: string;
  integracaoBanco?: {
    tipo: 'manual' | 'efi_gerencianet' | 'banco_assas';
    clientId?: string;
    clientSecret?: string;
    sandbox?: boolean;
    webhookUrl?: string;
  };
  configuracoes: {
    gerarBoleto: boolean;
    gerarPix: boolean;
    enviarEmail: boolean;
    enviarWhatsapp: boolean;
    jurosAtraso: number;
    multaAtraso: number;
  };
  ativa: boolean;
  criadoEm: string;
  atualizadoEm: string;
}

interface ModeloContrato {
  id: string;
  empresaId: string;
  nome: string;
  categoria: 'consultoria' | 'software' | 'suporte' | 'misto';
  conteudo: string;
  variaveis: VariavelContrato[];
  clausulas: ClausulaContrato[];
  configuracoes: {
    assinaturaDigital: boolean;
    versionamento: boolean;
    aprovacaoObrigatoria: boolean;
    validadeDias: number;
  };
  ativo: boolean;
  criadoEm: string;
  atualizadoEm: string;
}

interface VariavelContrato {
  id: string;
  nome: string;
  tipo: 'texto' | 'numero' | 'data' | 'moeda' | 'lista';
  obrigatoria: boolean;
  valorPadrao: string;
  descricao: string;
  opcoes?: string[];
}

interface ClausulaContrato {
  id: string;
  titulo: string;
  conteudo: string;
  obrigatoria: boolean;
  ordem: number;
  categoria: 'geral' | 'pagamento' | 'entrega' | 'responsabilidade' | 'rescisao';
}

interface AppContextType {
  // Estados principais
  clientes: Cliente[];
  contratos: Contrato[];
  faturas: Fatura[];
  licencas: Licenca[];
  planosVenda: PlanoVenda[];
  produtos: Produto[];
  reunioes: Reuniao[];
  performanceMensal: PerformanceMensal[];
  contatos: ContatoCliente[];
  
  // Estados de empresa
  empresas: Empresa[];
  filiais: Filial[];
  empresaSelecionada: Empresa | null;
  filialAtiva: Filial | null;
  
  // Estados de contabilidade
  contasContabeis: ContaContabil[];
  lancamentosContabeis: LancamentoContabil[];
  contasPagar: ContaPagar[];
  contasBancarias: ContaBancaria[];
  fornecedores: Fornecedor[];
  pagamentosConta: PagamentoConta[];
  
  // Estados de consultoria
  consultoriasMensais: ConsultoriaMensal[];
  metasMensais: MetaMensal[];
  diagnosticosMensais: DiagnosticoMensal[];
  acoesConsultoria: AcaoConsultoria[];
  processosCliente: ProcessoCliente[];
  briefingsReuniao: BriefingReuniao[];
  oportunidadesNegocio: OportunidadeNegocio[];
  eventosLinhaTempo: EventoLinhaTempo[];
  relatoriosMensais: RelatorioMensal[];
  
  // Estados de vendas
  condicoesPagamento: CondicaoPagamento[];
  vendas: Venda[];
  
  // Estados de cobrança
  carteirasCobranca: CarteiraCobranca[];
  modelosContrato: ModeloContrato[];
  regrasCobranca: RegraCobranca[];
  historicoCobranca: HistoricoCobranca[];
  logsCobranca: LogCobranca[];
  
  // Estados de autenticação
  usuarioLogado: Usuario | null;
  usuariosSistema: Usuario[];
  perfisUsuario: PerfilUsuario[];
  sessoesUsuario: SessaoUsuario[];
  logsAcesso: LogAcesso[];
  
  // Estados de RH
  colaboradores: Colaborador[];
  departamentos: Departamento[];
  setores: Setor[];
  cargos: Cargo[];
  ferias: Ferias[];
  afastamentos: Afastamento[];
  avaliacoes: Avaliacao[];
  
  // Estados de seleção
  clienteSelecionado: Cliente | null;
  
  // Funções de clientes
  adicionarCliente: (cliente: Cliente) => void;
  atualizarCliente: (id: string, dados: Partial<Cliente>) => void;
  setClienteSelecionado: (cliente: Cliente | null) => void;
  
  // Funções de contatos
  adicionarContato: (contato: ContatoCliente) => void;
  atualizarContato: (id: string, dados: Partial<ContatoCliente>) => void;
  excluirContato: (id: string) => void;
  
  // Funções de contratos
  adicionarContrato: (contrato: Contrato) => void;
  atualizarContrato: (id: string, dados: Partial<Contrato>) => void;
  
  // Funções de faturas
  adicionarFatura: (fatura: Fatura) => void;
  atualizarFatura: (id: string, dados: Partial<Fatura>) => void;
  gerarFaturasVenda: (vendaId: string) => void;
  
  // Funções de licenças
  adicionarLicenca: (licenca: Licenca) => void;
  atualizarLicenca: (id: string, dados: Partial<Licenca>) => void;
  
  // Funções de planos de venda
  adicionarPlanoVenda: (plano: PlanoVenda) => void;
  atualizarPlanoVenda: (id: string, dados: Partial<PlanoVenda>) => void;
  
  // Funções de produtos
  adicionarProduto: (produto: Produto) => void;
  atualizarProduto: (id: string, dados: Partial<Produto>) => void;
  
  // Funções de reuniões
  adicionarReuniao: (reuniao: Reuniao) => void;
  atualizarReuniao: (id: string, dados: Partial<Reuniao>) => void;
  
  // Funções de performance
  adicionarPerformanceMensal: (performance: PerformanceMensal) => void;
  atualizarPerformanceMensal: (id: string, dados: Partial<PerformanceMensal>) => void;
  
  // Funções de empresa
  empresas: Empresa[];
  filiais: Filial[];
  adicionarEmpresa: (empresa: Empresa) => void;
  atualizarEmpresa: (id: string, dados: Partial<Empresa>) => void;
  adicionarFilial: (filial: Filial) => void;
  atualizarFilial: (id: string, dados: Partial<Filial>) => void;
  setEmpresaSelecionada: (empresa: Empresa | null) => void;
  
  // Funções de contabilidade
  adicionarContaContabil: (conta: ContaContabil) => void;
  atualizarContaContabil: (id: string, dados: Partial<ContaContabil>) => void;
  excluirContaContabil: (id: string) => void;
  adicionarLancamentoContabil: (lancamento: LancamentoContabil) => void;
  adicionarContaPagar: (conta: ContaPagar) => void;
  atualizarContaPagar: (id: string, dados: Partial<ContaPagar>) => void;
  adicionarContaBancaria: (conta: ContaBancaria) => void;
  atualizarContaBancaria: (id: string, dados: Partial<ContaBancaria>) => void;
  adicionarFornecedor: (fornecedor: Fornecedor) => void;
  atualizarFornecedor: (id: string, dados: Partial<Fornecedor>) => void;
  realizarPagamento: (contaId: string, dadosPagamento: any) => void;
  gerarLancamentoPagamento: (conta: ContaPagar) => void;
  gerarRecorrencia: (contaId: string) => void;
  
  // Funções de consultoria
  adicionarConsultoriaMensal: (consultoria: ConsultoriaMensal) => void;
  atualizarConsultoriaMensal: (id: string, dados: Partial<ConsultoriaMensal>) => void;
  adicionarMetaMensal: (meta: MetaMensal) => void;
  atualizarMetaMensal: (id: string, dados: Partial<MetaMensal>) => void;
  excluirMetaMensal: (id: string) => void;
  adicionarDiagnosticoMensal: (diagnostico: DiagnosticoMensal) => void;
  atualizarDiagnosticoMensal: (id: string, dados: Partial<DiagnosticoMensal>) => void;
  adicionarAcaoConsultoria: (acao: AcaoConsultoria) => void;
  atualizarAcaoConsultoria: (id: string, dados: Partial<AcaoConsultoria>) => void;
  excluirAcaoConsultoria: (id: string) => void;
  adicionarProcessoCliente: (processo: ProcessoCliente) => void;
  atualizarProcessoCliente: (id: string, dados: Partial<ProcessoCliente>) => void;
  adicionarBriefingReuniao: (briefing: BriefingReuniao) => void;
  atualizarBriefingReuniao: (id: string, dados: Partial<BriefingReuniao>) => void;
  adicionarOportunidadeNegocio: (oportunidade: OportunidadeNegocio) => void;
  atualizarOportunidadeNegocio: (id: string, dados: Partial<OportunidadeNegocio>) => void;
  excluirOportunidadeNegocio: (id: string) => void;
  adicionarEventoLinhaTempo: (evento: EventoLinhaTempo) => void;
  adicionarRelatorioMensal: (relatorio: RelatorioMensal) => void;
  
  // Funções de vendas
  adicionarCondicaoPagamento: (condicao: CondicaoPagamento) => void;
  atualizarCondicaoPagamento: (id: string, dados: Partial<CondicaoPagamento>) => void;
  excluirCondicaoPagamento: (id: string) => void;
  adicionarVenda: (venda: Venda) => void;
  atualizarVenda: (id: string, dados: Partial<Venda>) => void;
  
  // Funções de cobrança
  adicionarCarteiraCobranca: (carteira: CarteiraCobranca) => void;
  atualizarCarteiraCobranca: (id: string, dados: Partial<CarteiraCobranca>) => void;
  adicionarModeloContrato: (modelo: ModeloContrato) => void;
  atualizarModeloContrato: (id: string, dados: Partial<ModeloContrato>) => void;
  adicionarRegraCobranca: (regra: RegraCobranca) => void;
  atualizarRegraCobranca: (id: string, dados: Partial<RegraCobranca>) => void;
  
  // Funções de autenticação
  login: (email: string, senha: string) => boolean;
  logout: () => void;
  adicionarUsuario: (usuario: Usuario) => void;
  atualizarUsuario: (id: string, dados: Partial<Usuario>) => void;
  
  // Funções de RH
  adicionarColaborador: (colaborador: Colaborador) => void;
  atualizarColaborador: (id: string, dados: Partial<Colaborador>) => void;
  adicionarDepartamento: (departamento: Departamento) => void;
  atualizarDepartamento: (id: string, dados: Partial<Departamento>) => void;
  adicionarSetor: (setor: Setor) => void;
  atualizarSetor: (id: string, dados: Partial<Setor>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  // Hook de configurações
  const { configuracoes } = useConfig();

  // Estados principais
  const [clientes, setClientes] = useState<Cliente[]>([
    {
      id: '1',
      empresaId: '1',
      filialId: '1',
      nome: 'João Silva',
      empresa: 'TechCorp Ltda',
      email: 'joao@techcorp.com',
      telefone: '(11) 99999-9999',
      segmento: 'Tecnologia',
      tamanho: 'Médio',
      status: 'Ativo',
      dataConversao: '2024-01-15',
      valorTotal: 120000,
    },
    {
      id: '2',
      empresaId: '1',
      filialId: '1',
      nome: 'Maria Santos',
      empresa: 'InnovaSoft',
      email: 'maria@innovasoft.com',
      telefone: '(11) 88888-8888',
      segmento: 'Software',
      tamanho: 'Grande',
      status: 'Prospect',
      dataConversao: '',
      valorTotal: 250000,
    },
  ]);

  const [contratos, setContratos] = useState<Contrato[]>([
    {
      id: '1',
      empresaId: '1',
      filialId: '1',
      clienteId: '1',
      nome: 'Contrato de Consultoria ERP',
      planoVendaId: '1',
      modeloContratoId: '1',
      carteiraCobrancaId: '1',
      diaVencimento: 10,
      valor: 120000,
      dataInicio: '2024-01-01',
      dataFim: '2024-12-31',
      status: 'Ativo',
      dataAtivacao: '2024-01-01',
      tipo: 'Consultoria',
      renovacaoAutomatica: true,
      observacoes: 'Contrato de implementação de ERP',
    },
  ]);

  const [faturas, setFaturas] = useState<Fatura[]>([
    {
      id: '1',
      empresaId: '1',
      filialId: '1',
      clienteId: '1',
      contratoId: '1',
      numero: 'FAT-2024-001',
      valor: 10000,
      dataVencimento: '2024-02-10',
      dataPagamento: '2024-02-08',
      status: 'Pago',
      descricao: 'Mensalidade Janeiro 2024',
      parcela: 1,
      totalParcelas: 12,
    },
    {
      id: '2',
      empresaId: '1',
      filialId: '1',
      clienteId: '1',
      contratoId: '1',
      numero: 'FAT-2024-002',
      valor: 10000,
      dataVencimento: '2024-03-10',
      dataPagamento: '',
      status: 'Pendente',
      descricao: 'Mensalidade Fevereiro 2024',
      parcela: 2,
      totalParcelas: 12,
    },
  ]);

  const [licencas, setLicencas] = useState<Licenca[]>([
    {
      id: '1',
      clienteId: '1',
      software: 'Microsoft 365',
      usuarios: 50,
      custoMensal: 2500,
      dataInicio: '2024-01-01',
      dataFim: '2024-12-31',
      status: 'Ativa',
      fornecedor: 'Microsoft',
      produtoId: '1',
    },
  ]);

  const [planosVenda, setPlanosVenda] = useState<PlanoVenda[]>([
    {
      id: '1',
      nome: 'Plano ERP Completo',
      descricao: 'Implementação completa de ERP',
      itens: [
        {
          id: '1',
          produtoId: '1',
          quantidade: 1,
          precoUnitario: 120000,
          custoUnitario: 80000,
          desconto: 0,
          valorTotal: 120000,
          custoTotal: 80000,
        },
      ],
      valorTotal: 120000,
      custoTotal: 80000,
      margemLucro: 33.33,
      dataValidade: '2024-12-31',
      status: 'Aprovado',
      observacoes: '',
      contratoId: '1',
      criadoEm: '2024-01-01',
      atualizadoEm: '2024-01-01',
    },
  ]);

  const [produtos, setProdutos] = useState<Produto[]>([
    {
      id: '1',
      nome: 'Consultoria ERP',
      tipo: 'Consultoria',
      categoria: 'Implementação',
      descricao: 'Consultoria para implementação de ERP',
      precoUnitario: 120000,
      unidadeMedida: 'projeto',
      fornecedor: 'Interno',
      custoUnitario: 80000,
      margemLucro: 33.33,
      ativo: true,
      codigoNCM: '9999.99.99',
      aliquotaICMS: 0,
      aliquotaIPI: 0,
      contaReceitaId: '1',
      contaCustoId: '1',
      criadoEm: '2024-01-01',
    },
  ]);

  const [reunioes, setReunioes] = useState<Reuniao[]>([
    {
      id: '1',
      clienteId: '1',
      dataHoraInicio: '2024-02-15T10:00:00',
      dataHoraFim: '2024-02-15T11:00:00',
      canal: 'online',
      linkLocal: 'https://meet.consultorpro.com/reuniao-1',
      objetivo: 'Reunião de Kick-off do Projeto ERP',
      pauta: ['Apresentação da equipe', 'Cronograma do projeto', 'Definição de responsabilidades'],
      participantes: [
        {
          id: '1',
          tipo: 'cliente_contato',
          contatoClienteId: '1',
          nome: 'João Silva',
          email: 'joao@techcorp.com',
          confirmado: true,
        },
      ],
      responsavel: 'Consultor Principal',
      status: 'agendada',
      decisoes: [],
      tarefasGeradas: [],
      anexos: [],
    },
  ]);

  const [performanceMensal, setPerformanceMensal] = useState<PerformanceMensal[]>([
    {
      id: '1',
      clienteId: '1',
      mesAno: '2024-01',
      clientesAtivos: 45,
      novosClientes: 5,
      clientesCancelados: 2,
      contratosAtivos: 38,
      loginsUnicos: 1250,
      faturamentoTotal: 450000,
      inadimplencia: 15000,
      percentualInadimplencia: 3.33,
      ordensServico: 125,
      ordensResolvidasPrazo: 118,
      velocidadeMediaMbps: 85.5,
      tempoMedioInstalacao: 3.2,
      taxaChurn: 4.4,
      custoAquisicaoCliente: 850,
      nps: 72,
      satisfacaoMedia: 4.3,
      ticketMedio: 10000,
      arpu: 9500,
      uptime: 99.8,
      chamadosSuporte: 89,
      tempoMedioResolucao: 2.5,
      criadoEm: '2024-01-31',
      atualizadoEm: '2024-01-31',
    },
  ]);

  const [contatos, setContatos] = useState<ContatoCliente[]>([
    {
      id: '1',
      clienteId: '1',
      nome: 'João Silva',
      email: 'joao@techcorp.com',
      setor: 'TI',
      whatsapp: '(11) 99999-9999',
      funcao: 'Gerente de TI',
      habilidades: ['ERP', 'Gestão de Projetos', 'SQL'],
      ativo: true,
      criadoEm: '2024-01-15',
      atualizadoEm: '2024-01-15',
    },
  ]);

  // Estados de empresa
  const [empresas, setEmpresas] = useState<Empresa[]>([
    {
      id: '1',
      razaoSocial: 'HD Soluções em Internet e Sistemas Ltda',
      nomeFantasia: 'HD Soluções ISP',
      cnpj: '12.345.678/0001-90',
      inscricaoEstadual: '123.456.789.123',
      email: 'contato@hdsolucoesisp.com.br',
      telefone: '(11) 3333-4444',
      endereco: {
        logradouro: 'Rua das Tecnologias',
        numero: '123',
        bairro: 'Centro',
        cidade: 'São Paulo',
        estado: 'SP',
        cep: '01234-567',
      },
      configuracoes: {
        moeda: 'BRL',
        timezone: 'America/Sao_Paulo',
        formatoData: 'DD/MM/YYYY',
      },
      ativa: true,
      criadoEm: '2024-01-01',
      atualizadoEm: '2024-01-01',
    },
  ]);

  const [filiais, setFiliais] = useState<Filial[]>([
    {
      id: '1',
      empresaId: '1',
      codigo: '001',
      nome: 'Matriz São Paulo',
      isMatriz: true,
      email: 'matriz@hdsolucoesisp.com.br',
      telefone: '(11) 3333-4444',
      endereco: {
        logradouro: 'Rua das Tecnologias',
        numero: '123',
        bairro: 'Centro',
        cidade: 'São Paulo',
        estado: 'SP',
        cep: '01234-567',
      },
      responsavel: {
        nome: 'Carlos Diretor',
        email: 'carlos@hdsolucoesisp.com.br',
        telefone: '(11) 99999-0000',
        cargo: 'Diretor Geral',
      },
      configuracoes: {
        permiteVendas: true,
        permiteCompras: true,
        permiteEstoque: true,
        centroCusto: 'CC-001',
      },
      ativa: true,
      criadoEm: '2024-01-01',
      atualizadoEm: '2024-01-01',
    },
  ]);

  const [empresaSelecionada, setEmpresaSelecionada] = useState<Empresa | null>(empresas[0] || null);
  const [filialAtiva, setFilialAtiva] = useState<Filial | null>(filiais[0] || null);

  // Estados de contabilidade
  const [contasContabeis, setContasContabeis] = useState<ContaContabil[]>([
    // Ativo
    { id: '1', codigo: '1', nome: 'ATIVO', tipo: 'Ativo', subtipo: 'Grupo', contaPai: '', natureza: 'Devedora', nivel: 1, ativa: true },
    { id: '2', codigo: '1.1', nome: 'ATIVO CIRCULANTE', tipo: 'Ativo', subtipo: 'Subgrupo', contaPai: '1', natureza: 'Devedora', nivel: 2, ativa: true },
    { id: '3', codigo: '1.1.1', nome: 'Caixa e Equivalentes', tipo: 'Ativo', subtipo: 'Conta', contaPai: '2', natureza: 'Devedora', nivel: 3, ativa: true },
    { id: '4', codigo: '1.1.2', nome: 'Contas a Receber', tipo: 'Ativo', subtipo: 'Conta', contaPai: '2', natureza: 'Devedora', nivel: 3, ativa: true },
    
    // Passivo
    { id: '5', codigo: '2', nome: 'PASSIVO', tipo: 'Passivo', subtipo: 'Grupo', contaPai: '', natureza: 'Credora', nivel: 1, ativa: true },
    { id: '6', codigo: '2.1', nome: 'PASSIVO CIRCULANTE', tipo: 'Passivo', subtipo: 'Subgrupo', contaPai: '5', natureza: 'Credora', nivel: 2, ativa: true },
    { id: '7', codigo: '2.1.1', nome: 'Contas a Pagar', tipo: 'Passivo', subtipo: 'Conta', contaPai: '6', natureza: 'Credora', nivel: 3, ativa: true },
    
    // Receita
    { id: '8', codigo: '3', nome: 'RECEITAS', tipo: 'Receita', subtipo: 'Grupo', contaPai: '', natureza: 'Credora', nivel: 1, ativa: true },
    { id: '9', codigo: '3.1', nome: 'Receita de Serviços', tipo: 'Receita', subtipo: 'Conta', contaPai: '8', natureza: 'Credora', nivel: 2, ativa: true },
    
    // Despesa
    { id: '10', codigo: '4', nome: 'DESPESAS', tipo: 'Despesa', subtipo: 'Grupo', contaPai: '', natureza: 'Devedora', nivel: 1, ativa: true },
    { id: '11', codigo: '4.1', nome: 'Despesas Operacionais', tipo: 'Despesa', subtipo: 'Conta', contaPai: '10', natureza: 'Devedora', nivel: 2, ativa: true },
  ]);

  const [lancamentosContabeis, setLancamentosContabeis] = useState<LancamentoContabil[]>([]);

  const [contasPagar, setContasPagar] = useState<ContaPagar[]>([
    {
      id: '1',
      empresaId: '1',
      filialId: '1',
      fornecedorId: '1',
      descricao: 'Licença Microsoft 365',
      valor: 2500,
      dataVencimento: '2024-02-15',
      status: 'Pendente',
      categoria: 'Licenca',
      contaContabilId: '11',
      documento: 'NF-001',
      observacoes: 'Pagamento mensal',
      isRecorrente: true,
      frequenciaRecorrencia: 'Mensal',
      anexos: [],
      criadoEm: '2024-01-15',
    },
  ]);

  const [contasBancarias, setContasBancarias] = useState<ContaBancaria[]>([
    {
      id: '1',
      empresaId: '1',
      filialId: '1',
      nome: 'Conta Corrente Principal',
      banco: 'Banco do Brasil',
      agencia: '1234-5',
      conta: '12345-6',
      tipo: 'Corrente',
      saldoAtual: 150000,
      ativa: true,
      contaContabilId: '3',
      criadoEm: '2024-01-01',
    },
    {
      id: '2',
      empresaId: '1',
      filialId: '1',
      nome: 'Caixa Físico',
      banco: 'Caixa Físico',
      agencia: '',
      conta: '',
      tipo: 'Caixa',
      saldoAtual: 5000,
      ativa: true,
      contaContabilId: '3',
      criadoEm: '2024-01-01',
    },
  ]);

  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([
    {
      id: '1',
      empresaId: '1',
      nome: 'Microsoft Brasil',
      razaoSocial: 'Microsoft Informática Ltda',
      cnpj: '04.712.500/0001-07',
      email: 'contato@microsoft.com.br',
      telefone: '(11) 4444-5555',
      endereco: {
        logradouro: 'Av. das Nações Unidas',
        numero: '12901',
        bairro: 'Brooklin',
        cidade: 'São Paulo',
        estado: 'SP',
        cep: '04578-000',
      },
      contato: {
        nome: 'Representante Microsoft',
        cargo: 'Account Manager',
        telefone: '(11) 4444-5555',
        email: 'vendas@microsoft.com.br',
      },
      dadosBancarios: {
        banco: 'Itaú',
        agencia: '0001',
        conta: '12345-6',
        tipoConta: 'Corrente',
      },
      ativo: true,
      criadoEm: '2024-01-01',
      atualizadoEm: '2024-01-01',
    },
  ]);

  const [pagamentosConta, setPagamentosConta] = useState<PagamentoConta[]>([]);

  // Estados de consultoria
  const [consultoriasMensais, setConsultoriasMensais] = useState<ConsultoriaMensal[]>([]);
  const [metasMensais, setMetasMensais] = useState<MetaMensal[]>([]);
  const [diagnosticosMensais, setDiagnosticosMensais] = useState<DiagnosticoMensal[]>([]);
  const [acoesConsultoria, setAcoesConsultoria] = useState<AcaoConsultoria[]>([]);
  const [processosCliente, setProcessosCliente] = useState<ProcessoCliente[]>([]);
  const [briefingsReuniao, setBriefingsReuniao] = useState<BriefingReuniao[]>([]);
  const [oportunidadesNegocio, setOportunidadesNegocio] = useState<OportunidadeNegocio[]>([]);
  const [eventosLinhaTempo, setEventosLinhaTempo] = useState<EventoLinhaTempo[]>([]);
  const [relatoriosMensais, setRelatoriosMensais] = useState<RelatorioMensal[]>([]);

  // Estados de vendas
  const [condicoesPagamento, setCondicoesPagamento] = useState<CondicaoPagamento[]>([
    {
      id: '1',
      empresaId: '1',
      nome: 'À Vista',
      descricao: 'Pagamento à vista com desconto',
      parcelas: [
        { numero: 1, dias: 0, percentual: 100 }
      ],
      ativa: true,
      criadoEm: '2024-01-01',
    },
    {
      id: '2',
      empresaId: '1',
      nome: '30/60/90 dias',
      descricao: 'Parcelamento em 3x sem juros',
      parcelas: [
        { numero: 1, dias: 30, percentual: 33.33 },
        { numero: 2, dias: 60, percentual: 33.33 },
        { numero: 3, dias: 90, percentual: 33.34 }
      ],
      ativa: true,
      criadoEm: '2024-01-01',
    },
  ]);

  const [vendas, setVendas] = useState<Venda[]>([]);

  // Estados de cobrança
  // Agenda
  const [eventosAgenda, setEventosAgenda] = useState<EventoAgenda[]>([]);
  
  const [carteirasCobranca, setCarteirasCobranca] = useState<CarteiraCobranca[]>([
    {
      id: '1',
      empresaId: '1',
      filialId: '1',
      nome: 'Carteira Principal',
      tipo: 'bancaria',
      contaBancariaId: '1',
      configuracoes: {
        gerarBoleto: true,
        gerarPix: true,
        enviarEmail: true,
        enviarWhatsapp: false,
        jurosAtraso: 1,
        multaAtraso: 2,
      },
      ativa: true,
      criadoEm: '2024-01-01',
      atualizadoEm: '2024-01-01',
    },
  ]);

  const [modelosContrato, setModelosContrato] = useState<ModeloContrato[]>([
    {
      id: '1',
      empresaId: '1',
      nome: 'Contrato Padrão de Consultoria',
      categoria: 'consultoria',
      conteudo: 'CONTRATO DE PRESTAÇÃO DE SERVIÇOS DE CONSULTORIA\n\nCONTRATANTE: {{nomeCliente}}\nCONTRATADA: {{nomeEmpresa}}\n\nValor: {{valorContrato}}\nPrazo: {{prazoContrato}}',
      variaveis: [
        {
          id: '1',
          nome: 'nomeCliente',
          tipo: 'texto',
          obrigatoria: true,
          valorPadrao: '',
          descricao: 'Nome do cliente contratante',
        },
      ],
      clausulas: [
        {
          id: '1',
          titulo: 'Do Objeto',
          conteudo: 'O presente contrato tem por objeto a prestação de serviços de consultoria...',
          obrigatoria: true,
          ordem: 1,
          categoria: 'geral',
        },
      ],
      configuracoes: {
        assinaturaDigital: true,
        versionamento: true,
        aprovacaoObrigatoria: false,
        validadeDias: 30,
      },
      ativo: true,
      criadoEm: '2024-01-01',
      atualizadoEm: '2024-01-01',
    },
  ]);

  const [regrasCobranca, setRegrasCobranca] = useState<RegraCobranca[]>([]);
  const [historicoCobranca, setHistoricoCobranca] = useState<HistoricoCobranca[]>([]);
  const [logsCobranca, setLogsCobranca] = useState<LogCobranca[]>([]);

  // Estados de autenticação
  const [usuarioLogado, setUsuarioLogado] = useState<Usuario | null>(null);
  const [logsAuditoria, setLogsAuditoria] = useState<LogAuditoria[]>([]);
  const [usuariosSistema, setUsuariosSistema] = useState<Usuario[]>([
    {
      id: '1',
      email: 'admin@hdsolucoesisp.com.br',
      senha: '123',
      nome: 'Administrador',
      ativo: true,
      colaboradorId: '1',
      empresaId: '1',
      perfil: {
        id: '1',
        nome: 'Super Administrador',
        descricao: 'Acesso total ao sistema',
        nivel: 'super_admin',
        permissoesPadrao: {
          dashboard: { visualizar: true, criar: true, editar: true, excluir: true },
          empresas: { visualizar: true, criar: true, editar: true, excluir: true },
          clientes: { visualizar: true, criar: true, editar: true, excluir: true },
          contratos: { visualizar: true, criar: true, editar: true, excluir: true },
          faturas: { visualizar: true, criar: true, editar: true, excluir: true },
          licencas: { visualizar: true, criar: true, editar: true, excluir: true },
          produtos: { visualizar: true, criar: true, editar: true, excluir: true },
          vendas: { visualizar: true, criar: true, editar: true, excluir: true },
          contabilidade: { visualizar: true, criar: true, editar: true, excluir: true },
          contasPagar: { visualizar: true, criar: true, editar: true, excluir: true },
          contasReceber: { visualizar: true, criar: true, editar: true, excluir: true },
          reunioes: { visualizar: true, criar: true, editar: true, excluir: true },
          projetos: { visualizar: true, criar: true, editar: true, excluir: true },
          consultoriaMensal: { visualizar: true, criar: true, editar: true, excluir: true },
          rh: { visualizar: true, criar: true, editar: true, excluir: true },
          usuarios: { visualizar: true, criar: true, editar: true, excluir: true },
          relatorios: { visualizar: true, criar: true, editar: true, excluir: true, exportar: true },
          auditoria: { visualizar: true, criar: true, editar: true, excluir: true },
          configuracoes: { visualizar: true, criar: true, editar: true, excluir: true },
        },
        ativo: true,
        criadoEm: '2024-01-01',
      },
      permissoes: {
        dashboard: { visualizar: true, criar: true, editar: true, excluir: true },
        empresas: { visualizar: true, criar: true, editar: true, excluir: true },
        clientes: { visualizar: true, criar: true, editar: true, excluir: true },
        contratos: { visualizar: true, criar: true, editar: true, excluir: true },
        faturas: { visualizar: true, criar: true, editar: true, excluir: true },
        licencas: { visualizar: true, criar: true, editar: true, excluir: true },
        produtos: { visualizar: true, criar: true, editar: true, excluir: true },
        vendas: { visualizar: true, criar: true, editar: true, excluir: true },
        contabilidade: { visualizar: true, criar: true, editar: true, excluir: true },
        contasPagar: { visualizar: true, criar: true, editar: true, excluir: true },
        contasReceber: { visualizar: true, criar: true, editar: true, excluir: true },
        reunioes: { visualizar: true, criar: true, editar: true, excluir: true },
        projetos: { visualizar: true, criar: true, editar: true, excluir: true },
        consultoriaMensal: { visualizar: true, criar: true, editar: true, excluir: true },
        rh: { visualizar: true, criar: true, editar: true, excluir: true },
        usuarios: { visualizar: true, criar: true, editar: true, excluir: true },
        relatorios: { visualizar: true, criar: true, editar: true, excluir: true, exportar: true },
        auditoria: { visualizar: true, criar: true, editar: true, excluir: true },
        configuracoes: { visualizar: true, criar: true, editar: true, excluir: true },
      },
      criadoEm: '2024-01-01',
      atualizadoEm: '2024-01-01',
    },
  ]);

  const [perfisUsuario, setPerfisUsuario] = useState<PerfilUsuario[]>([
    {
      id: '1',
      nome: 'Super Administrador',
      descricao: 'Acesso total ao sistema',
      nivel: 'super_admin',
      permissoesPadrao: {
        dashboard: { visualizar: true, criar: true, editar: true, excluir: true },
        empresas: { visualizar: true, criar: true, editar: true, excluir: true },
        clientes: { visualizar: true, criar: true, editar: true, excluir: true },
        contratos: { visualizar: true, criar: true, editar: true, excluir: true },
        faturas: { visualizar: true, criar: true, editar: true, excluir: true },
        licencas: { visualizar: true, criar: true, editar: true, excluir: true },
        produtos: { visualizar: true, criar: true, editar: true, excluir: true },
        vendas: { visualizar: true, criar: true, editar: true, excluir: true },
        contabilidade: { visualizar: true, criar: true, editar: true, excluir: true },
        contasPagar: { visualizar: true, criar: true, editar: true, excluir: true },
        contasReceber: { visualizar: true, criar: true, editar: true, excluir: true },
        reunioes: { visualizar: true, criar: true, editar: true, excluir: true },
        projetos: { visualizar: true, criar: true, editar: true, excluir: true },
        consultoriaMensal: { visualizar: true, criar: true, editar: true, excluir: true },
        rh: { visualizar: true, criar: true, editar: true, excluir: true },
        usuarios: { visualizar: true, criar: true, editar: true, excluir: true },
        relatorios: { visualizar: true, criar: true, editar: true, excluir: true, exportar: true },
        auditoria: { visualizar: true, criar: true, editar: true, excluir: true },
        configuracoes: { visualizar: true, criar: true, editar: true, excluir: true },
      },
      ativo: true,
      criadoEm: '2024-01-01',
    },
    {
      id: '2',
      nome: 'Gerente',
      descricao: 'Acesso gerencial',
      nivel: 'gerente',
      permissoesPadrao: {
        dashboard: { visualizar: true, criar: false, editar: false, excluir: false },
        empresas: { visualizar: false, criar: false, editar: false, excluir: false },
        clientes: { visualizar: true, criar: true, editar: true, excluir: false },
        contratos: { visualizar: true, criar: true, editar: true, excluir: false },
        faturas: { visualizar: true, criar: true, editar: true, excluir: false },
        licencas: { visualizar: true, criar: true, editar: true, excluir: false },
        produtos: { visualizar: true, criar: true, editar: true, excluir: false },
        vendas: { visualizar: true, criar: true, editar: true, excluir: false },
        contabilidade: { visualizar: true, criar: false, editar: false, excluir: false },
        contasPagar: { visualizar: true, criar: true, editar: true, excluir: false },
        contasReceber: { visualizar: true, criar: false, editar: false, excluir: false },
        reunioes: { visualizar: true, criar: true, editar: true, excluir: false },
        projetos: { visualizar: true, criar: true, editar: true, excluir: false },
        consultoriaMensal: { visualizar: true, criar: true, editar: true, excluir: false },
        rh: { visualizar: true, criar: false, editar: false, excluir: false },
        usuarios: { visualizar: false, criar: false, editar: false, excluir: false },
        relatorios: { visualizar: true, criar: false, editar: false, excluir: false, exportar: true },
        auditoria: { visualizar: false, criar: false, editar: false, excluir: false },
        configuracoes: { visualizar: false, criar: false, editar: false, excluir: false },
      },
      ativo: true,
      criadoEm: '2024-01-01',
    },
  ]);

  const [sessoesUsuario, setSessoesUsuario] = useState<SessaoUsuario[]>([]);
  const [logsAcesso, setLogsAcesso] = useState<LogAcesso[]>([]);

  // Estados de RH
  const [colaboradores, setColaboradores] = useState<Colaborador[]>([
    {
      id: '1',
      empresaId: '1',
      filialId: '1',
      codigo: 'COL-001',
      nome: 'João Silva',
      cpf: '123.456.789-00',
      rg: '12.345.678-9',
      email: 'joao.silva@hdsolucoesisp.com.br',
      telefone: '(11) 99999-1111',
      whatsapp: '(11) 99999-1111',
      endereco: {
        logradouro: 'Rua das Flores',
        numero: '123',
        bairro: 'Centro',
        cidade: 'São Paulo',
        estado: 'SP',
        cep: '01234-567',
      },
      dadosPessoais: {
        dataNascimento: '1985-05-15',
        estadoCivil: 'casado',
        genero: 'masculino',
        nacionalidade: 'Brasileira',
        naturalidade: 'São Paulo - SP',
      },
      dadosProfissionais: {
        cargo: 'Gerente de TI',
        departamentoId: '1',
        setorId: '1',
        dataAdmissao: '2020-01-15',
        salario: 8500,
        tipoContrato: 'clt',
        cargaHoraria: 40,
        supervisor: 'Carlos Diretor',
      },
      dadosBancarios: {
        banco: 'Banco do Brasil',
        agencia: '1234-5',
        conta: '54321-0',
        tipoConta: 'corrente',
        pix: 'joao.silva@hdsolucoesisp.com.br',
      },
      documentos: {
        carteiraTrabalho: '123456789',
        pis: '12345678901',
        tituloEleitor: '123456789012',
      },
      status: 'ativo',
      observacoes: 'Colaborador exemplar, responsável pela área de TI',
      criadoEm: '2024-01-01',
      atualizadoEm: '2024-01-01',
    },
    {
      id: '2',
      empresaId: '1',
      filialId: '1',
      codigo: 'COL-002',
      nome: 'Maria Santos',
      cpf: '987.654.321-00',
      rg: '98.765.432-1',
      email: 'maria.santos@hdsolucoesisp.com.br',
      telefone: '(11) 88888-2222',
      whatsapp: '(11) 88888-2222',
      endereco: {
        logradouro: 'Av. Paulista',
        numero: '456',
        bairro: 'Bela Vista',
        cidade: 'São Paulo',
        estado: 'SP',
        cep: '01310-100',
      },
      dadosPessoais: {
        dataNascimento: '1990-08-22',
        estadoCivil: 'solteiro',
        genero: 'feminino',
        nacionalidade: 'Brasileira',
        naturalidade: 'Rio de Janeiro - RJ',
      },
      dadosProfissionais: {
        cargo: 'Analista Financeiro',
        departamentoId: '2',
        setorId: '2',
        dataAdmissao: '2021-03-10',
        salario: 6500,
        tipoContrato: 'clt',
        cargaHoraria: 40,
        supervisor: 'João Silva',
      },
      dadosBancarios: {
        banco: 'Itaú',
        agencia: '5678-9',
        conta: '98765-4',
        tipoConta: 'corrente',
        pix: '(11) 88888-2222',
      },
      documentos: {
        carteiraTrabalho: '987654321',
        pis: '98765432109',
        tituloEleitor: '987654321098',
      },
      status: 'ativo',
      observacoes: 'Responsável pela área financeira',
      criadoEm: '2024-01-01',
      atualizadoEm: '2024-01-01',
    },
  ]);

  const [departamentos, setDepartamentos] = useState<Departamento[]>([
    {
      id: '1',
      empresaId: '1',
      nome: 'Tecnologia da Informação',
      descricao: 'Departamento responsável pela infraestrutura e desenvolvimento',
      responsavelId: '1',
      centroCusto: 'CC-TI',
      orcamentoAnual: 500000,
      ativo: true,
      criadoEm: '2024-01-01',
      atualizadoEm: '2024-01-01',
    },
    {
      id: '2',
      empresaId: '1',
      nome: 'Financeiro',
      descricao: 'Departamento financeiro e contábil',
      responsavelId: '2',
      centroCusto: 'CC-FIN',
      orcamentoAnual: 300000,
      ativo: true,
      criadoEm: '2024-01-01',
      atualizadoEm: '2024-01-01',
    },
    {
      id: '3',
      empresaId: '1',
      nome: 'Comercial',
      descricao: 'Departamento de vendas e relacionamento com clientes',
      centroCusto: 'CC-COM',
      orcamentoAnual: 400000,
      ativo: true,
      criadoEm: '2024-01-01',
      atualizadoEm: '2024-01-01',
    },
  ]);

  const [setores, setSetores] = useState<Setor[]>([
    {
      id: '1',
      empresaId: '1',
      departamentoId: '1',
      nome: 'Desenvolvimento de Software',
      descricao: 'Setor responsável pelo desenvolvimento de aplicações',
      responsavelId: '1',
      localizacao: '2º Andar - Sala 201',
      ativo: true,
      criadoEm: '2024-01-01',
      atualizadoEm: '2024-01-01',
    },
    {
      id: '2',
      empresaId: '1',
      departamentoId: '2',
      nome: 'Contabilidade',
      descricao: 'Setor de contabilidade e controladoria',
      responsavelId: '2',
      localizacao: '1º Andar - Sala 105',
      ativo: true,
      criadoEm: '2024-01-01',
      atualizadoEm: '2024-01-01',
    },
    {
      id: '3',
      empresaId: '1',
      departamentoId: '3',
      nome: 'Vendas',
      descricao: 'Setor de vendas e prospecção',
      localizacao: '1º Andar - Sala 110',
      ativo: true,
      criadoEm: '2024-01-01',
      atualizadoEm: '2024-01-01',
    },
  ]);

  const [cargos, setCargos] = useState<Cargo[]>([]);
  const [ferias, setFerias] = useState<Ferias[]>([]);
  const [afastamentos, setAfastamentos] = useState<Afastamento[]>([]);
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);

  // Estados de seleção
  const [clienteSelecionado, setClienteSelecionado] = useState<Cliente | null>(null);

  // Funções de clientes
  const adicionarCliente = (cliente: Cliente) => {
    setClientes(prev => [...prev, cliente]);
  };

  const atualizarCliente = (id: string, dados: Partial<Cliente>) => {
    setClientes(prev => prev.map(cliente => 
      cliente.id === id ? { ...cliente, ...dados } : cliente
    ));
  };

  // Funções de contatos
  const adicionarContato = (contato: ContatoCliente) => {
    setContatos(prev => [...prev, contato]);
  };

  const atualizarContato = (id: string, dados: Partial<ContatoCliente>) => {
    setContatos(prev => prev.map(contato => 
      contato.id === id ? { ...contato, ...dados } : contato
    ));
  };

  const excluirContato = (id: string) => {
    setContatos(prev => prev.filter(contato => contato.id !== id));
  };

  // Funções de contratos
  const adicionarContrato = (contrato: Contrato) => {
    setContratos(prev => [...prev, contrato]);
  };

  const atualizarContrato = (id: string, dados: Partial<Contrato>) => {
    setContratos(prev => prev.map(contrato => 
      contrato.id === id ? { ...contrato, ...dados } : contrato
    ));
  };

  // Funções de faturas
  const adicionarFatura = (fatura: Fatura) => {
    setFaturas(prev => [...prev, fatura]);
  };

  const atualizarFatura = (id: string, dados: Partial<Fatura>) => {
    setFaturas(prev => prev.map(fatura => 
      fatura.id === id ? { ...fatura, ...dados } : fatura
    ));
  };

  const gerarFaturasVenda = (vendaId: string) => {
    const venda = vendas.find(v => v.id === vendaId);
    if (!venda) return;

    const condicao = condicoesPagamento.find(c => c.id === venda.condicaoPagamentoId);
    if (!condicao) return;

    const novasFaturas: Fatura[] = condicao.parcelas.map((parcela, index) => {
      const dataVencimento = new Date(venda.dataVenda);
      dataVencimento.setDate(dataVencimento.getDate() + parcela.dias);

      return {
        id: `${Date.now()}-${index}`,
        empresaId: venda.empresaId,
        filialId: venda.filialId,
        clienteId: venda.clienteId,
        contratoId: '', // Será preenchido se houver contrato
        numero: `${venda.numero}-${parcela.numero}`,
        valor: (venda.valorFinal * parcela.percentual) / 100,
        dataVencimento: dataVencimento.toISOString().split('T')[0],
        dataPagamento: '',
        status: 'Pendente',
        descricao: `Parcela ${parcela.numero}/${condicao.parcelas.length} - ${venda.numero}`,
        parcela: parcela.numero,
        totalParcelas: condicao.parcelas.length,
      };
    });

    setFaturas(prev => [...prev, ...novasFaturas]);
    atualizarVenda(vendaId, { status: 'Faturada' });
  };

  // Funções de licenças
  const adicionarLicenca = (licenca: Licenca) => {
    setLicencas(prev => [...prev, licenca]);
  };

  const atualizarLicenca = (id: string, dados: Partial<Licenca>) => {
    setLicencas(prev => prev.map(licenca => 
      licenca.id === id ? { ...licenca, ...dados } : licenca
    ));
  };

  // Funções de planos de venda
  const adicionarPlanoVenda = (plano: PlanoVenda) => {
    setPlanosVenda(prev => [...prev, plano]);
  };

  const atualizarPlanoVenda = (id: string, dados: Partial<PlanoVenda>) => {
    setPlanosVenda(prev => prev.map(plano => 
      plano.id === id ? { ...plano, ...dados } : plano
    ));
  };

  // Funções de produtos
  const adicionarProduto = (produto: Produto) => {
    setProdutos(prev => [...prev, produto]);
  };

  const atualizarProduto = (id: string, dados: Partial<Produto>) => {
    setProdutos(prev => prev.map(produto => 
      produto.id === id ? { ...produto, ...dados } : produto
    ));
  };

  // Funções de reuniões
  const adicionarReuniao = (reuniao: Reuniao) => {
    setReunioes(prev => [...prev, reuniao]);
  };

  const atualizarReuniao = (id: string, dados: Partial<Reuniao>) => {
    setReunioes(prev => prev.map(reuniao => 
      reuniao.id === id ? { ...reuniao, ...dados } : reuniao
    ));
    
    // Atualizar também no localStorage para acesso público
    const reunioesExistentes = JSON.parse(localStorage.getItem('reunioes') || '[]');
    const reunioesAtualizadas = reunioesExistentes.map((r: any) => 
      r.id === id ? { ...r, ...dados } : r
    );
    localStorage.setItem('reunioes', JSON.stringify(reunioesAtualizadas));
  };

  // Funções de performance
  const adicionarPerformanceMensal = (performance: PerformanceMensal) => {
    setPerformanceMensal(prev => [...prev, performance]);
  };

  const atualizarPerformanceMensal = (id: string, dados: Partial<PerformanceMensal>) => {
    setPerformanceMensal(prev => prev.map(perf => 
      perf.id === id ? { ...perf, ...dados } : perf
    ));
  };

  // Funções de empresa
  const adicionarEmpresa = (empresa: Empresa) => {
    setEmpresas(prev => [...prev, empresa]);
  };

  const atualizarEmpresa = (id: string, dados: Partial<Empresa>) => {
    setEmpresas(prev => prev.map(empresa => 
      empresa.id === id ? { ...empresa, ...dados } : empresa
    ));
  };

  const adicionarFilial = (filial: Filial) => {
    setFiliais(prev => [...prev, filial]);
  };

  const atualizarFilial = (id: string, dados: Partial<Filial>) => {
    setFiliais(prev => prev.map(filial => 
      filial.id === id ? { ...filial, ...dados } : filial
    ));
  };

  // Funções de contabilidade
  const adicionarContaContabil = (conta: ContaContabil) => {
    setContasContabeis(prev => [...prev, conta]);
  };

  const atualizarContaContabil = (id: string, dados: Partial<ContaContabil>) => {
    setContasContabeis(prev => prev.map(conta => 
      conta.id === id ? { ...conta, ...dados } : conta
    ));
  };

  const excluirContaContabil = (id: string) => {
    setContasContabeis(prev => prev.filter(conta => conta.id !== id));
  };

  const adicionarLancamentoContabil = (lancamento: LancamentoContabil) => {
    setLancamentosContabeis(prev => [...prev, lancamento]);
  };

  const adicionarContaPagar = (conta: ContaPagar) => {
    setContasPagar(prev => [...prev, conta]);
  };

  const atualizarContaPagar = (id: string, dados: Partial<ContaPagar>) => {
    setContasPagar(prev => prev.map(conta => 
      conta.id === id ? { ...conta, ...dados } : conta
    ));
  };

  const adicionarContaBancaria = (conta: ContaBancaria) => {
    setContasBancarias(prev => [...prev, conta]);
  };

  const atualizarContaBancaria = (id: string, dados: Partial<ContaBancaria>) => {
    setContasBancarias(prev => prev.map(conta => 
      conta.id === id ? { ...conta, ...dados } : conta
    ));
  };

  const adicionarFornecedor = (fornecedor: Fornecedor) => {
    setFornecedores(prev => [...prev, fornecedor]);
  };

  const atualizarFornecedor = (id: string, dados: Partial<Fornecedor>) => {
    setFornecedores(prev => prev.map(fornecedor => 
      fornecedor.id === id ? { ...fornecedor, ...dados } : fornecedor
    ));
  };

  const realizarPagamento = (contaId: string, dadosPagamento: any) => {
    // Atualizar conta para paga
    atualizarContaPagar(contaId, {
      status: 'Pago',
      dataPagamento: dadosPagamento.dataPagamento,
      valorPago: dadosPagamento.valor,
      jurosMulta: dadosPagamento.jurosMulta || 0,
      desconto: dadosPagamento.desconto || 0,
      formaPagamento: dadosPagamento.formaPagamento,
      contaBancariaId: dadosPagamento.contaBancariaId,
    });

    // Registrar pagamento
    const novoPagamento: PagamentoConta = {
      id: Date.now().toString(),
      contaPagarId: contaId,
      valor: dadosPagamento.valor,
      dataPagamento: dadosPagamento.dataPagamento,
      formaPagamento: dadosPagamento.formaPagamento,
      contaBancariaId: dadosPagamento.contaBancariaId,
      observacoes: dadosPagamento.observacoes,
      comprovante: dadosPagamento.comprovante,
    };

    setPagamentosConta(prev => [...prev, novoPagamento]);

    // Atualizar saldo da conta bancária
    if (dadosPagamento.contaBancariaId) {
      atualizarContaBancaria(dadosPagamento.contaBancariaId, {
        saldoAtual: contasBancarias.find(c => c.id === dadosPagamento.contaBancariaId)!.saldoAtual - dadosPagamento.valor
      });
    }
  };

  const gerarLancamentoPagamento = (conta: ContaPagar) => {
    const novoLancamento: LancamentoContabil = {
      id: Date.now().toString(),
      data: conta.dataPagamento || new Date().toISOString().split('T')[0],
      historico: `Pagamento - ${conta.descricao}`,
      valor: conta.valorPago || conta.valor,
      contaDebito: conta.contaContabilId,
      contaCredito: '3', // Conta de caixa
      documento: conta.documento || '',
      tipo: 'Despesa',
      status: 'Definitivo',
      criadoEm: new Date().toISOString().split('T')[0],
    };

    adicionarLancamentoContabil(novoLancamento);
  };

  const gerarRecorrencia = (contaId: string) => {
    const conta = contasPagar.find(c => c.id === contaId);
    if (!conta || !conta.isRecorrente) return;

    const proximaData = new Date(conta.dataVencimento);
    
    switch (conta.frequenciaRecorrencia) {
      case 'Mensal':
        proximaData.setMonth(proximaData.getMonth() + 1);
        break;
      case 'Bimestral':
        proximaData.setMonth(proximaData.getMonth() + 2);
        break;
      case 'Trimestral':
        proximaData.setMonth(proximaData.getMonth() + 3);
        break;
      case 'Semestral':
        proximaData.setMonth(proximaData.getMonth() + 6);
        break;
      case 'Anual':
        proximaData.setFullYear(proximaData.getFullYear() + 1);
        break;
    }

    const novaConta: ContaPagar = {
      ...conta,
      id: Date.now().toString(),
      dataVencimento: proximaData.toISOString().split('T')[0],
      dataPagamento: '',
      status: 'Pendente',
      valorPago: 0,
      jurosMulta: 0,
      desconto: 0,
      criadoEm: new Date().toISOString().split('T')[0],
    };

    adicionarContaPagar(novaConta);
  };

  // Funções de consultoria
  const adicionarConsultoriaMensal = (consultoria: ConsultoriaMensal) => {
    setConsultoriasMensais(prev => [...prev, consultoria]);
  };

  const atualizarConsultoriaMensal = (id: string, dados: Partial<ConsultoriaMensal>) => {
    setConsultoriasMensais(prev => prev.map(consultoria => 
      consultoria.id === id ? { ...consultoria, ...dados } : consultoria
    ));
  };

  const adicionarMetaMensal = (meta: MetaMensal) => {
    setMetasMensais(prev => [...prev, meta]);
  };

  const atualizarMetaMensal = (id: string, dados: Partial<MetaMensal>) => {
    setMetasMensais(prev => prev.map(meta => 
      meta.id === id ? { ...meta, ...dados } : meta
    ));
  };

  const excluirMetaMensal = (id: string) => {
    setMetasMensais(prev => prev.filter(meta => meta.id !== id));
  };

  const adicionarDiagnosticoMensal = (diagnostico: DiagnosticoMensal) => {
    setDiagnosticosMensais(prev => [...prev, diagnostico]);
  };

  const atualizarDiagnosticoMensal = (id: string, dados: Partial<DiagnosticoMensal>) => {
    setDiagnosticosMensais(prev => prev.map(diagnostico => 
      diagnostico.id === id ? { ...diagnostico, ...dados } : diagnostico
    ));
  };

  const adicionarAcaoConsultoria = (acao: AcaoConsultoria) => {
    setAcoesConsultoria(prev => [...prev, acao]);
  };

  const atualizarAcaoConsultoria = (id: string, dados: Partial<AcaoConsultoria>) => {
    setAcoesConsultoria(prev => prev.map(acao => 
      acao.id === id ? { ...acao, ...dados } : acao
    ));
  };

  const excluirAcaoConsultoria = (id: string) => {
    setAcoesConsultoria(prev => prev.filter(acao => acao.id !== id));
  };

  const adicionarProcessoCliente = (processo: ProcessoCliente) => {
    setProcessosCliente(prev => [...prev, processo]);
  };

  const atualizarProcessoCliente = (id: string, dados: Partial<ProcessoCliente>) => {
    setProcessosCliente(prev => prev.map(processo => 
      processo.id === id ? { ...processo, ...dados } : processo
    ));
  };

  const adicionarBriefingReuniao = (briefing: BriefingReuniao) => {
    setBriefingsReuniao(prev => [...prev, briefing]);
  };

  const atualizarBriefingReuniao = (id: string, dados: Partial<BriefingReuniao>) => {
    setBriefingsReuniao(prev => prev.map(briefing => 
      briefing.id === id ? { ...briefing, ...dados } : briefing
    ));
  };

  const adicionarOportunidadeNegocio = (oportunidade: OportunidadeNegocio) => {
    setOportunidadesNegocio(prev => [...prev, oportunidade]);
  };

  const atualizarOportunidadeNegocio = (id: string, dados: Partial<OportunidadeNegocio>) => {
    setOportunidadesNegocio(prev => prev.map(oportunidade => 
      oportunidade.id === id ? { ...oportunidade, ...dados } : oportunidade
    ));
  };

  const excluirOportunidadeNegocio = (id: string) => {
    setOportunidadesNegocio(prev => prev.filter(oportunidade => oportunidade.id !== id));
  };

  const adicionarEventoLinhaTempo = (evento: EventoLinhaTempo) => {
    setEventosLinhaTempo(prev => [...prev, evento]);
  };

  const adicionarRelatorioMensal = (relatorio: RelatorioMensal) => {
    setRelatoriosMensais(prev => [...prev, relatorio]);
  };

  // Funções de vendas
  const adicionarCondicaoPagamento = (condicao: CondicaoPagamento) => {
    setCondicoesPagamento(prev => [...prev, condicao]);
  };

  const atualizarCondicaoPagamento = (id: string, dados: Partial<CondicaoPagamento>) => {
    setCondicoesPagamento(prev => prev.map(condicao => 
      condicao.id === id ? { ...condicao, ...dados } : condicao
    ));
  };

  const excluirCondicaoPagamento = (id: string) => {
    setCondicoesPagamento(prev => prev.filter(condicao => condicao.id !== id));
  };

  const adicionarVenda = (venda: Venda) => {
    setVendas(prev => [...prev, venda]);
  };

  const atualizarVenda = (id: string, dados: Partial<Venda>) => {
    setVendas(prev => prev.map(venda => 
      venda.id === id ? { ...venda, ...dados } : venda
    ));
  };

  // Funções de cobrança
  const adicionarCarteiraCobranca = (carteira: CarteiraCobranca) => {
    setCarteirasCobranca(prev => [...prev, carteira]);
  };

  const atualizarCarteiraCobranca = (id: string, dados: Partial<CarteiraCobranca>) => {
    setCarteirasCobranca(prev => prev.map(carteira => 
      carteira.id === id ? { ...carteira, ...dados } : carteira
    ));
  };

  const adicionarModeloContrato = (modelo: ModeloContrato) => {
    setModelosContrato(prev => [...prev, modelo]);
  };

  const atualizarModeloContrato = (id: string, dados: Partial<ModeloContrato>) => {
    setModelosContrato(prev => prev.map(modelo => 
      modelo.id === id ? { ...modelo, ...dados } : modelo
    ));
  };

  const adicionarRegraCobranca = (regra: RegraCobranca) => {
    setRegrasCobranca(prev => [...prev, regra]);
  };

  const atualizarRegraCobranca = (id: string, dados: Partial<RegraCobranca>) => {
    setRegrasCobranca(prev => prev.map(regra => 
      regra.id === id ? { ...regra, ...dados } : regra
    ));
  };

  // Funções de autenticação
  const login = (email: string, senha: string): boolean => {
    const usuario = usuariosSistema.find(u => u.email === email && u.senha === senha && u.ativo);
    
    if (usuario) {
      setUsuarioLogado(usuario);
      
      // Atualizar último login
      atualizarUsuario(usuario.id, {
        ultimoLogin: new Date().toISOString(),
      });
      
      // Registrar log de acesso
      const logLogin: LogAcesso = {
        id: Date.now().toString(),
        usuarioId: usuario.id,
        acao: 'login',
        ipAddress: '192.168.1.100',
        userAgent: navigator.userAgent,
        sucesso: true,
        timestamp: new Date().toISOString(),
      };
      setLogsAcesso(prev => [...prev, logLogin]);
      
      return true;
    }
    
    return false;
  };

  const logout = () => {
    if (usuarioLogado) {
      // Registrar logout
      const logLogout: LogAcesso = {
        id: Date.now().toString(),
        usuarioId: usuarioLogado.id,
        acao: 'logout',
        ipAddress: '192.168.1.100',
        userAgent: navigator.userAgent,
        sucesso: true,
        timestamp: new Date().toISOString(),
      };
      setLogsAcesso(prev => [...prev, logLogout]);
    }
    
    setUsuarioLogado(null);
  };

  const adicionarUsuario = (usuario: Usuario) => {
    setUsuariosSistema(prev => [...prev, usuario]);
  };

  const atualizarUsuario = (id: string, dados: Partial<Usuario>) => {
    setUsuariosSistema(prev => prev.map(usuario => 
      usuario.id === id ? { ...usuario, ...dados } : usuario
    ));
  };

  // Funções de RH
  const adicionarColaborador = (colaborador: Colaborador) => {
    setColaboradores(prev => [...prev, colaborador]);
  };

  const atualizarColaborador = (id: string, dados: Partial<Colaborador>) => {
    setColaboradores(prev => prev.map(colaborador => 
      colaborador.id === id ? { ...colaborador, ...dados } : colaborador
    ));
  };

  const adicionarDepartamento = (departamento: Departamento) => {
    setDepartamentos(prev => [...prev, departamento]);
  };

  const atualizarDepartamento = (id: string, dados: Partial<Departamento>) => {
    setDepartamentos(prev => prev.map(departamento => 
      departamento.id === id ? { ...departamento, ...dados } : departamento
    ));
  };

  const adicionarSetor = (setor: Setor) => {
    setSetores(prev => [...prev, setor]);
  };

  const atualizarSetor = (id: string, dados: Partial<Setor>) => {
    setSetores(prev => prev.map(setor => 
      setor.id === id ? { ...setor, ...dados } : setor
    ));
  };

  const value: AppContextType = {
    // Estados principais
    clientes,
    contratos,
    faturas,
    licencas,
    planosVenda,
    produtos,
    reunioes,
    performanceMensal,
    contatos,
    
    // Estados de empresa
    empresas,
    filiais,
    empresaSelecionada,
    filialAtiva,
    
    // Estados de contabilidade
    contasContabeis,
    lancamentosContabeis,
    contasPagar,
    contasBancarias,
    fornecedores,
    pagamentosConta,
    
    // Estados de consultoria
    consultoriasMensais,
    metasMensais,
    diagnosticosMensais,
    acoesConsultoria,
    processosCliente,
    briefingsReuniao,
    oportunidadesNegocio,
    eventosLinhaTempo,
    relatoriosMensais,
    
    // Estados de vendas
    condicoesPagamento,
    vendas,
    
    // Estados de cobrança
    carteirasCobranca,
    modelosContrato,
    regrasCobranca,
    historicoCobranca,
    logsCobranca,
    
    // Estados de autenticação
    usuarioLogado,
    usuariosSistema,
    perfisUsuario,
    sessoesUsuario,
    logsAcesso,
    
    // Estados de RH
    colaboradores,
    departamentos,
    setores,
    cargos,
    ferias,
    afastamentos,
    avaliacoes,
    
    // Estados de seleção
    clienteSelecionado,
    
    // Funções de clientes
    adicionarCliente,
    atualizarCliente,
    setClienteSelecionado,
    
    // Funções de contatos
    adicionarContato,
    atualizarContato,
    excluirContato,
    
    // Funções de contratos
    adicionarContrato,
    atualizarContrato,
    
    // Funções de faturas
    adicionarFatura,
    atualizarFatura,
    gerarFaturasVenda,
    
    // Funções de licenças
    adicionarLicenca,
    atualizarLicenca,
    
    // Funções de planos de venda
    adicionarPlanoVenda,
    atualizarPlanoVenda,
    
    // Funções de produtos
    adicionarProduto,
    atualizarProduto,
    
    // Funções de reuniões
    adicionarReuniao,
    atualizarReuniao,
    
    // Funções de performance
    adicionarPerformanceMensal,
    atualizarPerformanceMensal,
    
    // Funções de empresa
    adicionarEmpresa,
    atualizarEmpresa,
    adicionarFilial,
    atualizarFilial,
    setEmpresaSelecionada,
    
    // Funções de contabilidade
    adicionarContaContabil,
    atualizarContaContabil,
    excluirContaContabil,
    adicionarLancamentoContabil,
    adicionarContaPagar,
    atualizarContaPagar,
    adicionarContaBancaria,
    atualizarContaBancaria,
    adicionarFornecedor,
    atualizarFornecedor,
    realizarPagamento,
    gerarLancamentoPagamento,
    gerarRecorrencia,
    
    // Funções de consultoria
    adicionarConsultoriaMensal,
    atualizarConsultoriaMensal,
    adicionarMetaMensal,
    atualizarMetaMensal,
    excluirMetaMensal,
    adicionarDiagnosticoMensal,
    atualizarDiagnosticoMensal,
    adicionarAcaoConsultoria,
    atualizarAcaoConsultoria,
    excluirAcaoConsultoria,
    adicionarProcessoCliente,
    atualizarProcessoCliente,
    adicionarBriefingReuniao,
    atualizarBriefingReuniao,
    adicionarOportunidadeNegocio,
    atualizarOportunidadeNegocio,
    excluirOportunidadeNegocio,
    adicionarEventoLinhaTempo,
    adicionarRelatorioMensal,
    
    // Funções de vendas
    adicionarCondicaoPagamento,
    atualizarCondicaoPagamento,
    excluirCondicaoPagamento,
    adicionarVenda,
    atualizarVenda,
    
    // Funções de cobrança
    adicionarCarteiraCobranca,
    atualizarCarteiraCobranca,
    adicionarModeloContrato,
    atualizarModeloContrato,
    adicionarRegraCobranca,
    atualizarRegraCobranca,
    
    // Funções de autenticação
    login,
    logout,
    adicionarUsuario,
    atualizarUsuario,
    
    // Funções de RH
    adicionarColaborador,
    atualizarColaborador,
    adicionarDepartamento,
    atualizarDepartamento,
    adicionarSetor,
    atualizarSetor,
    logsAuditoria,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}