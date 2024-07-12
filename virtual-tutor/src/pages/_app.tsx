// _app.tsx

import "@mantine/core/styles.css";
import { MantineProvider, createTheme } from "@mantine/core";
import type { AppProps } from "next/app";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <MantineProvider defaultColorScheme="dark">
      <Component {...pageProps} />
    </MantineProvider>
  );
}

export default MyApp;
