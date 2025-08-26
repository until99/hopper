# Sistema de Autenticação - Hopper

Este projeto implementa um sistema completo de autenticação usando Supabase Auth.

## 🚀 Funcionalidades Implementadas

### ✅ Formulários de Autenticação
- **Login**: Formulário para entrar na conta com email e senha
- **Signup**: Formulário para criar nova conta com email e senha
- **Alternância**: Botão para alternar entre login e signup
- **Validação**: Validação de email e senha (mínimo 6 caracteres)

### ✅ Funcionalidades de Segurança
- Autenticação via Supabase Auth
- Gestão de sessões automática
- Redirecionamento automático baseado no status de autenticação
- Tradução de mensagens de erro para português
- Loading states durante as operações

### ✅ Interface do Usuário
- Design responsivo com Tailwind CSS
- Mensagens de feedback coloridas (sucesso em verde, erro em vermelho)
- Estados de loading com spinner animado
- Campos de formulário com validação visual

## 📁 Arquivos Criados/Modificados

### Novos Arquivos
- `src/lib/useAuth.ts` - Hook customizado para gerenciar autenticação
- `src/routes/sigin.tsx` - Página combinada de login e signup
- `.env.example` - Exemplo de variáveis de ambiente

### Arquivos Modificados
- `src/routes/app/dashboard/index.tsx` - Dashboard protegido com logout

## 🔧 Configuração

### 1. Configurar Supabase
1. Copie `.env.example` para `.env.local`
2. Preencha suas credenciais do Supabase:
   ```env
   VITE_SUPABASE_URL=https://seu-projeto.supabase.co
   VITE_SUPABASE_ANON_KEY=sua-chave-anonima
   ```

### 2. Executar o Projeto
```bash
cd app
pnpm install
pnpm dev
```

## 🎯 Como Usar

### Acessar a Página de Login/Signup
- Navegue para `http://localhost:5173/sigin`
- Alternar entre "Login" e "Cadastrar" usando o botão no topo

### Criar Nova Conta
1. Clique em "Cadastre-se aqui"
2. Digite seu email e senha (mínimo 6 caracteres)
3. Clique em "Cadastrar"
4. Verifique seu email para confirmar a conta

### Fazer Login
1. Na página de login, digite seu email e senha
2. Clique em "Entrar"
3. Será redirecionado automaticamente para o dashboard

### Dashboard
- Mostra informações do usuário logado
- Botão de logout no canto superior direito
- Protegido: redireciona para login se não autenticado

## 🔒 Funcionalidades de Segurança

### Proteção de Rotas
- Dashboard só é acessível para usuários autenticados
- Redirecionamento automático baseado no status de autenticação
- Verificação de sessão em tempo real

### Tratamento de Erros
Mensagens de erro traduzidas para português:
- "Invalid login credentials" → "Email ou senha inválidos"
- "User already registered" → "Este email já está cadastrado"
- "Password should be at least 6 characters" → "A senha deve ter pelo menos 6 caracteres"
- E outras...

### Estados de Interface
- Loading spinners durante operações
- Campos desabilitados durante processamento
- Mensagens de feedback claras

## 🎨 Design System

### Cores
- **Primary**: Indigo (botões principais)
- **Success**: Verde (mensagens de sucesso)
- **Error**: Vermelho (mensagens de erro)
- **Background**: Gray-50 (fundo da página)

### Componentes
- Formulários com campos agrupados
- Botões com estados hover e disabled
- Cards com sombras sutis
- Loading spinners animados

## 📱 Responsividade

O sistema é totalmente responsivo e funciona em:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (até 767px)

## 🔄 Fluxo de Autenticação

1. **Usuário não logado**: Acessa `/sigin`
2. **Signup**: Cria conta → Email de confirmação → Login manual
3. **Login**: Autentica → Redireciona para `/app/dashboard`
4. **Dashboard**: Área protegida → Logout → Volta para `/sigin`
5. **Proteção automática**: Tentativa de acesso direto ao dashboard sem login redireciona para `/sigin`

## 🛠️ Tecnologias Utilizadas

- **React 19** - Framework principal
- **TypeScript** - Tipagem estática
- **Tanstack Router** - Roteamento
- **Supabase** - Backend e autenticação
- **Tailwind CSS** - Estilização
- **Vite** - Build tool

## 🚧 Próximos Passos Sugeridos

- [ ] Implementar "Esqueci minha senha"
- [ ] Adicionar autenticação social (Google, GitHub)
- [ ] Implementar perfil do usuário
- [ ] Adicionar middleware de autenticação
- [ ] Implementar refresh token automático
- [ ] Adicionar testes unitários
