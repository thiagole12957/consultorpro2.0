import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Eye, Edit2, Building2, Mail, Phone, MapPin } from 'lucide-react';
import { FornecedorModal } from './FornecedorModal';

export function FornecedoresList() {
  const { fornecedores } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [fornecedorEdit, setFornecedorEdit] = useState(null);

  const handleEditFornecedor = (fornecedor: any) => {
    setFornecedorEdit(fornecedor);
    setShowModal(true);
  };

  const fornecedoresAtivos = fornecedores.filter(f => f.ativo);

  return (
    <div className="p-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Fornecedor</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">CNPJ</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Contato</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Localização</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Status</th>
                <th className="text-right py-4 px-6 font-semibold text-gray-900">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {fornecedores.map((fornecedor) => (
                <tr key={fornecedor.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center text-white font-semibold">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{fornecedor.nome}</p>
                        <p className="text-sm text-gray-500">{fornecedor.razaoSocial}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-gray-900 font-mono text-sm">{fornecedor.cnpj}</span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-gray-600">
                        <Mail className="w-4 h-4 mr-1" />
                        <span>{fornecedor.email}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="w-4 h-4 mr-1" />
                        <span>{fornecedor.telefone}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>{fornecedor.endereco.cidade}, {fornecedor.endereco.estado}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      fornecedor.ativo 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {fornecedor.ativo ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Ver detalhes"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEditFornecedor(fornecedor)}
                        className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                        title="Editar fornecedor"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <FornecedorModal
          fornecedor={fornecedorEdit}
          onClose={() => {
            setShowModal(false);
            setFornecedorEdit(null);
          }}
        />
      )}
    </div>
  );
}