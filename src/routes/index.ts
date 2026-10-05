import { Router } from 'express';

const router = Router();

// Module routes will be mounted here
const moduleRoutes: { path: string; route: Router }[] = [
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
