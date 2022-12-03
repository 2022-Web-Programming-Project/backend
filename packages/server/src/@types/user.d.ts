import { User as ExtendUser } from 'src/user/entities/user.entity';

// Todo
// 1. Extend User type with custom fields
declare global {
  namespace Express {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    export interface User extends ExtendUser {}
  }
}
