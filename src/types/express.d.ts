export interface IAuthUser {
  id: string;
  phone: string;
  role: string;
  email?: string | null;
  [key: string]: any;
}

declare global {
  namespace Express {
    interface Request {
      user?: IAuthUser;
    }
  }
}
