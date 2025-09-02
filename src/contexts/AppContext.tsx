import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Cliente, Contrato, Fatura, Licenca, PlanoVenda, Produto, Reuniao, ContatoCliente } from '../types';
import { Empresa, Filial } from '../types/empresa';
import { Usuario, PerfilUsuario } from '../types/auth';
import { Colaborador, Departamento, Setor } from '../types/rh';
import { EventoAgenda } from '../types/agenda';

interface AppContextType {
  // Estados principais
  clientes: Cliente[];
  contratos: Contrato[];
  faturas: Fatura[];
  licencas: Licenca[];
  planosVenda: PlanoVenda[];
  produtos: Produto[];
  reunioes: Reuniao[];
  contatos: ContatoCliente[];
  
  // Estados de empresa
  empresas: Empresa[];
  filiais: Filial[];
  empresaSelecionada: Empresa | null;
  filialAtiva: Filial | null;
  
  // Estados de usuário
  usuarios: Usuario[];
  perfisUsuario: PerfilUsuario[];
  usuarioLogado: Usuario | null;
  
  // Estados de RH
  colaboradores: Colaborador[];
  departamentos: Departamento[];
  setores: Setor[];
  
  // Estados de agenda
  eventosAgenda: EventoAgenda[];
  
  // Estados básicos de contabilidade
  contasContabeis: any[];
  lancamentosContabeis: any[];
  fornecedores: any[];
  contasPagar: any[];
  contasBancarias: any[];
  pagamentosConta: any[];
  
  // Estados de consultoria (vazios por enquanto)
  performanceMensal: any[];
  metasMensais: any[];
  diagnosticosMensais: any[];
  acoesConsultoria: any[];
  processosCliente: any[];
  briefingsReuniao: any[];
  oportunidadesNegocio: any[];
  eventosLinhaTempo: any[];
  relatoriosMensais: any[];
  consultoriasMensais: any[];
  
  // Estados de cobrança (vazios por enquanto)
  carteirasCobranca: any[];
  modelosContrato: any[];
  regrasCobranca: any[];
  historicoCobranca: any[];
  logsCobranca: any[];
  
  // Estados de vendas (vazios por enquanto)
  vendas: any[];
  condicoesPagamento: any[];
  
  // Seleções
  clienteSelecionado: Cliente | null;
  
  // Funções básicas
  adicionarCliente: (cliente: Cliente) => void;
  atualizarCliente: (id: string, dados: Partial<Cliente>) => void;
  setClienteSelecionado: (cliente: Cliente | null) => void;
  adicionarContrato: (contrato: Contrato) => void;
  atualizarContrato: (id: string, dados: Partial<Contrato>) => void;
  adicionarFatura: (fatura: Fatura) => void;
  atualizarFatura: (id: string, dados: Partial<Fatura>) => void;
  adicionarLicenca: (licenca: Licenca) => void;
  atualizarLicenca: (id: string, dados: Partial<Licenca>) => void;
  adicionarPlanoVenda: (plano: PlanoVenda) => void;
  atualizarPlanoVenda: (id: string, dados: Partial<PlanoVenda>) => void;
  adicionarProduto: (produto: Produto) => void;
  atualizarProduto: (id: string, dados: Partial<Produto>) => void;
  adicionarReuniao: (reuniao: Reuniao) => void;
  atualizarReuniao: (id: string, dados: Partial<Reuniao>) => void;
  adicionarContato: (contato: ContatoCliente) => void;
  atualizarContato: (id: string, dados: Partial<ContatoCliente>) => void;
  excluirContato: (id: string) => void;
  
  // Funções de empresa
  adicionarEmpresa: (empresa: Empresa) => void;
  atualizarEmpresa: (id: string, dados: Partial<Empresa>) => void;
  setEmpresaSelecionada: (empresa: Empresa | null) => void;
  adicionarFilial: (filial: Filial) => void;
  atualizarFilial: (id: string, dados: Partial<Filial>) => void;
  
  // Funções de usuário
  adicionarUsuario: (usuario: Usuario) => void;
  atualizarUsuario: (id: string, dados: Partial<Usuario>) => void;
  login: (email: string, senha: string) => boolean;
  logout: () => void;
  
  // Funções de RH
  adicionarColaborador: (colaborador: Colaborador) => void;
  atualizarColaborador: (id: string, dados: Partial<Colaborador>) => void;
  adicionarDepartamento: (departamento: Departamento) => void;
  atualizarDepartamento: (id: string, dados: Partial<Departamento>) => void;
  adicionarSetor: (setor: Setor) => void;
  atualizarSetor: (id: string, dados: Partial<Setor>) => void;
  
  // Funções de agenda
  adicionarEventoAgenda: (evento: EventoAgenda) => void;
  atualizarEventoAgenda: (id: string, dados: Partial<EventoAgenda>) => void;
  
  // Funções básicas de contabilidade (stubs)
  adicionarContaContabil: (conta: any) => void;
  atualizarContaContabil: (id: string, dados: any) => void;
  excluirContaContabil: (id: string) => void;
  adicionarLancamentoContabil: (lancamento: any) => void;
  adicionarFornecedor: (fornecedor: any) => void;
  atualizarFornecedor: (id: string, dados: any) => void;
  adicionarContaPagar: (conta: any) => void;
  atualizarContaPagar: (id: string, dados: any) => void;
  adicionarContaBancaria: (conta: any) => void;
  atualizarContaBancaria: (id: string, dados: any) => void;
  realizarPagamento: (contaId: string, dados: any) => void;
  gerarLancamentoPagamento: (conta: any) => void;
  gerarRecorrencia: (contaId: string) => void;
  
  // Funções de consultoria (stubs)
  adicionarPerformanceMensal: (performance: any) => void;
  atualizarPerformanceMensal: (id: string, dados: any) => void;
  adicionarMetaMensal: (meta: any) => void;
  atualizarMetaMensal: (id: string, dados: any) => void;
  excluirMetaMensal: (id: string) => void;
  adicionarDiagnosticoMensal: (diagnostico: any) => void;
  atualizarDiagnosticoMensal: (id: string, dados: any) => void;
  adicionarAcaoConsultoria: (acao: any) => void;
  atualizarAcaoConsultoria: (id: string, dados: any) => void;
  excluirAcaoConsultoria: (id: string) => void;
  adicionarProcessoCliente: (processo: any) => void;
  atualizarProcessoCliente: (id: string, dados: any) => void;
  adicionarBriefingReuniao: (briefing: any) => void;
  atualizarBriefingReuniao: (id: string, dados: any) => void;
  adicionarOportunidadeNegocio: (oportunidade: any) => void;
  atualizarOportunidadeNegocio: (id: string, dados: any) => void;
  excluirOportunidadeNegocio: (id: string) => void;
  adicionarEventoLinhaTempo: (evento: any) => void;
  adicionarRelatorioMensal: (relatorio: any) => void;
  
  // Funções de cobrança (stubs)
  adicionarCarteiraCobranca: (carteira: any) => void;
  atualizarCarteiraCobranca: (id: string, dados: any) => void;
  adicionarModeloContrato: (modelo: any) => void;
  atualizarModeloContrato: (id: string, dados: any) => void;
  adicionarRegraCobranca: (regra: any) => void;
  atualizarRegraCobranca: (id: string, dados: any) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
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
      valorTotal: 120000
    }
  ]);

  const [contratos, setContratos] = useState<Contrato[]>([
    {
      id: '1',
      empresaId: '1',
      filialId: '1',
      clienteId: '1',
      nome: 'Contrato de Consultoria TechCorp',
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
      observacoes: 'Contrato de consultoria mensal'
    }
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
      descricao: 'Consultoria Janeiro 2024',
      parcela: 1,
      totalParcelas: 12
    }
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
      produtoId: '1'
    }
  ]);

  const [planosVenda, setPlanosVenda] = useState<PlanoVenda[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [reunioes, setReunioes] = useState<Reuniao[]>([]);
  const [contatos, setContatos] = useState<ContatoCliente[]>([]);

  // Estados de empresa
  const [empresas, setEmpresas] = useState<Empresa[]>([
    {
      id: '1',
      razaoSocial: 'HD Soluções ISP Ltda',
      nomeFantasia: 'HD Soluções ISP',
      cnpj: '12.345.678/0001-90',
      inscricaoEstadual: '123456789',
      email: 'contato@hdsolucoesisp.com',
      telefone: '(11) 3333-4444',
      endereco: {
        logradouro: 'Rua das Empresas',
        numero: '123',
        bairro: 'Centro',
        cidade: 'São Paulo',
        estado: 'SP',
        cep: '01000-000'
      },
      configuracoes: {
        moeda: 'BRL',
        timezone: 'America/Sao_Paulo',
        formatoData: 'DD/MM/YYYY'
      },
      ativa: true,
      criadoEm: '2024-01-01',
      atualizadoEm: '2024-01-01'
    }
  ]);

  const [filiais, setFiliais] = useState<Filial[]>([
    {
      id: '1',
      empresaId: '1',
      codigo: '001',
      nome: 'Matriz São Paulo',
      isMatriz: true,
      email: 'matriz@hdsolucoesisp.com',
      telefone: '(11) 3333-4444',
      endereco: {
        logradouro: 'Rua das Empresas',
        numero: '123',
        bairro: 'Centro',
        cidade: 'São Paulo',
        estado: 'SP',
        cep: '01000-000'
      },
      responsavel: {
        nome: 'João Silva',
        email: 'joao@hdsolucoesisp.com',
        telefone: '(11) 99999-9999',
        cargo: 'Gerente Geral'
      },
      configuracoes: {
        permiteVendas: true,
        permiteCompras: true,
        permiteEstoque: true,
        centroCusto: 'CC-001'
      },
      ativa: true,
      criadoEm: '2024-01-01',
      atualizadoEm: '2024-01-01'
    }
  ]);

  const [empresaSelecionada, setEmpresaSelecionada] = useState<Empresa | null>(empresas[0] || null);
  const [filialAtiva, setFilialAtiva] = useState<Filial | null>(filiais[0] || null);

  // Estados de usuário
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [perfisUsuario] = useState<PerfilUsuario[]>([
    {
      id: '1',
      nome: 'Administrador',
      descricao: 'Acesso total ao sistema',
      nivel: 'admin',
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
        configuracoes: { visualizar: true, criar: true, editar: true, excluir: true }
      },
      ativo: true,
      criadoEm: '2024-01-01'
    }
  ]);

  const [usuarioLogado, setUsuarioLogado] = useState<Usuario | null>({
    id: '1',
    email: 'admin@consultorpro.com',
    senha: 'admin123',
    nome: 'Administrador',
    ativo: true,
    colaboradorId: '1',
    empresaId: '1',
    perfil: perfisUsuario[0],
    permissoes: perfisUsuario[0].permissoesPadrao,
    criadoEm: '2024-01-01',
    atualizadoEm: '2024-01-01'
  });

  // Estados de RH
  const [colaboradores, setColaboradores] = useState<Colaborador[]>([]);
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [setores, setSetores] = useState<Setor[]>([]);

  // Estados de agenda
  const [eventosAgenda, setEventosAgenda] = useState<EventoAgenda[]>([]);

  // Estados de contabilidade
  const [contasContabeis, setContasContabeis] = useState<ContaContabil[]>([
    // ATIVO
    {
      id: '1',
      codigo: '1',
      nome: 'ATIVO',
      tipo: 'Ativo',
      subtipo: 'Grupo',
      contaPai: '',
      natureza: 'Devedora',
      nivel: 1,
      ativa: true
    },
    {
      id: '2',
      codigo: '1.1',
      nome: 'ATIVO CIRCULANTE',
      tipo: 'Ativo',
      subtipo: 'Subgrupo',
      contaPai: '1',
      natureza: 'Devedora',
      nivel: 2,
      ativa: true
    },
    {
      id: '3',
      codigo: '1.1.1',
      nome: 'Caixa e Equivalentes de Caixa',
      tipo: 'Ativo',
      subtipo: 'Subgrupo',
      contaPai: '2',
      natureza: 'Devedora',
      nivel: 3,
      ativa: true
    },
    {
      id: '4',
      codigo: '1.1.1.01',
      nome: 'Caixa',
      tipo: 'Ativo',
      subtipo: 'Conta',
      contaPai: '3',
      natureza: 'Devedora',
      nivel: 4,
      ativa: true
    },
    {
      id: '5',
      codigo: '1.1.1.02',
      nome: 'Bancos Conta Movimento',
      tipo: 'Ativo',
      subtipo: 'Conta',
      contaPai: '3',
      natureza: 'Devedora',
      nivel: 4,
      ativa: true
    },
    {
      id: '6',
      codigo: '1.1.1.03',
      nome: 'Aplicações Financeiras',
      tipo: 'Ativo',
      subtipo: 'Conta',
      contaPai: '3',
      natureza: 'Devedora',
      nivel: 4,
      ativa: true
    },
    {
      id: '7',
      codigo: '1.1.2',
      nome: 'Contas a Receber',
      tipo: 'Ativo',
      subtipo: 'Subgrupo',
      contaPai: '2',
      natureza: 'Devedora',
      nivel: 3,
      ativa: true
    },
    {
      id: '8',
      codigo: '1.1.2.01',
      nome: 'Clientes',
      tipo: 'Ativo',
      subtipo: 'Conta',
      contaPai: '7',
      natureza: 'Devedora',
      nivel: 4,
      ativa: true
    },
    {
      id: '9',
      codigo: '1.1.2.02',
      nome: 'Duplicatas a Receber',
      tipo: 'Ativo',
      subtipo: 'Conta',
      contaPai: '7',
      natureza: 'Devedora',
      nivel: 4,
      ativa: true
    },
    {
      id: '10',
      codigo: '1.1.3',
      nome: 'Estoques',
      tipo: 'Ativo',
      subtipo: 'Subgrupo',
      contaPai: '2',
      natureza: 'Devedora',
      nivel: 3,
      ativa: true
    },
    {
      id: '11',
      codigo: '1.1.3.01',
      nome: 'Estoque de Mercadorias',
      tipo: 'Ativo',
      subtipo: 'Conta',
      contaPai: '10',
      natureza: 'Devedora',
      nivel: 4,
      ativa: true
    },
    {
      id: '12',
      codigo: '1.1.4',
      nome: 'Impostos a Recuperar',
      tipo: 'Ativo',
      subtipo: 'Subgrupo',
      contaPai: '2',
      natureza: 'Devedora',
      nivel: 3,
      ativa: true
    },
    {
      id: '13',
      codigo: '1.1.4.01',
      nome: 'ICMS a Recuperar',
      tipo: 'Ativo',
      subtipo: 'Conta',
      contaPai: '12',
      natureza: 'Devedora',
      nivel: 4,
      ativa: true
    },
    {
      id: '14',
      codigo: '1.1.4.02',
      nome: 'PIS a Recuperar',
      tipo: 'Ativo',
      subtipo: 'Conta',
      contaPai: '12',
      natureza: 'Devedora',
      nivel: 4,
      ativa: true
    },
    {
      id: '15',
      codigo: '1.1.4.03',
      nome: 'COFINS a Recuperar',
      tipo: 'Ativo',
      subtipo: 'Conta',
      contaPai: '12',
      natureza: 'Devedora',
      nivel: 4,
      ativa: true
    },
    {
      id: '16',
      codigo: '1.2',
      nome: 'ATIVO NÃO CIRCULANTE',
      tipo: 'Ativo',
      subtipo: 'Subgrupo',
      contaPai: '1',
      natureza: 'Devedora',
      nivel: 2,
      ativa: true
    },
    {
      id: '17',
      codigo: '1.2.1',
      nome: 'Realizável a Longo Prazo',
      tipo: 'Ativo',
      subtipo: 'Subgrupo',
      contaPai: '16',
      natureza: 'Devedora',
      nivel: 3,
      ativa: true
    },
    {
      id: '18',
      codigo: '1.2.1.01',
      nome: 'Contas a Receber LP',
      tipo: 'Ativo',
      subtipo: 'Conta',
      contaPai: '17',
      natureza: 'Devedora',
      nivel: 4,
      ativa: true
    },
    {
      id: '19',
      codigo: '1.2.2',
      nome: 'Imobilizado',
      tipo: 'Ativo',
      subtipo: 'Subgrupo',
      contaPai: '16',
      natureza: 'Devedora',
      nivel: 3,
      ativa: true
    },
    {
      id: '20',
      codigo: '1.2.2.01',
      nome: 'Móveis e Utensílios',
      tipo: 'Ativo',
      subtipo: 'Conta',
      contaPai: '19',
      natureza: 'Devedora',
      nivel: 4,
      ativa: true
    },
    {
      id: '21',
      codigo: '1.2.2.02',
      nome: 'Equipamentos de Informática',
      tipo: 'Ativo',
      subtipo: 'Conta',
      contaPai: '19',
      natureza: 'Devedora',
      nivel: 4,
      ativa: true
    },
    {
      id: '22',
      codigo: '1.2.2.03',
      nome: 'Veículos',
      tipo: 'Ativo',
      subtipo: 'Conta',
      contaPai: '19',
      natureza: 'Devedora',
      nivel: 4,
      ativa: true
    },
    {
      id: '23',
      codigo: '1.2.2.04',
      nome: '(-) Depreciação Acumulada',
      tipo: 'Ativo',
      subtipo: 'Conta',
      contaPai: '19',
      natureza: 'Credora',
      nivel: 4,
      ativa: true
    },
    {
      id: '24',
      codigo: '1.2.3',
      nome: 'Intangível',
      tipo: 'Ativo',
      subtipo: 'Subgrupo',
      contaPai: '16',
      natureza: 'Devedora',
      nivel: 3,
      ativa: true
    },
    {
      id: '25',
      codigo: '1.2.3.01',
      nome: 'Software e Licenças',
      tipo: 'Ativo',
      subtipo: 'Conta',
      contaPai: '24',
      natureza: 'Devedora',
      nivel: 4,
      ativa: true
    },
    
    // PASSIVO
    {
      id: '26',
      codigo: '2',
      nome: 'PASSIVO',
      tipo: 'Passivo',
      subtipo: 'Grupo',
      contaPai: '',
      natureza: 'Credora',
      nivel: 1,
      ativa: true
    },
    {
      id: '27',
      codigo: '2.1',
      nome: 'PASSIVO CIRCULANTE',
      tipo: 'Passivo',
      subtipo: 'Subgrupo',
      contaPai: '26',
      natureza: 'Credora',
      nivel: 2,
      ativa: true
    },
    {
      id: '28',
      codigo: '2.1.1',
      nome: 'Fornecedores',
      tipo: 'Passivo',
      subtipo: 'Subgrupo',
      contaPai: '27',
      natureza: 'Credora',
      nivel: 3,
      ativa: true
    },
    {
      id: '29',
      codigo: '2.1.1.01',
      nome: 'Fornecedores Nacionais',
      tipo: 'Passivo',
      subtipo: 'Conta',
      contaPai: '28',
      natureza: 'Credora',
      nivel: 4,
      ativa: true
    },
    {
      id: '30',
      codigo: '2.1.2',
      nome: 'Obrigações Trabalhistas',
      tipo: 'Passivo',
      subtipo: 'Subgrupo',
      contaPai: '27',
      natureza: 'Credora',
      nivel: 3,
      ativa: true
    },
    {
      id: '31',
      codigo: '2.1.2.01',
      nome: 'Salários a Pagar',
      tipo: 'Passivo',
      subtipo: 'Conta',
      contaPai: '30',
      natureza: 'Credora',
      nivel: 4,
      ativa: true
    },
    {
      id: '32',
      codigo: '2.1.2.02',
      nome: 'INSS a Recolher',
      tipo: 'Passivo',
      subtipo: 'Conta',
      contaPai: '30',
      natureza: 'Credora',
      nivel: 4,
      ativa: true
    },
    {
      id: '33',
      codigo: '2.1.2.03',
      nome: 'FGTS a Recolher',
      tipo: 'Passivo',
      subtipo: 'Conta',
      contaPai: '30',
      natureza: 'Credora',
      nivel: 4,
      ativa: true
    },
    {
      id: '34',
      codigo: '2.1.3',
      nome: 'Obrigações Fiscais',
      tipo: 'Passivo',
      subtipo: 'Subgrupo',
      contaPai: '27',
      natureza: 'Credora',
      nivel: 3,
      ativa: true
    },
    {
      id: '35',
      codigo: '2.1.3.01',
      nome: 'ICMS a Recolher',
      tipo: 'Passivo',
      subtipo: 'Conta',
      contaPai: '34',
      natureza: 'Credora',
      nivel: 4,
      ativa: true
    },
    {
      id: '36',
      codigo: '2.1.3.02',
      nome: 'PIS a Recolher',
      tipo: 'Passivo',
      subtipo: 'Conta',
      contaPai: '34',
      natureza: 'Credora',
      nivel: 4,
      ativa: true
    },
    {
      id: '37',
      codigo: '2.1.3.03',
      nome: 'COFINS a Recolher',
      tipo: 'Passivo',
      subtipo: 'Conta',
      contaPai: '34',
      natureza: 'Credora',
      nivel: 4,
      ativa: true
    },
    {
      id: '38',
      codigo: '2.1.3.04',
      nome: 'Imposto de Renda a Recolher',
      tipo: 'Passivo',
      subtipo: 'Conta',
      contaPai: '34',
      natureza: 'Credora',
      nivel: 4,
      ativa: true
    },
    {
      id: '39',
      codigo: '2.1.3.05',
      nome: 'CSLL a Recolher',
      tipo: 'Passivo',
      subtipo: 'Conta',
      contaPai: '34',
      natureza: 'Credora',
      nivel: 4,
      ativa: true
    },
    {
      id: '40',
      codigo: '2.1.4',
      nome: 'Empréstimos e Financiamentos',
      tipo: 'Passivo',
      subtipo: 'Subgrupo',
      contaPai: '27',
      natureza: 'Credora',
      nivel: 3,
      ativa: true
    },
    {
      id: '41',
      codigo: '2.1.4.01',
      nome: 'Empréstimos Bancários CP',
      tipo: 'Passivo',
      subtipo: 'Conta',
      contaPai: '40',
      natureza: 'Credora',
      nivel: 4,
      ativa: true
    },
    {
      id: '42',
      codigo: '2.2',
      nome: 'PASSIVO NÃO CIRCULANTE',
      tipo: 'Passivo',
      subtipo: 'Subgrupo',
      contaPai: '26',
      natureza: 'Credora',
      nivel: 2,
      ativa: true
    },
    {
      id: '43',
      codigo: '2.2.1',
      nome: 'Empréstimos e Financiamentos LP',
      tipo: 'Passivo',
      subtipo: 'Subgrupo',
      contaPai: '42',
      natureza: 'Credora',
      nivel: 3,
      ativa: true
    },
    {
      id: '44',
      codigo: '2.2.1.01',
      nome: 'Empréstimos Bancários LP',
      tipo: 'Passivo',
      subtipo: 'Conta',
      contaPai: '43',
      natureza: 'Credora',
      nivel: 4,
      ativa: true
    },
    
    // PATRIMÔNIO LÍQUIDO
    {
      id: '45',
      codigo: '3',
      nome: 'PATRIMÔNIO LÍQUIDO',
      tipo: 'Patrimonio',
      subtipo: 'Grupo',
      contaPai: '',
      natureza: 'Credora',
      nivel: 1,
      ativa: true
    },
    {
      id: '46',
      codigo: '3.1',
      nome: 'Capital Social',
      tipo: 'Patrimonio',
      subtipo: 'Subgrupo',
      contaPai: '45',
      natureza: 'Credora',
      nivel: 2,
      ativa: true
    },
    {
      id: '47',
      codigo: '3.1.1',
      nome: 'Capital Social Subscrito',
      tipo: 'Patrimonio',
      subtipo: 'Conta',
      contaPai: '46',
      natureza: 'Credora',
      nivel: 3,
      ativa: true
    },
    {
      id: '48',
      codigo: '3.2',
      nome: 'Reservas',
      tipo: 'Patrimonio',
      subtipo: 'Subgrupo',
      contaPai: '45',
      natureza: 'Credora',
      nivel: 2,
      ativa: true
    },
    {
      id: '49',
      codigo: '3.2.1',
      nome: 'Reservas de Lucros',
      tipo: 'Patrimonio',
      subtipo: 'Conta',
      contaPai: '48',
      natureza: 'Credora',
      nivel: 3,
      ativa: true
    },
    {
      id: '50',
      codigo: '3.3',
      nome: 'Lucros ou Prejuízos Acumulados',
      tipo: 'Patrimonio',
      subtipo: 'Conta',
      contaPai: '45',
      natureza: 'Credora',
      nivel: 2,
      ativa: true
    },
    
    // RECEITAS
    {
      id: '51',
      codigo: '4',
      nome: 'RECEITAS',
      tipo: 'Receita',
      subtipo: 'Grupo',
      contaPai: '',
      natureza: 'Credora',
      nivel: 1,
      ativa: true
    },
    {
      id: '52',
      codigo: '4.1',
      nome: 'Receita Bruta',
      tipo: 'Receita',
      subtipo: 'Subgrupo',
      contaPai: '51',
      natureza: 'Credora',
      nivel: 2,
      ativa: true
    },
    {
      id: '53',
      codigo: '4.1.1',
      nome: 'Receita de Vendas',
      tipo: 'Receita',
      subtipo: 'Subgrupo',
      contaPai: '52',
      natureza: 'Credora',
      nivel: 3,
      ativa: true
    },
    {
      id: '54',
      codigo: '4.1.1.01',
      nome: 'Vendas de Produtos',
      tipo: 'Receita',
      subtipo: 'Conta',
      contaPai: '53',
      natureza: 'Credora',
      nivel: 4,
      ativa: true
    },
    {
      id: '55',
      codigo: '4.1.1.02',
      nome: 'Receita de Serviços',
      tipo: 'Receita',
      subtipo: 'Conta',
      contaPai: '53',
      natureza: 'Credora',
      nivel: 4,
      ativa: true
    },
    {
      id: '56',
      codigo: '4.1.1.03',
      nome: 'Receita de Consultoria',
      tipo: 'Receita',
      subtipo: 'Conta',
      contaPai: '53',
      natureza: 'Credora',
      nivel: 4,
      ativa: true
    },
    {
      id: '57',
      codigo: '4.1.1.04',
      nome: 'Receita de Software',
      tipo: 'Receita',
      subtipo: 'Conta',
      contaPai: '53',
      natureza: 'Credora',
      nivel: 4,
      ativa: true
    },
    {
      id: '58',
      codigo: '4.2',
      nome: 'Deduções da Receita Bruta',
      tipo: 'Receita',
      subtipo: 'Subgrupo',
      contaPai: '51',
      natureza: 'Devedora',
      nivel: 2,
      ativa: true
    },
    {
      id: '59',
      codigo: '4.2.1',
      nome: 'Impostos sobre Vendas',
      tipo: 'Receita',
      subtipo: 'Subgrupo',
      contaPai: '58',
      natureza: 'Devedora',
      nivel: 3,
      ativa: true
    },
    {
      id: '60',
      codigo: '4.2.1.01',
      nome: 'ICMS sobre Vendas',
      tipo: 'Receita',
      subtipo: 'Conta',
      contaPai: '59',
      natureza: 'Devedora',
      nivel: 4,
      ativa: true
    },
    {
      id: '61',
      codigo: '4.2.1.02',
      nome: 'PIS sobre Vendas',
      tipo: 'Receita',
      subtipo: 'Conta',
      contaPai: '59',
      natureza: 'Devedora',
      nivel: 4,
      ativa: true
    },
    {
      id: '62',
      codigo: '4.2.1.03',
      nome: 'COFINS sobre Vendas',
      tipo: 'Receita',
      subtipo: 'Conta',
      contaPai: '59',
      natureza: 'Devedora',
      nivel: 4,
      ativa: true
    },
    {
      id: '63',
      codigo: '4.2.2',
      nome: 'Devoluções e Cancelamentos',
      tipo: 'Receita',
      subtipo: 'Conta',
      contaPai: '58',
      natureza: 'Devedora',
      nivel: 3,
      ativa: true
    },
    {
      id: '64',
      codigo: '4.3',
      nome: 'Outras Receitas',
      tipo: 'Receita',
      subtipo: 'Subgrupo',
      contaPai: '51',
      natureza: 'Credora',
      nivel: 2,
      ativa: true
    },
    {
      id: '65',
      codigo: '4.3.1',
      nome: 'Receitas Financeiras',
      tipo: 'Receita',
      subtipo: 'Conta',
      contaPai: '64',
      natureza: 'Credora',
      nivel: 3,
      ativa: true
    },
    
    // DESPESAS
    {
      id: '66',
      codigo: '5',
      nome: 'DESPESAS',
      tipo: 'Despesa',
      subtipo: 'Grupo',
      contaPai: '',
      natureza: 'Devedora',
      nivel: 1,
      ativa: true
    },
    {
      id: '67',
      codigo: '5.1',
      nome: 'Custo dos Produtos Vendidos',
      tipo: 'Despesa',
      subtipo: 'Subgrupo',
      contaPai: '66',
      natureza: 'Devedora',
      nivel: 2,
      ativa: true
    },
    {
      id: '68',
      codigo: '5.1.1',
      nome: 'Custo de Mercadorias',
      tipo: 'Despesa',
      subtipo: 'Conta',
      contaPai: '67',
      natureza: 'Devedora',
      nivel: 3,
      ativa: true
    },
    {
      id: '69',
      codigo: '5.1.2',
      nome: 'Custo de Serviços',
      tipo: 'Despesa',
      subtipo: 'Conta',
      contaPai: '67',
      natureza: 'Devedora',
      nivel: 3,
      ativa: true
    },
    {
      id: '70',
      codigo: '5.2',
      nome: 'Despesas Operacionais',
      tipo: 'Despesa',
      subtipo: 'Subgrupo',
      contaPai: '66',
      natureza: 'Devedora',
      nivel: 2,
      ativa: true
    },
    {
      id: '71',
      codigo: '5.2.1',
      nome: 'Despesas Administrativas',
      tipo: 'Despesa',
      subtipo: 'Subgrupo',
      contaPai: '70',
      natureza: 'Devedora',
      nivel: 3,
      ativa: true
    },
    {
      id: '72',
      codigo: '5.2.1.01',
      nome: 'Salários e Ordenados',
      tipo: 'Despesa',
      subtipo: 'Conta',
      contaPai: '71',
      natureza: 'Devedora',
      nivel: 4,
      ativa: true
    },
    {
      id: '73',
      codigo: '5.2.1.02',
      nome: 'Encargos Sociais',
      tipo: 'Despesa',
      subtipo: 'Conta',
      contaPai: '71',
      natureza: 'Devedora',
      nivel: 4,
      ativa: true
    },
    {
      id: '74',
      codigo: '5.2.1.03',
      nome: 'Pró-Labore',
      tipo: 'Despesa',
      subtipo: 'Conta',
      contaPai: '71',
      natureza: 'Devedora',
      nivel: 4,
      ativa: true
    },
    {
      id: '75',
      codigo: '5.2.1.04',
      nome: 'Honorários Profissionais',
      tipo: 'Despesa',
      subtipo: 'Conta',
      contaPai: '71',
      natureza: 'Devedora',
      nivel: 4,
      ativa: true
    },
    {
      id: '76',
      codigo: '5.2.1.05',
      nome: 'Aluguéis',
      tipo: 'Despesa',
      subtipo: 'Conta',
      contaPai: '71',
      natureza: 'Devedora',
      nivel: 4,
      ativa: true
    },
    {
      id: '77',
      codigo: '5.2.1.06',
      nome: 'Energia Elétrica',
      tipo: 'Despesa',
      subtipo: 'Conta',
      contaPai: '71',
      natureza: 'Devedora',
      nivel: 4,
      ativa: true
    },
    {
      id: '78',
      codigo: '5.2.1.07',
      nome: 'Telefone e Internet',
      tipo: 'Despesa',
      subtipo: 'Conta',
      contaPai: '71',
      natureza: 'Devedora',
      nivel: 4,
      ativa: true
    },
    {
      id: '79',
      codigo: '5.2.1.08',
      nome: 'Material de Escritório',
      tipo: 'Despesa',
      subtipo: 'Conta',
      contaPai: '71',
      natureza: 'Devedora',
      nivel: 4,
      ativa: true
    },
    {
      id: '80',
      codigo: '5.2.1.09',
      nome: 'Licenças de Software',
      tipo: 'Despesa',
      subtipo: 'Conta',
      contaPai: '71',
      natureza: 'Devedora',
      nivel: 4,
      ativa: true
    },
    {
      id: '81',
      codigo: '5.2.1.10',
      nome: 'Depreciação',
      tipo: 'Despesa',
      subtipo: 'Conta',
      contaPai: '71',
      natureza: 'Devedora',
      nivel: 4,
      ativa: true
    },
    {
      id: '82',
      codigo: '5.2.2',
      nome: 'Despesas Comerciais',
      tipo: 'Despesa',
      subtipo: 'Subgrupo',
      contaPai: '70',
      natureza: 'Devedora',
      nivel: 3,
      ativa: true
    },
    {
      id: '83',
      codigo: '5.2.2.01',
      nome: 'Comissões sobre Vendas',
      tipo: 'Despesa',
      subtipo: 'Conta',
      contaPai: '82',
      natureza: 'Devedora',
      nivel: 4,
      ativa: true
    },
    {
      id: '84',
      codigo: '5.2.2.02',
      nome: 'Marketing e Publicidade',
      tipo: 'Despesa',
      subtipo: 'Conta',
      contaPai: '82',
      natureza: 'Devedora',
      nivel: 4,
      ativa: true
    },
    {
      id: '85',
      codigo: '5.2.2.03',
      nome: 'Viagens e Representação',
      tipo: 'Despesa',
      subtipo: 'Conta',
      contaPai: '82',
      natureza: 'Devedora',
      nivel: 4,
      ativa: true
    },
    {
      id: '86',
      codigo: '5.3',
      nome: 'Despesas Financeiras',
      tipo: 'Despesa',
      subtipo: 'Subgrupo',
      contaPai: '66',
      natureza: 'Devedora',
      nivel: 2,
      ativa: true
    },
    {
      id: '87',
      codigo: '5.3.1',
      nome: 'Juros Passivos',
      tipo: 'Despesa',
      subtipo: 'Conta',
      contaPai: '86',
      natureza: 'Devedora',
      nivel: 3,
      ativa: true
    },
    {
      id: '88',
      codigo: '5.3.2',
      nome: 'Tarifas Bancárias',
      tipo: 'Despesa',
      subtipo: 'Conta',
      contaPai: '86',
      natureza: 'Devedora',
      nivel: 3,
      ativa: true
    },
    {
      id: '89',
      codigo: '5.4',
      nome: 'Despesas Tributárias',
      tipo: 'Despesa',
      subtipo: 'Subgrupo',
      contaPai: '66',
      natureza: 'Devedora',
      nivel: 2,
      ativa: true
    },
    {
      id: '90',
      codigo: '5.4.1',
      nome: 'Imposto de Renda',
      tipo: 'Despesa',
      subtipo: 'Conta',
      contaPai: '89',
      natureza: 'Devedora',
      nivel: 3,
      ativa: true
    },
    {
      id: '91',
      codigo: '5.4.2',
      nome: 'Contribuição Social',
      tipo: 'Despesa',
      subtipo: 'Conta',
      contaPai: '89',
      natureza: 'Devedora',
      nivel: 3,
      ativa: true
    }
  ]);

  const [lancamentosContabeis] = useState<any[]>([]);
  const [fornecedores] = useState<any[]>([]);
  const [contasPagar] = useState<any[]>([]);
  const [contasBancarias] = useState<any[]>([]);
  const [pagamentosConta] = useState<any[]>([]);
  const [performanceMensal] = useState<any[]>([]);
  const [metasMensais] = useState<any[]>([]);
  const [diagnosticosMensais] = useState<any[]>([]);
  const [acoesConsultoria] = useState<any[]>([]);
  const [processosCliente] = useState<any[]>([]);
  const [briefingsReuniao] = useState<any[]>([]);
  const [oportunidadesNegocio] = useState<any[]>([]);
  const [eventosLinhaTempo] = useState<any[]>([]);
  const [relatoriosMensais] = useState<any[]>([]);
  const [consultoriasMensais] = useState<any[]>([]);
  const [carteirasCobranca] = useState<any[]>([]);
  const [modelosContrato] = useState<any[]>([]);
  const [regrasCobranca] = useState<any[]>([]);
  const [historicoCobranca] = useState<any[]>([]);
  const [logsCobranca] = useState<any[]>([]);
  const [vendas] = useState<any[]>([]);
  const [condicoesPagamento] = useState<any[]>([]);

  // Seleções
  const [clienteSelecionado, setClienteSelecionado] = useState<Cliente | null>(null);

  // Funções de cliente
  const adicionarCliente = (cliente: Cliente) => {
    setClientes(prev => [...prev, cliente]);
  };

  const atualizarCliente = (id: string, dados: Partial<Cliente>) => {
    setClientes(prev => prev.map(c => c.id === id ? { ...c, ...dados } : c));
  };

  // Funções de contrato
  const adicionarContrato = (contrato: Contrato) => {
    setContratos(prev => [...prev, contrato]);
  };

  const atualizarContrato = (id: string, dados: Partial<Contrato>) => {
    setContratos(prev => prev.map(c => c.id === id ? { ...c, ...dados } : c));
  };

  // Funções de fatura
  const adicionarFatura = (fatura: Fatura) => {
    setFaturas(prev => [...prev, fatura]);
  };

  const atualizarFatura = (id: string, dados: Partial<Fatura>) => {
    setFaturas(prev => prev.map(f => f.id === id ? { ...f, ...dados } : f));
  };

  // Funções de licença
  const adicionarLicenca = (licenca: Licenca) => {
    setLicencas(prev => [...prev, licenca]);
  };

  const atualizarLicenca = (id: string, dados: Partial<Licenca>) => {
    setLicencas(prev => prev.map(l => l.id === id ? { ...l, ...dados } : l));
  };

  // Funções de plano de venda
  const adicionarPlanoVenda = (plano: PlanoVenda) => {
    setPlanosVenda(prev => [...prev, plano]);
  };

  const atualizarPlanoVenda = (id: string, dados: Partial<PlanoVenda>) => {
    setPlanosVenda(prev => prev.map(p => p.id === id ? { ...p, ...dados } : p));
  };

  // Funções de produto
  const adicionarProduto = (produto: Produto) => {
    setProdutos(prev => [...prev, produto]);
  };

  const atualizarProduto = (id: string, dados: Partial<Produto>) => {
    setProdutos(prev => prev.map(p => p.id === id ? { ...p, ...dados } : p));
  };

  // Funções de reunião
  const adicionarReuniao = (reuniao: Reuniao) => {
    setReunioes(prev => [...prev, reuniao]);
  };

  const atualizarReuniao = (id: string, dados: Partial<Reuniao>) => {
    setReunioes(prev => prev.map(r => r.id === id ? { ...r, ...dados } : r));
  };

  // Funções de contato
  const adicionarContato = (contato: ContatoCliente) => {
    setContatos(prev => [...prev, contato]);
  };

  const atualizarContato = (id: string, dados: Partial<ContatoCliente>) => {
    setContatos(prev => prev.map(c => c.id === id ? { ...c, ...dados } : c));
  };

  const excluirContato = (id: string) => {
    setContatos(prev => prev.filter(c => c.id !== id));
  };

  // Funções de empresa
  const adicionarEmpresa = (empresa: Empresa) => {
    setEmpresas(prev => [...prev, empresa]);
  };

  const atualizarEmpresa = (id: string, dados: Partial<Empresa>) => {
    setEmpresas(prev => prev.map(e => e.id === id ? { ...e, ...dados } : e));
  };

  const adicionarFilial = (filial: Filial) => {
    setFiliais(prev => [...prev, filial]);
  };

  const atualizarFilial = (id: string, dados: Partial<Filial>) => {
    setFiliais(prev => prev.map(f => f.id === id ? { ...f, ...dados } : f));
  };

  // Funções de usuário
  const adicionarUsuario = (usuario: Usuario) => {
    setUsuarios(prev => [...prev, usuario]);
  };

  const atualizarUsuario = (id: string, dados: Partial<Usuario>) => {
    setUsuarios(prev => prev.map(u => u.id === id ? { ...u, ...dados } : u));
  };

  const login = (email: string, senha: string): boolean => {
    if (email === 'admin@consultorpro.com' && senha === 'admin123') {
      return true;
    }
    return false;
  };

  const logout = () => {
    setUsuarioLogado(null);
  };

  // Funções de RH
  const adicionarColaborador = (colaborador: Colaborador) => {
    setColaboradores(prev => [...prev, colaborador]);
  };

  const atualizarColaborador = (id: string, dados: Partial<Colaborador>) => {
    setColaboradores(prev => prev.map(c => c.id === id ? { ...c, ...dados } : c));
  };

  const adicionarDepartamento = (departamento: Departamento) => {
    setDepartamentos(prev => [...prev, departamento]);
  };

  const atualizarDepartamento = (id: string, dados: Partial<Departamento>) => {
    setDepartamentos(prev => prev.map(d => d.id === id ? { ...d, ...dados } : d));
  };

  const adicionarSetor = (setor: Setor) => {
    setSetores(prev => [...prev, setor]);
  };

  const atualizarSetor = (id: string, dados: Partial<Setor>) => {
    setSetores(prev => prev.map(s => s.id === id ? { ...s, ...dados } : s));
  };

  // Funções de agenda
  const adicionarEventoAgenda = (evento: EventoAgenda) => {
    setEventosAgenda(prev => [...prev, evento]);
  };

  const atualizarEventoAgenda = (id: string, dados: Partial<EventoAgenda>) => {
    setEventosAgenda(prev => prev.map(e => e.id === id ? { ...e, ...dados } : e));
  };

  // Funções stub (implementação básica)
  const adicionarContaContabil = () => {};
  const atualizarContaContabil = () => {};
  const excluirContaContabil = () => {};
  const adicionarLancamentoContabil = () => {};
  const adicionarFornecedor = () => {};
  const atualizarFornecedor = () => {};
  const adicionarContaPagar = () => {};
  const atualizarContaPagar = () => {};
  const adicionarContaBancaria = () => {};
  const atualizarContaBancaria = () => {};
  const realizarPagamento = () => {};
  const gerarLancamentoPagamento = () => {};
  const gerarRecorrencia = () => {};
  const adicionarPerformanceMensal = () => {};
  const atualizarPerformanceMensal = () => {};
  const adicionarMetaMensal = () => {};
  const atualizarMetaMensal = () => {};
  const excluirMetaMensal = () => {};
  const adicionarDiagnosticoMensal = () => {};
  const atualizarDiagnosticoMensal = () => {};
  const adicionarAcaoConsultoria = () => {};
  const atualizarAcaoConsultoria = () => {};
  const excluirAcaoConsultoria = () => {};
  const adicionarProcessoCliente = () => {};
  const atualizarProcessoCliente = () => {};
  const adicionarBriefingReuniao = () => {};
  const atualizarBriefingReuniao = () => {};
  const adicionarOportunidadeNegocio = () => {};
  const atualizarOportunidadeNegocio = () => {};
  const excluirOportunidadeNegocio = () => {};
  const adicionarEventoLinhaTempo = () => {};
  const adicionarRelatorioMensal = () => {};
  const adicionarCarteiraCobranca = () => {};
  const atualizarCarteiraCobranca = () => {};
  const adicionarModeloContrato = () => {};
  const atualizarModeloContrato = () => {};
  const adicionarRegraCobranca = () => {};
  const atualizarRegraCobranca = () => {};

  const value: AppContextType = {
    // Estados
    clientes,
    contratos,
    faturas,
    licencas,
    planosVenda,
    produtos,
    reunioes,
    contatos,
    empresas,
    filiais,
    empresaSelecionada,
    filialAtiva,
    usuarios,
    perfisUsuario,
    usuarioLogado,
    colaboradores,
    departamentos,
    setores,
    eventosAgenda,
    contasContabeis,
    lancamentosContabeis,
    fornecedores,
    contasPagar,
    contasBancarias,
    pagamentosConta,
    performanceMensal,
    metasMensais,
    diagnosticosMensais,
    acoesConsultoria,
    processosCliente,
    briefingsReuniao,
    oportunidadesNegocio,
    eventosLinhaTempo,
    relatoriosMensais,
    consultoriasMensais,
    carteirasCobranca,
    modelosContrato,
    regrasCobranca,
    historicoCobranca,
    logsCobranca,
    vendas,
    condicoesPagamento,
    clienteSelecionado,

    // Funções
    adicionarCliente,
    atualizarCliente,
    setClienteSelecionado,
    adicionarContrato,
    atualizarContrato,
    adicionarFatura,
    atualizarFatura,
    adicionarLicenca,
    atualizarLicenca,
    adicionarPlanoVenda,
    atualizarPlanoVenda,
    adicionarProduto,
    atualizarProduto,
    adicionarReuniao,
    atualizarReuniao,
    adicionarContato,
    atualizarContato,
    excluirContato,
    adicionarEmpresa,
    atualizarEmpresa,
    setEmpresaSelecionada,
    adicionarFilial,
    atualizarFilial,
    adicionarUsuario,
    atualizarUsuario,
    login,
    logout,
    adicionarColaborador,
    atualizarColaborador,
    adicionarDepartamento,
    atualizarDepartamento,
    adicionarSetor,
    atualizarSetor,
    adicionarEventoAgenda,
    atualizarEventoAgenda,
    adicionarContaContabil,
    atualizarContaContabil,
    excluirContaContabil,
    adicionarLancamentoContabil,
    adicionarFornecedor,
    atualizarFornecedor,
    adicionarContaPagar,
    atualizarContaPagar,
    adicionarContaBancaria,
    atualizarContaBancaria,
    realizarPagamento,
    gerarLancamentoPagamento,
    gerarRecorrencia,
    adicionarPerformanceMensal,
    atualizarPerformanceMensal,
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
    adicionarCarteiraCobranca,
    atualizarCarteiraCobranca,
    adicionarModeloContrato,
    atualizarModeloContrato,
    adicionarRegraCobranca,
    atualizarRegraCobranca
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