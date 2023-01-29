import { LoadingOverlay, MantineProvider } from "@mantine/core";
import { useEffect, useState } from "react";

import type { AppProps } from "next/app";
import { NotificationsProvider } from "@mantine/notifications";
import theme from "@/styles/theme";

export default function App({ Component, pageProps }: AppProps) {
	useEffect(() => {
		if (typeof window !== "undefined") {
			const loader = document.getElementById("globalLoader");
			if (loader) loader.style.display = "none";
		}
	}, []);

	return (
		<MantineProvider
			withGlobalStyles
			withNormalizeCSS
			theme={{
				...theme,
				colorScheme: "dark",
			}}
		>
			<NotificationsProvider position="bottom-center">
				<Component {...pageProps} />
			</NotificationsProvider>
		</MantineProvider>
	);
}
