/* eslint-disable @next/next/no-img-element */
"use client";
import { useState } from "react";

import ImageModal from "./image-modal";
import { UploadIcon, X } from "lucide-react";

export default function UploadAvatar({
  field,
  maxFileSize,
  fileRef,
}: {
  field: any;
  maxFileSize: number;
  /** Make a ref and pass it, then use it to clear the file input value when submitting the form. */
  fileRef: any;
}) {
  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);
  const [croppedFile, setCroppedFile] = useState<File | undefined>(undefined);
  const [open, setOpen] = useState(false);
  const [filePreview, setFilePreview] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");

  return (
    <>
      <input
        ref={fileRef}
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
              if (fileRef.current) {
                fileRef.current.value = "";
              }
            }}
            className="absolute top-1 -right-2 p-1 hover:bg-white/80 border border-gray-100 bg-white rounded-full"
          >
            <X />
          </span>
          <img
            src={croppedFile ? URL.createObjectURL(croppedFile) : ""}
            alt="Server Image"
            className="object-cover w-full h-[96px] rounded-full border border-neutral-100"
          />
        </div>
      ) : (
        <label
          htmlFor="serverImage"
          className="cursor-pointer inline-block w-fit"
        >
          <div className="flex flex-col items-center justify-center w-[96px] h-[96px] rounded-full p-1 bg-neutral-100">
            <UploadIcon />
          </div>
        </label>
      )}
      {errorMsg && (
        <p className="text-xs italic text-red-400 text-nowrap pt-1 -ml-1">
          {errorMsg}
        </p>
      )}

      <ImageModal
        fileInputRef={fileRef}
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
