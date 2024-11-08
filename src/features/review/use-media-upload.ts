import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

import ky, { HTTPError } from "ky";

export function useMediaUpload() {
  const { toast } = useToast();
  const [attachments, setAttachments] = useState<MediaAttachment[]>([]);

  async function startUpload(file: File) {
    const id = crypto.randomUUID();
    setAttachments((prev) => [
      ...prev,
      {
        file,
        id,
        state: "uploading",
      },
    ]);

    try {
      const { uploadUrl } = await ky
        .get("/api/review-media-upload-url", {
          searchParams: {
            fileName: file.name,
            mimeType: file.type,
          },
        })
        .json<ReviewMediaUploadURLRouteResponse>();

      const {
        file: { url },
      } = await ky
        .put(uploadUrl, {
          timeout: false,
          body: file,
          headers: {
            "Content-type": "application/octet-stream",
          },
          searchParams: {
            filename: file.name,
          },
        })
        .json<{ file: { url: string } }>();

      setAttachments((prev) =>
        prev.map((att) =>
          att.id === id ? { ...att, state: "uploaded" } : att,
        ),
      );
    } catch (error) {
      console.error(error);
      setAttachments((prev) =>
        prev.map((attachment) =>
          attachment.id
            ? {
                ...attachment,
                state: "failed",
              }
            : attachment,
        ),
      );
      toast({
        variant: "destructive",
        description: "Failed to upload attachment",
      });
      if (error instanceof HTTPError) {
        console.error({ httpError: error }); //For debugging
      }
    }
  }

  function removeAttachment(id: string) {
    setAttachments((prev) => prev.filter((attachment) => attachment.id !== id));
  }

  function clearAttachments() {
    setAttachments([]);
  }

  return { attachments, startUpload, removeAttachment, clearAttachments };
}

export interface MediaAttachment {
  id: string;
  file: File;
  url?: string;
  state: "uploading" | "uploaded" | "failed";
}
