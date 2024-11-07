import {
  addToCart,
  AddToCartValues,
  getCart,
  removeCartItem,
  updateCartItemQuantity,
  UpdateCartItemQuantityValues,
} from "@/features/wix/api/cart";
import { wixBrowserClient } from "@/lib/wix-client-browser";
import {
  MutationKey,
  QueryKey,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { currentCart } from "@wix/ecom";
import { toast } from "./use-toast";

const queryKey: QueryKey = ["cart"];
const mutationKey: MutationKey = ["useUpdateCartItemQuantity"];

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

export function useUpdateCartItemQuantity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey,
    mutationFn: (values: UpdateCartItemQuantityValues) =>
      updateCartItemQuantity(wixBrowserClient, values),
    onMutate: async ({ productId, newQuantity }) => {
      await queryClient.cancelQueries({ queryKey });
      const prevState = queryClient.getQueryData<currentCart.Cart>(queryKey);
      queryClient.setQueryData<currentCart.Cart>(queryKey, (oldData) => ({
        ...oldData,
        lineItems: oldData?.lineItems?.map((lineItem) =>
          lineItem._id === productId
            ? {
                ...lineItem,
                quantity: newQuantity,
              }
            : lineItem,
        ),
      }));
      return { prevState };
    },
    onError(error, _, context) {
      console.error(error);
      queryClient.setQueryData(queryKey, context?.prevState);
      toast({
        variant: "destructive",
        description: "Something went wrong plese try again",
      });
    },
    onSettled() {
      if (queryClient.isMutating({ mutationKey }) === 1) {
        queryClient.invalidateQueries({ queryKey });
      }
    },
  });
}

export function useRemoveCartItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (productId: string) =>
      removeCartItem(wixBrowserClient, productId),
    async onMutate(productId) {
      await queryClient.cancelQueries({ queryKey });
      const prevState = queryClient.getQueryData<currentCart.Cart>(queryKey);
      queryClient.setQueryData<currentCart.Cart>(queryKey, (oldData) => ({
        ...oldData,
        lineItems: oldData?.lineItems?.filter((item) => item._id !== productId),
      }));
      return { prevState };
    },
    onError(error, _, context) {
      console.error(error);
      queryClient.setQueryData(queryKey, context?.prevState);
      toast({
        variant: "destructive",
        description: "Something went wrong plese try again",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
}
