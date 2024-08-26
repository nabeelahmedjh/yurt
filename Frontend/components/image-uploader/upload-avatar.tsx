/* eslint-disable @next/next/no-img-element */
"use client";
import { useState } from "react";

import ImageModal from "./image-modal";
import { toast } from "sonner";
import { Upload, UploadIcon, X } from "lucide-react";

export default function UploadAvatar({
  field,
  maxFileSize,
}: {
  field: any;
  maxFileSize: number;
}) {
  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);
  const [croppedFile, setCroppedFile] = useState<File | undefined>(undefined);
  const [open, setOpen] = useState(false);
  const [filePreview, setFilePreview] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");

  return (
    <>
      <input
        ref={field.ref}
        id="serverImage"
        name={field.name}
        onBlur={field.onBlur}
        onChange={(e) => {
          const file = e.target?.files?.[0];

          if (file) {
            if (file.size > maxFileSize * 1024 * 1024) {
              setErrorMsg(`File size must be less than ${maxFileSize}MB.`);
              return;
            }
            setErrorMsg(``);

            setSelectedFile(file);
            field.onChange(file);

            const preview = URL.createObjectURL(file);

            setFilePreview(preview);

            setOpen(true);
          }
        }}
        type="file"
        accept="image/*"
        className="hidden"
      />

      {selectedFile && croppedFile ? (
        <div className="relative">
          <span
            onClick={() => {
              setSelectedFile(undefined);
              field.onChange(undefined);
            }}
            className="absolute top-2 right-2 p-1 bg-white rounded-full"
          >
            <X />
          </span>
          <img
            src={croppedFile ? URL.createObjectURL(croppedFile) : ""}
            alt="Server Image"
            className="object-cover w-full h-full rounded-full"
          />
        </div>
      ) : (
        <label htmlFor="serverImage" className="cursor-pointer">
          <div className="flex flex-col items-center justify-center w-full h-full rounded-full p-1 bg-gray-200">
            <UploadIcon />
            <p className="text-sm text-gray-500 mt-2">Upload Image</p>
          </div>
        </label>
      )}
      {errorMsg && (
        <p className="text-sm text-red-500 text-nowrap mt-8 -ml-2">
          {errorMsg}
        </p>
      )}

      <ImageModal
        field={field}
        isOpen={open}
        setIsOpen={setOpen}
        selectedFile={selectedFile}
        filePreview={filePreview}
        setCroppedFile={setCroppedFile}
      />
    </>
  );
}
