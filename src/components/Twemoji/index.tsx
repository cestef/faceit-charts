import React, { memo } from "react";

import { createStyles } from "@mantine/core";
import twemoji from "twemoji";

const useStyles = createStyles((theme) => ({
	emoji: {
		"& img": {
			display: "inline-block",
			width: "auto",
			height: "1em",
			verticalAlign: "-0.125em",
		},
	},
}));

const Twemoji = ({ emoji }: { emoji: string }) => {
	const { classes } = useStyles();
	return (
		<span
			// rome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
			dangerouslySetInnerHTML={{
				__html: twemoji.parse(emoji, {
					folder: "svg",
					ext: ".svg",
					base: "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/",
				}),
			}}
			className={classes.emoji}
		/>
	);
};

export default memo(Twemoji);
