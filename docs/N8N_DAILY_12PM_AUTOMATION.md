# Daily 12:00 PM Automated Job Sync System

This document outlines the architecture and execution instructions for the **zero-manual-intervention daily job auto-sync system** powered by **n8n Schedule Trigger**, **Apify**, and **PlacementOS AI Express Backend**.

---

## 1. How It Works

1. **n8n Schedule Trigger**:
   - Fires automatically **every day at 12:00 PM (12:00 Noon)**.
   - Requires no manual user clicking or searching.

2. **Multi-Source Scraping**:
   - Scrapes & domain-verifies job postings from **Official Corporate Careers Sites** (Google, Zoho, Texas Instruments, Tata Motors, Microsoft, Amazon, Infosys, Wipro, TCS).
   - Scrapes from **Professional Job Boards** (LinkedIn, Indeed, Naukri, Glassdoor).
   - Scrapes from **Social Media Hiring Handles** (X/Twitter, Instagram, Facebook Jobs).

3. **Automatic Push to PlacementOS Website DB**:
   - At 12:00 PM, n8n executes `POST http://localhost:5000/api/v1/jobs/auto-sync`.
   - The website database (`jobsDB`) is automatically populated with today's verified openings.

4. **Instant Student Skill Matching**:
   - When a student opens the website, `http://localhost:5000/api/v1/jobs/daily-auto-feed` automatically feeds today's jobs to `JobBoard.tsx` and matches them against the student's technical skills.

---

## 2. Importing the Daily 12:00 PM Workflow

Workflow File:
`automation/n8n_daily_12pm_job_cron.json`

### Import Instructions:
1. Open n8n (`http://localhost:5678`).
2. Open `automation/n8n_daily_12pm_job_cron.json`, copy all content (`Ctrl+A`, `Ctrl+C`).
3. Select any existing nodes on n8n dark canvas, press `Delete`, then press `Ctrl+V`.
4. Click **Publish** at top-right.

The n8n cron trigger will now automatically fire every day at 12:00 PM and update your website database!
