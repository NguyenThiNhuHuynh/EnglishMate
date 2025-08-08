import { RegisterDTO, UserResponseDTO } from "@/dtos/user.dto";
import { Types } from "mongoose";
import { connectToDatabase } from "../mongoose";
import User, { IUser } from "@/database/user.model";
import bcrypt from "bcryptjs";
const saltRounds = 10;

export async function createUserWithRole(
  params: RegisterDTO,
  role: "student" | "teacher" | "admin"
): Promise<
  | { success: false; message: string }
  | { success: true; userData: UserResponseDTO; message: string }
> {
  try {
    await connectToDatabase();

    if (params.password !== params.confirmPassword) {
      return { success: false, message: "Confirm password does not match!" };
    }

    const existedUser = await User.findOne({
      $or: [{ email: params.email }, { phoneNumber: params.phoneNumber }],
    });
    if (existedUser) {
      return { success: false, message: "User already exists!" };
    }

    const hashPassword = await bcrypt.hash(params.password, saltRounds);
    const { confirmPassword, password, ...userData } = params;

    const createUserData = {
      ...userData,
      password: hashPassword,
      role,
      avatar: "",
      bio: "",
    };

    const newUser = (await User.create(createUserData)) as unknown as IUser & {
      _id: Types.ObjectId;
      createdAt: Date;
      updatedAt: Date;
    };

    const result: UserResponseDTO = {
      _id: newUser._id.toString(),
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      phoneNumber: newUser.phoneNumber,
      email: newUser.email,
      role: newUser.role,
      avatar: newUser.avatar,
      bio: newUser.bio,
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt,
    };

    return {
      success: true,
      userData: result,
      message: `Register ${role} successfully!`,
    };
  } catch (error) {
    console.error("Error in createUser:", error);
    return { success: false, message: "An unexpected error occurred." };
  }
}
