import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import React from "react";

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 font-display uppercase tracking-wider font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:pointer-events-none",
    {
        variants: {
            variant: {
                primary:
                    "bg-primary/20 text-primary border border-primary/40 hover:bg-primary/30 hover:border-primary/60 shadow-[0_0_10px_hsl(var(--primary)/0.1)] hover:shadow-[0_0_15px_hsl(var(--primary)/0.2)]",
                secondary:
                    "bg-secondary text-secondary-foreground border border-border hover:bg-secondary/80",
                ghost:
                    "text-muted-foreground hover:text-foreground hover:bg-muted",
                destructive:
                    "bg-destructive/20 text-destructive border border-destructive/40 hover:bg-destructive/30",
                outline:
                    "border border-border text-foreground hover:border-primary/50 hover:text-primary bg-transparent",
            },
            size: {
                sm: "px-3 py-1.5 text-xs rounded-md",
                md: "px-4 py-2 text-sm rounded-lg",
                lg: "px-6 py-3 text-base rounded-lg",
            },
        },
        defaultVariants: {
            variant: "primary",
            size: "md",
        },
    }
);

interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, ...props }, ref) => (
        <button
            ref={ref}
            className={cn(buttonVariants({ variant, size, className }))}
            {...props}
        />
    )
);

Button.displayName = "Button";

export { buttonVariants };
