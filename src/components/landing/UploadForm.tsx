"use client";

import { useState } from "react";
import Tesseract from "tesseract.js";

interface ParsedItem {
  name: string;
  quantity: number;
  unit?: string;
  expiration?: string | null;
}

interface UploadFormProps {
  userId: string;
}

const UploadForm: React.FC<UploadFormProps> = ({ userId }) => {
  const [file, setFile] = useState<File | null>(null);
  const [parsedItems, setParsedItems] = useState<ParsedItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  // Resize image to speed up OCR
  const resizeImage = (file: File, maxWidth = 1024): Promise<Blob> =>
    new Promise((resolve) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const scale = Math.min(1, maxWidth / img.width);
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => resolve(blob!));
      };
    });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
      setParsedItems([]);
      setError(null);
      setProgress(0);
    }
  };

  const handleScan = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    setProgress(0);

    try {
      // Resize image
      const resizedBlob = await resizeImage(file);
      const resizedFile = new File([resizedBlob], file.name, { type: file.type });

      // OCR with progress
      const { data } = await Tesseract.recognize(resizedFile, "eng", {
        logger: (m) => {
          if (m.status === "recognizing text") setProgress(m.progress);
          console.log("OCR progress:", m);
        },
      });

      const lines = data.text
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line !== "");

      if (lines.length === 0) {
        setError("No text detected. Try a clearer image.");
      }

      const parsed: ParsedItem[] = lines.map((line) => ({
        name: line,
        quantity: 1,
        unit: "",
        expiration: null,
      }));

      setParsedItems(parsed);
    } catch (err: any) {
      console.error("OCR error:", err);
      setError(err.message || "OCR failed");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (parsedItems.length === 0) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/inventory/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, items: parsedItems }),
      });

      const data = await res.json();
      if (data.success) {
        alert("Items added to inventory!");
        setParsedItems([]);
        setFile(null);
      } else {
        throw new Error(data.error || "Failed to add items");
      }
    } catch (err: any) {
      console.error("Confirm error:", err);
      setError(err.message || "Failed to add items");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-lg rounded-2xl border border-gray-200">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
        Upload Receipt or Food Label
      </h2>

      {/* File Input */}
      <label className="block mb-4">
        <span className="text-gray-700 font-medium">Select an image</span>
        <input
          type="file"
          accept="image/png, image/jpeg"
          onChange={handleFileChange}
          className="mt-2 w-full border border-gray-300 rounded-lg p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </label>

      {/* Scan Button */}
      <button
        onClick={handleScan}
        disabled={!file || loading}
        className={`w-full py-3 rounded-lg font-semibold text-white transition-colors duration-200 ${
          file && !loading ? "bg-green-500 hover:bg-green-600" : "bg-gray-300 cursor-not-allowed"
        }`}
      >
        {loading ? `Scanning... ${Math.round(progress * 100)}%` : "Scan & Extract"}
      </button>

      {/* Error Message */}
      {error && <p className="text-red-500 mt-2">{error}</p>}

      {/* Parsed Items */}
      {parsedItems.length > 0 && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-3 text-gray-800">Confirm Extracted Items</h3>
          <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-lg p-3 bg-gray-50 space-y-2">
            <ul>
              {parsedItems.map((item, idx) => (
                <li
                  key={idx}
                  className="flex justify-between items-center bg-white p-2 rounded-md shadow-sm"
                >
                  <span className="text-gray-800 font-medium">{item.name}</span>
                  <span className="text-gray-600">
                    {item.quantity} {item.unit || ""}
                    {item.expiration && (
                      <span className="ml-2 text-gray-500">
                        (Expires: {item.expiration.slice(0, 10)})
                      </span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <button
            onClick={handleConfirm}
            className="mt-4 w-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors duration-200"
          >
            Confirm & Add to Inventory
          </button>
        </div>
      )}
    </div>
  );
};

export default UploadForm;
