import mongoose, { Model, Document } from 'mongoose';
import { QueryResult } from '../paginate/paginate';
import { AccessAndRefreshTokens } from '../token/token.interfaces';

export interface IUser {
  name: string;
  email: string;
  password: string;
  role: string;
  isEmailVerified: boolean;
}

/*
Extends the IUser interface and the Mongoose Document interface,
adding a method isPasswordMatch which returns a Promise indicating 
whether the provided password matches the user's password. 
*/
export interface IUserDoc extends IUser, Document {
  isPasswordMatch(password: string): Promise<boolean>;
}

/*
export interface IUserModel extends Model<IUserDoc> { ... }: 
Extends the Mongoose Model interface for IUserDoc, 
adding static methods like isEmailTaken and paginate
*/

export interface IUserModel extends Model<IUserDoc> {
  isEmailTaken(email: string, excludeUserId?: mongoose.Types.ObjectId): Promise<boolean>;
  paginate(filter: Record<string, any>, options: Record<string, any>): Promise<QueryResult>;
}

/*
export type UpdateUserBody = Partial<IUser>;: Defines a type UpdateUserBody which is a partial representation of IUser, allowing for updating user data.
export type NewRegisteredUser = Omit<IUser, 'role' | 'isEmailVerified'>;: Defines a type NewRegisteredUser which excludes the 'role' and 'isEmailVerified' fields from IUser, typically used for registering new users.
export type NewCreatedUser = Omit<IUser, 'isEmailVerified'>;: Defines a type NewCreatedUser which excludes the 'isEmailVerified' field from IUser, typically used for creating new users.
*/

export type UpdateUserBody = Partial<IUser>;

export type NewRegisteredUser = Omit<IUser, 'role' | 'isEmailVerified'>;

export type NewCreatedUser = Omit<IUser, 'isEmailVerified'>;

export interface IUserWithTokens {
  user: IUserDoc;
  tokens: AccessAndRefreshTokens;
}
