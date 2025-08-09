"use client";
import UploadAvatar from "@/components/form/UploadAvatar";
import Tag from "@/components/ui/tag";
import { UserResponseDTO } from "@/dtos/user.dto";
import { fetchUser } from "@/lib/services/user.service";
import React, { useEffect, useState } from "react";

const Page = () => {
  const [user, setUser] = useState<UserResponseDTO>();
  const [error, setError] = useState("");

  useEffect(() => {
    const getUserData = async () => {
      const userData = await fetchUser(setError);

      if (userData) {
        setUser(userData);
      }
    };

    getUserData();
  }, []);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="background-light500_dark500 text-dark100_light100 p-6">
      <div className="flex flex-col  gap-6">
        <div className="flex gap-5 items-center">
          <h1 className="text-2xl font-bold">
            Welcome, {user.firstName} {user.lastName}
          </h1>
          <div className="w-fit">
            <Tag content={user.role} />
          </div>
        </div>

        <div className="flex-shrink-0 w-full gap-5 lg:w-1/3 flex items-center">
          <UploadAvatar />
          <div className="mt-4">
            <p className="text-lg font-semibold">Bio</p>
            <p className="text-sm">{user.bio || "No bio available"}</p>
          </div>
        </div>

        <div className="w-full lg:w-2/3 flex flex-col gap-4">
          <p>Email: {user.email}</p>
          <p>Phone: {user.phoneNumber}</p>
        </div>
      </div>
    </div>
  );
};

export default Page;
