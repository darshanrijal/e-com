"use client";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Input } from "./ui/input";
import { SearchIcon } from "lucide-react";
import Form from "next/form";

interface SearchFieldProps {
  className?: string;
}

export const SearchField = ({ className }: SearchFieldProps) => {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const q = formData.get("q")?.toString();
    if (!q?.trim()) {
      return;
    }

    router.push(`/shop?q=${encodeURIComponent(q)}`);
  };

  return (
    <Form
      action={"/shop"}
      onSubmit={handleSubmit}
      className={cn("grow", className)}
    >
      <div className="relative">
        <Input name="q" placeholder="Search" className="pe-10" />
        <SearchIcon className="absolute right-3 top-1/2 size-5 -translate-y-1/2 transform text-muted-foreground" />
      </div>
    </Form>
  );
};
