"use client"
import "@/styles/globals.css";
import { Providers } from "../providers";
import Navigationbar from "@/components/Navigationbar";

export default function RootLayout({ children }) {

  return (
    <html lang="en" className='light'>
      <head>
        <title>WebLibrary</title>
      </head>

      <body>
        <Providers>
          <Navigationbar/>
          {children}
        </Providers>
      </body>
    </html>
  );
}