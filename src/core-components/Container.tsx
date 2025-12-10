import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import React from "react";

const containerVariants = cva(
    "mx-auto w-full px-4 md:px-6 lg:px-8",
    {
        variants: {
            size: {
                default: "max-w-7xl",
                sm: "max-w-3xl",
                lg: "max-w-7xl",
                xl: "max-w-[1400px]",
                full: "max-w-full",
            },
        },
        defaultVariants: {
            size: "default",
        },
    }
);

interface ContainerProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof containerVariants> { }

export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
    ({ className, size, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(containerVariants({ size, className }))}
                {...props}
            />
        );
    }
);

Container.displayName = "Container";
