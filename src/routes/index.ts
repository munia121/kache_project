import { Router } from 'express';
import { AuthRoutes } from '../modules/auth/auth.routes';
import { CategoryRoutes } from '../modules/category/category.routes';

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
  // {
  //   path: '/users',
  //   route: userRoutes,
  // },
  // {
  //   path: '/products',
  //   route: productRoutes,
  // },
  // {
  //   path: '/orders',
  //   route: orderRoutes,
  // },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
