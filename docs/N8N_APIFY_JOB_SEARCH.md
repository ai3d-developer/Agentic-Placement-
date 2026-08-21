# n8n Cloud + Apify Automated Verified Job Search Engine

This document provides setup, publishing, and execution instructions for the live **n8n Cloud Workflow (`VwWgmCKFPyhLaNmb`)** and **Apify Actors** integrated with **PlacementOS AI**.

---

## 1. Overview & Cloud Workflow Link

- **Live n8n Cloud Workflow Link**: [https://ai-placement.app.n8n.cloud/workflow/VwWgmCKFPyhLaNmb](https://ai-placement.app.n8n.cloud/workflow/VwWgmCKFPyhLaNmb)
- **Production Webhook URL**: `https://ai-placement.app.n8n.cloud/webhook/job-search`
- **Workflow ID Webhook Path**: `https://ai-placement.app.n8n.cloud/webhook/VwWgmCKFPyhLaNmb`
- **Test Webhook URL**: `https://ai-placement.app.n8n.cloud/webhook-test/job-search`

---

## 2. Solved n8n Cloud Publishing Issues

When publishing workflows on n8n Cloud (`ai-placement.app.n8n.cloud`), the following common issues were addressed and resolved:

1. **Test vs Production Webhook Routing**:
   - In draft/editing mode, n8n listens only to `/webhook-test/`. Once activated/published, n8n switches listening to `/webhook/`.
   - **Resolution**: PlacementOS backend (`server/server.js`) now uses multi-candidate retry logic. It tries `https://ai-placement.app.n8n.cloud/webhook/job-search`, workflow path `https://ai-placement.app.n8n.cloud/webhook/VwWgmCKFPyhLaNmb`, and draft path `https://ai-placement.app.n8n.cloud/webhook-test/job-search` automatically.

2. **CORS & Options Configuration**:
   - Webhook trigger node has `allowedOrigins: "*"` enabled in `automation/n8n_apify_job_scraper.json` to allow seamless HTTP requests from browser frontends.

3. **Active Status**:
   - Workflow export JSON is configured with `"active": true` so importing or publishing in n8n Cloud activates live execution immediately.

---

## 3. Environment Variables Configuration

Both root `.env` and `server/.env` are pre-configured:

```env
N8N_WEBHOOK_URL=https://ai-placement.app.n8n.cloud/webhook/job-search
N8N_WORKFLOW_URL=https://ai-placement.app.n8n.cloud/workflow/VwWgmCKFPyhLaNmb
APIFY_API_TOKEN=apify_api_live_verified
```

---

## 4. How to Publish & Activate Workflow in n8n Cloud

1. Open [https://ai-placement.app.n8n.cloud/workflow/VwWgmCKFPyhLaNmb](https://ai-placement.app.n8n.cloud/workflow/VwWgmCKFPyhLaNmb) in your browser.
2. If updating from scratch, click **Workflow Settings -> Import from File** and select `automation/n8n_apify_job_scraper.json`.
3. Click the **Publish / Active** toggle in the top-right corner to activate production listening.
4. Test the live endpoint with `curl`:

```bash
curl -X POST https://ai-placement.app.n8n.cloud/webhook/job-search \
  -H "Content-Type: application/json" \
  -d '{
    "query": "Software Engineer",
    "department": "CSE/IT",
    "location": "India"
  }'
```

---

## 5. Verification Safeguards

- **Domain Whitelist Matching**: Ensures deep-links direct students strictly to verified corporate hostnames (`.google.com`, `.zoho.com`, `.ti.com`, `.microsoft.com`, `.amazon.jobs`).
- **Real-Time Skill Matching**: Cross-references scraped required skills against student profile `technicalSkills` in `JobBoard.tsx`.
- **Live Cloud Status Badge**: Renders a clickable status pill in the student job dashboard linking directly to [https://ai-placement.app.n8n.cloud/workflow/VwWgmCKFPyhLaNmb](https://ai-placement.app.n8n.cloud/workflow/VwWgmCKFPyhLaNmb).
