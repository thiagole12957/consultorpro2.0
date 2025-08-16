import React, { useState } from 'react';
import { X, Save, User, Shield, Key, Settings } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { Usuario, PermissoesUsuario } from '../../types/auth';

interface UsuarioModalProps {
  usuario?: Usuario | null;
  onClose: () => void;
}

export function UsuarioModal({ usuario, onClose }: UsuarioModalProps) {
  const { adicionarUsuario, atualizarUsuario, colaboradores, perfisUsuario, empresaSelecionada, filiais } = useApp();
  const isEdit = !!usuario;
  
  const [activeTab, setActiveTab] = useState<'basico' | 'permissoes'>('basico');
  
  const [formData, setFormData] = useState({
    email: usuario?.email || '',
    senha: usuario?.senha || '',
    nome: usuario?.nome || '',
    colaboradorId: usuario?.colaboradorId || '',
    empresaId: usuario?.empresaId || empresaSelecionada?.id || '',
    filialId: usuario?.filialId || '',
    perfil: usuario?.perfil || null,
    ativo: usuario?.ativo ?? true,
  });

  const [permissoes, setPermissoes] = useState<PermissoesUsuario>(
    usuario?.permissoes || {
      dashboard: { visualizar: true, criar: false, editar: false, excluir: false },
      empresas: { visualizar: false, criar: false, editar: false, excluir: false },
      clientes: { visualizar: true, criar: true, editar: true, excluir: false },
      contratos: { visualizar: true, criar: true, editar: true, excluir: false },
      faturas: { visualizar: true, criar: true, editar: true, excluir: false },
      licencas: { visualizar: true, criar: true, editar: true, excluir: false },
      produtos: { visualizar: true, criar: true, editar: true, excluir: false },
      vendas: { visualizar: true, criar: true, editar: true, excluir: false },
      contabilidade: { visualizar: false, criar: false, editar: false, excluir: false },
      contasPagar: { visualizar: false, criar: false, editar: false, excluir: false },
      contasReceber: { visualizar: true, criar: false, editar: false, excluir: false },
      reunioes: { visualizar: true, criar: true, editar: true, excluir: false },
      projetos: { visualizar: true, criar: true, editar: true, excluir: false },
      consultoriaMensal: { visualizar: true, criar: true, editar: true, excluir: false },
      rh: { visualizar: false, criar: false, editar: false, excluir: false },
      usuarios: { visualizar: false, criar: false, editar: false, excluir: false },
      relatorios: { visualizar: true, criar: false, editar: false, excluir: false, exportar: true },
      auditoria: { visualizar: false, criar: false, editar: false, excluir: false },
      configuracoes: { visualizar: false, criar: false, editar: false, excluir: false },
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.colaboradorId) {
      alert('Selecione um colaborador para vincular ao usuário');
      return;
    }
    
    if (isEdit && usuario) {
      atualizarUsuario(usuario.id, {
        ...formData,
        permissoes,
        atualizadoEm: new Date().toISOString().split('T')[0],
      });
    } else {
      const novoUsuario: Usuario = {
        id: Date.now().toString(),
        ...formData,
        permissoes,
        criadoEm: new Date().toISOString().split('T')[0],
        atualizadoEm: new Date().toISOString().split('T')[0],
      };
      adicionarUsuario(novoUsuario);
    }
    
    onClose();
  };

  const aplicarPerfilPermissoes = (perfilId: string) => {
    const perfil = perfisUsuario.find(p => p.id === perfilId);
    if (perfil) {
      setPermissoes(perfil.permissoesPadrao);
      setFormData(prev => ({ ...prev, perfil }));
    }
  };

  const colaboradoresDisponiveis = colaboradores.filter(c => 
    c.empresaId === formData.empresaId && 
    c.status === 'ativo' &&
    (!isEdit || !usuarios.some(u => u.colaboradorId === c.id && u.id !== usuario?.id) || c.id === usuario?.colaboradorId)
  );

  const filiaisDisponiveis = filiais.filter(f => 
    f.empresaId === formData.empresaId && f.ativa
  );

  const renderBasico = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            E-mail de Login *
          </label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="usuario@empresa.com"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Senha *
          </label>
          <input
            type="password"
            required
            value={formData.senha}
            onChange={(e) => setFormData(prev => ({ ...prev, senha: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Digite uma senha segura"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Colaborador Vinculado *
        </label>
        <select
          required
          value={formData.colaboradorId}
          onChange={(e) => {
            const colaborador = colaboradores.find(c => c.id === e.target.value);
            setFormData(prev => ({ 
              ...prev, 
              colaboradorId: e.target.value,
              nome: colaborador?.nome || '',
              email: colaborador?.email || prev.email,
            }));
          }}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Selecione um colaborador</option>
          {colaboradoresDisponiveis.map(colaborador => (
            <option key={colaborador.id} value={colaborador.id}>
              {colaborador.nome} - {colaborador.dadosProfissionais.cargo}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Filial de Acesso
        </label>
        <select
          value={formData.filialId}
          onChange={(e) => setFormData(prev => ({ ...prev, filialId: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Todas as filiais</option>
          {filiaisDisponiveis.map(filial => (
            <option key={filial.id} value={filial.id}>
              {filial.nome} {filial.isMatriz ? '(Matriz)' : ''}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Perfil de Acesso
        </label>
        <select
          value={formData.perfil?.id || ''}
          onChange={(e) => aplicarPerfilPermissoes(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Selecione um perfil</option>
          {perfisUsuario.filter(p => p.ativo).map(perfil => (
            <option key={perfil.id} value={perfil.id}>
              {perfil.nome} - {perfil.descricao}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="ativo"
          checked={formData.ativo}
          onChange={(e) => setFormData(prev => ({ ...prev, ativo: e.target.checked }))}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="ativo" className="ml-2 block text-sm text-gray-900">
          Usuário Ativo
        </label>
      </div>
    </div>
  );

  const renderPermissoes = () => {
    const modulos = [
      { key: 'dashboard', label: 'Dashboard' },
      { key: 'empresas', label: 'Empresas & Filiais' },
      { key: 'clientes', label: 'Clientes' },
      { key: 'contratos', label: 'Contratos' },
      { key: 'faturas', label: 'Faturas' },
      { key: 'licencas', label: 'Licenças' },
      { key: 'produtos', label: 'Produtos' },
      { key: 'vendas', label: 'Vendas' },
      { key: 'contabilidade', label: 'Contabilidade' },
      { key: 'contasPagar', label: 'Contas a Pagar' },
      { key: 'contasReceber', label: 'Contas a Receber' },
      { key: 'reunioes', label: 'Reuniões' },
      { key: 'projetos', label: 'Projetos' },
      { key: 'consultoriaMensal', label: 'Consultoria Mensal' },
      { key: 'rh', label: 'Recursos Humanos' },
      { key: 'usuarios', label: 'Usuários' },
      { key: 'relatorios', label: 'Relatórios' },
      { key: 'auditoria', label: 'Auditoria' },
      { key: 'configuracoes', label: 'Configurações' },
    ];

    const atualizarPermissao = (modulo: string, acao: string, valor: boolean) => {
      setPermissoes(prev => ({
        ...prev,
        [modulo]: {
          ...prev[modulo as keyof PermissoesUsuario],
          [acao]: valor
        }
      }));
    };

    return (
      <div className="space-y-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Configuração de Permissões</h4>
          <p className="text-sm text-blue-800">
            Configure as permissões específicas para cada módulo do sistema.
          </p>
        </div>

        <div className="space-y-4">
          {modulos.map((modulo) => {
            const permissaoModulo = permissoes[modulo.key as keyof PermissoesUsuario];
            
            return (
              <div key={modulo.key} className="border border-gray-200 rounded-lg p-4">
                <h5 className="font-medium text-gray-900 mb-3">{modulo.label}</h5>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id={`${modulo.key}-visualizar`}
                      checked={permissaoModulo.visualizar}
                      onChange={(e) => atualizarPermissao(modulo.key, 'visualizar', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor={`${modulo.key}-visualizar`} className="ml-2 text-sm text-gray-700">
                      Visualizar
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id={`${modulo.key}-criar`}
                      checked={permissaoModulo.criar}
                      onChange={(e) => atualizarPermissao(modulo.key, 'criar', e.target.checked)}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                    <label htmlFor={`${modulo.key}-criar`} className="ml-2 text-sm text-gray-700">
                      Criar
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id={`${modulo.key}-editar`}
                      checked={permissaoModulo.editar}
                      onChange={(e) => atualizarPermissao(modulo.key, 'editar', e.target.checked)}
                      className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
                    />
                    <label htmlFor={`${modulo.key}-editar`} className="ml-2 text-sm text-gray-700">
                      Editar
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id={`${modulo.key}-excluir`}
                      checked={permissaoModulo.excluir}
                      onChange={(e) => atualizarPermissao(modulo.key, 'excluir', e.target.checked)}
                      className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                    />
                    <label htmlFor={`${modulo.key}-excluir`} className="ml-2 text-sm text-gray-700">
                      Excluir
                    </label>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const tabs = [
    { id: 'basico', label: 'Dados Básicos', icon: User },
    { id: 'permissoes', label: 'Permissões', icon: Shield },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {isEdit ? 'Editar Usuário' : 'Novo Usuário do Sistema'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navegação por Abas */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          {/* Conteúdo das Abas */}
          {activeTab === 'basico' && renderBasico()}
          {activeTab === 'permissoes' && renderPermissoes()}
          
          <div className="flex justify-end space-x-3 pt-6 mt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>{isEdit ? 'Salvar Usuário' : 'Criar Usuário'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}