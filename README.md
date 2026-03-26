# 📱 Agendei — App de Agendamento de Serviços

PWA completo para agendamento de serviços como barbearia, cabeleireiro, manicure e muito mais. Construído com **Next.js 14 + TypeScript + Axios + Tailwind CSS**.

---

## 🚀 Como rodar

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev

# Build para produção
npm run build && npm start
```

Acesse: `http://localhost:3000`

---

## 🧪 Contas de demonstração (mock)

| Email | Senha | Tipo |
|-------|-------|------|
| `joao@email.com` | `123456` | Cliente |
| `carlos@email.com` | `123456` | Prestador |

> Ou clique nos botões "Demo Cliente" / "Demo Prestador" na tela de login.

---

## 🗂️ Estrutura do projeto

```
agendei/
├── app/                        # App Router (Next.js 14)
│   ├── layout.tsx              # Root layout + Providers
│   ├── page.tsx                # Splash screen / redirect
│   ├── login/page.tsx          # 🔐 Tela de login
│   ├── register/page.tsx       # 📝 Tela de cadastro (2 passos)
│   ├── home/
│   │   ├── layout.tsx          # Layout com bottom nav
│   │   └── page.tsx            # 🏠 Home (cliente OU prestador)
│   ├── search/page.tsx         # 🔍 Busca de profissionais
│   ├── appointments/page.tsx   # 📅 Meus agendamentos (cliente)
│   ├── profile/page.tsx        # 👤 Perfil do usuário
│   └── providers/[id]/page.tsx # 🛍️ Detalhe + agendamento
│
├── components/
│   ├── layout/
│   │   └── BottomNav.tsx       # Navegação inferior adaptável
│   └── ui/
│       ├── ProviderCard.tsx    # Card do profissional
│       └── AppointmentCard.tsx # Card do agendamento
│
├── services/
│   ├── authService.ts          # Login, register, logout
│   └── appointmentService.ts  # Providers + agendamentos
│
├── lib/
│   ├── axios.ts                # Instância axios + interceptors
│   ├── authContext.tsx         # Context de autenticação
│   └── mockData.ts             # Dados mock + categorias
│
├── types/
│   └── index.ts                # Todos os tipos TypeScript
│
└── public/
    └── manifest.json           # PWA manifest
```

---

## 🔌 Como integrar com a API

### 1. Configure a URL base
```bash
# .env.local
NEXT_PUBLIC_API_URL=https://sua-api.com/v1
```

### 2. Desative o mock
Em `services/authService.ts` e `services/appointmentService.ts`, altere:
```typescript
const USE_MOCK = false; // era true
```

### 3. Endpoints esperados

#### Auth
| Método | Rota | Body |
|--------|------|------|
| `POST` | `/auth/login` | `{ email, password }` |
| `POST` | `/auth/register` | `{ name, email, phone, password, role }` |
| `POST` | `/auth/logout` | — |
| `GET`  | `/auth/me` | — |

#### Providers
| Método | Rota | Query |
|--------|------|-------|
| `GET` | `/providers` | `?category&search` |
| `GET` | `/providers/:id` | — |
| `GET` | `/providers/featured` | — |
| `GET` | `/providers/me` | — (auth provider) |
| `PUT` | `/providers/me` | body |
| `GET` | `/providers/:id/slots` | `?date=YYYY-MM-DD` |

#### Appointments
| Método | Rota | — |
|--------|------|---|
| `GET` | `/appointments/me` | Agendamentos do cliente |
| `GET` | `/appointments/provider` | Agendamentos do prestador |
| `POST` | `/appointments` | Criar agendamento |
| `PATCH` | `/appointments/:id/cancel` | Cancelar |
| `PATCH` | `/appointments/:id/confirm` | Confirmar |
| `PATCH` | `/appointments/:id/complete` | Concluir |

---

## 📱 Telas por tipo de usuário

### Cliente 👤
- `/login` — Login
- `/register` — Cadastro (escolhe papel)
- `/home` — Feed com categorias + próximo agendamento
- `/search` — Busca com filtro por categoria
- `/providers/:id` — Detalhe + agendamento inline
- `/appointments` — Meus agendamentos (filtros)
- `/profile` — Perfil e configurações

### Prestador 💼
- `/home` — Dashboard com estatísticas + agendamentos recebidos
- `/dashboard` — (próxima tela: gráficos e receita)
- `/schedule` — (próxima tela: agenda semanal)
- `/services` — (próxima tela: gerenciar serviços)
- `/settings` — (próxima tela: configurações do perfil)

---

## 🎨 Design System

| Token | Valor |
|-------|-------|
| Background | `#1a1210` |
| Card | `#261914` |
| Accent | `#f97316` (orange-500) |
| Font display | Playfair Display |
| Font body | DM Sans |

---

## ✅ Funcionalidades implementadas

- [x] PWA (manifest + next-pwa)
- [x] Login com validação
- [x] Registro em 2 passos com seleção de papel
- [x] Autenticação via JWT em cookies
- [x] Context de auth com redirect automático
- [x] Home diferente por tipo de usuário
- [x] Listagem e busca de profissionais
- [x] Filtro por categoria
- [x] Detalhe do profissional
- [x] Fluxo completo de agendamento
- [x] Página de agendamentos com filtros
- [x] Dashboard do prestador com ações
- [x] Bottom nav adaptável por papel
- [x] Toast notifications
- [x] Loading states
- [x] Todas as requisições mockadas com `USE_MOCK = true`
- [x] Axios interceptors com refresh 401

---

## 📦 Próximas telas sugeridas

- `/dashboard` — Gráficos de receita (prestador)
- `/schedule` — Agenda semanal visual (prestador)  
- `/services` — CRUD de serviços (prestador)
- `/reviews` — Avaliações
- `/notifications` — Central de notificações
- `/booking/success` — Confirmação pós-agendamento
