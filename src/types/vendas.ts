// Tipos para sistema de vendas

export interface CondicaoPagamento {
  id: string;
  empresaId: string;
  nome: string;
  descricao: string;
  parcelas: ParcelaPagamento[];
  ativa: boolean;
  criadoEm: string;
}

export interface ParcelaPagamento {
  numero: number;
  dias: number;
  percentual: number;
}

export interface Venda {
  id: string;
  empresaId: string;
  filialId: string;
  clienteId: string;
  numero: string;
  dataVenda: string;
  itens: ItemVenda[];
  valorTotal: number;
  desconto: number;
  valorFinal: number;
  status: 'Orcamento' | 'Aprovada' | 'Faturada' | 'Cancelada';
  condicaoPagamentoId: string;
  vendedor?: string;
  comissao: number;
  observacoes?: string;
  criadoEm: string;
  atualizadoEm: string;
}

export interface ItemVenda {
  id: string;
  produtoId: string;
  descricao: string;
  quantidade: number;
  valorUnitario: number;
  desconto: number;
  valorTotal: number;
  contaReceitaId: string;
}