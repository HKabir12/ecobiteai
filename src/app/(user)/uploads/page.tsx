"use client";

import { useSession } from "next-auth/react";
import UploadForm from "@/components/module/user/upload/UploadForm";

const UploadPage = () => {
  const { data: session, status } = useSession();

  if (status === "loading") return <p>Loading...</p>;
  if (!session?.user?.id) return <p>Please login to upload files.</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        Upload Receipts or Food Labels
      </h1>
      <UploadForm userId={session.user.id} />
    </div>
  );
};
export default UploadPage;
