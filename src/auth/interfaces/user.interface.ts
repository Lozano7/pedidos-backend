import { Document, Types } from 'mongoose';
import { ROLES } from 'src/constants/roles';

export interface User {
  email: string;
  roles: ROLES[];
  fullName: string;
  name: string;
  lastName: string;
}

export type UserType = Document &
  User & {
    _id: Types.ObjectId;
  };
