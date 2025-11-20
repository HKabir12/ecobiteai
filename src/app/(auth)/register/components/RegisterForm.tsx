"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";

interface RegisterState {
  fullName: string;
  email: string;
  password: string;
  householdSize: string;
  dietaryPreferences: string;
  location: string;
}

const RegisterForm: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<RegisterState>({
    fullName: "",
    email: "",
    password: "",
    householdSize: "",
    dietaryPreferences: "",
    location: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Registration failed");
        setLoading(false);
        return;
      }

      toast.success("🎉 Registration successful!");

      // Auto-login
      const login = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });

      if (login?.ok) {
        toast.success("Logged in successfully!");
        router.push("/dashboard/user");
      } else {
        toast.error("Auto-login failed. Please login manually.");
        router.push("/login");
      }
    } catch (error) {
      console.error(error);
      toast.error("Unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 w-full max-w-md mx-auto bg-white dark:bg-gray-900 p-6 rounded-2xl shadow"
    >
      <h2 className="text-2xl font-semibold text-center">Create Account</h2>

      <div>
        <Label htmlFor="fullName">Full Name</Label>
        <Input
          id="fullName"
          name="fullName"
          type="text"
          placeholder="John Doe"
          value={formData.fullName}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="kabir@gmail.com"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="Enter a strong password"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <Label htmlFor="householdSize">Household Size</Label>
        <Input
          id="householdSize"
          name="householdSize"
          type="number"
          placeholder="Number of people"
          value={formData.householdSize}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <Label htmlFor="dietaryPreferences">Dietary Preferences</Label>
        <Input
          id="dietaryPreferences"
          name="dietaryPreferences"
          type="text"
          placeholder="Vegetarian, vegan, etc."
          value={formData.dietaryPreferences}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          name="location"
          type="text"
          placeholder="City or region"
          value={formData.location}
          onChange={handleChange}
          required
        />
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Registering..." : "Register"}
      </Button>
    </form>
  );
};

export default RegisterForm;
