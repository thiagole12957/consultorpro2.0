import React from 'react';
import { useApp } from '../../contexts/AppContext';
import { Calendar, DollarSign, User, FileText, CreditCard, TrendingUp } from 'lucide-react';

export function ContasReceberView() {
  const { faturas, clientes, contratos } = useApp();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pago': return 'bg-green-100 text-green-700';
      case 'Pendente': return 'bg-yellow-100 text-yellow-700';
      case 'Vencida': return 'bg-red-100 text-red-700';
      case 'Cancelada': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getClienteNome = (clienteId: string) => {
    const cliente = clientes.find(c => c.id === clienteId);
    return cliente ? cliente.nome : 'Cliente não encontrado';
  };

  const getContratoNome = (contratoId: string) => {
    const contrato = contratos.find(c => c.id === contratoId);
    return contrato ? contrato.nome : 'Contrato não encontrado';
  };

  const isVencida = (dataVencimento: string) => {
    return new Date(dataVencimento) < new Date();
  };

  const totalReceber = faturas
    .filter(f => f.status === 'Pendente')
    .reduce((sum, f) => sum + f.valor, 0);

  const totalVencidas = faturas
    .filter(f => f.status === 'Vencida' || (f.status === 'Pendente' && isVencida(f.dataVencimento)))
    .reduce((sum, f) => sum + f.valor, 0);

  const totalRecebido = faturas
    .filter(f => f.status === 'Pago')
    .reduce((sum, f) => sum + f.valor, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Contas a Receber</h2>
          <p className="text-gray-600">Controle de faturas e recebimentos</p>
        </div>
      </div>

      {/* Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 mb-1">
              R$ {totalReceber.toLocaleString('pt-BR')}
            </p>
            <p className="text-sm text-gray-600">Total a Receber</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-red-500 to-red-600 shadow-lg">
              <Calendar className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 mb-1">
              R$ {totalVencidas.toLocaleString('pt-BR')}
            </p>
            <p className="text-sm text-gray-600">Vencidas</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-green-500 to-green-600 shadow-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 mb-1">
              R$ {totalRecebido.toLocaleString('pt-BR')}
            </p>
            <p className="text-sm text-gray-600">Já Recebido</p>
          </div>
        </div>
      </div>

      {/* Lista de Faturas */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Fatura</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Cliente</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Contrato</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Valor</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Vencimento</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Status</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Dias</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {faturas.length > 0 ? (
                faturas.map((fatura) => {
                  const diasVencimento = Math.ceil((new Date(fatura.dataVencimento).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                  
                  return (
                    <tr key={fatura.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{fatura.numero}</p>
                            <p className="text-sm text-gray-500">
                              {fatura.parcela}/{fatura.totalParcelas}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center">
                          <User className="w-4 h-4 mr-2 text-gray-400" />
                          <span className="text-gray-900">{getClienteNome(fatura.clienteId)}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-gray-700 text-sm">{getContratoNome(fatura.contratoId)}</span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center">
                          <DollarSign className="w-4 h-4 mr-1 text-green-600" />
                          <span className="font-semibold text-gray-900">
                            R$ {fatura.valor.toLocaleString('pt-BR')}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className={`flex items-center text-sm ${
                          isVencida(fatura.dataVencimento) && fatura.status === 'Pendente' 
                            ? 'text-red-600' 
                            : 'text-gray-600'
                        }`}>
                          <Calendar className="w-4 h-4 mr-1" />
                          <span>{new Date(fatura.dataVencimento).toLocaleDateString('pt-BR')}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(fatura.status)}`}>
                          {fatura.status}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`text-sm font-medium ${
                          diasVencimento < 0 ? 'text-red-600' :
                          diasVencimento <= 7 ? 'text-yellow-600' :
                          'text-gray-600'
                        }`}>
                          {diasVencimento < 0 ? `${Math.abs(diasVencimento)} dias em atraso` :
                           diasVencimento === 0 ? 'Vence hoje' :
                           `${diasVencimento} dias`}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-500">
                    <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>Nenhuma fatura encontrada</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Análise por Cliente */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Análise por Cliente</h3>
        <div className="space-y-3">
          {faturas
            .reduce((acc: any[], fatura) => {
              const existing = acc.find(item => item.clienteId === fatura.clienteId);
              if (existing) {
                existing.total += fatura.valor;
                existing.pendente += fatura.status === 'Pendente' ? fatura.valor : 0;
                existing.pago += fatura.status === 'Pago' ? fatura.valor : 0;
                existing.quantidade += 1;
              } else {
                acc.push({
                  clienteId: fatura.clienteId,
                  total: fatura.valor,
                  pendente: fatura.status === 'Pendente' ? fatura.valor : 0,
                  pago: fatura.status === 'Pago' ? fatura.valor : 0,
                  quantidade: 1
                });
              }
              return acc;
            }, [])
            .sort((a, b) => b.total - a.total)
            .slice(0, 5)
            .map((item) => (
              <div key={item.clienteId} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {getClienteNome(item.clienteId).split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{getClienteNome(item.clienteId)}</p>
                    <p className="text-sm text-gray-500">{item.quantidade} faturas</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    R$ {item.total.toLocaleString('pt-BR')}
                  </p>
                  <div className="flex space-x-4 text-sm">
                    <span className="text-green-600">
                      Pago: R$ {item.pago.toLocaleString('pt-BR')}
                    </span>
                    <span className="text-yellow-600">
                      Pendente: R$ {item.pendente.toLocaleString('pt-BR')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}