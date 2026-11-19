export type AuthResponse = { accessToken: string };

export type LoginPayload = { email: string; password: string };

export type RegisterClinicPayload = {
  clinic: {
    name: string;
    subDomain: string;
    address: string;
    email?: string;
    phone?: string;
    timezone?: string;
  };
  admin: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
    username?: string;
  };
};
