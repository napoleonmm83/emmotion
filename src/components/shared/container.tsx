import { cn } from "@/lib/utils";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  size?: "default" | "small" | "large";
  as?: "div" | "section" | "article" | "main";
}

export function Container({
  children,
  className,
  size = "default",
  as: Component = "div",
}: ContainerProps) {
  return (
    <Component
      className={cn(
        "mx-auto px-4 md:px-6 lg:px-8",
        {
          "max-w-5xl": size === "small",
          "max-w-7xl": size === "default",
          "max-w-[1400px]": size === "large",
        },
        className
      )}
    >
      {children}
    </Component>
  );
}
