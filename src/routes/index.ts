import { Router } from 'express';
import { AuthRoutes } from '../modules/auth/auth.routes';

const router = Router();

// Module routes will be mounted here
const moduleRoutes: { path: string; route: Router }[] = [
  {
    path: '/auth',
    route: AuthRoutes,
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
  //   path: '/categories',
  //   route: categoryRoutes,
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
