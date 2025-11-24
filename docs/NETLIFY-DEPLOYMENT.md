# 🚀 Netlify Deployment Guide

## Overview

This document explains the Netlify deployment configuration for the Brevo KPI Benchmark tool, particularly addressing the long-running AI analysis feature.

---

## ⚙️ Configuration Files

### `netlify.toml`

Located at the project root, this file configures:

- **Build settings**: Next.js build command and output directory
- **Function timeout**: Set to 300 seconds (5 minutes) for AI analysis
- **Cache optimization**: Static assets caching
- **Security headers**: XSS, clickjacking, and other protections
- **Rate limiting hints**: For `/api/analyze` endpoint

```toml
[functions]
  timeout = 300  # 5 minutes (requires Netlify Pro)
```

### API Route Configuration

In `app/api/analyze/route.ts`:

```typescript
export const runtime = 'nodejs';
export const maxDuration = 300; // 5 minutes
```

This tells Next.js and Netlify that this specific API route needs extended execution time.

---

## ⏱️ Function Timeout Issue

### Problem

The AI analysis feature makes a request to Dust.tt API that takes **~3 minutes** to complete. This causes issues with Netlify's default serverless function timeout.

### Netlify Timeout Limits

| Tier | Default Timeout | Max Timeout |
|------|----------------|-------------|
| Free/Starter | 10 seconds | 10 seconds |
| **Pro** | 26 seconds | **300 seconds (5 min)** |
| Business/Enterprise | 26 seconds | 300 seconds |

**Our app requires**: Netlify Pro plan or higher for the full 300-second timeout.

### Solution Implemented

1. **Extended timeout configuration** (`netlify.toml` + `maxDuration` export)
2. **Keepalive heartbeats** (SSE messages every 15 seconds to prevent connection drops)
3. **Activity tracking** (monitors time since last Dust.tt event)
4. **Graceful error handling** (proper cleanup of intervals and streams)

---

## 🔧 Environment Variables

Configure these in Netlify Dashboard → Site Settings → Environment Variables:

```bash
# Required for v4 AI Analysis
DUST_WORKSPACE_ID=your_workspace_id
DUST_API_KEY=your_api_key
DUST_ASSISTANT_ID=your_assistant_id
```

**Important**: Never commit these to git. They are in `.gitignore`.

---

## 🧪 Testing Deployment

### Local Testing

```bash
# Start dev server
npm run dev

# Test API endpoint (in another terminal)
cd .dev-tests && node test-api-analyze.js
```

Expected result: ✅ Full analysis delivered in ~3 minutes

### Production Testing

1. **Deploy to Netlify**:
   ```bash
   git add .
   git commit -m "feat: Add Netlify timeout configuration"
   git push origin master
   ```

2. **Monitor deployment**:
   - Go to Netlify Dashboard → Deploys
   - Wait for build to complete
   - Check Function Logs for any errors

3. **Test live endpoint**:
   - Go to your deployed site `/v4`
   - Enter KPI values and click "Generate AI Analysis"
   - Watch the Process Log for events
   - Should see: `user_message_new` → `agent_message_new` → `conversation_title` → `agent_message_done` → analysis content

### Debugging Production Issues

If analysis gets stuck in production:

1. **Check Netlify Functions logs**:
   - Dashboard → Functions → Click on the function
   - Look for timeout errors or exceptions

2. **Verify environment variables**:
   - Dashboard → Site Settings → Environment Variables
   - Ensure all three DUST_* variables are set correctly

3. **Check timeout configuration**:
   - Verify `netlify.toml` is in the root directory
   - Confirm you're on Netlify Pro plan (for 300s timeout)

4. **Review function execution time**:
   - Functions tab will show execution duration
   - If hitting timeout, may need to optimize or use async pattern

---

## 🔐 Security Considerations

### Secrets Management

- ✅ API keys stored in Netlify environment variables
- ✅ `.env` files gitignored
- ✅ Netlify Secrets Scanner enabled (validates no secrets in code)

### Rate Limiting

Currently **not enforced** (requires Netlify Enterprise or external solution).

**Recommendations**:
- Implement rate limiting middleware (e.g., `@upstash/ratelimit`)
- Add IP-based throttling
- Consider authentication for production use

### CORS Configuration

Currently allowing all origins. For production:

```javascript
// next.config.js
headers: async () => [
  {
    source: '/api/:path*',
    headers: [
      { key: 'Access-Control-Allow-Origin', value: 'https://yourdomain.com' }
    ]
  }
]
```

---

## 📊 Monitoring

### Key Metrics to Watch

1. **Function execution time**: Should be ~180-200 seconds
2. **Error rate**: Watch for timeout or Dust.tt API errors
3. **Bandwidth usage**: Streaming responses consume more bandwidth

### Netlify Analytics

Enable Netlify Analytics to track:
- API endpoint usage
- Response times
- Error rates
- Geographic distribution

---

## 🚨 Common Issues

### Issue 1: "Function execution timed out"

**Symptoms**: Analysis stops mid-stream, no content delivered

**Solutions**:
- Upgrade to Netlify Pro for 300s timeout
- Verify `netlify.toml` and `maxDuration` are configured
- Check Dust.tt API is responding (test locally first)

### Issue 2: "Missing Dust API credentials"

**Symptoms**: Error message immediately after clicking "Generate AI Analysis"

**Solutions**:
- Add environment variables in Netlify Dashboard
- Redeploy after adding variables (required for them to take effect)

### Issue 3: Analysis stuck after "conversation_title"

**Symptoms**: Receives first few events but stops before `agent_message_done`

**Solutions**:
- Check Function Logs for server-side errors
- Verify Dust.tt API key has correct permissions
- Test same request locally to isolate issue (use `.dev-tests/test-api-analyze.js`)

### Issue 4: Build fails with secrets scanner error

**Symptoms**: "Secret env var detected" error during build

**Solutions**:
- Ensure no real API keys in code or documentation
- Use placeholders: `DUST_API_KEY=your_api_key_here`
- Check `docs/AUDIT.md` and README for exposed secrets

---

## 🔄 Deployment Workflow

### Standard Deployment

```bash
# 1. Make changes
# 2. Test locally
npm run dev

# 3. Run tests
npm test

# 4. Build production
npm run build

# 5. Commit and push
git add .
git commit -m "feat: Your feature description"
git push origin master

# 6. Netlify auto-deploys from master branch
```

### Rollback

If deployment fails:

```bash
# In Netlify Dashboard → Deploys
# Click "⋯" on last successful deploy → "Publish deploy"
```

Or via CLI:

```bash
netlify deploy --prod --dir=.next
```

---

## 📚 Resources

- [Netlify Functions Docs](https://docs.netlify.com/functions/overview/)
- [Next.js on Netlify](https://docs.netlify.com/integrations/frameworks/next-js/)
- [Netlify Function Timeouts](https://docs.netlify.com/functions/configure-and-deploy/#synchronous-function-format)
- [Environment Variables](https://docs.netlify.com/environment-variables/overview/)

---

## ✅ Pre-deployment Checklist

Before pushing to production:

- [ ] `netlify.toml` exists at project root
- [ ] Environment variables set in Netlify Dashboard
- [ ] Local testing passes (`.dev-tests/test-api-analyze.js`)
- [ ] Build succeeds (`npm run build`)
- [ ] No secrets in code (check with `git grep "sk-"`)
- [ ] Netlify Pro plan active (for 300s timeout)
- [ ] `.env` file not committed to git

---

**Last Updated**: 2025-11-24
**Maintainer**: Brevo Growth Team
