export { register } from './register.controller';
export { login } from './login.controller';
export { getMe } from './getMe.controller';

import { register } from './register.controller';
import { login } from './login.controller';
import { getMe } from './getMe.controller';

export const AuthController = {
  register,
  login,
  getMe,
};

export default AuthController;
