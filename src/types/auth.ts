// Tipos para sistema de autenticação e permissões

export interface Usuario {
  id: string;
  email: string;
  senha: string; // Em produção seria hash
  nome: string;
  ativo: boolean;
  colaboradorId: string;
  empresaId: string;
  filialId?: string;
  perfil: PerfilUsuario;
  permissoes: PermissoesUsuario;
  ultimoLogin?: string;
  criadoEm: string;
  atualizadoEm: string;
}

export interface PerfilUsuario {
  id: string;
  nome: string;
  descricao: string;
  nivel: 'super_admin' | 'admin' | 'gerente' | 'operador' | 'consultor' | 'visualizador';
  permissoesPadrao: PermissoesUsuario;
  ativo: boolean;
  criadoEm: string;
}

export interface PermissoesUsuario {
  // Módulos principais
  dashboard: PermissaoModulo;
  empresas: PermissaoModulo;
  clientes: PermissaoModulo;
  contratos: PermissaoModulo;
  faturas: PermissaoModulo;
  licencas: PermissaoModulo;
  produtos: PermissaoModulo;
  vendas: PermissaoModulo;
  
  // Financeiro
  contabilidade: PermissaoModulo;
  contasPagar: PermissaoModulo;
  contasReceber: PermissaoModulo;
  
  // Operacional
  reunioes: PermissaoModulo;
  projetos: PermissaoModulo;
  consultoriaMensal: PermissaoModulo;
  
  // Configurações
  rh: PermissaoModulo;
  usuarios: PermissaoModulo;
  relatorios: PermissaoModulo;
  auditoria: PermissaoModulo;
  configuracoes: PermissaoModulo;
}

export interface PermissaoModulo {
  visualizar: boolean;
  criar: boolean;
  editar: boolean;
  excluir: boolean;
  aprovar?: boolean;
  exportar?: boolean;
}

export interface SessaoUsuario {
  id: string;
  usuarioId: string;
  token: string;
  dataInicio: string;
  dataExpiracao: string;
  ipAddress: string;
  userAgent: string;
  ativa: boolean;
}

export interface LogAcesso {
  id: string;
  usuarioId: string;
  acao: 'login' | 'logout' | 'tentativa_login_falhou' | 'sessao_expirada';
  ipAddress: string;
  userAgent: string;
  sucesso: boolean;
  detalhes?: string;
  timestamp: string;
}