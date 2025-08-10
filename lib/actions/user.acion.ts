import { RegisterDTO, UserResponseDTO } from "@/dtos/user.dto";
import { Schema, Types } from "mongoose";
import { connectToDatabase } from "../mongoose";
import User, { IUser } from "@/database/user.model";
import bcrypt from "bcryptjs";
import cloudinary from "../cloudinary";
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

export async function fetchUser(id: String | undefined) {
  try {
    connectToDatabase();
    const user = await User.findById(id);

    if (!user) {
      return { success: false, message: "User not found" };
    }
    const result: UserResponseDTO = {
      _id: user._id.toString(),
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      avatar: user.avatar,
      bio: user.bio,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return {
      success: true,
      userData: result,
      message: `Fetch user successfully!`,
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function uploadAvatar(
  userId: Schema.Types.ObjectId | undefined,
  url: string,
  publicId: string
) {
  try {
    connectToDatabase();
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not exist");
    }

    if (user.avatarPublicId) {
      await cloudinary.uploader.destroy(user.avatarPublicId);
      console.log("Previous avatar removed from Cloudinary");
    }

    user.avatar = url;
    user.avatarPublicId = publicId;
    await user.save();

    return { message: "Upload avatar successfully" };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function updateUserBio(
  userId: string | undefined,
  params: { bio: string }
) {
  try {
    await connectToDatabase();

    if (!userId) {
      throw new Error("Unauthorized: missing user id");
    }

    const existingUser = await User.findById(userId);
    if (!existingUser) {
      throw new Error("User not found!");
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: { bio: params.bio } },
      { new: true, projection: { bio: 1, _id: 0 } }
    );

    if (!updatedUser) {
      throw new Error("Update failed");
    }

    return { status: true, bio: updatedUser.bio };
  } catch (error) {
    console.error(error);
    throw error;
  }
}
