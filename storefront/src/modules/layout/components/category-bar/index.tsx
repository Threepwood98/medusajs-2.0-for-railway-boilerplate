import { Button } from "@lib/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@lib/components/ui/navigation-menu"
import { getCategoriesList } from "@lib/data/categories"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default async function CategoryBar() {
  const { product_categories } = await getCategoriesList(0, 6)

  return (
    <NavigationMenu className="h-full w-full max-w-none">
      <NavigationMenuList className="justify-start">
        {product_categories
          ?.filter((c) => !c.parent_category)
          .slice(0, 6)
          .map((c) => {
            const children = c.category_children?.map((child) => ({
              name: child.name,
              handle: child.handle,
              id: child.id,
            }))

            if (!children || children.length === 0) {
              return (
                <NavigationMenuItem key={c.id}>
                  <NavigationMenuLink
                    // className={navigationMenuTriggerStyle()}
                    render={
                      <LocalizedClientLink
                        href={`/categories/${c.handle}`}
                        data-testid="category-link"
                      >
                        {c.name}
                      </LocalizedClientLink>
                    }
                  />
                </NavigationMenuItem>
              )
            }

            return (
              <NavigationMenuItem key={c.id}>
                <NavigationMenuTrigger>{c.name}</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-55 gap-1">
                    {children.map((child) => (
                      <li key={child.id}>
                        <NavigationMenuLink
                          render={
                            <LocalizedClientLink
                              href={`/categories/${child.handle}`}
                              data-testid="category-link"
                            >
                              {child.name}
                            </LocalizedClientLink>
                          }
                        />
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            )
          })}
      </NavigationMenuList>
    </NavigationMenu>
  )
}
