"use client";
import { CartProvider } from "./CartContext";
import { ReactNode } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <CartProvider>
      {children}
      <ToastContainer
        position="bottom-right" // Position (optional)
        autoClose={3000} // Close after 3 seconds (optional)
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light" // Or "dark" or "colored"
      />
    </CartProvider>
  );
}
