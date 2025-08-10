"use client";
import PageContainer from "@/components/container/pageContainer";
import UpdateBio from "@/components/form/UpdateBio";
import UploadAvatar from "@/components/form/UploadAvatar";
import Button from "@/components/ui/button";
import Tag from "@/components/ui/tag";
import { UserResponseDTO } from "@/dtos/user.dto";
import { fetchUser, updateUserBio } from "@/lib/services/user.service";
import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useEffect, useState } from "react";

const Page = () => {
  const [user, setUser] = useState<UserResponseDTO | null>(null);
  const [error, setError] = useState("");
  const [showEditBio, setShowEditBio] = useState(false);

  useEffect(() => {
    const getUserData = async () => {
      const userData = await fetchUser(setError);
      if (userData) setUser(userData);
    };
    getUserData();
  }, []);

  const openEdit = () => setShowEditBio(true);

  const handleSaveBio = async (newBio: string) => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      console.log("Invalid token");
      return;
    }
    const res = await updateUserBio({ bio: newBio }, token);
    if (res?.status) {
      setUser((prev) => (prev ? { ...prev, bio: res.bio } : prev));
      setShowEditBio(false);
    } else {
      console.error("Failed to update user information");
    }
  };

  if (error) return <div className="text-red-500">{error}</div>;
  if (!user) return <div>Loading...</div>;

  return (
    <PageContainer className="text-dark100_light100">
      <div className="lg:flex lg:justify-between lg:mt-0 sm:mt-5">
        <div className="flex flex-col gap-6">
          <div className="flex gap-5 items-center">
            <h1 className="text-2xl font-bold">
              Welcome, {user.firstName} {user.lastName}
            </h1>
            <div className="w-fit">
              <Tag content={user.role} />
            </div>
          </div>

          <div className="flex-shrink-0 w-full gap-5 lg:w-2/3 flex items-center">
            <UploadAvatar />
            <div>
              <div className="flex">
                <p className="text-lg font-semibold">Bio</p>
                <button
                  className="p-[7px] ml-auto w-fit background-light400_dark400 rounded-full"
                  onClick={openEdit}
                  aria-label="Edit bio"
                >
                  <Icon
                    icon="solar:pen-broken"
                    className="text-primary-100 size-[15px]"
                  />
                </button>
              </div>

              <p className="text-sm">{user.bio || "No bio available"}</p>
            </div>
          </div>

          <div className="w-full lg:w-2/3 flex flex-col gap-4">
            <p>Email: {user.email}</p>
            <p>Phone: {user.phoneNumber}</p>
          </div>
        </div>
        <div>
          {" "}
          <Button title="Log Out" size="small" />
        </div>
      </div>

      {showEditBio && (
        <UpdateBio
          initialBio={user.bio ?? ""}
          onClose={() => setShowEditBio(false)}
          onSave={handleSaveBio}
        />
      )}
    </PageContainer>
  );
};

export default Page;
