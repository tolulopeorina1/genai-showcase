"use client";

import { Button, cn, Image } from "@heroui/react";
import React from "react";
import { TickCircle } from "iconsax-react";

export type ProductItem = {
  id: string;
  name: string;
  image: string;
};

export type ProductListItemProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "id"
> & {
  isLiked: boolean;
  isPopular?: boolean;
  isLoading?: boolean;
  removeWrapper?: boolean;
  onclickAction: (value: { id: string; name: string }) => void;
} & ProductItem;

const ProductListItem = React.forwardRef<HTMLDivElement, ProductListItemProps>(
  (
    {
      id,
      name,
      isLoading,
      isLiked,
      image,
      removeWrapper,
      className,
      onclickAction,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative flex w-full flex-none flex-col gap-3 cursor-pointer group font-[family-name:var(--font-quick-sand)]",
          {
            "rounded-none bg-background shadow-none": removeWrapper,
          },
          className
        )}
        {...props}
        onClick={() => onclickAction({ id, name })}
      >
        {isLiked && (
          <Button
            isIconOnly
            className="absolute right-2 top-2 z-20 bg-background/60 backdrop-blur-md backdrop-saturate-150 dark:bg-default-100/50"
            radius="full"
            size="sm"
            variant="flat"
          >
            <TickCircle size="20" color="#2572D0" variant="Bold" />
          </Button>
        )}

        <Image
          isBlurred
          isZoomed
          alt={name}
          className="aspect-square w-full hover:scale-110 max-w-full"
          isLoading={isLoading}
          src={image}
          classNames={{ wrapper: "custom_image-wrapper" }}
          style={{ maxWidth: "100%" }}
        />
      </div>
    );
  }
);

ProductListItem.displayName = "ProductListItem";

export default ProductListItem;
