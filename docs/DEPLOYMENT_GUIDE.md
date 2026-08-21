# Production Deployment Guide - PlacementOS AI

## 1. Stack Architecture
- **Frontend**: Next.js / Vite React TypeScript with Tailwind CSS (Port 80)
- **Backend**: Express.js REST API with Mongoose (Port 5000)
- **Database**: MongoDB v6+ (Port 27017)
- **Automation / AI Orchestration**: n8n / Flowise Docker service (Port 5678)
- **Reverse Proxy & SSL**: Nginx

---

## 2. Quickstart with Docker Compose

```bash
# Clone PlacementOS AI repository
git clone https://github.com/placementos/placement-os-ai.git
cd placement-os-ai

# Configure production environment variables
cp .env.example .env

# Build & launch all services
docker-compose up -d --build
```

---

## 3. Environment Configuration (`.env`)

```env
PORT=5000
NODE_ENV=production
MONGO_URI=mongodb://mongo:27017/placement_os_ai
JWT_SECRET=super_secure_placement_os_jwt_secret_key_2026
OPENAI_API_KEY=sk-...
GEMINI_API_KEY=AIza...
WHATSAPP_TOKEN=EAAG...
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
FRONTEND_URL=https://placementos.university.edu
```

---

## 4. Automation Workflows (WhatsApp, Email & Voice Calls)
- **n8n / Flowise Integration**: Import workflow templates from `/automation/n8n_workflows.json`.
- **WhatsApp Cloud API**: Configure webhook target to `/api/v1/webhooks/whatsapp`.
- **Twilio Voice Call Engine**: Webhook endpoint `/api/v1/webhooks/voice-call`.
