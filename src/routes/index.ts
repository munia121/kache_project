import { Router } from 'express';
import { AuthRoutes } from '../modules/auth/auth.routes';
import { CategoryRoutes } from '../modules/category/category.routes';
import { ProductRoutes } from '../modules/product/product.routes';

const router = Router();

// Module routes will be mounted here
const moduleRoutes: { path: string; route: Router }[] = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/categories',
    route: CategoryRoutes,
  },
  {
    path: '/products',
    route: ProductRoutes,
  },
  // {
  //   path: '/orders',
  //   route: orderRoutes,
  // },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
