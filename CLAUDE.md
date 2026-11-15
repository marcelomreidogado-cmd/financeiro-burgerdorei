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
