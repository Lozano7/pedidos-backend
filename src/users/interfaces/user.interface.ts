export interface IUserResponse {
  _id: string;
  email: string;
  name: string;
  lastName: string;
  roles: string[];
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}
