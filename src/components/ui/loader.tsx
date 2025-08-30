import React from "react";
import { Loader2 } from "lucide-react";

const FullScreenLoader: React.FC = () => {
  return (
    <div
      className="fixed inset-0 bg-opacity-60 flex items-center justify-center z-50"
      style={{ backdropFilter: "blur(1px)" }}
    >
      <Loader2 className="animate-spin text-white w-12 h-12" />
    </div>
  );
};

export default FullScreenLoader;
