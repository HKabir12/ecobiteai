"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";

interface UploadFormProps {
  userId: string; // pass logged-in user ID
  associatedItemId?: string;
}

const UploadForm: React.FC<UploadFormProps> = ({ userId, associatedItemId }) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return toast.error("Please select a file");

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("userId", userId);
      if (associatedItemId) formData.append("associatedItemId", associatedItemId);

      const res = await fetch("/api/uploads", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Upload failed");
        return;
      }

      toast.success("File uploaded successfully!");
      setFile(null);
      (document.getElementById("file-input") as HTMLInputElement).value = "";
    } catch (err) {
      console.error(err);
      toast.error("Unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white rounded-xl shadow max-w-md">
      <div>
        <Label htmlFor="file-input">Upload Receipt or Food Label (JPG/PNG)</Label>
        <Input
          type="file"
          id="file-input"
          accept="image/jpeg,image/png"
          onChange={handleChange}
          required
        />
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Uploading..." : "Upload"}
      </Button>
    </form>
  );
};

export default UploadForm;
