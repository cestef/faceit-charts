import type { AppProps } from "next/app";
import { MantineProvider } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import { rtlCache } from "../utils/rtl-cache";
import theme from "@/styles/theme";
import { useEffect } from "react";

export default function App({ Component, pageProps }: AppProps) {
	useEffect(() => {
		if (typeof window !== "undefined") {
			const loader = document.getElementById("globalLoader");
			if (loader) loader.style.display = "none";
		}
	}, []);

	return (
		<div dir="ltr">
			<MantineProvider
				withGlobalStyles
				withNormalizeCSS
				theme={{
					...theme,
					colorScheme: "dark",
				}}
				emotionCache={rtlCache}
			>
				<NotificationsProvider position="bottom-center">
					<Component {...pageProps} />
				</NotificationsProvider>
			</MantineProvider>
		</div>
	);
}
