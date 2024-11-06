import { cn } from "@/lib/utils";

export interface BadgeProps {
  children: React.ReactNode;
  className?: string;
}

export const Badge = ({ children, className }: BadgeProps) => {
  return (
    <span
      className={cn(
        "w-fit bg-primary px-2 py-1 text-xs text-primary-foreground",
        className,
      )}
    >
      {children}
    </span>
  );
};
