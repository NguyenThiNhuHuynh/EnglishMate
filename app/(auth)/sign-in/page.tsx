"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/button";
import InputTitle from "@/components/ui/input-title";
import { handleLogin } from "@/lib/services/user.service";

const SignIn = () => {
  const [phoneNumberOrEmail, setPhoneNumberOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");
  //   const { setProfile } = useAuth();

  const handleLoginSubmit = async () => {
    const result = await handleLogin(
      { emailOrPhone: phoneNumberOrEmail, password },
      (errorMsg) => setErrorMessage(errorMsg) // Cập nhật thông báo lỗi
    );

    if (result) {
      // Nếu đăng nhập thành công, chuyển hướng
      router.push("/"); // Chuyển hướng đến trang chủ hoặc trang yêu cầu
    }
  };

  return (
    <div className="background-light500_dark500 flex h-screen w-full items-center justify-center">
      <div className="background-light200_dark200 my-[110px] w-[540px] rounded-lg p-12 shadow-md flex flex-col gap-8">
        <div>
          <p className="text-dark100_light100 text-center text-[48px] font-medium">
            Welcome Back !
          </p>
          <p className="text-dark100_light100 text-center text-4 font-normal">
            Enter your phone number or email and password to access your account
          </p>
          {errorMessage && (
            <p className="text-center text-red-500">{errorMessage}</p>
          )}
        </div>
        <div className="w-full flex flex-col gap-10">
          <div className="flex flex-col gap-6">
            <InputTitle
              label="Phone number or email"
              placeholder="Enter your phone number or email"
              value={phoneNumberOrEmail}
              onChange={(e) => setPhoneNumberOrEmail(e.target.value)}
            />
            <div>
              <InputTitle
                label="Password"
                placeholder="Enter your password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <div className="mt-2 text-end">
                <a
                  href="/forget-password"
                  className="text-dark100_light100 text-[14px] font-normal hover:underline"
                >
                  Forget password?
                </a>
              </div>
            </div>
          </div>
          <Button title="Sign In" size="large" onClick={handleLoginSubmit} />

          <div className="text-center">
            <p className="text-dark100_light100 text-4 font-nomal">
              You don&apos;t have an account yet ?{" "}
              <a
                href="/sign-up"
                className="text-dark100_light100 text-4 font-semibold hover:underline"
              >
                Sign Up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Page() {
  return <SignIn />;
}
