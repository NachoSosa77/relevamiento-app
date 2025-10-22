import "react-toastify/dist/ReactToastify.css";
import "./globals.css";

import Providers from "@/components/providers";
import { ReactNode } from "react";

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className="bg-white mb-8">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
