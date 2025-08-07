export interface RegisterDTO {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginDTO {
  emailOrPhone: string;
  password: string;
}

export interface UpdateUserDTO {
  firstName?: string;
  lastName?: string;
  avatar?: string;
  bio?: string;
}

export interface UserResponseDTO {
  _id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  role: "student" | "teacher" | "admin";
  avatar?: string;
  bio?: string;
  createdAt: Date;
  updatedAt: Date;
}
