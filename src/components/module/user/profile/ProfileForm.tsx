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
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
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
        toast.error(data.error || "Update failed");
      } else {
        toast.success("Profile updated successfully!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Unexpected error");
    }

    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-white dark:bg-gray-900 p-6 rounded-xl shadow"
    >
      {/* Full Name */}
      <div>
        <Label>Full Name</Label>
        <Input
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          required
        />
      </div>

      {/* Household Size */}
      <div>
        <Label>Household Size</Label>
        <Input
          type="number"
          name="householdSize"
          value={formData.householdSize}
          onChange={handleChange}
          required
        />
      </div>

      {/* Dietary Preferences */}
      <div>
        <Label>Dietary Preferences</Label>
        <Input
          name="dietaryPreferences"
          placeholder="Vegetarian, Vegan, Halal..."
          value={formData.dietaryPreferences}
          onChange={handleChange}
        />
      </div>

      {/* Budget */}
      <div>
        <Label>Monthly Food Budget (optional)</Label>
        <Input
          type="number"
          name="budget"
          placeholder="Enter amount in USD"
          value={formData.budget}
          onChange={handleChange}
        />
      </div>

      {/* Location */}
      <div>
        <Label>Location</Label>
        <Input
          name="location"
          placeholder="City / Region"
          value={formData.location}
          onChange={handleChange}
        />
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={loading}
      >
        {loading ? "Updating..." : "Save Changes"}
      </Button>
    </form>
  );
}
