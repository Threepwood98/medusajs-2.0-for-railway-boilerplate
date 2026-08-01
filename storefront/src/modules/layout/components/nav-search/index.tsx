"use client"

import { InstantSearch } from "react-instantsearch"
import { useEffect, useRef, useState } from "react"
import { MagnifyingGlassMini, XMarkMini } from "@medusajs/icons"

import { SEARCH_INDEX_NAME, searchClient } from "@lib/search-client"
import SearchBoxWrapper from "@modules/search/components/search-box-wrapper"
import Hits from "@modules/search/components/hits"
import Hit from "@modules/search/components/hit"

const NavSearch = () => {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return

    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false)
      }
    }
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false)
    }

    document.addEventListener("mousedown", handleClickOutside)
    window.addEventListener("keydown", handleEsc)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      window.removeEventListener("keydown", handleEsc)
    }
  }, [open])

  return (
    <div ref={containerRef} className="relative">
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="hover:text-ui-fg-base"
          data-testid="nav-search-link"
          aria-label="Search"
        >
          <MagnifyingGlassMini />
        </button>
      ) : (
        <InstantSearch
          indexName={SEARCH_INDEX_NAME}
          searchClient={searchClient}
        >
          <SearchBoxWrapper>
            {({ value, onChange, onReset, inputRef, placeholder }) => (
              <div className="flex items-center gap-x-2 border border-ui-border-base rounded-rounded px-3 h-8 w-48 sm:w-64 bg-ui-bg-field">
                <MagnifyingGlassMini className="text-ui-fg-subtle shrink-0" />
                <input
                  ref={inputRef}
                  data-testid="nav-search-input"
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  placeholder={placeholder}
                  spellCheck={false}
                  type="search"
                  value={value}
                  onChange={onChange}
                  className="txt-compact-small h-full flex-1 bg-transparent placeholder:text-ui-fg-muted focus:outline-hidden"
                />
                <button
                  onClick={(e) => {
                    onReset()
                    setOpen(false)
                  }}
                  type="button"
                  className="text-ui-fg-subtle shrink-0"
                  aria-label="Close search"
                >
                  <XMarkMini />
                </button>
              </div>
            )}
          </SearchBoxWrapper>

          <div className="absolute top-full right-0 mt-2 w-[90vw] sm:w-[50vw] max-w-md bg-white shadow-elevation-flyout rounded-rounded p-4 z-50">
            <Hits hitComponent={Hit} />
          </div>
        </InstantSearch>
      )}
    </div>
  )
}

export default NavSearch
