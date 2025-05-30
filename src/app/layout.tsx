"use client";

import { persistor, store } from "@/redux/store";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { PersistGate } from "redux-persist/integration/react";
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

      <body className="bg-white mb-8">
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <ToastContainer autoClose={5000}/>
            {children}
          </PersistGate>
        </Provider>
      </body>
    </html>
  );
}
