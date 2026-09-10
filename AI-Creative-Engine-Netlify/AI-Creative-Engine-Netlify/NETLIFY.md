# AI Creative Engine — pacote Netlify

Este ZIP já contém o frontend compilado em `public/` e duas Netlify Functions em `netlify/functions/`. O `netlify.toml` está configurado para publicar o build pronto e encaminhar as rotas de API.

## Publicação recomendada

1. Descompacte o ZIP.
2. No Netlify, importe a pasta do projeto via Git ou use o Netlify CLI a partir desta pasta:

```bash
netlify deploy --prod
```

3. Se usar upload manual, o site estático de `public/` poderá ser publicado, mas use Git/CLI para garantir que as Functions também sejam implantadas.
4. No Netlify, abra **Project configuration → Environment variables** e crie as variáveis abaixo com escopo **Functions** e opção de segredo:

```env
OPENAI_API_KEY=
CODEKRAFT_API_KEY=
APIFY_API_TOKEN=
APIFY_ACTOR_ID=
```

Opcionalmente:

```env
OPENAI_API_BASE=https://api.openai.com/v1
CODEKRAFT_API_BASE=https://codecraftapi.com/v1
APIFY_INPUT_JSON={}
```

`APIFY_ACTOR_ID` deve ser o ID ou nome do Actor/Task escolhido no Apify, como `seu-usuario~seu-actor`. O Actor precisa retornar uma lista JSON de produtos com campos comuns como `title`, `url`, `image`, `price`, `sales`, `rating` e `seller`.

## Endpoints protegidos

- `/api/ai-script`: geração de roteiro via OpenAI ou CodeKraft.
- `/api/apify-trending`: radar de produtos do Actor Apify.

O navegador chama somente esses endpoints; as chaves são lidas no runtime das Functions e nunca são incluídas no JavaScript público. No Netlify, use OpenAI oficial ou CodeKraft. A opção IA interna é exclusiva do ambiente Manus.

## Privacidade

Você pode deixar o projeto privado ou usar proteção por senha no Netlify. Isso restringe visitantes, mas a proteção das chaves depende principalmente de mantê-las nas Functions, nunca em `public/` ou no frontend.
