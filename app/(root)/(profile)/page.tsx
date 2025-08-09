"use client";
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
    <div className="background-light100_dark100 text-black dark:text-white">
      <h1 className="text-2xl font-bold">
        Welcome, {user.firstName} {user.lastName}
      </h1>
      <p>Email: {user.email}</p>
      <p>Phone: {user.phoneNumber}</p>
      <p>Role: {user.role}</p>
    </div>
  );
};

export default Page;
