import { Head, Html, Main, NextScript } from "next/document";

import loader from "@/styles/loader";

export default function Document() {
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
