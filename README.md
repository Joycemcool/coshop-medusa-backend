# Co-Shop MedusaJS Backend

E-commerce backend for Co-Shop farmer marketplace built with MedusaJS.

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- PostgreSQL
- Git

### Database Setup
The backend uses PostgreSQL database `medusa_coshop` with connection:
```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/medusa_coshop
```

**PostgreSQL Credentials:**
- Username: `postgres`
- Password: `postgres`
- Database: `medusa_coshop`
- Host: `localhost`
- Port: `5432`

### Development Server
```bash
npm run dev
```
Server runs on: http://localhost:9000
Admin Panel: http://localhost:9000/app

### Admin User Credentials
**Email**: `admin@coshop.com`
**Password**: `supersecret123`

Use these credentials to access the admin panel at http://localhost:9000/app

## 📋 API Endpoints

- **Store API**: http://localhost:9000/store
- **Admin API**: http://localhost:9000/admin  
- **Health Check**: http://localhost:9000/health

## 🔧 Environment Variables

Key environment variables in `.env`:
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: JWT token secret
- `COOKIE_SECRET`: Session cookie secret
- `STORE_CORS`: Frontend CORS URLs
- `ADMIN_CORS`: Admin panel CORS URLs

## 🏗️ Project Structure

```
src/
├── admin/          # Admin panel customizations
├── api/            # Custom API routes
├── jobs/           # Background jobs
├── modules/        # Custom modules
├── scripts/        # Database scripts
├── subscribers/    # Event subscribers
└── workflows/      # Custom workflows
```

## 🌱 Next Steps

1. Create admin user: `npx medusa user --email admin@coshop.com --password supersecret123`
2. Seed sample data: `npm run seed`
3. Access admin panel: http://localhost:9000/app
4. Configure farmer-specific features
5. Connect React frontend

---

<p align="center">
  <a href="https://www.medusajs.com">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://user-images.githubusercontent.com/59018053/229103275-b5e482bb-4601-46e6-8142-244f531cebdb.svg">
    <source media="(prefers-color-scheme: light)" srcset="https://user-images.githubusercontent.com/59018053/229103726-e5b529a3-9b3f-4970-8a1f-c6af37f087bf.svg">
    <img alt="Medusa logo" src="https://user-images.githubusercontent.com/59018053/229103726-e5b529a3-9b3f-4970-8a1f-c6af37f087bf.svg">
    </picture>
  </a>
</p>
<h1 align="center">
  Medusa
</h1>

<h4 align="center">
  <a href="https://docs.medusajs.com">Documentation</a> |
  <a href="https://www.medusajs.com">Website</a>
</h4>

<p align="center">
  Building blocks for digital commerce
</p>

## What is Medusa

Medusa is a set of commerce modules and tools that allow you to build rich, reliable, and performant commerce applications without reinventing core commerce logic. The modules can be customized and used to build advanced ecommerce stores, marketplaces, or any product that needs foundational commerce primitives. All modules are open-source and freely available on npm.

Learn more about [Medusa’s architecture](https://docs.medusajs.com/learn/introduction/architecture) and [commerce modules](https://docs.medusajs.com/learn/fundamentals/modules/commerce-modules) in the Docs.

## Community & Contributions

The community and core team are available in [GitHub Discussions](https://github.com/medusajs/medusa/discussions), where you can ask for support, discuss roadmap, and share ideas.

Join our [Discord server](https://discord.com/invite/medusajs) to meet other community members.

## Other channels

- [GitHub Issues](https://github.com/medusajs/medusa/issues)
- [Twitter](https://twitter.com/medusajs)
- [LinkedIn](https://www.linkedin.com/company/medusajs)
- [Medusa Blog](https://medusajs.com/blog/)
