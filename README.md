# Sistema de Gestão para Consultoria de Software

Sistema completo de gestão empresarial com videoconferências inteligentes e IA integrada.

## 🚀 Funcionalidades

### 📊 **Dashboard & Gestão**
- Dashboard executivo com métricas em tempo real
- Gestão completa de clientes, contratos e faturas
- Controle de licenças de software
- Planos de venda e produtos/serviços
- Contabilidade integrada (DRE, Balanço, Lançamentos)

### 🎥 **Videoconferências com IA**
- Interface estilo Google Meet
- Transcrição em tempo real com OpenAI Whisper
- Resumos automáticos gerados por IA
- Gravação em alta qualidade
- Chat integrado durante reuniões
- Múltiplas visualizações (grade, apresentador, sidebar)

### 👥 **Gestão de Contatos**
- Cadastro completo de contatos por cliente
- Informações detalhadas: nome, email, setor, WhatsApp, função, habilidades
- Integração com sistema de reuniões
- Organização por empresa e setor

### 🤖 **Inteligência Artificial**
- **OpenAI Whisper** para transcrição de áudio
- **GPT-4** para geração de resumos
- Análise de sentimento e engajamento
- Extração automática de decisões e próximos passos

## 🛠️ Configuração

### 1. **Variáveis de Ambiente**
Copie `.env.example` para `.env` e configure:

```bash
# Supabase
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima

# OpenAI (para Edge Functions)
OPENAI_API_KEY=sua_chave_openai
```

### 2. **Instalação**
```bash
npm install
npm run dev
```

### 3. **Configurar OpenAI**
1. Crie uma conta em [OpenAI](https://platform.openai.com)
2. Gere uma API key
3. Configure a variável `OPENAI_API_KEY` no Supabase

### 4. **Edge Functions**
As funções de IA são automaticamente deployadas:
- `/functions/v1/transcribe-audio` - Transcrição com Whisper
- `/functions/v1/generate-summary` - Resumos com GPT-4

## 🎯 **Como Usar**

### **Reuniões com IA:**
1. Acesse **Reuniões & IA** no menu
2. Clique em **"Agendar Reunião"**
3. **Obrigatório**: Adicione participantes
   - **Contatos do Cliente**: Selecione da base
   - **Leads**: Digite nome e email
   - **Equipe Interna**: Colaboradores
4. Defina pauta e horário
5. **Inicie a videoconferência** com transcrição automática

### **Gestão de Contatos:**
1. Acesse um cliente específico
2. Vá para aba **"Contatos"**
3. Cadastre contatos com informações completas
4. Use os contatos nas reuniões

## 🔧 **Tecnologias**

- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: Supabase Edge Functions
- **IA**: OpenAI Whisper + GPT-4
- **Videoconferência**: WebRTC + MediaRecorder API
- **Deploy**: Netlify

## 📱 **Responsivo**
Interface otimizada para desktop, tablet e mobile.

## 🔒 **Segurança**
- Todas as chamadas de IA são processadas no backend
- API keys protegidas em Edge Functions
- Dados criptografados em trânsito

---

**Desenvolvido com IA avançada para consultoria de software** 🚀