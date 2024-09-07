"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "~/components/ui/button"
import { SearchIcon, BookIcon, SettingsIcon, UserIcon, LayersIcon } from "lucide-react"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "~/components/ui/command"
import { searchData, SearchItem } from "~/lib/search-data"

export function GlobalSearch() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const router = useRouter()

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const getFilteredResults = (query: string): SearchItem[] => {
    if (query === "") {
      return []
    }
    return searchData.filter(
      (item) =>
        item.keywords.some((keyword) =>
          keyword.toLowerCase().includes(query.toLowerCase())
        ) ||
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase())
    )
  }

  const filteredResults = getFilteredResults(query)

  const groupedResults = filteredResults.reduce((acc, item) => {
    const category = item.category || "Other"
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(item)
    return acc
  }, {} as Record<string, SearchItem[]>)

  const handleSelect = (url: string) => {
    setOpen(false)
    router.push(url)
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Assignments":
        return <BookIcon className="mr-2 h-4 w-4" />
      case "Settings":
        return <SettingsIcon className="mr-2 h-4 w-4" />
      case "Tutors":
        return <UserIcon className="mr-2 h-4 w-4" />
      case "Units":
        return <LayersIcon className="mr-2 h-4 w-4" />
      default:
        return <SearchIcon className="mr-2 h-4 w-4" />
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (!newOpen) {
      setQuery("")
    }
  }

  return (
    <>
      <Button
        variant="outline"
        className="w-full justify-start text-sm text-muted-foreground sm:w-64"
        onClick={() => setOpen(true)}
      >
        <SearchIcon className="mr-2 h-4 w-4" />
        Search...
        <CommandShortcut>⌘K</CommandShortcut>
      </Button>
      <CommandDialog open={open} onOpenChange={handleOpenChange}>
        <CommandInput
          placeholder="Type to search across all areas..."
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          {query === "" ? (
            <CommandEmpty>Start typing to search...</CommandEmpty>
          ) : filteredResults.length === 0 ? (
            <CommandEmpty>
              No results found for &quot;{query}&quot;. Try a different search term.
            </CommandEmpty>
          ) : (
            Object.entries(groupedResults).map(([category, items]) => (
              <CommandGroup key={category} heading={category}>
                {items.map((item: SearchItem) => (
                  <CommandItem
                    key={item.url}
                    onSelect={() => handleSelect(item.url)}
                    className="py-2"
                  >
                    <div className="flex items-center">
                      {getCategoryIcon(category)}
                      <div>
                        <div className="font-medium">{item.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {item.description}
                        </div>
                      </div>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            ))
          )}
        </CommandList>
      </CommandDialog>
    </>
  )
}