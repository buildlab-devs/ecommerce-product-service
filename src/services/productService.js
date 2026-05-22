const prisma = require('../lib/prisma');
const { AppError } = require('../lib/errors');

async function listProducts({ search, category, page = 1, limit = 20 }) {
  const skip = (page - 1) * limit;
  const where = {};

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }

  if (category) {
    where.category = { slug: category };
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      skip,
      take: limit,
      include: { category: true, inventory: true, variants: true },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.product.count({ where }),
  ]);

  return { products, pagination: { page, limit, total, pages: Math.ceil(total / limit) } };
}

async function getProduct(id) {
  const product = await prisma.product.findUnique({
    where: { id },
    include: { category: true, inventory: true, variants: true },
  });

  if (!product) {
    throw new AppError('Product not found', 404, 'NOT_FOUND');
  }

  return product;
}

async function listCategories() {
  return prisma.category.findMany({ include: { _count: { select: { products: true } } } });
}

async function reserveStock(items) {
  const results = [];

  for (const item of items) {
    const inventory = await prisma.inventory.findUnique({ where: { productId: item.productId } });
    if (!inventory) {
      throw new AppError(`No inventory for product ${item.productId}`, 400, 'NO_INVENTORY');
    }

    const available = inventory.quantity - inventory.reserved;
    if (available < item.quantity) {
      throw new AppError(`Insufficient stock for product ${item.productId}`, 400, 'INSUFFICIENT_STOCK');
    }

    await prisma.inventory.update({
      where: { productId: item.productId },
      data: { reserved: { increment: item.quantity } },
    });

    results.push({ productId: item.productId, reserved: item.quantity });
  }

  return results;
}

async function confirmStock(items) {
  for (const item of items) {
    await prisma.inventory.update({
      where: { productId: item.productId },
      data: {
        reserved: { decrement: item.quantity },
        quantity: { decrement: item.quantity },
      },
    });
  }
  return { success: true };
}

async function releaseStock(items) {
  for (const item of items) {
    await prisma.inventory.update({
      where: { productId: item.productId },
      data: { reserved: { decrement: item.quantity } },
    });
  }
  return { success: true };
}

async function getProductsByIds(ids) {
  return prisma.product.findMany({
    where: { id: { in: ids } },
    include: { inventory: true },
  });
}

module.exports = {
  listProducts,
  getProduct,
  listCategories,
  reserveStock,
  confirmStock,
  releaseStock,
  getProductsByIds,
};
