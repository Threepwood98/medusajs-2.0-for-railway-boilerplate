"use client"

import { usePathname } from "next/navigation"
import { useEffect, useRef, useState } from "react"

import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import DeleteButton from "@modules/common/components/delete-button"
import LineItemOptions from "@modules/common/components/line-item-options"
import LineItemPrice from "@modules/common/components/line-item-price"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "@modules/products/components/thumbnail"
import { Button } from "@lib/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@lib/components/ui/drawer"
import { Badge } from "@lib/components/ui/badge"
import { AvatarBadge } from "@lib/components/ui/avatar"
import { ShoppingCartIcon } from "lucide-react"

const CartDrawer = ({
  cart: cartState,
}: {
  cart?: HttpTypes.StoreCart | null
}) => {
  const [open, setOpen] = useState(false)

  const totalItems =
    cartState?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0
  const subtotal = cartState?.subtotal ?? 0
  const itemRef = useRef<number>(totalItems || 0)

  const pathname = usePathname()

  // abre el drawer solo cuando cambia la cantidad de items,
  // salvo que ya estés en /cart
  useEffect(() => {
    if (itemRef.current !== totalItems && !pathname.includes("/cart")) {
      setOpen(true)
    }
    itemRef.current = totalItems
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalItems])

  return (
    <Drawer open={open} onOpenChange={setOpen} swipeDirection="right">
      <DrawerTrigger
        render={
          <Button
            className="relative flex items-center h-full"
            variant="ghost"
            data-testid="nav-cart-link"
          >
            <ShoppingCartIcon className="size-auto" />
            {totalItems > 0 && (
              <Badge className="absolute top-0 right-0 h-4 min-w-4 rounded-full px-1 bg-destructive">
                {totalItems <= 99 ? totalItems : "99+"}
              </Badge>
            )}
          </Button>
        }
      />

      <DrawerContent className="w-full sm:max-w-md">
        <DrawerHeader>
          <DrawerTitle>Cart</DrawerTitle>
        </DrawerHeader>

        {cartState && cartState.items?.length ? (
          <>
            <div className="flex-1 overflow-y-auto px-4 grid grid-cols-1 gap-y-8 no-scrollbar">
              {cartState.items
                .sort((a, b) =>
                  (a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1
                )
                .map((item) => (
                  <div
                    className="grid grid-cols-[122px_1fr] gap-x-4"
                    key={item.id}
                    data-testid="cart-item"
                  >
                    <LocalizedClientLink
                      href={`/products/${item.variant?.product?.handle}`}
                      className="w-24"
                    >
                      <Thumbnail
                        thumbnail={item.variant?.product?.thumbnail}
                        images={item.variant?.product?.images}
                        size="square"
                      />
                    </LocalizedClientLink>
                    <div className="flex flex-col justify-between flex-1">
                      <div className="flex flex-col flex-1">
                        <div className="flex items-start justify-between">
                          <div className="flex flex-col text-ellipsis whitespace-nowrap mr-4 w-45">
                            <h3 className="text-base-regular overflow-hidden text-ellipsis">
                              <LocalizedClientLink
                                href={`/products/${item.variant?.product?.handle}`}
                                data-testid="product-link"
                              >
                                {item.title}
                              </LocalizedClientLink>
                            </h3>
                            <LineItemOptions
                              variant={item.variant}
                              data-testid="cart-item-variant"
                              data-value={item.variant}
                            />
                            <span
                              data-testid="cart-item-quantity"
                              data-value={item.quantity}
                            >
                              Quantity: {item.quantity}
                            </span>
                          </div>
                          <div className="flex justify-end">
                            <LineItemPrice item={item} style="tight" />
                          </div>
                        </div>
                      </div>
                      <DeleteButton
                        id={item.id}
                        className="mt-1"
                        data-testid="cart-item-remove-button"
                      >
                        Remove
                      </DeleteButton>
                    </div>
                  </div>
                ))}
            </div>

            <div className="px-4 py-4 flex items-center justify-between text-small-regular border-t">
              <span className="text-ui-fg-base font-semibold">
                Subtotal <span className="font-normal">(excl. taxes)</span>
              </span>
              <span
                className="text-large-semi"
                data-testid="cart-subtotal"
                data-value={subtotal}
              >
                {convertToLocale({
                  amount: subtotal,
                  currency_code: cartState.currency_code,
                })}
              </span>
            </div>
          </>
        ) : (
          <div className="flex flex-1 py-16 flex-col gap-y-4 items-center justify-center">
            <div className="bg-gray-900 text-small-regular flex items-center justify-center w-6 h-6 rounded-full text-white">
              <span>0</span>
            </div>
            <span>Your shopping bag is empty.</span>
            <LocalizedClientLink href="/store">
              <span className="sr-only">Go to all products page</span>
              <Button onClick={() => setOpen(false)}>Explore products</Button>
            </LocalizedClientLink>
          </div>
        )}

        <DrawerFooter>
          <LocalizedClientLink href="/cart">
            <Button
              className="w-full"
              size="lg"
              onClick={() => setOpen(false)}
              data-testid="go-to-cart-button"
            >
              Go to cart
            </Button>
          </LocalizedClientLink>
          <DrawerClose render={<Button variant="outline">Cerrar</Button>} />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

export default CartDrawer
