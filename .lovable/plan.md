

# Ricardo Routine — Plano de Implementação

## Visão Geral
App PWA offline-first, mobile-first, para registar treinos Push/Pull/Legs com halteres. Sem login, sem cloud — tudo guardado localmente no dispositivo. Visual gym dark com acentos vermelho vivo.

## Design System
- **Fundo**: preto/grafite escuro
- **Cards**: cinza escuro (#1a1a1a / #2a2a2a)
- **Acento**: vermelho vivo (#e53e3e) — usado apenas em botões principais e timer
- **Tipografia**: títulos bold e grandes, texto claro sobre fundo escuro
- **Modo**: dark only (sem light mode)

## Navegação
Barra inferior fixa com 3 tabs: **Home** | **History** | **Settings**

---

## 1. Home
- Título grande "Ricardo Routine"
- Card mostrando o próximo treino da rotação (ex: "Push Day")
- Card mostrando o treino seguinte (ex: "Pull Day")
- Botão grande vermelho fixo no fundo: **START NEXT WORKOUT**
- Rotação infinita: Push → Pull → Legs → Push → ...

## 2. Pelvic Reset (Pré-Treino Obrigatório)
- Ecrã com checklist de 4 exercícios de ativação
- Cada item tem checkbox para marcar como feito
- Todos devem ser completados antes de avançar
- Botão **START MAIN WORKOUT** fica ativo só quando tudo está marcado

## 3. Workout Screen
- Cabeçalho com o dia atual (Push/Pull/Legs)
- Lista de todos os exercícios base do dia (fixos, não removíveis)
- Para cada exercício:
  - Nome + sets × rep range
  - "Last session" mostrando peso e reps de cada série do treino anterior
  - Inputs editáveis por série: peso (kg) e reps
  - Todas as séries visíveis de uma vez
  - Checkbox/botão "Set done" por série

### Rest Timer
- Ativado automaticamente ao marcar set como done
- Compostos: 90 segundos / Isolamentos: 60 segundos
- Aparece no topo do ecrã, não bloqueia a UI
- Beep curto ao terminar (se som ON nas settings)

### Secção Extras
- Botão "+ Add exercise" no final do dia
- Filtro automático por grupo muscular do dia
- Exercícios extras podem ser removidos
- Exercícios base nunca são alteráveis

### Finalizar
- Botão fixo inferior: **FINISH WORKOUT**
- Guarda todos os dados das séries
- Atualiza "last session" por exercício
- Avança a rotação para o próximo dia

## 4. History
- Lista de treinos por data (mais recente primeiro)
- Cada entrada mostra data + tipo (Push/Pull/Legs)
- Ao clicar, abre detalhe com todos os exercícios e séries registadas

## 5. Settings
- Toggle: Rest Timer ON/OFF
- Toggle: Som ON/OFF
- Botão: Export backup (JSON)
- Botão: Import backup (JSON)

## 6. PWA & Armazenamento
- Configuração PWA com vite-plugin-pwa para instalação no telemóvel
- Todos os dados guardados em localStorage
- App funciona 100% offline
- Manifest com nome "Ricardo Routine" e ícones

