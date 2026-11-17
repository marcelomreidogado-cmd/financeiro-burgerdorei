# Financeiro Burger do Rei — guia do projeto

Sistema financeiro da hamburgueria Burger do Rei: lançamentos (contas a pagar/receber), centros de custo, agenda financeira, extratos bancários, fechamento mensal de vendas e motoboy, bens, auditoria e usuários.

## Publicação
- Firebase Hosting, projeto `fini-lancamentos`. Deploy automático pelo GitHub Actions (`.github/workflows/firebase-hosting-merge.yml`, secret `FIREBASE_SERVICE_ACCOUNT_FINI_LANCAMENTOS`) a cada push na `main`; PRs geram canal de prévia. HTML servido com `no-store`; todas as rotas reescrevem para `index.html`.

## Arquitetura
- `index.html` é o app inteiro (**~2,8 MB**, sem build). Nunca ler o arquivo inteiro: usar `grep`/leituras por trecho.
- Firebase compat **9.22.2** (auth + Firestore). Versão em `APP_VERSION` (formato `'FINANCEIRO_BURGER_AAAA_MM_DD_DESCRICAO_V1'`) — atualizar ao mudar comportamento.
- Coleções principais: `lancamentos`, `agenda_financeira`, `extratos_bancarios`, `centrocusto`, `clientes_mes`, `config`, `burger_finance_access`, `burger_finance_login`.
- Integração com o **Caixa Burger** (repo `caixa-burger-do-rei`, outro projeto Firebase): lê a coleção `caixa` com travas `caixa_fechamento_guards`, `caixa_integracao_locks` e `caixa_fechamento_config` para não duplicar recebimentos.

## Acesso
- Login usuário/senha: usuário → e-mail em `burger_finance_login/{usuario}`; permissões individuais em `burger_finance_access`. O **Contas a Pagar Fini** usa o mesmo login e o mesmo projeto Firebase.
- Regras do Firestore são editadas no console e compartilhadas com o Contas a Pagar Fini — não alterar sem perguntar.

## Fluxo de trabalho
- Editar → extrair o `<script>` e validar com `node --check` → testar mudanças de dados numa cópia → commit em português → push na `main` publica.
- Nunca apagar/sobrescrever dados do Firestore sem backup (o app tem "Baixar relatório completo"/backup).
- Usuário (Marcelo) trabalha em português do Brasil, no Mac, e prefere soluções simples, sem terminal.

## Versão e cache local (importante)
- Ao trocar `APP_VERSION`, o app apaga o cache local (`bdr_data_v2_light`) **a menos que a versão anterior esteja na lista** ao lado de `LS_VER_KEY`. Sempre inclua a versão que está saindo nessa lista. Atualize também `"build"` em `<script id="financeiro-release">`.

## Polimento visual
- Etapa 1 (15/11/2026, `FINANCEIRO_BURGER_2026_11_15_VISUAL_V1`, bloco `<style id="financeiro-polimento-v1">`): até 900 px o menu lateral vira faixa horizontal no topo; painéis lado a lado (`.fin-stack`, `.fin-stack4`) empilham; valores `.vin/.vout` sem quebra; escala do gráfico Receita × Breakeven corrigida.
- Etapa 2 (15/11/2026, `..._VISUAL_V2`): cabeçalho de Lançamentos (título menor, filtros `auto-fill` sem cortar); DRE até 900 px com coluna Item fixa (150 px, `left:-11px` para cobrir o recuo) e tabela no tamanho do conteúdo. No computador a DRE mantém a coluna Item de 380 px **sem** fixar (decisão anterior: regras `position:static!important`).
- Refinos (15/11/2026, `..._VISUAL_V3`): indicadores `.kpis` em 2 colunas até 900 px (Agenda tinha 6 empilhados); dias sem lançamento da Agenda mais baixos no celular; abas de Despesa × Receita compactas (cabem em 1440 px) e com esmaecimento no celular; filtros do BI com rótulo e seletor juntos (`.bi-fld`). A primeira semana vazia da Agenda no computador é comportamento normal do calendário (mês que começa no domingo).
- Teste visual sem Firebase real: injetar um `window.firebase` falso (auth + firestore compat, `metadata.fromCache:false`) via Playwright `addInitScript` e bloquear `gstatic.com/firebasejs`.

## Padrão visual (obrigatório em toda mudança)
Polimento visual feito em 15/11/2026. Para não regredir (o Compras piorou em 16–17/11 por isso):
- **Não colocar estilo solto (`style="..."`) em linhas de tabela, listas ou cartões.** Criar ou reutilizar classes no bloco de CSS do projeto (indicado abaixo). Estilo inline só para valores dinâmicos (cor de loja, largura de barra).
- **Tabelas compactas:** cada linha de produto/cliente/lançamento cabe em ~2 linhas de texto. Controles extras (marcações, botões) ficam pequenos e na mesma linha; detalhes vão para um modal ou para a dica (`title`).
- **Nada passa da largura da tela**, exceto tabelas largas dentro de um contêiner que desliza (com a coluna de nome fixa à esquerda no celular).
- **Celular primeiro:** conferir em 390 px e em 1440 px. No celular: navegação numa faixa/barra única, filtros e chips em faixa que desliza, indicadores em 2 colunas, textos sem cortar no meio da palavra.
- **Números** com algarismos alinhados (`font-variant-numeric: tabular-nums`), sem fonte monoespaçada; valores com sinal não quebram linha.
- Reaproveitar as cores, raios, botões e chips que o sistema já usa — não criar um estilo novo para cada tela.

### Conferência antes de publicar
1. Abrir o sistema com **dados fictícios** e **sem acesso ao banco real** (veja "Como testar o visual" abaixo).
2. Fotografar as telas alteradas em 390 px e 1440 px (Playwright já instalado no ambiente; Chromium em `/opt/pw-browsers`).
3. Medir que `document.documentElement.scrollWidth` não passa da largura da janela em todas as abas.
4. Mostrar ao Marcelo as fotos de **antes e depois** na resposta e dizer o que não foi testado.

### Onde fica o visual / como testar o visual
- CSS no bloco `<style id="financeiro-polimento-v1">` (antes de `</head>`). Até 900 px o menu vira faixa no topo; painéis lado a lado usam `.fin-stack`/`.fin-stack4` para empilhar no celular — painel novo lado a lado deve receber uma dessas classes.
- Teste: ver "Polimento visual" acima (firebase falso com `metadata.fromCache:false`); clicar em `#sb .ni[data-m]` para as 12 telas e medir em 390, 768, 900 e 1024 px.
