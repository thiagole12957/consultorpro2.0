import React from 'react';
import { useApp } from '../../contexts/AppContext';
import { Building2, CreditCard, TrendingUp } from 'lucide-react';

export function BalancoView() {
  const { faturas, contratos } = useApp();

  // Cálculos do Balanço (valores estimados para demonstração)
  const contasReceber = faturas
    .filter(f => f.status === 'Pendente')
    .reduce((sum, f) => sum + f.valor, 0);

  const caixa = 150000; // Valor estimado
  const estoque = 25000; // Valor estimado
  const imobilizado = 80000; // Valor estimado
  const intangivel = 45000; // Valor estimado

  const contasPagar = 35000; // Valor estimado
  const emprestimos = 60000; // Valor estimado
  const impostos = 18000; // Valor estimado
  const emprestimosLP = 120000; // Valor estimado

  const capital = 200000; // Valor estimado
  const reservas = 50000; // Valor estimado
  const lucrosAcumulados = 87000; // Valor estimado

  // Totais
  const ativoCirculante = caixa + contasReceber + estoque;
  const ativoNaoCirculante = imobilizado + intangivel;
  const ativoTotal = ativoCirculante + ativoNaoCirculante;

  const passivoCirculante = contasPagar + emprestimos + impostos;
  const passivoNaoCirculante = emprestimosLP;
  const passivoTotal = passivoCirculante + passivoNaoCirculante;

  const patrimonioTotal = capital + reservas + lucrosAcumulados;

  const ItemBalanco = ({ label, valor, nivel = 0, destaque = false }: any) => (
    <div className={`flex items-center justify-between py-2 px-4 ${
      destaque ? 'bg-blue-50 border-l-4 border-blue-500 font-semibold' : ''
    } ${nivel > 0 ? 'ml-4' : ''}`}>
      <span className={`${destaque ? 'text-blue-900' : 'text-gray-700'}`}>
        {label}
      </span>
      <span className={`font-semibold ${destaque ? 'text-blue-600' : 'text-gray-900'}`}>
        R$ {valor.toLocaleString('pt-BR')}
      </span>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Balanço Patrimonial</h2>
        <p className="text-green-100">Posição em 31 de Dezembro de 2024</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ATIVO */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6">
            <div className="flex items-center mb-4">
              <Building2 className="w-6 h-6 text-blue-600 mr-2" />
              <h3 className="text-xl font-bold text-gray-900">ATIVO</h3>
            </div>
            
            <div className="space-y-1">
              <ItemBalanco label="ATIVO CIRCULANTE" valor={ativoCirculante} destaque />
              <ItemBalanco label="Caixa e Equivalentes" valor={caixa} nivel={1} />
              <ItemBalanco label="Contas a Receber" valor={contasReceber} nivel={1} />
              <ItemBalanco label="Estoque" valor={estoque} nivel={1} />
              
              <div className="border-t border-gray-200 my-2"></div>
              
              <ItemBalanco label="ATIVO NÃO CIRCULANTE" valor={ativoNaoCirculante} destaque />
              <ItemBalanco label="Imobilizado" valor={imobilizado} nivel={1} />
              <ItemBalanco label="Intangível" valor={intangivel} nivel={1} />
              
              <div className="border-t-2 border-blue-500 my-3"></div>
              
              <ItemBalanco label="TOTAL DO ATIVO" valor={ativoTotal} destaque />
            </div>
          </div>
        </div>

        {/* PASSIVO + PATRIMÔNIO */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6">
            <div className="flex items-center mb-4">
              <CreditCard className="w-6 h-6 text-red-600 mr-2" />
              <h3 className="text-xl font-bold text-gray-900">PASSIVO + PATRIMÔNIO</h3>
            </div>
            
            <div className="space-y-1">
              <ItemBalanco label="PASSIVO CIRCULANTE" valor={passivoCirculante} destaque />
              <ItemBalanco label="Contas a Pagar" valor={contasPagar} nivel={1} />
              <ItemBalanco label="Empréstimos" valor={emprestimos} nivel={1} />
              <ItemBalanco label="Impostos a Pagar" valor={impostos} nivel={1} />
              
              <div className="border-t border-gray-200 my-2"></div>
              
              <ItemBalanco label="PASSIVO NÃO CIRCULANTE" valor={passivoNaoCirculante} destaque />
              <ItemBalanco label="Empréstimos LP" valor={emprestimosLP} nivel={1} />
              
              <div className="border-t border-gray-200 my-2"></div>
              
              <ItemBalanco label="PATRIMÔNIO LÍQUIDO" valor={patrimonioTotal} destaque />
              <ItemBalanco label="Capital Social" valor={capital} nivel={1} />
              <ItemBalanco label="Reservas" valor={reservas} nivel={1} />
              <ItemBalanco label="Lucros Acumulados" valor={lucrosAcumulados} nivel={1} />
              
              <div className="border-t-2 border-red-500 my-3"></div>
              
              <ItemBalanco label="TOTAL PASSIVO + PL" valor={passivoTotal + patrimonioTotal} destaque />
            </div>
          </div>
        </div>
      </div>

      {/* Indicadores Financeiros */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center mb-6">
          <TrendingUp className="w-6 h-6 text-purple-600 mr-2" />
          <h3 className="text-xl font-bold text-gray-900">Indicadores Financeiros</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Liquidez Corrente</p>
            <p className="text-2xl font-bold text-blue-600">
              {(ativoCirculante / passivoCirculante).toFixed(2)}
            </p>
            <p className="text-xs text-gray-500">AC / PC</p>
          </div>

          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Endividamento</p>
            <p className="text-2xl font-bold text-green-600">
              {((passivoTotal / ativoTotal) * 100).toFixed(1)}%
            </p>
            <p className="text-xs text-gray-500">PT / AT</p>
          </div>

          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">ROE</p>
            <p className="text-2xl font-bold text-purple-600">
              {((lucrosAcumulados / patrimonioTotal) * 100).toFixed(1)}%
            </p>
            <p className="text-xs text-gray-500">LL / PL</p>
          </div>

          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Composição Endiv.</p>
            <p className="text-2xl font-bold text-orange-600">
              {((passivoCirculante / passivoTotal) * 100).toFixed(1)}%
            </p>
            <p className="text-xs text-gray-500">PC / PT</p>
          </div>
        </div>
      </div>
    </div>
  );
}