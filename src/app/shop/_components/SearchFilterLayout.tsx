"use client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProductsSort } from "@/features/wix/api/products";
import { collections } from "@wix/stores";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useOptimistic, useState, useTransition } from "react";

interface SearchFilterLayoutProps extends PropsWithChildren {
  collections: collections.Collection[];
}

export const SearchFilterLayout = ({
  children,
  collections,
}: SearchFilterLayoutProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [optimisticFilters, setOptimisticFilters] = useOptimistic({
    collection: searchParams.getAll("collection"),
    price_min: searchParams.get("price_min") || undefined,
    price_max: searchParams.get("price_max") || undefined,
    sort: searchParams.get("sort") as ProductsSort | undefined,
  });
  const [isPending, startTransition] = useTransition();

  function updateFilters(updates: Partial<typeof optimisticFilters>) {
    const newState = { ...optimisticFilters, ...updates };
    const params = new URLSearchParams(searchParams);

    Object.entries(newState).forEach(([key, value]) => {
      params.delete(key);

      if (Array.isArray(value)) {
        value.forEach((v) => params.append(key, v));
      } else if (value) {
        params.set(key, value);
      }
    });

    params.delete("page");

    startTransition(() => {
      setOptimisticFilters(newState);
      router.push(`?${params.toString()}`);
    });
  }

  return (
    <main className="group flex flex-col items-center justify-center gap-10 px-5 py-10 lg:flex-row lg:items-start">
      <aside
        className="h-fit space-y-5 lg:sticky lg:top-10 lg:w-64"
        data-pending={isPending ? "" : undefined}
      >
        <CollectionsFilter
          collections={collections}
          selectedCollectionIds={optimisticFilters.collection}
          updateCollectionIds={(collectionIds) =>
            updateFilters({ collection: collectionIds })
          }
        />
        <PriceFilter
          minDefaultInput={optimisticFilters.price_min || ""}
          maxDefaultInput={optimisticFilters.price_max || ""}
          updatePriceRange={(price_min, price_max) =>
            updateFilters({
              price_min,
              price_max,
            })
          }
        />
      </aside>
      <div className="w-full max-w-7xl space-y-5">
        <div className="flex justify-center lg:justify-end">
          <SortFilter
            sort={optimisticFilters.sort}
            updateSort={(sort) => updateFilters({ sort })}
          />
        </div>
        {children}
      </div>
    </main>
  );
};

interface CollectionsFilterProps {
  collections: collections.Collection[];
  selectedCollectionIds: string[];
  updateCollectionIds: (collectionIds: string[]) => void;
}
function CollectionsFilter({
  collections,
  selectedCollectionIds,
  updateCollectionIds,
}: CollectionsFilterProps) {
  return (
    <div className="space-y-3">
      <p className="font-bold">Collections</p>
      <ul className="space-y-1.5">
        {collections.map((collection) => {
          const collectionId = collection._id;
          if (!collectionId) {
            return null;
          }

          return (
            <li key={collectionId}>
              <label className="flex cursor-pointer items-center gap-2 font-medium">
                <Checkbox
                  id={collectionId}
                  checked={selectedCollectionIds.includes(collectionId)}
                  onCheckedChange={(checked) => {
                    updateCollectionIds(
                      checked
                        ? [...selectedCollectionIds, collectionId]
                        : selectedCollectionIds.filter(
                            (id) => id !== collectionId,
                          ),
                    );
                  }}
                />

                <span className="line-clamp-1 break-all">
                  {collection.name}
                </span>
              </label>
            </li>
          );
        })}
      </ul>
      {selectedCollectionIds.length > 0 && (
        <button
          onClick={() => updateCollectionIds([])}
          className="text-sm text-primary hover:underline"
        >
          Clear
        </button>
      )}
    </div>
  );
}

interface PriceFilterProps {
  minDefaultInput: string;
  maxDefaultInput: string;
  updatePriceRange: (min?: string, max?: string) => void;
}
function PriceFilter({
  maxDefaultInput,
  minDefaultInput,
  updatePriceRange,
}: PriceFilterProps) {
  const [minInput, setMinInput] = useState(minDefaultInput);
  const [maxInput, setMaxInput] = useState(maxDefaultInput);

  useEffect(() => {
    setMinInput(minDefaultInput || "");
    setMaxInput(maxDefaultInput || "");
  }, [minDefaultInput, maxDefaultInput]);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    updatePriceRange(minInput, maxInput);
  }

  return (
    <div className="space-y-3">
      <p className="font-bold">Price range</p>
      <form className="flex items-center gap-2" onSubmit={onSubmit}>
        <Input
          type="number"
          name="min"
          placeholder="Min"
          min={0}
          value={minInput}
          onChange={(e) => setMinInput(e.target.value)}
          className="w-20"
        />
        <span>-</span>
        <Input
          type="number"
          name="max"
          placeholder="Max"
          value={maxInput}
          onChange={(e) => setMaxInput(e.target.value)}
          className="w-20"
        />

        <Button type="submit">Go</Button>
      </form>

      {(!!minDefaultInput || !!maxDefaultInput) && (
        <button
          onClick={() => updatePriceRange(undefined, undefined)}
          className="text-sm text-primary hover:underline"
        >
          Clear
        </button>
      )}
    </div>
  );
}

interface SortFilterProps {
  sort?: ProductsSort;
  updateSort: (value: ProductsSort) => void;
}

function SortFilter({ sort, updateSort }: SortFilterProps) {
  return (
    <Select value={sort || "last_updated"} onValueChange={updateSort}>
      <SelectTrigger className="w-fit gap-2 text-start">
        <span>
          Sort by : <SelectValue />
        </span>
      </SelectTrigger>

      <SelectContent>
        <SelectItem value="last_updated">Newest</SelectItem>
        <SelectItem value="price_asc">Price (low to high)</SelectItem>
        <SelectItem value="price_desc">Price (high to low)</SelectItem>
      </SelectContent>
    </Select>
  );
}
