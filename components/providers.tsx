"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MathJaxContext } from "better-react-mathjax";
import { useState } from "react";
const mathJax = { tex: { inlineMath: [["\\(", "\\)"]], displayMath: [["\\[", "\\]"]] } };

export function Providers({children}:{children:React.ReactNode}) { const [client] = useState(() => new QueryClient({defaultOptions:{queries:{staleTime:300_000,retry:1,refetchOnWindowFocus:false}}})); return <QueryClientProvider client={client}><MathJaxContext version={3} config={mathJax}>{children}</MathJaxContext></QueryClientProvider>; }
