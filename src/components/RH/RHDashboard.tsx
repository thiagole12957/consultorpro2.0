import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Plus, Users, Building2, Briefcase, Calendar, TrendingUp, UserCheck, UserX } from 'lucide-react';
import { ColaboradorModal } from './ColaboradorModal';
import { DepartamentoModal } from './DepartamentoModal';
import { SetorModal } from './SetorModal';

export function RHDashboard() {
  const { colaboradores, departamentos, setores } = useApp();
  const [activeTab, setActiveTab] = useState<'colaboradores' | 'departamentos' | 'setores' | 'avaliacoes'>('colaboradores');
  const [showColaboradorModal, setShowColaboradorModal] = useState(false);
  const [showDepartamentoModal, setShowDepartamentoModal] = useState(false);
  const [showSetorModal, setShowSetorModal] = useState(false);
  const [colaboradorEdit, setColaboradorEdit] = useState(null);
  const [departamentoEdit, setDepartamentoEdit] = useState(null);
  const [setorEdit, setSetorEdit] = useState(null);

  const colaboradoresAtivos = colaboradores.filter(c => c.status === 'ativo');
  const colaboradoresInativos = colaboradores.filter(c => c.status !== 'ativo');
  const departamentosAtivos = departamentos.filter(d => d.ativo);
  const setoresAtivos = setores.filter(s => s.ativo);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativo': return 'bg-green-100 text-green-700';
      case 'inativo': return 'bg-gray-100 text-gray-700';
      case 'afastado': return 'bg-yellow-100 text-yellow-700';
      case 'ferias': return 'bg-blue-100 text-blue-700';
      case 'demitido': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getDepartamentoNome = (departamentoId: string) => {
    const dept = departamentos.find(d => d.id === departamentoId);
    return dept ? dept.nome : 'Não informado';
  };

  const getSetorNome = (setorId: string) => {
    const setor = setores.find(s => s.id === setorId);
    return setor ? setor.nome : 'Não informado';
  };

  const handleEditColaborador = (colaborador: any) => {
    setColaboradorEdit(colaborador);
    setShowColaboradorModal(true);
  };

  const handleEditDepartamento = (departamento: any) => {
    setDepartamentoEdit(departamento);
    setShowDepartamentoModal(true);
  };

  const handleEditSetor = (setor: any) => {
    setSetorEdit(setor);
    setShowSetorModal(true);
  };

  const renderColaboradores = () => (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 mb-1">{colaboradores.length}</p>
            <p className="text-sm text-gray-600">Total de Colaboradores</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-green-500 to-green-600 shadow-lg">
              <UserCheck className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 mb-1">{colaboradoresAtivos.length}</p>
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
            <p className="text-2xl font-bold text-gray-900 mb-1">{colaboradoresInativos.length}</p>
            <p className="text-sm text-gray-600">Inativos</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 shadow-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 mb-1">
              R$ {(colaboradoresAtivos.reduce((sum, c) => sum + c.dadosProfissionais.salario, 0) / 1000).toFixed(0)}k
            </p>
            <p className="text-sm text-gray-600">Folha Salarial</p>
          </div>
        </div>
      </div>

      {/* Lista de Colaboradores */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Colaborador</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Cargo</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Departamento</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Setor</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Admissão</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Status</th>
                <th className="text-right py-4 px-6 font-semibold text-gray-900">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {colaboradores.map((colaborador) => (
                <tr key={colaborador.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {colaborador.nome.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{colaborador.nome}</p>
                        <p className="text-sm text-gray-500">{colaborador.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-gray-900">{colaborador.dadosProfissionais.cargo}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-gray-700">{getDepartamentoNome(colaborador.dadosProfissionais.departamentoId)}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-gray-700">{getSetorNome(colaborador.dadosProfissionais.setorId)}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-gray-600">
                      {new Date(colaborador.dadosProfissionais.dataAdmissao).toLocaleDateString('pt-BR')}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(colaborador.status)}`}>
                      {colaborador.status === 'ativo' ? 'Ativo' :
                       colaborador.status === 'inativo' ? 'Inativo' :
                       colaborador.status === 'afastado' ? 'Afastado' :
                       colaborador.status === 'ferias' ? 'Férias' : 'Demitido'}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => handleEditColaborador(colaborador)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Editar colaborador"
                    >
                      <Users className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderDepartamentos = () => (
    <div className="space-y-6">
      {/* Lista de Departamentos */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Departamento</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Responsável</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Centro de Custo</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Colaboradores</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Status</th>
                <th className="text-right py-4 px-6 font-semibold text-gray-900">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {departamentos.map((departamento) => {
                const colaboradoresDept = colaboradores.filter(c => 
                  c.dadosProfissionais.departamentoId === departamento.id
                );
                const responsavel = colaboradores.find(c => c.id === departamento.responsavelId);
                
                return (
                  <tr key={departamento.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                          <Building2 className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{departamento.nome}</p>
                          <p className="text-sm text-gray-500">{departamento.descricao}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-gray-700">
                        {responsavel ? responsavel.nome : 'Não definido'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-gray-600 font-mono">{departamento.centroCusto}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-medium text-gray-900">{colaboradoresDept.length}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        departamento.ativo ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {departamento.ativo ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => handleEditDepartamento(departamento)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Editar departamento"
                      >
                        <Building2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderSetores = () => (
    <div className="space-y-6">
      {/* Lista de Setores */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Setor</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Departamento</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Responsável</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Localização</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Colaboradores</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Status</th>
                <th className="text-right py-4 px-6 font-semibold text-gray-900">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {setores.map((setor) => {
                const colaboradoresSetor = colaboradores.filter(c => 
                  c.dadosProfissionais.setorId === setor.id
                );
                const responsavel = colaboradores.find(c => c.id === setor.responsavelId);
                const departamento = departamentos.find(d => d.id === setor.departamentoId);
                
                return (
                  <tr key={setor.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-semibold">
                          <Briefcase className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{setor.nome}</p>
                          <p className="text-sm text-gray-500">{setor.descricao}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-gray-700">{departamento?.nome}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-gray-700">
                        {responsavel ? responsavel.nome : 'Não definido'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-gray-600">{setor.localizacao || '-'}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-medium text-gray-900">{colaboradoresSetor.length}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        setor.ativo ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {setor.ativo ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => handleEditSetor(setor)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Editar setor"
                      >
                        <Briefcase className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'colaboradores', label: 'Colaboradores', icon: Users },
    { id: 'departamentos', label: 'Departamentos', icon: Building2 },
    { id: 'setores', label: 'Setores', icon: Briefcase },
    { id: 'avaliacoes', label: 'Avaliações', icon: Calendar },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Recursos Humanos</h2>
          <p className="text-gray-600">Gestão completa de colaboradores e estrutura organizacional</p>
        </div>
        <button
          onClick={() => {
            if (activeTab === 'colaboradores') setShowColaboradorModal(true);
            else if (activeTab === 'departamentos') setShowDepartamentoModal(true);
            else if (activeTab === 'setores') setShowSetorModal(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>
            {activeTab === 'colaboradores' ? 'Novo Colaborador' :
             activeTab === 'departamentos' ? 'Novo Departamento' :
             activeTab === 'setores' ? 'Novo Setor' : 'Adicionar'}
          </span>
        </button>
      </div>

      {/* Navegação por Abas */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
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

        {/* Conteúdo das Abas */}
        <div className="p-6">
          {activeTab === 'colaboradores' && renderColaboradores()}
          {activeTab === 'departamentos' && renderDepartamentos()}
          {activeTab === 'setores' && renderSetores()}
          {activeTab === 'avaliacoes' && (
            <div className="text-center py-8">
              <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Avaliações de Desempenho</h3>
              <p className="text-gray-600">Sistema de avaliações será implementado em breve</p>
            </div>
          )}
        </div>
      </div>

      {/* Modais */}
      {showColaboradorModal && (
        <ColaboradorModal
          colaborador={colaboradorEdit}
          onClose={() => {
            setShowColaboradorModal(false);
            setColaboradorEdit(null);
          }}
        />
      )}

      {showDepartamentoModal && (
        <DepartamentoModal
          departamento={departamentoEdit}
          onClose={() => {
            setShowDepartamentoModal(false);
            setDepartamentoEdit(null);
          }}
        />
      )}

      {showSetorModal && (
        <SetorModal
          setor={setorEdit}
          onClose={() => {
            setShowSetorModal(false);
            setSetorEdit(null);
          }}
        />
      )}
    </div>
  );
}