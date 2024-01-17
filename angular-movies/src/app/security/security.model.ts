export interface UserCredentials {
  email: string;
  password: string;
}

export interface AuthenicationResponse {
  token: string;
  expiryDate: Date;
}

export interface UserDTO {
  id: string;
  email: string;
}
