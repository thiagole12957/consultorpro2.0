import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Zap, Shield, Building2 } from 'lucide-react';

interface LoginScreenProps {
  onLogin: (email: string, senha: string) => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [formData, setFormData] = useState({
    email: '',
    senha: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Simular delay de autenticação
      await new Promise(resolve => setTimeout(resolve, 1000));
      onLogin(formData.email, formData.senha);
    } catch (error) {
      console.error('Erro no login:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-2xl shadow-2xl w-full max-w-md border border-white border-opacity-30">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-2xl p-8 text-white text-center">
          <div className="w-16 h-16 bg-white bg-opacity-20 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Zap className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold mb-2">ConsultorPro</h1>
          <p className="text-blue-100">Sistema de Gestão Empresarial</p>
        </div>

        {/* Form */}
        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Acesso ao Sistema</h2>
            <p className="text-gray-600">Entre com suas credenciais corporativas</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                E-mail corporativo
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                  placeholder="seu.email@empresa.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Senha
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.senha}
                  onChange={(e) => setFormData(prev => ({ ...prev, senha: e.target.value }))}
                  className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                  placeholder="Digite sua senha"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Entrando...</span>
                </div>
              ) : (
                'Entrar no Sistema'
              )}
            </button>
          </form>

          {/* Security Info */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
              <Shield className="w-4 h-4" />
              <span>Conexão segura e criptografada</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 pb-8">
          <div className="text-center text-sm text-gray-500">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Building2 className="w-4 h-4" />
              <span>HD Soluções ISP</span>
            </div>
            <p>© 2024 Todos os direitos reservados</p>
            <p className="text-xs mt-1">ConsultorPro v1.0</p>
          </div>
        </div>
      </div>
    </div>
  );
}