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
declare type BACK_IN_STOCK_NOTIFICATION_REQUEST_ALREADY_EXIST = {
  message: "Notification request already exists.";
  details: {
    applicationError: {
      description: "Notification request already exists.";
      code: "BACK_IN_STOCK_NOTIFICATION_REQUEST_ALREADY_EXISTS";
      data: object;
    };
  };
};

type SelectedOption = Record<string, string>;

type ReviewMediaUploadURLRouteResponse = {
  uploadUrl: string;
};
