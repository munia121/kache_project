export { register } from './register.controller';
export { login } from './login.controller';
export { getMe } from './getMe.controller';
export { verifyOtp } from './verifyOtp.controller';
export { resendOtp } from './resendOtp.controller';
export { forgotPassword } from './forgotPassword.controller';
export { resetPassword } from './resetPassword.controller';
export { refreshToken } from './refreshToken.controller';

import { register } from './register.controller';
import { login } from './login.controller';
import { getMe } from './getMe.controller';
import { verifyOtp } from './verifyOtp.controller';
import { resendOtp } from './resendOtp.controller';
import { forgotPassword } from './forgotPassword.controller';
import { resetPassword } from './resetPassword.controller';
import { refreshToken } from './refreshToken.controller';

export const AuthController = {
  register,
  login,
  getMe,
  verifyOtp,
  resendOtp,
  forgotPassword,
  resetPassword,
  refreshToken,
};

export default AuthController;
