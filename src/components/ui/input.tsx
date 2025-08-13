// Caminho: src/components/ui/Input.tsx
import * as React from "react"
import { cn } from "@/lib/utils"

// Define as props que nosso Input pode receber, estendendo as props padrão de um input HTML
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-blue-500",
          className
        )}
        ref={ref} // <<-- A MUDANÇA PRINCIPAL ESTÁ AQUI!
        {...props}
      />
    )
  }
)
// Adiciona um nome de exibição para facilitar a depuração no React DevTools
Input.displayName = "Input"

export { Input }