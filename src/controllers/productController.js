const { z } = require('zod');
const productService = require('../services/productService');

const listSchema = z.object({
  query: z.object({
    search: z.string().optional(),
    category: z.string().optional(),
    page: z.coerce.number().int().min(1).optional().default(1),
    limit: z.coerce.number().int().min(1).max(100).optional().default(20),
  }),
});

const idSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
});

const stockSchema = z.object({
  body: z.object({
    items: z.array(
      z.object({
        productId: z.string().uuid(),
        quantity: z.number().int().min(1),
      })
    ).min(1),
  }),
});

const idsSchema = z.object({
  body: z.object({
    ids: z.array(z.string().uuid()).min(1),
  }),
});

async function list(req, res, next) {
  try {
    const result = await productService.listProducts(req.validated.query);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

async function getById(req, res, next) {
  try {
    const product = await productService.getProduct(req.validated.params.id);
    res.json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
}

async function categories(_req, res, next) {
  try {
    const data = await productService.listCategories();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

async function reserve(req, res, next) {
  try {
    const result = await productService.reserveStock(req.validated.body.items);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

async function confirm(req, res, next) {
  try {
    const result = await productService.confirmStock(req.validated.body.items);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

async function release(req, res, next) {
  try {
    const result = await productService.releaseStock(req.validated.body.items);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

async function byIds(req, res, next) {
  try {
    const products = await productService.getProductsByIds(req.validated.body.ids);
    res.json({ success: true, data: products });
  } catch (err) {
    next(err);
  }
}

async function health(_req, res) {
  res.json({ success: true, service: 'product-service', status: 'ok' });
}

module.exports = {
  listSchema,
  idSchema,
  stockSchema,
  idsSchema,
  list,
  getById,
  categories,
  reserve,
  confirm,
  release,
  byIds,
  health,
};
