/* eslint-disable @next/next/no-img-element */
import { media as wixMedia } from "@wix/sdk";
import { ImgHTMLAttributes } from "react";

type WixImageProps = Omit<
  ImgHTMLAttributes<HTMLImageElement>,
  "src" | "width" | "height" | "alt"
> & {
  mediaIdentifier?: string;
  placeholder?: string;
  alt?: string | null;
} & (
    | {
        scaleToFill?: true;
        width: number;
        height: number;
      }
    | {
        scaleToFill: false;
      }
  );

export const WixImage = ({
  mediaIdentifier,
  placeholder = "/placeholder.png",
  alt,
  scaleToFill,
  ...props
}: WixImageProps) => {
  let imageUrl: string;

  if (mediaIdentifier) {
    if (scaleToFill || scaleToFill === undefined) {
      const { width, height } = props as { width: number; height: number };
      imageUrl = wixMedia.getScaledToFillImageUrl(
        mediaIdentifier,
        width,
        height,
        {},
      );
    } else {
      imageUrl = wixMedia.getImageUrl(mediaIdentifier).url;
    }
  } else {
    imageUrl = placeholder;
  }

  return <img src={imageUrl} alt={alt || ""} {...props} />;
};
