import { LoadingButton } from "@/components/LoadingButton";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { WixImage } from "@/components/WixImage";
import { useCreateProductReview } from "@/hooks/use-review";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { products } from "@wix/stores";
import { CircleAlert, ImageUpIcon, Loader2, X } from "lucide-react";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { MediaAttachment, useMediaUpload } from "../use-media-upload";
import { StarRatingInput } from "./StarRatingInput";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  title: z
    .string()
    .trim()
    .min(5, "Must be atleast 5 characters")
    .max(100, "Cant be longer than 100 characters")
    .or(z.literal("")),
  body: z
    .string()
    .trim()
    .min(10, "Must be atleast 10 characters")
    .max(3000, "Cant be longer than 3000 characters")
    .or(z.literal("")),
  rating: z.number().int().positive().min(1, "Please rate this product").max(5),
});

type FormValues = z.infer<typeof formSchema>;

interface CreateProductReviewDialogProps {
  product: products.Product;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmitted: () => void;
}
export const CreateProductReviewDialog = ({
  product,
  open,
  onOpenChange,
  onSubmitted,
}: CreateProductReviewDialogProps) => {
  const router = useRouter();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      body: "",
      rating: 0,
      title: "",
    },
  });

  const mutation = useCreateProductReview();
  const { attachments, clearAttachments, removeAttachment, startUpload } =
    useMediaUpload();

  function onSubmit(values: FormValues) {
    if (!product._id) {
      throw new Error("Product id is missing");
    }
    mutation.mutate(
      {
        ...values,
        productId: product._id,
        media: attachments
          .filter((d) => d.url)
          .map((m) => ({
            url: m.url!,
            type: m.file.type.startsWith("image") ? "image" : "video",
          })),
      },
      {
        onSuccess: () => {
          form.reset();
          clearAttachments();
          onSubmitted();
          router.refresh();
        },
      },
    );
  }

  const uploadInProgress = attachments.some((att) => att.state === "uploading");
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Write a review</DialogTitle>
          <DialogDescription>
            Did you like this product ? share your thought with other customers
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-5">
          <div className="space-y-2">
            <Label>Product</Label>
            <div className="flex items-center gap-3">
              <WixImage
                mediaIdentifier={product.media?.mainMedia?.image?.url}
                width={50}
                height={50}
              />
              <span className="font-bold">{product.name}</span>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rating</FormLabel>
                    <FormControl>
                      <StarRatingInput
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="body"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell others about your experience"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                    <FormDescription>
                      Write a detailed review to help other customers
                    </FormDescription>
                  </FormItem>
                )}
              />
              <div className="flex flex-wrap gap-5">
                {attachments.map((a) => (
                  <AttachmentPreview
                    key={a.id}
                    attachment={a}
                    onRemoveClick={removeAttachment}
                  />
                ))}
                <AddMediaButton
                  onFileSelected={startUpload}
                  disabled={
                    attachments.filter((a) => a.state !== "failed").length >= 5
                  }
                />
              </div>
              <LoadingButton
                type="submit"
                loading={mutation.isPending}
                disabled={uploadInProgress}
              >
                Submit
              </LoadingButton>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

function AddMediaButton({
  disabled,
  onFileSelected,
}: {
  onFileSelected: (file: File) => void;
  disabled: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <Button
        variant={"outline"}
        size={"icon"}
        title="Add media"
        type="button"
        disabled={disabled}
        onClick={() => inputRef.current?.click()}
      >
        <ImageUpIcon />
      </Button>

      <input
        type="file"
        ref={inputRef}
        accept="image/*, video/*"
        className="sr-only hidden"
        onChange={(e) => {
          const files = Array.from(e.target.files || []);

          if (files.length) {
            onFileSelected(files[0]);
            e.target.value = "";
          }
        }}
      />
    </>
  );
}

function AttachmentPreview({
  attachment: { file, state, url, id },
  onRemoveClick,
}: {
  attachment: MediaAttachment;
  onRemoveClick: (id: string) => void;
}) {
  return (
    <div
      className={cn(
        "relative size-fit",
        state === "failed" && "outline outline-1 outline-destructive",
      )}
    >
      {file.type.startsWith("image") ? (
        <WixImage
          mediaIdentifier={url}
          scaleToFill={false}
          placeholder={URL.createObjectURL(file)}
          alt={"Attachment preview"}
          className={cn(
            "max-h-24 max-w-24 object-contain",
            !url && "opacity-50",
          )}
        />
      ) : (
        <video
          controls
          className={cn("max-h-24 max-w-24", !url && "opacity-50")}
        >
          <source src={url || URL.createObjectURL(file)} type={file.type} />
        </video>
      )}
      {state === "uploading" && (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform">
          <Loader2 className="animate-spin" />
        </div>
      )}
      {state === "failed" && (
        <div
          title="Failed to upload media"
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform"
        >
          <CircleAlert className="text-destructive" />
        </div>
      )}
      <button
        title="Remove media"
        type="button"
        onClick={() => onRemoveClick(id)}
        className="absolute -right-1.5 -top-1.5 border bg-background"
      >
        <X size={20} />
      </button>
    </div>
  );
}
