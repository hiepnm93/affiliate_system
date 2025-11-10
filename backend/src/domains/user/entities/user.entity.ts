export enum UserRole {
  ADMIN = 'admin',
  AFFILIATE = 'affiliate',
  USER = 'user',
}

export class UserEntity {
  id: number;
  email: string;
  password: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(
    id: number,
    email: string,
    password: string,
    role: UserRole,
    isActive: boolean,
    createdAt: Date,
    updatedAt: Date,
  ) {
    this.id = id;
    this.email = email;
    this.password = password;
    this.role = role;
    this.isActive = isActive;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static create(
    email: string,
    password: string,
    role: UserRole = UserRole.USER,
  ): Omit<UserEntity, 'id' | 'createdAt' | 'updatedAt'> {
    return {
      email,
      password,
      role,
      isActive: true,
    } as any;
  }

  isAdmin(): boolean {
    return this.role === UserRole.ADMIN;
  }

  isAffiliate(): boolean {
    return this.role === UserRole.AFFILIATE;
  }

  activate(): void {
    this.isActive = true;
  }

  deactivate(): void {
    this.isActive = false;
  }
}
