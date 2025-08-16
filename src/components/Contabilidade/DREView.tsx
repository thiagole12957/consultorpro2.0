import React from 'react';
import { useApp } from '../../contexts/AppContext';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

export function DREView() {
  const { faturas, licencas } = useApp();

  // Cálculos da DRE
  const receitaBruta = faturas
    .filter(f => f.status === 'Pago')
    .reduce((sum, f) => sum + f.valor, 0);

  const deducoes = receitaBruta * 0.15; // Estimativa de impostos (15%)
  const receitaLiquida = receitaBruta - deducoes;

  const custoVendas = licencas
    .filter(l => l.status === 'Ativa')
    .reduce((sum, l) => sum + l.custoMensal * 12, 0); // Anualizado

  const lucroBruto = receitaLiquida - custoVendas;

  const despesasOperacionais = receitaBruta * 0.25; // Estimativa (25% da receita)
  const lucroOperacional = lucroBruto - despesasOperacionais;

  const receitasFinanceiras = receitaBruta * 0.02; // Estimativa (2%)
  const despesasFinanceiras = receitaBruta * 0.03; // Estimativa (3%)
  const lucroAntesIR = lucroOperacional + receitasFinanceiras - despesasFinanceiras;

  const impostoRenda = lucroAntesIR > 0 ? lucroAntesIR * 0.25 : 0; // 25%
  const lucroLiquido = lucroAntesIR - impostoRenda;

  // Margens
  const margemBruta = receitaLiquida > 0 ? (lucroBruto / receitaLiquida) * 100 : 0;
  const margemOperacional = receitaLiquida > 0 ? (lucroOperacional / receitaLiquida) * 100 : 0;
  const margemLiquida = receitaLiquida > 0 ? (lucroLiquido / receitaLiquida) * 100 : 0;

  const ItemDRE = ({ label, valor, nivel = 0, destaque = false, margem }: any) => (
    <div className={`flex items-center justify-between py-2 px-4 ${
      destaque ? 'bg-blue-50 border-l-4 border-blue-500 font-semibold' : ''
    } ${nivel > 0 ? 'ml-4' : ''}`}>
      <span className={`${destaque ? 'text-blue-900' : 'text-gray-700'}`}>
        {label}
      </span>
      <div className="flex items-center space-x-4">
        {margem && (
          <span className="text-sm text-gray-500">
            {margem.toFixed(1)}%
          </span>
        )}
        <span className={`font-semibold ${
          valor >= 0 ? 'text-green-600' : 'text-red-600'
        }`}>
          R$ {Math.abs(valor).toLocaleString('pt-BR')}
        </span>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Demonstração do Resultado do Exercício (DRE)</h2>
        <p className="text-blue-100">Período: Janeiro a Dezembro 2024</p>
      </div>

      {/* DRE */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6">
          <div className="space-y-1">
            <ItemDRE label="RECEITA BRUTA" valor={receitaBruta} destaque />
            <ItemDRE label="(-) Deduções da Receita" valor={-deducoes} nivel={1} />
            <ItemDRE label="RECEITA LÍQUIDA" valor={receitaLiquida} destaque />
            
            <div className="border-t border-gray-200 my-2"></div>
            
            <ItemDRE label="(-) Custo das Vendas" valor={-custoVendas} nivel={1} />
            <ItemDRE label="LUCRO BRUTO" valor={lucroBruto} destaque margem={margemBruta} />
            
            <div className="border-t border-gray-200 my-2"></div>
            
            <ItemDRE label="(-) Despesas Operacionais" valor={-despesasOperacionais} nivel={1} />
            <ItemDRE label="LUCRO OPERACIONAL" valor={lucroOperacional} destaque margem={margemOperacional} />
            
            <div className="border-t border-gray-200 my-2"></div>
            
            <ItemDRE label="(+) Receitas Financeiras" valor={receitasFinanceiras} nivel={1} />
            <ItemDRE label="(-) Despesas Financeiras" valor={-despesasFinanceiras} nivel={1} />
            <ItemDRE label="LUCRO ANTES DO IR" valor={lucroAntesIR} destaque />
            
            <div className="border-t border-gray-200 my-2"></div>
            
            <ItemDRE label="(-) Imposto de Renda" valor={-impostoRenda} nivel={1} />
            <ItemDRE label="LUCRO LÍQUIDO" valor={lucroLiquido} destaque margem={margemLiquida} />
          </div>
        </div>
      </div>

      {/* Análise de Margens */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-green-500 to-green-600 shadow-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div className={`flex items-center text-sm font-medium px-2 py-1 rounded-full ${
              margemBruta >= 0 ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'
            }`}>
              {margemBruta >= 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
              <span>{margemBruta.toFixed(1)}%</span>
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 mb-1">Margem Bruta</p>
            <p className="text-sm text-gray-600">Eficiência operacional</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div className={`flex items-center text-sm font-medium px-2 py-1 rounded-full ${
              margemOperacional >= 0 ? 'text-blue-700 bg-blue-100' : 'text-red-700 bg-red-100'
            }`}>
              {margemOperacional >= 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
              <span>{margemOperacional.toFixed(1)}%</span>
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 mb-1">Margem Operacional</p>
            <p className="text-sm text-gray-600">Gestão de despesas</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 shadow-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div className={`flex items-center text-sm font-medium px-2 py-1 rounded-full ${
              margemLiquida >= 0 ? 'text-purple-700 bg-purple-100' : 'text-red-700 bg-red-100'
            }`}>
              {margemLiquida >= 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
              <span>{margemLiquida.toFixed(1)}%</span>
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 mb-1">Margem Líquida</p>
            <p className="text-sm text-gray-600">Rentabilidade final</p>
          </div>
        </div>
      </div>
    </div>
  );
}