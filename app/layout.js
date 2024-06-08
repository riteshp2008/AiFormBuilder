import { Inter } from "next/font/google";
import "./globals.css";
import Header from "./_components/Header";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "AI Form Builder",
  favicon: "./favicon.ico",
  description:
    "Create your AI form in seconds. Just fill out the form and we will create the form for you. You can use the form to collect data from your users.",
  type: "website",
  keywords: ["AI form builder", "form builder", "AI"],
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en" data-theme="winter">
        <body className={inter.className}>
          <Header />
          {children}
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
