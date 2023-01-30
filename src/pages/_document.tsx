import Document, {
	DocumentContext,
	Head,
	Html,
	Main,
	NextScript,
} from "next/document";
import { ServerStyles, createStylesServer } from "@mantine/next";

import loader from "@/styles/loader";
import { rtlCache } from "../utils/rtl-cache";

const stylesServer = createStylesServer(rtlCache);
export default class _Document extends Document {
	static async getInitialProps(ctx: DocumentContext) {
		const initialProps = await Document.getInitialProps(ctx);

		return {
			...initialProps,
			styles: [
				initialProps.styles,
				<ServerStyles
					html={initialProps.html}
					server={stylesServer}
					key="styles"
				/>,
			],
		};
	}
	render(): JSX.Element {
		return (
			<Html lang="en">
				<Head />
				<head>
					<style>{loader}</style>
				</head>
				<body>
					<div id={"globalLoader"}>
						<div className="loader">
							<div />
							<div />
						</div>
					</div>{" "}
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}
