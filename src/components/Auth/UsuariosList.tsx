import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Plus, Edit2, Shield, User, Key, Clock, Eye, UserX } from 'lucide-react';
import { UsuarioModal } from './UsuarioModal';

export function UsuariosList() {
  const { usuarios = [], colaboradores = [], perfisUsuario, atualizarUsuario } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [usuarioEdit, setUsuarioEdit] = useState(null);

  const getColaboradorNome = (colaboradorId: string) => {
    const colaborador = colaboradores.find(c => c.id === colaboradorId);
    return colaborador ? colaborador.nome : 'Colaborador não encontrado';
  };

  const getPerfilNome = (perfil: any) => {
    return perfil ? perfil.nome : 'Personalizado';
  };

  const getStatusColor = (ativo: boolean) => {
    return ativo ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700';
  };

  const getNivelColor = (nivel: string) => {
    switch (nivel) {
      case 'super_admin': return 'bg-red-100 text-red-700';
      case 'admin': return 'bg-purple-100 text-purple-700';
      case 'gerente': return 'bg-blue-100 text-blue-700';
      case 'operador': return 'bg-green-100 text-green-700';
      case 'consultor': return 'bg-yellow-100 text-yellow-700';
      case 'visualizador': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handleEditUsuario = (usuario: any) => {
    setUsuarioEdit(usuario);
    setShowModal(true);
  };

  const bloquearUsuario = (usuarioId: string) => {
    if (confirm('Tem certeza que deseja bloquear este usuário?')) {
      atualizarUsuario(usuarioId, { ativo: false });
    }
  };

  const usuariosAtivos = usuarios.filter(u => u.ativo);
  const usuariosBloqueados = usuarios.filter(u => !u.ativo);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">Usuários do Sistema</h3>
          <p className="text-gray-600">Gerencie acessos e permissões</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Usuário</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg">
              <User className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 mb-1">{usuarios.length}</p>
            <p className="text-sm text-gray-600">Total de Usuários</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-green-500 to-green-600 shadow-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 mb-1">{usuariosAtivos.length}</p>
            <p className="text-sm text-gray-600">Ativos</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-red-500 to-red-600 shadow-lg">
              <UserX className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 mb-1">{usuariosBloqueados.length}</p>
            <p className="text-sm text-gray-600">Bloqueados</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 shadow-lg">
              <Clock className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 mb-1">
              {usuarios.filter(u => u.ultimoLogin && 
                new Date(u.ultimoLogin).getTime() > Date.now() - 24 * 60 * 60 * 1000
              ).length}
            </p>
            <p className="text-sm text-gray-600">Online Hoje</p>
          </div>
        </div>
      </div>

      {/* Lista de Usuários */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Usuário</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Colaborador</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Perfil</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Último Login</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Status</th>
                <th className="text-right py-4 px-6 font-semibold text-gray-900">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {usuarios.length > 0 ? (
                usuarios.map((usuario) => {
                  const colaborador = colaboradores.find(c => c.id === usuario.colaboradorId);
                  
                  return (
                    <tr key={usuario.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                            {usuario.nome.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{usuario.nome}</p>
                            <p className="text-sm text-gray-500">{usuario.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div>
                          <p className="text-gray-900">{getColaboradorNome(usuario.colaboradorId)}</p>
                          <p className="text-sm text-gray-500">
                            {colaborador?.dadosProfissionais.cargo}
                          </p>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            usuario.perfil ? getNivelColor(usuario.perfil.nivel) : 'bg-gray-100 text-gray-700'
                          }`}>
                            {getPerfilNome(usuario.perfil)}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {usuario.ultimoLogin ? 
                              new Date(usuario.ultimoLogin).toLocaleDateString('pt-BR') : 
                              'Nunca'
                            }
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(usuario.ativo)}`}>
                          {usuario.ativo ? 'Ativo' : 'Bloqueado'}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Ver permissões"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          
                          <button
                            onClick={() => handleEditUsuario(usuario)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Editar usuário"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          
                          {usuario.ativo && (
                            <button
                              onClick={() => bloquearUsuario(usuario.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Bloquear usuário"
                            >
                              <UserX className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-500">
                    <User className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>Nenhum usuário cadastrado</p>
                    <p className="text-sm mt-2">Crie o primeiro usuário do sistema</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <UsuarioModal
          usuario={usuarioEdit}
          onClose={() => {
            setShowModal(false);
            setUsuarioEdit(null);
          }}
        />
      )}
    </div>
  );
}