"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/button";
import InputTitle from "@/components/ui/input-title";
import { handleRegister } from "@/lib/services/user.service";

const SignUp = () => {
  const [step, setStep] = useState(1);
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleNextStep = () => {
    setErrorMessage("");
    if (step === 2) {
      if (password !== confirmPassword) {
        setErrorMessage("Passwords do not match!");
        return;
      }
      handleRegister(
        { firstName, lastName, email, phoneNumber, password, confirmPassword },
        setErrorMessage,
        setSuccessMessage
      ).then((result) => {
        if (result) {
          setTimeout(() => {
            router.push("/sign-in");
          }, 1500);
        }
      });
    } else {
      setStep((prev) => prev + 1);
    }
  };

  return (
    <div className="background-light500_dark500 flex h-screen w-full items-center justify-center">
      <div className="background-light200_dark200 w-[500px] rounded-lg p-10 shadow-md flex flex-col gap-8">
        <div>
          <p className="text-dark100_light100 text-center text-[32px] md:text-[48px] font-semibold">
            Sign up
          </p>
          <p className="text-dark100_light100 text-center text-4 font-normal">
            Create your new account
          </p>
          {errorMessage && (
            <div className=" text-center text-red-500">{errorMessage}</div>
          )}
          {successMessage && (
            <div className=" text-center text-green-500">{successMessage}</div>
          )}
        </div>

        {step === 1 && (
          <div className="flex flex-col gap-6">
            <div className="flex gap-2">
              <InputTitle
                label="First Name"
                placeholder="Enter first name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <InputTitle
                label="Last Name"
                placeholder="Enter last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>

            <InputTitle
              label="Email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <InputTitle
              label="Phone Number"
              placeholder="Enter phone number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-6">
            <InputTitle
              label="Password"
              placeholder="Enter password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <InputTitle
              label="Confirm Password"
              placeholder="Confirm password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        )}

        {step < 3 && (
          <div className="mt-6">
            <Button
              title={step === 2 ? "Sign Up" : "Continue"}
              size="large"
              onClick={handleNextStep}
            />
          </div>
        )}

        <div className="mt-6 text-center">
          <p className="text-dark100_light100 text-[12px] md:text-4">
            Already have an account?{" "}
            <a
              href="/sign-in"
              className="text-dark100_light100 hover:underline font-semibold"
            >
              Sign In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default function Page() {
  return <SignUp />;
}
