import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  DollarSign, 
  Key, 
  Package, 
  CreditCard, 
  Calculator, 
  Video, 
  Target, 
  BarChart3, 
  FileSearch,
  Building2,
  ShoppingCart,
  UserCheck,
  Settings,
  Brain,
  Zap,
  Crown,
  LogOut,
  Calendar
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export function Sidebar({ activeTab, setActiveTab, isOpen, onToggle }: SidebarProps) {
  const { usuarioLogado, logout, empresaSelecionada, filialAtiva } = useApp();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'empresas', label: 'Empresas & Filiais', icon: Building2 },
    { id: 'clientes', label: 'Clientes', icon: Users },
    { id: 'consultoria-mensal', label: 'Consultoria Mensal', icon: Brain },
    { id: 'contratos', label: 'Contratos', icon: FileText },
    { id: 'agenda', label: 'Agenda Pessoal', icon: Calendar },
    { id: 'calendario-empresa', label: 'Calendário da Empresa', icon: Building2 },
    { id: 'vendas', label: 'Vendas', icon: ShoppingCart },
    { id: 'planos-venda', label: 'Planos de Venda', icon: Target },
    { id: 'produtos', label: 'Produtos & Serviços', icon: Package },
    { id: 'faturas', label: 'Faturas', icon: CreditCard },
    { id: 'licencas', label: 'Licenças', icon: Key },
    { id: 'contabilidade', label: 'Contabilidade', icon: Calculator },
    { id: 'contas-pagar', label: 'Contas a Pagar', icon: DollarSign },
    { id: 'carteira-cobranca', label: 'Carteira de Cobrança', icon: CreditCard },
    { id: 'regua-cobranca', label: 'Régua de Cobrança', icon: Settings },
    { id: 'reunioes', label: 'Reuniões & IA', icon: Video },
    { id: 'projetos', label: 'Projetos', icon: Target },
    { id: 'relatorios', label: 'Relatórios', icon: BarChart3 },
    { id: 'rh', label: 'Recursos Humanos', icon: UserCheck },
    { id: 'usuarios', label: 'Usuários', icon: Users },
    { id: 'auditoria', label: 'Auditoria', icon: FileSearch },
    { id: 'configuracoes', label: 'Configurações', icon: Settings },
  ];

  const handleLogout = () => {
    if (confirm('Tem certeza que deseja sair do sistema?')) {
      logout();
    }
  };

  return (
    <>
      {/* Overlay para mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 flex flex-col h-full
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Header da Sidebar */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">ConsultorPro</h2>
              <p className="text-xs text-blue-100">Sistema de Gestão</p>
            </div>
          </div>
        </div>

        {/* Informações do Usuário */}
        {usuarioLogado && (
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                {usuarioLogado.nome.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{usuarioLogado.nome}</p>
                <p className="text-xs text-gray-500 truncate">{usuarioLogado.email}</p>
                {usuarioLogado.perfil && (
                  <div className="flex items-center space-x-1 mt-1">
                    <Crown className="w-3 h-3 text-yellow-600" />
                    <span className="text-xs text-yellow-700">{usuarioLogado.perfil.nome}</span>
                  </div>
                )}
              </div>
            </div>
            
            {empresaSelecionada && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <div className="flex items-center space-x-2">
                  <Building2 className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-medium text-blue-900">{empresaSelecionada.nomeFantasia}</span>
                </div>
                {filialAtiva && (
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs text-gray-600">{filialAtiva.nome}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Menu de Navegação */}
        <nav className="flex-1 overflow-y-auto py-4 scrollbar-thin">
          <div className="space-y-1 px-3">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    // Fechar sidebar no mobile após seleção
                    if (window.innerWidth < 1024) {
                      onToggle();
                    }
                  }}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 group ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <Icon className={`w-5 h-5 flex-shrink-0 ${
                    isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-700'
                  }`} />
                  <span className="font-medium text-sm truncate">{item.label}</span>
                  {isActive && (
                    <div className="w-2 h-2 bg-white rounded-full ml-auto flex-shrink-0"></div>
                  )}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Footer da Sidebar */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 text-red-600 hover:bg-red-50 hover:text-red-700"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium text-sm">Sair do Sistema</span>
          </button>
          
          <div className="mt-3 pt-3 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              ConsultorPro v1.0
            </p>
            <p className="text-xs text-gray-400 text-center">
              © 2024 HD Soluções ISP
            </p>
          </div>
        </div>
      </div>
    </>
  );
}