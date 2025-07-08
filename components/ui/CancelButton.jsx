"use client";

import { X } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CancelButton() {
  const router = useRouter();

  const handleCancel = () => {
    // Puedes cambiar esto a una ruta específica si quieres, por ejemplo: router.push("/home")
    router.back();
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={handleCancel}
        className="w-10 h-10 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-lg transition duration-200"
        title="Cancel"
      >
        <X size={28} />
      </button>
      <span className="text-sm font-medium text-black text-center">Cancel</span>
    </div>
  );
}
