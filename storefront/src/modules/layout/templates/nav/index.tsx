import { Suspense } from "react"

import { listRegions } from "@lib/data/regions"
import { StoreRegion } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import SideMenu from "@modules/layout/components/side-menu"
import SearchBoxNew from "@modules/layout/components/search-box-new"
import { getCategoriesList } from "@lib/data/categories"
import { clx } from "@medusajs/ui"
import CategoryBar from "@modules/layout/components/category-bar"
import { Avatar, AvatarFallback, AvatarImage } from "@lib/components/ui/avatar"
import CartDrawer from "@modules/layout/components/cart-drawer"

export default async function Nav() {
  const regions = await listRegions().then((regions: StoreRegion[]) => regions)

  return (
    <header className="sticky top-0 inset-x-0 z-50 h-24 duration-200 bg-primary-foreground shadow-md">
      <nav className="flex flex-col content-container h-24">
        <div className="flex h-16 py-2 items-center justify-between">
          <LocalizedClientLink
            href="/"
            className="h-full"
            data-testid="nav-store-link"
          >
            <img
              src="/GM_LOGO_n2.1.webp"
              alt="Logo"
              className="h-full w-auto object-contain"
            />
          </LocalizedClientLink>

          <SearchBoxNew classname="h-full" />

          <div className="flex h-full gap-1">
            <LocalizedClientLink
              className="flex h-full items-center"
              href="/account"
              data-testid="nav-account-link"
            >
              <Avatar size="lg">
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="@shadcn"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </LocalizedClientLink>

            <CartButton />

            {/* <SideMenu regions={regions} /> */}
          </div>
        </div>
        <div className="flex h-8 items-center">
          <CategoryBar />
        </div>
      </nav>
    </header>
  )
}
