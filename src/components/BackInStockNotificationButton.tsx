import { products } from "@wix/stores";
import { Button, ButtonProps } from "./ui/button";
import { useCreateBackInStockNotificationRequest } from "@/hooks/use-back-in-stock";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { LoadingButton } from "./LoadingButton";
import { env } from "@/env";

interface BackInStockNotificationButtonProps extends ButtonProps {
  product: products.Product;
  selectedOption: SelectedOption;
}

const formSchema = z.object({
  email: z
    .string()
    .min(1, "Enter your email")
    .email({ message: "Enter a valid email" })
    .trim(),
});

type FormValues = z.infer<typeof formSchema>;

export const BackInStockNotificationButton = ({
  product,
  selectedOption,
  ...props
}: BackInStockNotificationButtonProps) => {
  const mutation = useCreateBackInStockNotificationRequest();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  function onSubmit({ email }: FormValues) {
    mutation.mutate({
      email,
      itemUrl: env.NEXT_PUBLIC_BASE_URL + "/products/" + product.slug,
      product,
      selectedOptions: selectedOption,
    });
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button {...props}>Notify when available</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Notfiy when available</DialogTitle>
          <DialogDescription>
            Enter your email address and we will let you know and we will let
            you know when its back in stock
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <LoadingButton type="submit" loading={mutation.isPending}>
              Notify me
            </LoadingButton>
          </form>
        </Form>
        {mutation.isSuccess && (
          <p className="py-2.5 text-green-500">
            Thank you! We will notify you when the product is back in stock
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
};
