declare type PropsWithChildren<T = unknown> = T & {
  children: React.ReactNode;
};

declare type OWNED_CART_NOT_FOUND_Error = {
  message: "Cart not found: Cannot find cart by ownership";
  details: {
    applicationError: {
      description: "Cannot find cart by ownership";
      code: "OWNED_CART_NOT_FOUND";
      data: object;
    };
  };
};

type SelectedOption = Record<string, string>;
