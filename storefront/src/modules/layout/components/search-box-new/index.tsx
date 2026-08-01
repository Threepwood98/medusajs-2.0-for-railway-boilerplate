"use client"

import * as React from "react"
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

const SearchBoxInner = ({
  open,
  setOpen,
}: {
  open: boolean
  setOpen: (v: boolean) => void
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
          <InputGroup className="w-48 sm:w-64">
            <InputGroupInput
              placeholder="Buscar productos..."
              value={query}
              onChange={(e) => refine(e.currentTarget.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  handleSearch()
                }
              }}
              data-testid="nav-search-input"
            />
            <InputGroupAddon align="inline-end">
              <InputGroupButton
                variant="secondary"
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  handleSearch()
                }}
                aria-label="Buscar"
              >
                <MagnifyingGlassMini />
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
        {!query && (
          <p className="p-4 text-sm text-ui-fg-subtle">
            Escribe para buscar...
          </p>
        )}
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

const SearchBoxNew = () => {
  const [open, setOpen] = React.useState(false)

  return (
    <div className="hidden small:flex items-center">
      <InstantSearch indexName={SEARCH_INDEX_NAME} searchClient={searchClient}>
        <SearchBoxInner open={open} setOpen={setOpen} />
      </InstantSearch>
    </div>
  )
}

export default SearchBoxNew
