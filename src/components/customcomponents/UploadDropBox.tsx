import { useCallback, useRef } from "react";
import { UploadCloud } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { toast } from "react-toastify";

const UploadDropBox = ({ onFileSelect, preview, type = "img" }) => {
  const fileRef = useRef<HTMLInputElement>(null);

  const onDrop = useCallback(
    (files: File[]) => {
      const file = files[0];
      if (!file) return;

      // Only allow .png or .jpg/.jpeg
      const allowed = ["image/png", "image/jpeg", "image/webp"];
      if (!allowed.includes(file.type)) {
        return toast.error(
          "Unsupported image format. Please select a PNG or JPG or WEBP image."
        );
      }

      onFileSelect(file);

      if (fileRef.current) {
        fileRef.current.value = ""; // <-- crucial line
      }
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      "image/png": [".png"],
      "image/jpeg": [".jpg", ".jpeg"],
      "image/webp": [".webp"],
    },
  });

  return (
    <div
      {...getRootProps()}
      className={`border border-dashed relative uploadinner border-blue-500 rounded-lg bg-[#1f1f1f] p-8 text-center space-y-3 cursor-pointer transition-colors ${
        isDragActive ? "bg-[#2a2a2a]" : ""
      }`}
    >
      <input
        accept="image/*"
        {...getInputProps()}
        ref={fileRef}
        className="absolute w-full h-full top-0 left-0 bottom-0 right-0"
      />
      <UploadCloud className="mx-auto text-blue-500" size={40} />
      <p className="text-white font-medium text-md">
        {isDragActive
          ? "Drop your .png or .jpg or .webp image here"
          : "Drag & drop or sel a .png or.jpg or .webp image here"}
      </p>

      {preview && (
        <img src={preview} alt="Preview" className="mx-auto max-h-40 rounded" />
      )}

      <button
        type="button"
        className="text-[#94eb00] font-medium underline"
        onClick={() => fileRef.current?.click()}
      >
        Browse Files
      </button>
    </div>
  );
};

export default UploadDropBox;
