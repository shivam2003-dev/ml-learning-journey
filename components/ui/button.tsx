import * as React from "react";
import { cn } from "@/lib/utils";
export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "ghost" };
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant = "ghost", ...props }, ref) => <button ref={ref} className={cn("button", variant, className)} {...props}/>);
Button.displayName = "Button";
