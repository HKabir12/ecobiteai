"use client";

import React from "react";
import RegisterForm from "./components/RegisterForm";
import Image from "next/image";
import registerIcon from "@/assets/images/reg.jpg";

const RegisterPage = () => {
  return (
    <div className="flex flex-col-reverse md:flex-row items-center justify-center py-8 md:space-x-12">
      <RegisterForm />
      <Image
        src={registerIcon}
        width={450}
        height={450}
        alt="Register Illustration"
        className="rounded-xl w-[300px] sm:w-[350px] md:w-[450px] object-cover shadow"
      />
    </div>
  );
};

export default RegisterPage;
