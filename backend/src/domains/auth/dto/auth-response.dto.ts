export class AuthResponseDto {
  access_token: string;
  user: {
    id: number;
    email: string;
    name: string;
  };

  constructor(
    access_token: string,
    user: { id: number; email: string; name: string },
  ) {
    this.access_token = access_token;
    this.user = user;
  }
}
