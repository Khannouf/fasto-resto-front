import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { CartProvider } from "./context/cartContext.tsx";
import { UserProvider } from "./context/userContext.tsx";
import { QueryClient, QueryClientProvider } from 'react-query'
import { Toaster } from "./components/ui/toaster.tsx";

const queryClient = new QueryClient()

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <UserProvider>
          <Toaster />
          <App />
        </UserProvider>
      </CartProvider>
    </QueryClientProvider>
  </StrictMode>
);


