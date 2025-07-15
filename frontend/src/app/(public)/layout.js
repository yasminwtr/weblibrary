import "@/styles/globals.css";
import { Providers } from "../providers";

export default function RootLayout({ children }) {

  return (
    <html lang="pt-BR" className='light'>
      <head>
        <title>WebLibrary</title>
      </head>

      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
