"use client";

import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  /* useEffect(() => {
    const appElement = document.getElementById('__next');
    if (appElement) {
      Modal.setAppElement(appElement);
    } else {
      console.error('Element with ID "__next" not found.');
    }
  }, []); */
  
  return (
    <html lang="en">
      {/*
        <head /> will contain the components returned by the nearest parent
        head.js. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <body className={`bg-white `}>{children}</body>
    </html>
  );
}
