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