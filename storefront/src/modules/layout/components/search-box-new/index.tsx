"use client"

import { useRouter } from "next/navigation"
import { InstantSearch, useHits, useSearchBox } from "react-instantsearch"
import { SEARCH_INDEX_NAME, searchClient } from "@lib/search-client"
import { ProductHit } from "@modules/search/components/hit"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@lib/components/ui/combobox"

// Este componente vive ADENTRO de <InstantSearch>, por eso puede
// usar los hooks. No los muevas al componente padre.
const SearchBoxInner = () => {
  const router = useRouter()
  const { query, refine } = useSearchBox()
  const { hits } = useHits<ProductHit>()

  return (
    <Combobox
      items={hits}
      inputValue={query}
      onInputValueChange={(value) => refine(value)}
      itemToStringValue={(hit) => hit.title}
      filter={() => true}
      onValueChange={(hit) => {
        if (hit) router.push(`/products/${hit.handle}`)
      }}
    >
      <ComboboxInput
        placeholder="Buscar productos..."
        className="h-8 w-48 sm:w-64"
        data-testid="nav-search-input"
      />
      <ComboboxContent>
        <ComboboxEmpty>
          {query ? "Sin resultados." : "Escribe para buscar..."}
        </ComboboxEmpty>
        <ComboboxList>
          {(hit) => (
            <ComboboxItem key={hit.id} value={hit}>
              <div className="flex items-center gap-x-3">
                {hit.thumbnail && (
                  <img
                    src={hit.thumbnail}
                    alt={hit.title}
                    className="h-8 w-8 rounded object-cover"
                  />
                )}
                <span>{hit.title}</span>
              </div>
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}

const SearchBoxNew = () => {
  return (
    <div className="hidden small:flex items-center">
      <InstantSearch indexName={SEARCH_INDEX_NAME} searchClient={searchClient}>
        <SearchBoxInner />
      </InstantSearch>
    </div>
  )
}

export default SearchBoxNew
