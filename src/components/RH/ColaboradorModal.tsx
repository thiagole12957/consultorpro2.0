import React, { useState } from 'react';
import { X, Save, User, Briefcase, CreditCard, FileText } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { Colaborador } from '../../types/rh';

interface ColaboradorModalProps {
  colaborador?: Colaborador | null;
  onClose: () => void;
}

export function ColaboradorModal({ colaborador, onClose }: ColaboradorModalProps) {
  const { adicionarColaborador, atualizarColaborador, departamentos, setores, empresaSelecionada, filiais } = useApp();
  const isEdit = !!colaborador;
  
  const [activeTab, setActiveTab] = useState<'pessoais' | 'profissionais' | 'bancarios' | 'documentos'>('pessoais');
  
  const [formData, setFormData] = useState({
    empresaId: colaborador?.empresaId || empresaSelecionada?.id || '',
    filialId: colaborador?.filialId || '',
    codigo: colaborador?.codigo || '',
    nome: colaborador?.nome || '',
    cpf: colaborador?.cpf || '',
    rg: colaborador?.rg || '',
    email: colaborador?.email || '',
    telefone: colaborador?.telefone || '',
    whatsapp: colaborador?.whatsapp || '',
    endereco: {
      logradouro: colaborador?.endereco?.logradouro || '',
      numero: colaborador?.endereco?.numero || '',
      complemento: colaborador?.endereco?.complemento || '',
      bairro: colaborador?.endereco?.bairro || '',
      cidade: colaborador?.endereco?.cidade || '',
      estado: colaborador?.endereco?.estado || '',
      cep: colaborador?.endereco?.cep || '',
    },
    dadosPessoais: {
      dataNascimento: colaborador?.dadosPessoais?.dataNascimento || '',
      estadoCivil: colaborador?.dadosPessoais?.estadoCivil || 'solteiro',
      genero: colaborador?.dadosPessoais?.genero || 'nao_informar',
      nacionalidade: colaborador?.dadosPessoais?.nacionalidade || 'Brasileira',
      naturalidade: colaborador?.dadosPessoais?.naturalidade || '',
    },
    dadosProfissionais: {
      cargo: colaborador?.dadosProfissionais?.cargo || '',
      departamentoId: colaborador?.dadosProfissionais?.departamentoId || '',
      setorId: colaborador?.dadosProfissionais?.setorId || '',
      dataAdmissao: colaborador?.dadosProfissionais?.dataAdmissao || '',
      salario: colaborador?.dadosProfissionais?.salario || 0,
      tipoContrato: colaborador?.dadosProfissionais?.tipoContrato || 'clt',
      cargaHoraria: colaborador?.dadosProfissionais?.cargaHoraria || 40,
      supervisor: colaborador?.dadosProfissionais?.supervisor || '',
    },
    dadosBancarios: {
      banco: colaborador?.dadosBancarios?.banco || '',
      agencia: colaborador?.dadosBancarios?.agencia || '',
      conta: colaborador?.dadosBancarios?.conta || '',
      tipoConta: colaborador?.dadosBancarios?.tipoConta || 'corrente',
      pix: colaborador?.dadosBancarios?.pix || '',
    },
    documentos: {
      carteiraTrabalho: colaborador?.documentos?.carteiraTrabalho || '',
      pis: colaborador?.documentos?.pis || '',
      tituloEleitor: colaborador?.documentos?.tituloEleitor || '',
      certificadoReservista: colaborador?.documentos?.certificadoReservista || '',
      cnh: colaborador?.documentos?.cnh || '',
    },
    status: colaborador?.status || 'ativo',
    observacoes: colaborador?.observacoes || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.empresaId || !formData.filialId) {
      alert('Selecione a empresa e filial para o colaborador');
      return;
    }
    
    if (isEdit && colaborador) {
      atualizarColaborador(colaborador.id, {
        ...formData,
        atualizadoEm: new Date().toISOString().split('T')[0],
      });
    } else {
      const novoColaborador: Colaborador = {
        id: Date.now().toString(),
        ...formData,
        codigo: formData.codigo || `COL-${Date.now()}`,
        criadoEm: new Date().toISOString().split('T')[0],
        atualizadoEm: new Date().toISOString().split('T')[0],
      };
      adicionarColaborador(novoColaborador);
    }
    
    onClose();
  };

  const filiaisDisponiveis = filiais.filter(f => 
    f.empresaId === formData.empresaId && f.ativa
  );

  const departamentosEmpresa = departamentos.filter(d => 
    d.empresaId === formData.empresaId && d.ativo
  );

  const setoresDepartamento = setores.filter(s => 
    s.departamentoId === formData.dadosProfissionais.departamentoId && s.ativo
  );

  const estados = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 
    'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
  ];

  const tabs = [
    { id: 'pessoais', label: 'Dados Pessoais', icon: User },
    { id: 'profissionais', label: 'Dados Profissionais', icon: Briefcase },
    { id: 'bancarios', label: 'Dados Bancários', icon: CreditCard },
    { id: 'documentos', label: 'Documentos', icon: FileText },
  ];

  const renderDadosPessoais = () => (
    <div className="space-y-6">
      {/* Seleção de Empresa e Filial */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-3">Empresa e Filial</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Empresa *
            </label>
            <select
              required
              value={formData.empresaId}
              onChange={(e) => setFormData(prev => ({ ...prev, empresaId: e.target.value, filialId: '' }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Selecione a empresa</option>
              <option value="1">HD Soluções ISP</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filial *
            </label>
            <select
              required
              value={formData.filialId}
              onChange={(e) => setFormData(prev => ({ ...prev, filialId: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={!formData.empresaId}
            >
              <option value="">Selecione a filial</option>
              {filiaisDisponiveis.map(filial => (
                <option key={filial.id} value={filial.id}>
                  {filial.nome} {filial.isMatriz ? '(Matriz)' : ''}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Informações Básicas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Código do Colaborador
          </label>
          <input
            type="text"
            value={formData.codigo}
            onChange={(e) => setFormData(prev => ({ ...prev, codigo: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Será gerado automaticamente se vazio"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nome Completo *
          </label>
          <input
            type="text"
            required
            value={formData.nome}
            onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            CPF *
          </label>
          <input
            type="text"
            required
            value={formData.cpf}
            onChange={(e) => setFormData(prev => ({ ...prev, cpf: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="000.000.000-00"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            RG *
          </label>
          <input
            type="text"
            required
            value={formData.rg}
            onChange={(e) => setFormData(prev => ({ ...prev, rg: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            E-mail *
          </label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Telefone *
          </label>
          <input
            type="tel"
            required
            value={formData.telefone}
            onChange={(e) => setFormData(prev => ({ ...prev, telefone: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Dados Pessoais */}
      <div>
        <h4 className="font-medium text-gray-900 mb-4">Informações Pessoais</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data de Nascimento *
            </label>
            <input
              type="date"
              required
              value={formData.dadosPessoais.dataNascimento}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                dadosPessoais: { ...prev.dadosPessoais, dataNascimento: e.target.value }
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estado Civil
            </label>
            <select
              value={formData.dadosPessoais.estadoCivil}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                dadosPessoais: { ...prev.dadosPessoais, estadoCivil: e.target.value as any }
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="solteiro">Solteiro(a)</option>
              <option value="casado">Casado(a)</option>
              <option value="divorciado">Divorciado(a)</option>
              <option value="viuvo">Viúvo(a)</option>
              <option value="uniao_estavel">União Estável</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gênero
            </label>
            <select
              value={formData.dadosPessoais.genero}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                dadosPessoais: { ...prev.dadosPessoais, genero: e.target.value as any }
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="nao_informar">Não informar</option>
              <option value="masculino">Masculino</option>
              <option value="feminino">Feminino</option>
              <option value="outro">Outro</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Naturalidade
            </label>
            <input
              type="text"
              value={formData.dadosPessoais.naturalidade}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                dadosPessoais: { ...prev.dadosPessoais, naturalidade: e.target.value }
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="São Paulo - SP"
            />
          </div>
        </div>
      </div>

      {/* Endereço */}
      <div>
        <h4 className="font-medium text-gray-900 mb-4">Endereço</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Logradouro *
            </label>
            <input
              type="text"
              required
              value={formData.endereco.logradouro}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                endereco: { ...prev.endereco, logradouro: e.target.value }
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Número *
            </label>
            <input
              type="text"
              required
              value={formData.endereco.numero}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                endereco: { ...prev.endereco, numero: e.target.value }
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bairro *
            </label>
            <input
              type="text"
              required
              value={formData.endereco.bairro}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                endereco: { ...prev.endereco, bairro: e.target.value }
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cidade *
            </label>
            <input
              type="text"
              required
              value={formData.endereco.cidade}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                endereco: { ...prev.endereco, cidade: e.target.value }
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estado *
            </label>
            <select
              required
              value={formData.endereco.estado}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                endereco: { ...prev.endereco, estado: e.target.value }
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Selecione</option>
              {estados.map(estado => (
                <option key={estado} value={estado}>{estado}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              CEP *
            </label>
            <input
              type="text"
              required
              value={formData.endereco.cep}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                endereco: { ...prev.endereco, cep: e.target.value }
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="00000-000"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderDadosProfissionais = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cargo *
          </label>
          <input
            type="text"
            required
            value={formData.dadosProfissionais.cargo}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              dadosProfissionais: { ...prev.dadosProfissionais, cargo: e.target.value }
            }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Departamento *
          </label>
          <select
            required
            value={formData.dadosProfissionais.departamentoId}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              dadosProfissionais: { ...prev.dadosProfissionais, departamentoId: e.target.value, setorId: '' }
            }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Selecione o departamento</option>
            {departamentosEmpresa.map(dept => (
              <option key={dept.id} value={dept.id}>{dept.nome}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Setor *
          </label>
          <select
            required
            value={formData.dadosProfissionais.setorId}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              dadosProfissionais: { ...prev.dadosProfissionais, setorId: e.target.value }
            }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={!formData.dadosProfissionais.departamentoId}
          >
            <option value="">Selecione o setor</option>
            {setoresDepartamento.map(setor => (
              <option key={setor.id} value={setor.id}>{setor.nome}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Data de Admissão *
          </label>
          <input
            type="date"
            required
            value={formData.dadosProfissionais.dataAdmissao}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              dadosProfissionais: { ...prev.dadosProfissionais, dataAdmissao: e.target.value }
            }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Salário *
          </label>
          <input
            type="number"
            required
            min="0"
            step="0.01"
            value={formData.dadosProfissionais.salario}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              dadosProfissionais: { ...prev.dadosProfissionais, salario: Number(e.target.value) }
            }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tipo de Contrato
          </label>
          <select
            value={formData.dadosProfissionais.tipoContrato}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              dadosProfissionais: { ...prev.dadosProfissionais, tipoContrato: e.target.value as any }
            }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="clt">CLT</option>
            <option value="pj">PJ</option>
            <option value="estagio">Estágio</option>
            <option value="terceirizado">Terceirizado</option>
            <option value="freelancer">Freelancer</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Carga Horária (horas/semana)
          </label>
          <input
            type="number"
            min="1"
            max="60"
            value={formData.dadosProfissionais.cargaHoraria}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              dadosProfissionais: { ...prev.dadosProfissionais, cargaHoraria: Number(e.target.value) }
            }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            value={formData.status}
            onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="ativo">Ativo</option>
            <option value="inativo">Inativo</option>
            <option value="afastado">Afastado</option>
            <option value="ferias">Férias</option>
            <option value="demitido">Demitido</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderDadosBancarios = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Banco
          </label>
          <input
            type="text"
            value={formData.dadosBancarios.banco}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              dadosBancarios: { ...prev.dadosBancarios, banco: e.target.value }
            }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Agência
          </label>
          <input
            type="text"
            value={formData.dadosBancarios.agencia}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              dadosBancarios: { ...prev.dadosBancarios, agencia: e.target.value }
            }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Conta
          </label>
          <input
            type="text"
            value={formData.dadosBancarios.conta}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              dadosBancarios: { ...prev.dadosBancarios, conta: e.target.value }
            }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tipo de Conta
          </label>
          <select
            value={formData.dadosBancarios.tipoConta}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              dadosBancarios: { ...prev.dadosBancarios, tipoConta: e.target.value as any }
            }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="corrente">Conta Corrente</option>
            <option value="poupanca">Conta Poupança</option>
          </select>
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            PIX (Chave)
          </label>
          <input
            type="text"
            value={formData.dadosBancarios.pix}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              dadosBancarios: { ...prev.dadosBancarios, pix: e.target.value }
            }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="CPF, e-mail, telefone ou chave aleatória"
          />
        </div>
      </div>
    </div>
  );

  const renderDocumentos = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Carteira de Trabalho
          </label>
          <input
            type="text"
            value={formData.documentos.carteiraTrabalho}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              documentos: { ...prev.documentos, carteiraTrabalho: e.target.value }
            }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            PIS/PASEP
          </label>
          <input
            type="text"
            value={formData.documentos.pis}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              documentos: { ...prev.documentos, pis: e.target.value }
            }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Título de Eleitor
          </label>
          <input
            type="text"
            value={formData.documentos.tituloEleitor}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              documentos: { ...prev.documentos, tituloEleitor: e.target.value }
            }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Certificado de Reservista
          </label>
          <input
            type="text"
            value={formData.documentos.certificadoReservista}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              documentos: { ...prev.documentos, certificadoReservista: e.target.value }
            }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            CNH
          </label>
          <input
            type="text"
            value={formData.documentos.cnh}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              documentos: { ...prev.documentos, cnh: e.target.value }
            }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Observações
        </label>
        <textarea
          value={formData.observacoes}
          onChange={(e) => setFormData(prev => ({ ...prev, observacoes: e.target.value }))}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Observações adicionais sobre o colaborador..."
        />
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {isEdit ? 'Editar Colaborador' : 'Novo Colaborador'}
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
          {activeTab === 'pessoais' && renderDadosPessoais()}
          {activeTab === 'profissionais' && renderDadosProfissionais()}
          {activeTab === 'bancarios' && renderDadosBancarios()}
          {activeTab === 'documentos' && renderDocumentos()}
          
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
              <span>{isEdit ? 'Salvar Colaborador' : 'Criar Colaborador'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}