# 🚀 Supabase Database Deployment Guide

## 📋 Pre-Deployment Checklist

### 1. Supabase Project Setup
Before running the deployment script, ensure you have:

- [ ] **Supabase Account**: Sign up at [supabase.com](https://supabase.com)
- [ ] **New Project Created**: Create a new project in Supabase dashboard
- [ ] **Project Reference**: Note your project reference (e.g., `abc123def456`)
- [ ] **Database Password**: Set and note your database password

### 2. Local Development Environment
Ensure your local development environment is set up with:

- [ ] **Node.js**: Install [Node.js](https://nodejs.org/) (LTS version recommended)
- [ ] **Git**: Install [Git](https://git-scm.com/) for version control
- [ ] **Docker**: Install [Docker](https://www.docker.com/) for containerization

### 3. Repository Setup
Clone the repository and install dependencies:

```bash
git clone <repository-url>
cd <repository-directory>
npm install
```

### 4. Environment Variables
Create a `.env` file in the project root and add your Supabase credentials:

```env
SUPABASE_URL=https://<your-project-ref>.supabase.co
SUPABASE_KEY=your-anon-or-service-role-key
```

### 5. Database Migrations
Ensure your database is up-to-date with the latest schema:

```bash
npx supabase db push
```

### 6. Seed Database
(Optional) Load initial data into your database:

```bash
npx supabase db seed
```

## 🚀 Deployment Steps

**Ready to deploy?** Run: `./scripts/deploy-supabase.sh`
