import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { FileText, Download, Calendar, BarChart3, Target, CheckCircle, AlertTriangle, TrendingUp } from 'lucide-react';

interface RelatoriosAutomaticosProps {
  clienteId: string;
  mesAno: string;
}

export function RelatoriosAutomaticos({ clienteId, mesAno }: RelatoriosAutomaticosProps) {
  const { 
    clientes, 
    performanceMensal, 
    metasMensais, 
    acoesConsultoria, 
    diagnosticosMensais,
    relatoriosMensais,
    adicionarRelatorioMensal 
  } = useApp();
  
  const [gerandoRelatorio, setGerandoRelatorio] = useState(false);

  const cliente = clientes.find(c => c.id === clienteId);
  const performance = performanceMensal.find(p => p.clienteId === clienteId && p.mesAno === mesAno);
  const metas = metasMensais.filter(m => m.consultoriaMensalId && m.consultoriaMensalId.includes(mesAno));
  const acoes = acoesConsultoria.filter(a => a.consultoriaMensalId && a.consultoriaMensalId.includes(mesAno));
  const diagnostico = diagnosticosMensais.find(d => d.consultoriaMensalId && d.consultoriaMensalId.includes(mesAno));

  const relatorioExistente = relatoriosMensais.find(r => 
    r.consultoriaMensalId && r.consultoriaMensalId.includes(mesAno)
  );

  const gerarRelatorio = async () => {
    setGerandoRelatorio(true);
    
    try {
      // Simular geração de relatório
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const dadosRelatorio = {
        indicadores: {
          clientesAtivos: performance?.clientesAtivos || 0,
          faturamento: performance?.faturamentoTotal || 0,
          nps: performance?.nps || 0,
          churn: performance?.taxaChurn || 0,
          inadimplencia: performance?.percentualInadimplencia || 0,
        },
        metas: {
          total: metas.length,
          cumpridas: metas.filter(m => m.status === 'cumprida').length,
          emAndamento: metas.filter(m => m.status === 'em_andamento').length,
          naoAtingidas: metas.filter(m => m.status === 'nao_atingida').length,
        },
        acoes: {
          total: acoes.length,
          concluidas: acoes.filter(a => a.status === 'concluido').length,
          emAndamento: acoes.filter(a => a.status === 'em_andamento').length,
          atrasadas: acoes.filter(a => a.status === 'atrasado').length,
        },
        resultados: {
          scorePerformance: 85, // Calculado
          melhorias: diagnostico?.insightsMelhoria.length || 0,
          problemas: diagnostico?.problemasDetectados.length || 0,
        },
        proximosPassos: [
          'Implementar ações do quadrante Quick Wins',
          'Acompanhar metas em andamento',
          'Revisar processos com baixa performance',
          'Agendar reunião de follow-up'
        ]
      };

      const novoRelatorio = {
        id: Date.now().toString(),
        consultoriaMensalId: `${clienteId}-${mesAno}`,
        ...dadosRelatorio,
        observacoes: 'Relatório gerado automaticamente',
        geradoEm: new Date().toISOString(),
        urlPdf: `/relatorios/consultoria-${clienteId}-${mesAno}.pdf`
      };

      adicionarRelatorioMensal(novoRelatorio);
      
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
    } finally {
      setGerandoRelatorio(false);
    }
  };

  const downloadRelatorio = () => {
    // Simular download do PDF
    const conteudo = gerarConteudoPDF();
    const blob = new Blob([conteudo], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio-consultoria-${cliente?.empresa}-${mesAno}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const gerarConteudoPDF = () => {
    return `
RELATÓRIO MENSAL DE CONSULTORIA
${cliente?.empresa} - ${mesAno}
Gerado em: ${new Date().toLocaleDateString('pt-BR')}

=== INDICADORES PRINCIPAIS ===
Clientes Ativos: ${performance?.clientesAtivos || 0}
Faturamento: R$ ${performance?.faturamentoTotal.toLocaleString('pt-BR') || '0'}
NPS: ${performance?.nps || 0}
Taxa de Churn: ${performance?.taxaChurn.toFixed(1) || 0}%
Inadimplência: ${performance?.percentualInadimplencia.toFixed(1) || 0}%

=== METAS DO MÊS ===
Total de Metas: ${metas.length}
Cumpridas: ${metas.filter(m => m.status === 'cumprida').length}
Em Andamento: ${metas.filter(m => m.status === 'em_andamento').length}
Não Atingidas: ${metas.filter(m => m.status === 'nao_atingida').length}

=== PLANO DE AÇÃO ===
Total de Ações: ${acoes.length}
Concluídas: ${acoes.filter(a => a.status === 'concluido').length}
Em Andamento: ${acoes.filter(a => a.status === 'em_andamento').length}
Atrasadas: ${acoes.filter(a => a.status === 'atrasado').length}

=== PRÓXIMOS PASSOS ===
${relatorioExistente?.proximosPassos.map((passo, i) => `${i + 1}. ${passo}`).join('\n') || 'Não definidos'}

=== OBSERVAÇÕES ===
${relatorioExistente?.observacoes || 'Nenhuma observação adicional'}
    `;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">Relatórios Automáticos</h3>
          <p className="text-gray-600">Geração de relatórios mensais em PDF</p>
        </div>
        <div className="flex space-x-3">
          {relatorioExistente && (
            <button
              onClick={downloadRelatorio}
              className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF</span>
            </button>
          )}
          <button
            onClick={gerarRelatorio}
            disabled={gerandoRelatorio}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <FileText className="w-4 h-4" />
            <span>{gerandoRelatorio ? 'Gerando...' : 'Gerar Relatório'}</span>
          </button>
        </div>
      </div>

      {/* Preview do Relatório */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <FileText className="w-6 h-6 text-blue-600" />
            <div>
              <h4 className="text-lg font-semibold text-gray-900">
                Relatório Mensal - {cliente?.empresa}
              </h4>
              <p className="text-sm text-gray-600">Período: {mesAno}</p>
            </div>
          </div>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Indicadores */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              <h5 className="font-semibold text-gray-900">Indicadores Principais</h5>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-600 font-medium">Clientes Ativos</p>
                <p className="text-2xl font-bold text-blue-900">{performance?.clientesAtivos || 0}</p>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-green-600 font-medium">Faturamento</p>
                <p className="text-2xl font-bold text-green-900">
                  R$ {((performance?.faturamentoTotal || 0) / 1000).toFixed(0)}k
                </p>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-sm text-purple-600 font-medium">NPS</p>
                <p className="text-2xl font-bold text-purple-900">{performance?.nps || 0}</p>
              </div>
            </div>
          </div>

          {/* Status das Metas */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Target className="w-5 h-5 text-orange-600" />
              <h5 className="font-semibold text-gray-900">Status das Metas</h5>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-xl font-bold text-gray-900">{metas.length}</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-green-600">Cumpridas</p>
                <p className="text-xl font-bold text-green-900">
                  {metas.filter(m => m.status === 'cumprida').length}
                </p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-600">Em Andamento</p>
                <p className="text-xl font-bold text-blue-900">
                  {metas.filter(m => m.status === 'em_andamento').length}
                </p>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <p className="text-sm text-red-600">Não Atingidas</p>
                <p className="text-xl font-bold text-red-900">
                  {metas.filter(m => m.status === 'nao_atingida').length}
                </p>
              </div>
            </div>
          </div>

          {/* Ações Executadas */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <h5 className="font-semibold text-gray-900">Ações Executadas</h5>
            </div>
            
            <div className="space-y-2">
              {acoes.filter(a => a.status === 'concluido').slice(0, 5).map((acao) => (
                <div key={acao.id} className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-800">{acao.descricao}</span>
                </div>
              ))}
              
              {acoes.filter(a => a.status === 'concluido').length === 0 && (
                <p className="text-sm text-gray-500 italic">Nenhuma ação concluída no período</p>
              )}
            </div>
          </div>

          {/* Ações Pendentes */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              <h5 className="font-semibold text-gray-900">Ações Pendentes</h5>
            </div>
            
            <div className="space-y-2">
              {acoes.filter(a => a.status !== 'concluido').slice(0, 5).map((acao) => (
                <div key={acao.id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className="w-4 h-4 text-yellow-600" />
                    <span className="text-sm text-yellow-800">{acao.descricao}</span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    acao.status === 'em_andamento' ? 'bg-blue-100 text-blue-700' :
                    acao.status === 'atrasado' ? 'bg-red-100 text-red-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {acao.status.replace('_', ' ')}
                  </span>
                </div>
              ))}
              
              {acoes.filter(a => a.status !== 'concluido').length === 0 && (
                <p className="text-sm text-gray-500 italic">Todas as ações foram concluídas</p>
              )}
            </div>
          </div>

          {/* Próximos Passos */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              <h5 className="font-semibold text-gray-900">Próximos Passos</h5>
            </div>
            
            <div className="space-y-2">
              {relatorioExistente?.proximosPassos.map((passo, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-purple-50 rounded-lg">
                  <span className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    {index + 1}
                  </span>
                  <span className="text-sm text-purple-800">{passo}</span>
                </div>
              )) || (
                <div className="space-y-2">
                  <div className="flex items-start space-x-3 p-3 bg-purple-50 rounded-lg">
                    <span className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
                    <span className="text-sm text-purple-800">Revisar metas não atingidas</span>
                  </div>
                  <div className="flex items-start space-x-3 p-3 bg-purple-50 rounded-lg">
                    <span className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
                    <span className="text-sm text-purple-800">Implementar ações prioritárias</span>
                  </div>
                  <div className="flex items-start space-x-3 p-3 bg-purple-50 rounded-lg">
                    <span className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold">3</span>
                    <span className="text-sm text-purple-800">Agendar reunião de acompanhamento</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Histórico de Relatórios */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <h4 className="text-lg font-semibold text-gray-900">Histórico de Relatórios</h4>
        </div>
        
        <div className="p-6">
          {relatoriosMensais.length > 0 ? (
            <div className="space-y-3">
              {relatoriosMensais
                .filter(r => r.consultoriaMensalId && r.consultoriaMensalId.includes(clienteId))
                .sort((a, b) => new Date(b.geradoEm).getTime() - new Date(a.geradoEm).getTime())
                .map((relatorio) => (
                  <div key={relatorio.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-gray-900">
                          Relatório {relatorio.consultoriaMensalId?.split('-')[1]}
                        </p>
                        <p className="text-sm text-gray-600">
                          Gerado em {new Date(relatorio.geradoEm).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                    
                    <button
                      onClick={downloadRelatorio}
                      className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download</span>
                    </button>
                  </div>
                ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Nenhum relatório gerado</h4>
              <p className="text-gray-600">Gere o primeiro relatório para este cliente</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}