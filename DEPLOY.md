# DeliveryConnect Pro - Deploy

Este projeto está pronto para deploy em várias plataformas.

## 🚀 Opções de Deploy

### 1. Vercel (Recomendado - Mais Fácil)

**Passo a passo:**

```bash
# 1. Instalar Vercel CLI
npm install -g vercel

# 2. Fazer login
vercel login

# 3. Deploy
vercel

# 4. Deploy para produção
vercel --prod
```

**Ou via GitHub:**
1. Acesse [vercel.com](https://vercel.com)
2. Conecte seu repositório GitHub
3. Deploy automático!

**Configurações:**
- Framework: Vite
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

---

### 2. Netlify

**Via CLI:**
```bash
# 1. Instalar Netlify CLI
npm install -g netlify-cli

# 2. Fazer login
netlify login

# 3. Deploy
netlify deploy

# 4. Deploy para produção
netlify deploy --prod
```

**Via Interface:**
1. Acesse [netlify.com](https://netlify.com)
2. Conecte repositório GitHub
3. Configurações:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Deploy!

**netlify.toml** (já criado):
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

### 3. GitHub Pages

```bash
# 1. Instalar gh-pages
npm install --save-dev gh-pages

# 2. Adicionar scripts no package.json
# "predeploy": "npm run build",
# "deploy": "gh-pages -d dist"

# 3. Deploy
npm run deploy
```

**Configuração no vite.config.ts:**
```typescript
export default defineConfig({
  base: '/deliveryconnect-pro/', // nome do repositório
  // ... resto da config
})
```

---

### 4. Railway

```bash
# 1. Instalar Railway CLI
npm install -g @railway/cli

# 2. Login
railway login

# 3. Inicializar
railway init

# 4. Deploy
railway up
```

**railway.json** (já criado):
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm run build"
  },
  "deploy": {
    "startCommand": "npm run preview",
    "restartPolicyType": "ON_FAILURE"
  }
}
```

---

### 5. Render

1. Acesse [render.com](https://render.com)
2. Conecte repositório
3. Configurações:
   - **Build Command**: `npm run build`
   - **Start Command**: `npm run preview`
   - **Publish Directory**: `dist`

---

### 6. Firebase Hosting

```bash
# 1. Instalar Firebase CLI
npm install -g firebase-tools

# 2. Login
firebase login

# 3. Inicializar
firebase init hosting

# 4. Deploy
firebase deploy
```

**firebase.json** (já criado):
```json
{
  "hosting": {
    "public": "dist",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

---

## 📦 Build Manual

Se preferir fazer build e hospedar em servidor próprio:

```bash
# 1. Build de produção
npm run build

# 2. Testar localmente
npm run preview

# 3. A pasta 'dist' contém todos os arquivos
# Upload para seu servidor (Apache, Nginx, etc.)
```

---

## 🔧 Configuração do Servidor

### Nginx

```nginx
server {
    listen 80;
    server_name seu-dominio.com;
    root /var/www/deliveryconnect/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Gzip
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # Cache
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### Apache (.htaccess)

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>

# Gzip
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json
</IfModule>

# Cache
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access 1 year"
  ExpiresByType image/jpeg "access 1 year"
  ExpiresByType image/gif "access 1 year"
  ExpiresByType image/png "access 1 year"
  ExpiresByType text/css "access 1 month"
  ExpiresByType application/javascript "access 1 month"
</IfModule>
```

---

## ⚙️ Variáveis de Ambiente

Se precisar de variáveis de ambiente:

**Criar `.env.production`:**
```env
VITE_API_URL=https://api.seudominio.com
VITE_APP_NAME=DeliveryConnect Pro
```

**Usar no código:**
```typescript
const apiUrl = import.meta.env.VITE_API_URL
```

---

## 🔒 HTTPS Obrigatório

**Importante:** O GPS só funciona com HTTPS!

Todas as plataformas recomendadas (Vercel, Netlify, etc.) fornecem HTTPS automaticamente.

Para servidor próprio:
- Use Let's Encrypt (gratuito)
- Certbot para automação
- Cloudflare para proxy HTTPS

---

## ✅ Checklist de Deploy

Antes de fazer deploy, verifique:

- [ ] `npm run build` funciona sem erros
- [ ] `npm run preview` mostra app funcionando
- [ ] GPS testado em HTTPS
- [ ] Todas funcionalidades testadas
- [ ] Arquivos de configuração criados
- [ ] README atualizado
- [ ] Commit e push para GitHub

---

## 🎯 Deploy Rápido (Vercel)

**Método mais rápido - 2 minutos:**

1. **Instalar Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel
   ```

4. **Seguir prompts:**
   - Project name: deliveryconnect-pro
   - Framework: Vite
   - Continue? Yes
   - Deploy? Yes

5. **Pronto!** URL gerada: `https://deliveryconnect-pro.vercel.app`

---

## 📊 Monitoramento

Após deploy:
- Vercel: Analytics embutido
- Netlify: Analytics disponível
- Google Analytics: Adicione o script
- Sentry: Para tracking de erros

---

## 🔄 CI/CD Automático

**GitHub Actions** (já configurado):

Toda vez que você fizer push para `main`, o deploy é automático!

---

## 🆘 Problemas Comuns

### Build falha
```bash
# Limpar cache
rm -rf node_modules dist
npm install
npm run build
```

### GPS não funciona
- Certifique-se que está usando HTTPS
- Verifique permissões do navegador
- Teste em dispositivo móvel

### Rotas não funcionam (404)
- Configure redirects (já configurado)
- Verifique servidor (nginx/apache)

---

## 📞 Suporte

Se precisar de ajuda:
- Documentação: Veja os arquivos `.md`
- Issues: Abra issue no GitHub
- Comunidade: Discord/Slack do projeto

---

**Deploy concluído! 🚀**
