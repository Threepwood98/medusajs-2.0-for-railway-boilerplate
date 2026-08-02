"use client"

import { useRouter } from "next/navigation"
import { InstantSearch, useHits, useSearchBox } from "react-instantsearch"
import { MagnifyingGlassMini } from "@medusajs/icons"

import { SEARCH_INDEX_NAME, searchClient } from "@lib/search-client"
import { ProductHit } from "@modules/search/components/hit"
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
  InputGroupButton,
} from "@lib/components/ui/input-group"
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@lib/components/ui/popover"
import { useState } from "react"
import { SearchIcon } from "lucide-react"
import { cn } from "@lib/lib/utils"
import { Separator } from "@lib/components/ui/separator"

const SearchBoxInner = ({
  open,
  setOpen,
  classname = "",
}: {
  open: boolean
  setOpen: (v: boolean) => void
  classname?: string
}) => {
  const router = useRouter()
  const { query, refine } = useSearchBox()
  const { hits } = useHits<ProductHit>()

  const goToProduct = (handle: string) => {
    router.push(`/products/${handle}`)
    refine("")
    setOpen(false)
  }

  const handleSearch = () => {
    if (!query.trim()) return
    router.push(`/results/${encodeURIComponent(query.trim())}`)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        nativeButton={false}
        render={
          <InputGroup className={cn("w-auto", classname)}>
            <InputGroupInput
              placeholder="Buscar..."
              value={query}
              onChange={(e) => refine(e.currentTarget.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  handleSearch()
                }
              }}
              data-testid="nav-search-input"
              className="h-full w-full"
            />
            <InputGroupAddon
              align="inline-end"
              className="h-full w-1/4 py-0.5 px-1.5"
            >
              <InputGroupButton
                variant="default"
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  handleSearch()
                }}
                aria-label="Buscar"
                className="h-full w-full rounded-2xl"
              >
                <SearchIcon className="size-auto" />
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        }
      />

      <PopoverContent
        align="start"
        sideOffset={8}
        className="w-48 sm:w-64 p-2 max-h-[70vh] overflow-y-auto"
        initialFocus={false}
      >
        {query && hits.length === 0 && (
          <p className="p-4 text-sm text-ui-fg-subtle">Sin resultados.</p>
        )}
        <ul className="flex flex-col">
          {hits.map((hit) => (
            <li key={hit.id}>
              <button
                type="button"
                onClick={() => goToProduct(hit.handle)}
                className="flex w-full items-center gap-x-3 rounded-md p-2 text-left hover:bg-accent"
                data-testid="search-result"
              >
                {hit.thumbnail && (
                  <img
                    src={hit.thumbnail}
                    alt={hit.title}
                    className="h-10 w-10 shrink-0 rounded object-cover"
                  />
                )}
                <span className="text-sm">{hit.title}</span>
              </button>
            </li>
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  )
}

const SearchBoxNew = ({ classname = "" }: { classname?: string }) => {
  const [open, setOpen] = useState(false)

  return (
    <InstantSearch indexName={SEARCH_INDEX_NAME} searchClient={searchClient}>
      <SearchBoxInner open={open} setOpen={setOpen} classname={classname} />
    </InstantSearch>
  )
}

export default SearchBoxNew
