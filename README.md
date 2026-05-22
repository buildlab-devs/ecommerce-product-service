# ecommerce-product-service

Product catalog microservice — products, categories, inventory, search.

## Setup

```bash
npm install
cp .env.example .env
npm run prisma:generate
npm run prisma:migrate
npm run seed
npm run dev
```

Runs on **port 4003** locally.

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/products/health` | Health check |
| GET | `/api/products` | List/search products |
| GET | `/api/products/:id` | Get product by ID |
| GET | `/api/products/categories/list` | List categories |
| POST | `/api/products/internal/reserve` | Reserve stock (internal) |
| POST | `/api/products/internal/confirm` | Confirm stock deduction (internal) |
| POST | `/api/products/internal/release` | Release reserved stock (internal) |

Internal endpoints require `X-Internal-Key` header.

## Vercel Deployment

1. Push repo to GitHub, import to Vercel
2. Set `DATABASE_URL` and `INTERNAL_API_KEY`
3. Run migrations against production DB
4. Set `PRODUCT_SERVICE_URL` in gateway and order-service
