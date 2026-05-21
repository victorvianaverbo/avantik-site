# Mercado Pago — passos manuais para ativar

Esta é a parte que **eu não consigo automatizar** — depende de cliques no painel MP e no Netlify. Faça nesta ordem.

## 1. Rodar a migration no Supabase

1. Abra https://supabase.com → projeto `ajokzpjguhfxxudteetr` → **SQL Editor**
2. Cole o conteúdo de [`migrations/016-mercado-pago-payments.sql`](migrations/016-mercado-pago-payments.sql)
3. Execute (`Ctrl+Enter`)
4. Confirme no painel **Database → Tables** que apareceu a tabela `payments` e que `speakers` ganhou as 3 colunas novas

## 2. Pegar o Service Role Key do Supabase

1. Supabase → projeto → **Settings → API**
2. Copie o valor de **`service_role` secret** (começa com `eyJhb...`, é diferente do `anon` key)
3. Cole no `.env`:
   ```
   SUPABASE_SERVICE_ROLE_KEY=eyJhb...
   ```

⚠️ **Esse token bypassa RLS** — nunca exponha no frontend, só usar em Netlify Functions.

## 3. Configurar webhook no Mercado Pago

1. https://www.mercadopago.com.br/developers/panel/app → app **Avantik**
2. Menu lateral → **Webhooks**
3. Clique em **Configurar notificações**
4. URL de produção:
   ```
   https://avantikpalestras.com.br/.netlify/functions/mp-webhook
   ```
5. Eventos a marcar: **Pagamentos** (`payment.created` e `payment.updated`)
6. Salve
7. Após salvar, o MP exibe uma **assinatura secreta** ("Chave secreta de assinatura"). Copie e cole no `.env`:
   ```
   MP_WEBHOOK_SECRET=<chave_secreta_do_mp>
   ```

## 4. Configurar variáveis de ambiente no Netlify

O `.env` local é só pra desenvolvimento. Em produção, as Netlify Functions leem do painel do Netlify.

1. https://app.netlify.com/projects/avantik-plataforma → **Site configuration → Environment variables**
2. Adicione cada uma (clique em **Add a variable** → **Add a single variable**):

| Key | Value | Scopes |
|---|---|---|
| `MP_ACCESS_TOKEN_PROD` | `APP_USR-6219...` (do seu .env) | Functions |
| `MP_WEBHOOK_SECRET` | `<chave do passo 3>` | Functions |
| `SUPABASE_URL` | `https://ajokzpjguhfxxudteetr.supabase.co` | Functions |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhb...` (do passo 2) | Functions |
| `SITE_URL` | `https://avantikpalestras.com.br` | Functions |

⚠️ Em **Scopes**, marque apenas **Functions** (não builds) pra reduzir superfície de exposição.

## 5. Deploy

```bash
cd c:/Users/Victor/Desktop/Projetos/avantik/avantik
netlify deploy --prod --dir=. --message="feat: mercado pago checkout anual"
```

O CLI faz o upload, builda as functions automaticamente, e retorna a URL.

## 6. Testar end-to-end

1. Acesse https://avantikpalestras.com.br/minhas-palestras/ logado como palestrante
2. Você deve ver um **banner de cobrança** (trial ativo, expirando, ou sem acesso)
3. Clique em **Assinar plano anual** / **Assinar agora**
4. Modal abre com os 3 planos
5. Escolha um → você é redirecionado pro Checkout Pro do MP
6. **Use um cartão de teste do MP** ([lista aqui](https://www.mercadopago.com.br/developers/pt/docs/checkout-api/additional-content/test-cards)) — não use cartão real ainda
7. Aprove o pagamento
8. Você volta pro site em `/minhas-palestras/?mp=success`
9. Em alguns segundos, o webhook deve disparar e ativar o plano. Verifique:
   - **Painel MP → Suas notificações**: deve aparecer a notificação enviada
   - **Supabase → Table editor → payments**: deve ter um registro novo com `status='approved'`
   - **Supabase → speakers**: o palestrante deve estar com `subscription_paid_until` setado pra 1 ano à frente

## 7. Quando começar a cobrar de verdade

- Confirme que tudo acima funcionou com cartão de teste
- **Rotacione o Access Token de produção do MP** (ele vazou em screenshot no chat — ver `memory/project_mp_token_rotation_pending.md`)
- Atualize `MP_ACCESS_TOKEN_PROD` no `.env` local e no painel Netlify

## Troubleshooting

**Webhook chega mas pagamento não ativa o plano:**
- Veja logs em Netlify → **Functions → mp-webhook → Logs**
- Causa comum: `external_reference` não está no formato `<speaker_id>:<plan>:<ts>` (algum checkout antigo da API direta)

**Webhook retorna 401:**
- `MP_WEBHOOK_SECRET` no Netlify difere do configurado no painel MP. Resetar e atualizar.

**Erro "speaker_not_found" no /create-checkout:**
- O usuário logado não tem registro em `speakers` com `auth_id` correspondente. Provavelmente é contractor, não speaker — o botão "Assinar" só deve aparecer no /minhas-palestras/ (rota protegida por `requireAuth('speaker')`).

**Cobrança aprovada mas usuário não viu a mudança:**
- Webhook é async. Recarregue a página `/minhas-palestras/` após 30s. Se ainda não atualizou, ver logs.
