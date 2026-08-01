import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import "../styles/globals.css"
import { Inter } from "next/font/google";
import { cn } from "@lib/lib/utils";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" data-mode="light" className={cn("font-sans", inter.variable)}>
      <body>
        <main className="relative">{props.children}</main>
      </body>
    </html>
  )
}
