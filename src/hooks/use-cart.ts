import { addToCart, AddToCartValues, getCart } from "@/features/wix/api/cart";
import { wixBrowserClient } from "@/lib/wix-client-browser";
import {
  QueryKey,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { currentCart } from "@wix/ecom";
import { toast } from "./use-toast";

const queryKey: QueryKey = ["cart"];

export function useCart(initialData: currentCart.Cart | null) {
  const query = useQuery({
    queryKey,
    queryFn: () => getCart(wixBrowserClient),
    initialData,
  });
  return query;
}

export function useAddItemToCart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (values: AddToCartValues) =>
      addToCart(wixBrowserClient, values),
    async onSuccess(data) {
      toast({ description: "Item added to cart" });
      await queryClient.cancelQueries({ queryKey });
      queryClient.setQueryData<currentCart.Cart>(queryKey, data.cart);
    },
    onError(error, variables, context) {
      console.error(error);
      toast({
        variant: "destructive",
        description: "Failed to add item to cart, Please try again",
      });
    },
  });
}
