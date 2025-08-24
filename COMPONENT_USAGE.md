# Componentes Modularizados - Utilização

Este documento mostra como utilizar os componentes modularizados que foram criados para substituir código duplicado nas páginas.

## 🎯 Componentes Criados

### Componentes de UI Base

- ✅ **Button** - Botão com variantes e estados de loading
- ✅ **Input** - Campo de input com ícones e validação
- ✅ **PasswordInput** - Input de senha com toggle de visibilidade
- ✅ **Select** - Campo select estilizado
- ✅ **Checkbox** - Checkbox com label e descrição
- ✅ **Toggle** - Switch toggle animado
- ✅ **FormField** - Container de campo com label e erro
- ✅ **SearchInput** - Input especializado para busca
- ✅ **Modal** - Modal reutilizável
- ✅ **Card** - Container card com padding configurável
- ✅ **Badge** - Badge com variantes de cor
- ✅ **PageHeader** - Header de página padronizado
- ✅ **TabNavigation** - Navegação por abas
- ✅ **DataTable** - Tabela de dados reutilizável

### Hooks Personalizados

- ✅ **useFormValidation** - Validação de formulários
- ✅ **useDataTable** - Gerenciamento de tabelas com busca e paginação

### Utilitários

- ✅ **filterUtils** - Funções seguras para filtros e buscas (previne erros com campos undefined)

## 🔄 Páginas Refatoradas

### ✅ `/admin/users`

**Antes:** 120+ linhas | **Depois:** ~70 linhas

- Formulário no modal usando FormField + Input + Select + Toggle
- Tabela usando DataTable componente
- Busca usando SearchInput
- Validação usando useFormValidation

### ✅ `/dashboard/$dashboardId`

**Antes:** 137 linhas | **Depois:** ~90 linhas

- Header usando PageHeader
- Botões usando Button component

### 🔧 `/account/settings` (Em progresso)

- Modal de senha usando Modal + PasswordInput + FormField
- Abas usando TabNavigation
- Cards usando Card component

## 📝 Como Usar os Componentes

### Exemplo: Formulário Completo

```jsx
import { Button, Input, FormField, Modal } from "../../components/ui";
import useFormValidation, {
  validationRules,
} from "../../hooks/useFormValidation";

const { formData, errors, handleChange, validateForm } = useFormValidation(
  { name: "", email: "" },
  {
    name: [validationRules.required],
    email: [validationRules.required, validationRules.email],
  }
);

<FormField label="Nome" error={errors.name} required>
  <Input
    value={formData.name}
    onChange={(e) => handleChange("name", e.target.value)}
    error={errors.name}
    icon={UserIcon}
  />
</FormField>;
```

### Exemplo: Tabela com Busca

```jsx
import { DataTable, SearchInput } from "../../components/ui";
import useDataTable from "../../hooks/useDataTable";

const { data, searchQuery, setSearchQuery } = useDataTable(users, {
  searchFields: ["name", "email"],
});

<SearchInput
  value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)}
  placeholder="Buscar usuários..."
/>

<DataTable columns={columns} data={data} />
```

### Exemplo: Modal com Validação

```jsx
<Modal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  title="Título do Modal"
>
  <form onSubmit={handleSubmit}>
    <FormField label="Campo" required>
      <Input value={value} onChange={onChange} />
    </FormField>
    <Button type="submit">Salvar</Button>
  </form>
</Modal>
```

## 🎨 Páginas Sugeridas para Próxima Refatoração

### Alta Prioridade

1. **`/account/settings`** - Muitos inputs e selects duplicados
2. **`/account/profile`** - Formulário de edição duplicado
3. **`/admin/settings`** - Muitos checkboxes e selects

### Média Prioridade

4. **`/admin/groups`** - Tabela e formulário
5. **`/admin/databases`** - Listagem e configuração
6. **`/reports/*`** - Páginas de relatórios

## 📊 Métricas de Melhoria

### Redução de Código

- **admin/users**: 42% menos linhas (120 → 70)
- **dashboard/$dashboardId**: 34% menos linhas (137 → 90)

### Benefícios

- ✅ **Consistência**: UI uniforme em toda aplicação
- ✅ **Manutenibilidade**: Mudanças em um lugar afetam tudo
- ✅ **Reutilização**: Componentes podem ser usados em qualquer lugar
- ✅ **Validação**: Sistema de validação centralizado
- ✅ **Acessibilidade**: Padrões de acessibilidade aplicados automaticamente

## 🔧 Próximos Passos

1. **Continuar refatoração** das páginas restantes
2. **Adicionar Storybook** para documentar componentes
3. **Criar testes unitários** para os componentes
4. **Implementar tema escuro** nos componentes base
5. **Adicionar animações** e micro-interações

## 🎯 Padrões Estabelecidos

### Estrutura de Pastas

```
src/
├── components/ui/          # Componentes reutilizáveis
├── features/              # Funcionalidades específicas
├── hooks/                 # Hooks personalizados
├── lib/                  # Utilitários
└── routes/              # Páginas (agora mais limpas)
```

### Convenções

- Todos os componentes usam `forwardRef` quando necessário
- Props consistentes (`variant`, `size`, `error`, etc.)
- Classes CSS usando `cn()` utility para merge
- Validação usando `useFormValidation` hook
- Estados de loading e erro padronizados
