import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import React from "react";

const textVariants = cva("font-sans", {
    variants: {
        variant: {
            h1: "font-display font-bold uppercase tracking-wider text-6xl md:text-8xl",
            h2: "font-display font-bold uppercase tracking-wider text-4xl md:text-5xl",
            h3: "font-display font-bold text-xl truncate",
            h4: "font-display font-bold text-lg",
            body: "text-base",
            label: "text-xs uppercase tracking-wider font-medium",
            stat: "font-display text-xl",
            statValue: "font-display text-3xl",
        },
        color: {
            default: "text-foreground",
            muted: "text-muted-foreground",
            accent: "text-accent",
            primary: "text-primary",
            success: "text-success",
            destructive: "text-destructive",
        },
        glow: {
            none: "",
            cyan: "glow-text-cyan",
            amber: "glow-text-amber",
        },
    },
    defaultVariants: {
        variant: "body",
        color: "default",
        glow: "none",
    },
});

interface TextProps
    extends Omit<React.HTMLAttributes<HTMLParagraphElement>, "color">,
    VariantProps<typeof textVariants> {
    as?: "h1" | "h2" | "h3" | "h4" | "p" | "span" | "div";
}

export const Text = React.forwardRef<HTMLParagraphElement, TextProps>(
    ({ className, variant, color, glow, as: Component = "p", ...props }, ref) => {
        return (
            <Component
                ref={ref}
                className={cn(textVariants({ variant, color, glow, className }))}
                {...props}
            />
        );
    }
);

Text.displayName = "Text";
