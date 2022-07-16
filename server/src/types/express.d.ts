declare namespace Express {
  interface User {
    id: string
  }

  interface Request {
    user?: User | undefined
    logout(done: (err: any) => void): void
    isAuthenticated(): this is AuthenticatedRequest
    isUnauthenticated(): this is UnauthenticatedRequest
  }

  interface AuthenticatedRequest extends Request {
    user: User
  }

  interface UnauthenticatedRequest extends Request {
    user?: undefined
  }
}
