/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, useState } from "react";
import ReactCrop, { centerCrop, Crop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { CheckIcon, X } from "lucide-react";

interface ImageModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  selectedFile?: File;
  setCroppedFile: (file: File | undefined) => void;
  filePreview: string;
  field: any;
  fileInputRef: any;
  formSubmitter: any;
}

export default function ImageModal({
  isOpen,
  setIsOpen,
  selectedFile,
  setCroppedFile,
  filePreview,
  field,
  fileInputRef,
  formSubmitter,
}: ImageModalProps) {
  const [crop, setCrop] = useState<Crop>();
  const [croppedResult, setCroppedResult] = useState<File | undefined>(
    undefined
  );

  const aspectRatio = 1;
  const cropRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const dataURLtoFile = (dataurl: string, filename: string) => {
      const arr = dataurl.split(",");
      const mime = arr[0].match(/:(.*?);/)?.[1];
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);

      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      const croppedImage = new File([u8arr], filename, { type: mime });
      setCroppedResult(croppedImage);
    };

    const getCroppedImg = () => {
      const image = cropRef.current;
      if (image && crop) {
        const cropWidth = image.naturalWidth * (crop.width / 100);
        const cropHeight = image.naturalHeight * (crop.height / 100);
        const startX = image.naturalWidth * (crop.x / 100);
        const startY = image.naturalHeight * (crop.y / 100);

        const canvas = document.createElement("canvas");
        canvas.width = cropWidth;
        canvas.height = cropHeight;
        const ctx = canvas.getContext("2d");

        if (ctx) {
          ctx.drawImage(
            image,
            startX,
            startY,
            cropWidth,
            cropHeight,
            0,
            0,
            cropWidth,
            cropHeight
          );
        }

        if (selectedFile) {
          canvas.toBlob(
            (blob) => {
              if (blob) {
                const reader = new FileReader();
                reader.readAsDataURL(blob);
                reader.onloadend = () => {
                  if (reader.result) {
                    dataURLtoFile(reader.result.toString(), selectedFile.name);
                  }
                };
              }
            },
            selectedFile.type,
            1
          );
        }
      }
    };

    if (cropRef.current && crop?.width && crop?.height) {
      getCroppedImg();
    }
  }, [crop, selectedFile, setCroppedFile]);

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;

    const crop = centerCrop(
      makeAspectCrop(
        {
          unit: "%",
          width: 100,
        },
        aspectRatio,
        width,
        height
      ),
      width,
      height
    );
    setCrop(crop);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent
        className="[&_.dialog-close-btn]:hidden"
        onPointerDownOutside={() => {
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        }}
        onEscapeKeyDown={() => {
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        }}
      >
        <DialogHeader>
          <DialogTitle></DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4">
          <ReactCrop
            circularCrop
            keepSelection
            minWidth={400}
            minHeight={400}
            crop={crop}
            onChange={(c, percentCrop) => setCrop(percentCrop)}
            aspect={aspectRatio}
          >
            <img
              className="w-full h-full"
              draggable={false}
              src={filePreview}
              ref={cropRef}
              onLoad={onImageLoad}
              alt="Your uploaded image"
            />
          </ReactCrop>
          <div className="space-x-4">
            <button
              className="bg-green-500 text-white rounded-full p-2"
              onClick={() => {
                if (croppedResult) {
                  setCroppedFile(croppedResult);
                  field.onChange(croppedResult);
                  setIsOpen(false);
                  formSubmitter && formSubmitter();
                }
              }}
            >
              <CheckIcon />
            </button>
            <button
              className="bg-red-400 text-white rounded-full p-2"
              onClick={() => {
                if (fileInputRef.current) {
                  setCroppedFile(undefined);
                  field.onChange(undefined);
                  fileInputRef.current.value = "";
                  setIsOpen(false);
                }
              }}
            >
              <X />
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
