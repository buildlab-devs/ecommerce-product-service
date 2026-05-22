const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const electronics = await prisma.category.upsert({
    where: { slug: 'electronics' },
    update: {},
    create: { name: 'Electronics', slug: 'electronics' },
  });

  const clothing = await prisma.category.upsert({
    where: { slug: 'clothing' },
    update: {},
    create: { name: 'Clothing', slug: 'clothing' },
  });

  const products = [
    {
      name: 'Wireless Headphones',
      slug: 'wireless-headphones',
      description: 'Noise-cancelling over-ear headphones',
      price: 199.99,
      categoryId: electronics.id,
      inventory: { create: { quantity: 50 } },
      variants: {
        create: [{ name: 'Black', sku: 'WH-BLK', price: 199.99 }],
      },
    },
    {
      name: 'Smart Watch',
      slug: 'smart-watch',
      description: 'Fitness tracking smart watch',
      price: 299.99,
      categoryId: electronics.id,
      inventory: { create: { quantity: 30 } },
      variants: {
        create: [{ name: 'Silver', sku: 'SW-SLV', price: 299.99 }],
      },
    },
    {
      name: 'Classic T-Shirt',
      slug: 'classic-t-shirt',
      description: '100% cotton t-shirt',
      price: 29.99,
      categoryId: clothing.id,
      inventory: { create: { quantity: 100 } },
      variants: {
        create: [
          { name: 'Small', sku: 'TS-S', price: 29.99 },
          { name: 'Medium', sku: 'TS-M', price: 29.99 },
          { name: 'Large', sku: 'TS-L', price: 29.99 },
        ],
      },
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product,
    });
  }

  console.log('Seed completed');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
