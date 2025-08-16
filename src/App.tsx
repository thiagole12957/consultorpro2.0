import React, { useState } from 'react';
import { AppProvider } from './contexts/AppContext';
import { Sidebar } from './components/Layout/Sidebar';
import { Header } from './components/Layout/Header';
import { Dashboard } from './components/Dashboard/Dashboard';
import { ClientesList } from './components/Clientes/ClientesList';
import { ClienteDetalhes } from './components/Clientes/ClienteDetalhes';
import { ClienteModal } from './components/Clientes/ClienteModal';
import { ContratosList } from './components/Contratos/ContratosList';
import { ContratoModal } from './components/Contratos/ContratoModal';
import { ContratosDashboard } from './components/Contratos/ContratosDashboard';
import { PlanoVendaList } from './components/PlanosVenda/PlanoVendaList';
import { PlanoVendaModal } from './components/PlanosVenda/PlanoVendaModal';
import { ProdutosList } from './components/Produtos/ProdutosList';
import { ProdutoModal } from './components/Produtos/ProdutoModal';
import { FaturasList } from './components/Faturas/FaturasList';
import { FaturaModal } from './components/Faturas/FaturaModal';
import { LicencasList } from './components/Licencas/LicencasList';
import { LicencaModal } from './components/Licencas/LicencaModal';
import { ContabilidadeDashboard } from './components/Contabilidade/ContabilidadeDashboard';
import { ContasPagarDashboard } from './components/ContasPagar/ContasPagarDashboard';
import { ReunioesDashboard } from './components/Reunioes/ReunioesDashboard';
import { ProjetosDashboard } from './components/Projetos/ProjetosDashboard';
import { RelatoriosDashboard } from './components/Relatorios/RelatoriosDashboard';
import { AuditoriaDashboard } from './components/Auditoria/AuditoriaDashboard';
import { PainelConsultoriaDashboard } from './components/ConsultoriaMensal/PainelConsultoriaDashboard';
import { EmpresasList } from './components/Empresa/EmpresasList';
import { EmpresaDetalhes } from './components/Empresa/EmpresaDetalhes';
import { EmpresaModal } from './components/Empresa/EmpresaModal';
import { CarteiraCobrancaList } from './components/CarteiraCobranca/CarteiraCobrancaList';
import { CarteiraCobrancaModal } from './components/CarteiraCobranca/CarteiraCobrancaModal';
import { ModeloContratoList } from './components/CarteiraCobranca/ModeloContratoList';
import { ModeloContratoModal } from './components/CarteiraCobranca/ModeloContratoModal';
import { ReguaCobrancaDashboard } from './components/ReguaCobranca/ReguaCobrancaDashboard';
import { LoginScreen } from './components/Auth/LoginScreen';
import { RHDashboard } from './components/RH/RHDashboard';
import { UsuariosList } from './components/Auth/UsuariosList';
import { ConfiguracoesSistema } from './components/Configuracoes/ConfiguracoesSistema';
import { ConfiguracaoAviso } from './components/Configuracoes/ConfiguracaoAviso';
import { useApp } from './contexts/AppContext';

function AppContent() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mostrarAvisoConfig, setMostrarAvisoConfig] = useState(false);
  const [showClienteModal, setShowClienteModal] = useState(false);
  const [showContratoModal, setShowContratoModal] = useState(false);
  const [showFaturaModal, setShowFaturaModal] = useState(false);
  const [showLicencaModal, setShowLicencaModal] = useState(false);
  const [showPlanoVendaModal, setShowPlanoVendaModal] = useState(false);
  const [showProdutoModal, setShowProdutoModal] = useState(false);
  const [showEmpresaModal, setShowEmpresaModal] = useState(false);
  const [showCarteiraModal, setShowCarteiraModal] = useState(false);
  const [showModeloContratoModal, setShowModeloContratoModal] = useState(false);
  const { clienteSelecionado, empresaSelecionada, usuarioLogado, login } = useApp();

  // Se não há usuário logado, mostrar tela de login
  if (!usuarioLogado) {
    return (
      <LoginScreen 
        onLogin={(email, senha) => {
          const sucesso = login(email, senha);
          if (!sucesso) {
            alert('E-mail ou senha incorretos!');
          }
        }} 
      />
    );
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const getHeaderInfo = () => {
    switch (activeTab) {
      case 'dashboard':
        return { title: 'Dashboard', subtitle: 'Visão geral do seu negócio' };
      case 'empresas':
        return { 
          title: 'Empresas & Filiais', 
          subtitle: 'Gestão de empresas e filiais do sistema',
          showAdd: true 
        };
      case 'clientes':
        return { 
          title: 'Clientes', 
          subtitle: 'Gerencie seus clientes e prospects',
          showAdd: true 
        };
      case 'agenda':
        return { 
          title: 'Agenda Pessoal', 
          subtitle: 'Organize seus compromissos e reuniões'
        };
      case 'consultoria-mensal':
        return { 
          title: 'Painel de Consultoria Mensal', 
          subtitle: 'Gestão completa da consultoria mensal por cliente'
        };
      case 'contratos':
        return { 
          title: 'Contratos', 
          subtitle: 'Gerencie contratos e acordos',
          showAdd: true
        };
      case 'modelos-contrato':
        return { 
          title: 'Modelos de Contrato', 
          subtitle: 'Templates e modelos para contratos',
          showAdd: true 
        };
      case 'carteira-cobranca':
        return { 
          title: 'Carteira de Cobrança', 
          subtitle: 'Gerencie carteiras de cobrança',
          showAdd: true 
        };
      case 'planos-venda':
        return { 
          title: 'Planos de Venda', 
          subtitle: 'Gerencie propostas e planos comerciais',
          showAdd: true 
        };
      case 'produtos':
        return { 
          title: 'Produtos & Serviços', 
          subtitle: 'Catálogo de produtos e serviços',
          showAdd: true 
        };
      case 'faturas':
        return { 
          title: 'Faturas', 
          subtitle: 'Controle de faturamento',
          showAdd: true 
        };
      case 'licencas':
        return { 
          title: 'Licenças', 
          subtitle: 'Controle de licenças de software',
          showAdd: true 
        };
      case 'contabilidade':
        return { title: 'Contabilidade', subtitle: 'DRE, Balanço e Lançamentos' };
      case 'contas-pagar':
        return { title: 'Contas a Pagar', subtitle: 'Gestão de fornecedores e pagamentos' };
      case 'reunioes':
        return { title: 'Reuniões & IA', subtitle: 'Videoconferências com transcrição automática' };
      case 'projetos':
        return { title: 'Projetos', subtitle: 'Gestão completa de projetos' };
      case 'relatorios':
        return { title: 'Relatórios', subtitle: 'Analytics e relatórios detalhados' };
      case 'auditoria':
        return { title: 'Auditoria', subtitle: 'Logs e monitoramento do sistema' };
      case 'rh':
        return { title: 'Recursos Humanos', subtitle: 'Gestão de colaboradores e estrutura organizacional' };
      case 'usuarios':
        return { title: 'Usuários do Sistema', subtitle: 'Controle de acesso e permissões' };
      case 'configuracoes':
        return { title: 'Configurações do Sistema', subtitle: 'APIs, banco de dados e parâmetros gerais' };
      default:
        return { title: 'Sistema', subtitle: '' };
    }
  };

  const renderContent = () => {
    if (activeTab === 'empresas' && empresaSelecionada) {
      return <EmpresaDetalhes />;
    }

    if (activeTab === 'clientes' && clienteSelecionado) {
      return <ClienteDetalhes />;
    }

    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'empresas':
        return <EmpresasList />;
      case 'clientes':
        return <ClientesList />;
      case 'consultoria-mensal':
        return <PainelConsultoriaDashboard />;
      case 'contratos':
        return <ContratosDashboard />;
      case 'modelos-contrato':
        return <ModeloContratoList />;
      case 'carteira-cobranca':
        return <CarteiraCobrancaList />;
      case 'regua-cobranca':
        return <ReguaCobrancaDashboard />;
      case 'planos-venda':
        return <PlanoVendaList />;
      case 'produtos':
        return <ProdutosList />;
      case 'faturas':
        return <FaturasList />;
      case 'licencas':
        return <LicencasList />;
      case 'contabilidade':
        return <ContabilidadeDashboard />;
      case 'contas-pagar':
        return <ContasPagarDashboard />;
      case 'reunioes':
        return <ReunioesDashboard />;
      case 'projetos':
        return <ProjetosDashboard />;
      case 'relatorios':
        return <RelatoriosDashboard />;
      case 'auditoria':
        return <AuditoriaDashboard />;
      case 'rh':
        return <RHDashboard />;
      case 'usuarios':
        return <UsuariosList />;
      case 'configuracoes':
        return <ConfiguracoesSistema />;
      default:
        return <Dashboard />;
    }
  };

  const headerInfo = getHeaderInfo();
  
  const handleAddClick = () => {
    closeSidebar(); // Fechar sidebar no mobile ao clicar em adicionar
    switch (activeTab) {
      case 'empresas':
        setShowEmpresaModal(true);
        break;
      case 'clientes':
        setShowClienteModal(true);
        break;
      case 'planos-venda':
        setShowPlanoVendaModal(true);
        break;
      case 'produtos':
        setShowProdutoModal(true);
        break;
      case 'faturas':
        setShowFaturaModal(true);
        break;
      case 'licencas':
        setShowLicencaModal(true);
        break;
      case 'modelos-contrato':
        setShowModeloContratoModal(true);
        break;
      case 'carteira-cobranca':
        setShowCarteiraModal(true);
        break;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={(tab) => {
          setActiveTab(tab);
          closeSidebar(); // Fechar sidebar no mobile ao selecionar tab
        }} 
        isOpen={sidebarOpen}
        onToggle={toggleSidebar}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          title={headerInfo.title}
          subtitle={headerInfo.subtitle}
          onAddClick={headerInfo.showAdd ? handleAddClick : undefined}
          onMenuClick={toggleSidebar}
        />
        
        <main className="flex-1 overflow-y-auto bg-gray-50">
          {renderContent()}
        </main>
        
        {/* Aviso de Configuração */}
        {mostrarAvisoConfig && (
          <ConfiguracaoAviso 
            onAbrirConfiguracoes={() => {
              setActiveTab('configuracoes');
              setMostrarAvisoConfig(false);
            }}
          />
        )}
      </div>

      {showClienteModal && (
        <ClienteModal onClose={() => setShowClienteModal(false)} />
      )}
      
      {showContratoModal && (
        <ContratoModal onClose={() => setShowContratoModal(false)} />
      )}
      
      {showFaturaModal && (
        <FaturaModal onClose={() => setShowFaturaModal(false)} />
      )}
      
      {showLicencaModal && (
        <LicencaModal onClose={() => setShowLicencaModal(false)} />
      )}
      
      {showPlanoVendaModal && (
        <PlanoVendaModal onClose={() => setShowPlanoVendaModal(false)} />
      )}
      
      {showProdutoModal && (
        <ProdutoModal onClose={() => setShowProdutoModal(false)} />
      )}
      
      {showEmpresaModal && (
        <EmpresaModal onClose={() => setShowEmpresaModal(false)} />
      )}
      
      {showCarteiraModal && (
        <CarteiraCobrancaModal onClose={() => setShowCarteiraModal(false)} />
      )}
      
      {showModeloContratoModal && (
        <ModeloContratoModal onClose={() => setShowModeloContratoModal(false)} />
      )}
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;