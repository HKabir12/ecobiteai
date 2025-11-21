import type { Metadata } from "next";

import "./globals.css";

import { Toaster } from "react-hot-toast";
import NavbarFooterWrapper from "@/components/module/auth/NavbarFooterWrapper";
import NextAuthSessionProvider from "@/components/module/auth/NextAuthSessionProvider";
import { ThemeProvider } from "next-themes";
export const metadata: Metadata = {
  title: "EcoBite",
  description: "EcoBite sustainable eating & tracking",
  icons:{
    icon:[
    {url:"https://i.ibb.co/6d5BnPb/Ecobit-Logo.png" , type:"image/png"}
    ]
    
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <NextAuthSessionProvider>
        <body>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <NavbarFooterWrapper>
              <Toaster position="top-right" reverseOrder={false} />

              {children}
            </NavbarFooterWrapper>
          </ThemeProvider>
        </body>
      </NextAuthSessionProvider>
    </html>
  );
}
