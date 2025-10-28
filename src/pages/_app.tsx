import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { AuthProvider } from "@/contexts/AuthContext";
import { CarrinhoProvider } from "@/contexts/CarrinhoContext";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <CarrinhoProvider>
        <Component {...pageProps} />
      </CarrinhoProvider>
    </AuthProvider>
  );
}
