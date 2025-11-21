"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

interface User {
  fullName?: string;
  householdSize?: number;
  dietaryPreferences?: string;
  budget?: number;
  location?: string;
}

interface ProfileFormProps {
  user: User;
}

export default function ProfileForm({ user }: ProfileFormProps) {
  const [formData, setFormData] = useState({
    fullName: user.fullName || "",
    householdSize: user.householdSize || "",
    dietaryPreferences: user.dietaryPreferences || "",
    budget: user.budget || "",
    location: user.location || "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "householdSize" || name === "budget" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/user/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to update profile");
      } else {
        toast.success("Profile updated successfully!");
      }
    } catch (err) {
      console.error("Profile update error:", err);
      toast.error("Unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-white p-6 rounded-xl shadow-md"
    >
      {/* Full Name */}
      <div>
        <Label htmlFor="fullName">Full Name</Label>
        <Input
          id="fullName"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          required
        />
      </div>

      {/* Household Size */}
      <div>
        <Label htmlFor="householdSize">Household Size</Label>
        <Input
          id="householdSize"
          type="number"
          name="householdSize"
          value={formData.householdSize}
          onChange={handleChange}
          min={1}
          required
        />
      </div>

      {/* Dietary Preferences */}
      <div>
        <Label htmlFor="dietaryPreferences">Dietary Preferences</Label>
        <Input
          id="dietaryPreferences"
          name="dietaryPreferences"
          placeholder="Vegan, Vegetarian, Halal..."
          value={formData.dietaryPreferences}
          onChange={handleChange}
        />
      </div>

      {/* Budget */}
      <div>
        <Label htmlFor="budget">Monthly Food Budget (optional)</Label>
        <Input
          id="budget"
          type="number"
          name="budget"
          placeholder="Enter amount in USD"
          value={formData.budget}
          onChange={handleChange}
          min={0}
        />
      </div>

      {/* Location */}
      <div>
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          name="location"
          placeholder="City / Region"
          value={formData.location}
          onChange={handleChange}
        />
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Updating..." : "Save Changes"}
      </Button>
    </form>
  );
}
