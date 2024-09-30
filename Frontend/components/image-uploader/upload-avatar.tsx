/* eslint-disable @next/next/no-img-element */
"use client";
import { useState } from "react";

import ImageModal from "./image-modal";
import { CameraIcon, UploadIcon, X } from "lucide-react";
import { PROXY_API_URL } from "@/constants";
import { cn } from "@/lib/utils";

export default function UploadAvatar({
  field,
  maxFileSize,
  fileRef,
  formSubmitter,
  loading,
  defaultAvatar,
  className,
}: {
  field: any;
  maxFileSize: number;
  /** Make a ref and pass it, then use it to clear the file input value when submitting the form. */
  fileRef: any;
  /** Pass React Hook Form submitter if you want to submit form when user presses tick on image cropper dialog. */
  formSubmitter?: any;
  loading?: boolean;
  defaultAvatar?: string;
  className?: string;
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
        id={field.name}
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
        accept=".jpeg, .jpg, .png, .gif"
        className="hidden"
      />

      {!formSubmitter &&
        ((selectedFile && croppedFile) || defaultAvatar ? (
          <div className="relative">
            <span
              onClick={() => {
                setSelectedFile(undefined);
                field.onChange(undefined);
                if (fileRef.current) {
                  fileRef.current.value = "";
                  defaultAvatar && fileRef.current.click();
                }
              }}
              className="absolute top-1 -right-2 p-1 hover:bg-white/80 border border-gray-100 bg-white rounded-full"
            >
              {defaultAvatar ? <CameraIconCustom /> : <X />}
            </span>

            <img
              src={
                croppedFile
                  ? URL.createObjectURL(croppedFile)
                  : defaultAvatar
                  ? PROXY_API_URL + "/" + defaultAvatar
                  : ""
              }
              alt="Server Image"
              // className="object-cover w-full h-[96px] rounded-full border border-neutral-100"
              className={cn(
                "object-cover w-full h-[96px] rounded-full border border-neutral-100",
                className
              )}
            />
          </div>
        ) : (
          <label
            htmlFor={field.name}
            className="cursor-pointer inline-block w-fit"
          >
            <div className="flex flex-col items-center justify-center w-[96px] h-[96px] rounded-full p-1 bg-neutral-100">
              <UploadIcon />
            </div>
          </label>
        ))}

      {formSubmitter &&
        (defaultAvatar ? (
          <div className="relative">
            <label
              htmlFor={field.name}
              className="cursor-pointer inline-block w-fit"
            >
              <span
                onClick={() => {
                  setSelectedFile(undefined);
                  field.onChange(undefined);
                  if (fileRef.current) {
                    fileRef.current.value = "";
                  }
                }}
                className="absolute bottom-1 -right-1 p-1 shadow-lg hover:cursor-pointer border border-black bg-secondary rounded-full"
              >
                <CameraIconCustom />
              </span>
            </label>
            {loading && (
              <div className="absolute h-[100%] w-[100%] bg-white/80 animate-pulse rounded-full"></div>
            )}
            <img
              src={PROXY_API_URL + "/" + defaultAvatar}
              alt="File Upload"
              // className="object-cover w-full h-[96px] rounded-[40px] border-2 border-b-8"
              className={cn(
                "object-cover w-full h-[96px] rounded-[40px] border-2 border-b-8",
                className
              )}
            />
          </div>
        ) : (
          <label
            htmlFor={field.name}
            className="cursor-pointer inline-block w-fit relative"
          >
            <div
              title="Upload Picture"
              className="flex flex-col items-center justify-center w-[96px] h-[96px] rounded-full p-1 bg-neutral-100"
            >
              <UploadIcon />
            </div>
          </label>
        ))}

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
        formSubmitter={formSubmitter}
      />
    </>
  );
}

const CameraIconCustom = () => {
  return (
    <svg
      width="20"
      height="19"
      viewBox="0 0 20 19"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12.48 0.166992C12.9644 0.166832 13.4309 0.357604 13.7861 0.701065C14.1413 1.04453 14.3589 1.51529 14.3952 2.01899L14.4 2.16915C14.4 2.41435 14.4864 2.65101 14.6426 2.83424C14.7989 3.01747 15.0142 3.13453 15.2477 3.16322L15.36 3.17023H16.32C17.0546 3.17019 17.7615 3.46287 18.2959 3.98839C18.8304 4.51392 19.1521 5.23256 19.1952 5.99727L19.2 6.17346V15.1832C19.2 15.9492 18.9194 16.6863 18.4154 17.2437C17.9114 17.801 17.2223 18.1365 16.489 18.1814L16.32 18.1864H2.88C2.1454 18.1865 1.43855 17.8938 0.90407 17.3682C0.369593 16.8427 0.0478968 16.1241 0.00480011 15.3594L4.47403e-09 15.1832V6.17346C-4.09169e-05 5.40743 0.280632 4.67033 0.784592 4.11298C1.28855 3.55564 1.9777 3.22017 2.71104 3.17523L2.88 3.17023H3.84C4.09461 3.17023 4.33879 3.06476 4.51882 2.87702C4.69886 2.68928 4.8 2.43465 4.8 2.16915C4.79985 1.66403 4.98279 1.17751 5.31216 0.807134C5.64152 0.436754 6.09297 0.209882 6.576 0.171998L6.72 0.166992H12.48ZM9.6 7.17454C8.88633 7.17448 8.19806 7.45074 7.66861 7.94977C7.13916 8.44879 6.80624 9.13503 6.7344 9.87545L6.72384 10.0276L6.72 10.1778L6.72384 10.3279C6.75201 10.9148 6.94466 11.4802 7.27793 11.954C7.61119 12.4278 8.07042 12.7893 8.59874 12.9936C9.12706 13.1979 9.70125 13.2361 10.2502 13.1035C10.7992 12.9709 11.2987 12.6733 11.6871 12.2475C12.0754 11.8218 12.3355 11.2865 12.435 10.7082C12.5345 10.1298 12.4691 9.53372 12.247 8.99371C12.0248 8.45371 11.6556 7.99353 11.1851 7.67018C10.7146 7.34682 10.1635 7.17449 9.6 7.17454Z"
        fill="#ABF600"
      />
    </svg>
  );
};
