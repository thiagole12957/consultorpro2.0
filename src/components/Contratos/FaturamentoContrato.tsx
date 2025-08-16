import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Calendar, DollarSign, Play, Pause, Settings, AlertTriangle, CheckCircle } from 'lucide-react';

export function FaturamentoContrato() {
  const { contratos, clientes, faturas } = useApp();
  const [contratoSelecionado, setContratoSelecionado] = useState('');

  const contrato = contratos.find(c => c.id === contratoSelecionado);
  const cliente = contrato ? clientes.find(c => c.id === contrato.clienteId) : null;
  const faturasContrato = faturas.filter(f => f.contratoId === contratoSelecionado);

  const proximaFatura = () => {
    if (!contrato) return null;
    
    const hoje = new Date();
    const diaVencimento = contrato.diaVencimento || 10;
    
    let proximaData = new Date(hoje.getFullYear(), hoje.getMonth(), diaVencimento);
    if (proximaData <= hoje) {
      proximaData = new Date(hoje.getFullYear(), hoje.getMonth() + 1, diaVencimento);
    }
    
    return proximaData;
  };

  const calcularValorMensal = () => {
    if (!contrato) return 0;
    
    const dataInicio = new Date(contrato.dataInicio);
    const dataFim = new Date(contrato.dataFim);
    const meses = Math.ceil((dataFim.getTime() - dataInicio.getTime()) / (1000 * 60 * 60 * 24 * 30));
    
    return meses > 0 ? contrato.valor / meses : contrato.valor;
  };

  return (
    <div className="space-y-6">
      {/* Seleção de Contrato */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Configuração de Faturamento</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Selecione o Contrato
            </label>
            <select
              value={contratoSelecionado}
              onChange={(e) => setContratoSelecionado(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Selecione um contrato</option>
              {contratos.filter(c => c.status === 'Ativo').map(contrato => {
                const cliente = clientes.find(cl => cl.id === contrato.clienteId);
                return (
                  <option key={contrato.id} value={contrato.id}>
                    {contrato.nome} - {cliente?.empresa}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
      </div>

      {/* Detalhes do Faturamento */}
      {contrato && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Informações do Contrato */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Informações do Contrato</h4>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Cliente:</span>
                <span className="font-medium text-gray-900">{cliente?.empresa}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Valor Total:</span>
                <span className="font-medium text-green-600">R$ {contrato.valor.toLocaleString('pt-BR')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Valor Mensal:</span>
                <span className="font-medium text-blue-600">R$ {calcularValorMensal().toLocaleString('pt-BR')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Dia de Vencimento:</span>
                <span className="font-medium text-gray-900">Dia {contrato.diaVencimento}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Período:</span>
                <span className="font-medium text-gray-900">
                  {new Date(contrato.dataInicio).toLocaleDateString('pt-BR')} - {new Date(contrato.dataFim).toLocaleDateString('pt-BR')}
                </span>
              </div>
            </div>
          </div>

          {/* Próxima Fatura */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Próxima Fatura</h4>
            
            {proximaFatura() && (
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">
                      {proximaFatura()?.toLocaleDateString('pt-BR')}
                    </p>
                    <p className="text-sm text-gray-600">Data de vencimento</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium text-gray-900">
                      R$ {calcularValorMensal().toLocaleString('pt-BR')}
                    </p>
                    <p className="text-sm text-gray-600">Valor da fatura</p>
                  </div>
                </div>
                
                <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Gerar Fatura Agora
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Histórico de Faturas */}
      {contrato && faturasContrato.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Histórico de Faturas</h4>
          
          <div className="space-y-3">
            {faturasContrato.slice(0, 5).map((fatura) => (
              <div key={fatura.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{fatura.numero}</p>
                  <p className="text-sm text-gray-600">
                    Vencimento: {new Date(fatura.dataVencimento).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    R$ {fatura.valor.toLocaleString('pt-BR')}
                  </p>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    fatura.status === 'Pago' ? 'bg-green-100 text-green-700' :
                    fatura.status === 'Pendente' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {fatura.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Estado sem contrato selecionado */}
      {!contratoSelecionado && (
        <div className="bg-white rounded-xl p-8 text-center">
          <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Selecione um Contrato</h3>
          <p className="text-gray-600">Escolha um contrato ativo para configurar o faturamento</p>
        </div>
      )}
    </div>
  );
}