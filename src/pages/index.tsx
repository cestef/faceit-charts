import {
	Accordion,
	ActionIcon,
	Anchor,
	Box,
	Button,
	Card,
	Code,
	Container,
	Image,
	LoadingOverlay,
	Tooltip as MTooltip,
	Modal,
	NumberInput,
	Skeleton,
	Text,
	TextInput,
	ThemeIcon,
	Title,
	useMantineTheme,
} from "@mantine/core";
import {
	CartesianGrid,
	Legend,
	Line,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import { FormattedStats, formatStats } from "@/utils/formatting";
import { IconHelp, IconSettings } from "@tabler/icons-react";
import { User, getStats, getStatus, getUser } from "@/utils/faceit";
import { useLocalStorage, useMediaQuery } from "@mantine/hooks";

import Head from "next/head";
import Twemoji from "@/components/Twemoji";
import dynamic from "next/dynamic";
import { getFlagEmoji } from "@/utils/flags";
import { showNotification } from "@mantine/notifications";
import { useState } from "react";

const LineChart = dynamic(
	() => import("recharts").then((mod) => mod.LineChart),
	{
		ssr: false,
	},
);

const Home = () => {
	const theme = useMantineTheme();
	const [loading, setLoading] = useState(false);
	const [username, setUsername] = useState("");
	const [faceitUser, setFaceitUser] = useState<User | null>(null);
	const [FAQOpen, setFAQOpen] = useState(false);
	const [faceitClientToken, setFaceitClientToken] = useLocalStorage({
		key: "faceitClientToken",
		defaultValue: "",
		getInitialValueInEffect: false,
	});
	const [askForToken, setAskForToken] = useState(!faceitClientToken);
	const [playerStats, setPlayerStats] = useState<FormattedStats[]>();
	const [last20Stats, setLast20Stats] = useState<{
		winRate: number;
		averageKills: number;
		averageHSPerc: number;
		averageKDRatio: number;
		averageKRRatio: number;
	}>();
	const [matches, setMatches] = useState(20);

	const search = async () => {
		setPlayerStats([]);
		setLast20Stats(undefined);
		setFaceitUser(null);
		setLoading(true);
		if (!faceitClientToken) {
			setAskForToken(true);
			setLoading(false);
			return;
		}
		const faceitUser = await getUser(username, faceitClientToken);
		console.log(faceitUser);
		if (faceitUser) {
			setFaceitUser(faceitUser);
		} else {
			showNotification({
				title: "Error",
				message: "User not found",
				color: "red",
			});
			setLoading(false);
			return;
		}
		const stats = await getStats(faceitUser.id, faceitClientToken, matches);
		console.log(stats);
		const winRate = stats.filter((e) => e.won).length / stats.length;
		const averageKills = stats.reduce((a, b) => a + b.kills, 0) / stats.length;
		const averageHSPerc =
			stats.reduce((a, b) => a + b.hs_percentage, 0) / stats.length;
		const averageKDRatio = stats.reduce((a, b) => a + b.kdr, 0) / stats.length;
		const averageKRRatio = stats.reduce((a, b) => a + b.krr, 0) / stats.length;
		if (
			!(
				winRate &&
				averageKills &&
				averageHSPerc &&
				averageKDRatio &&
				averageKRRatio
			)
		) {
			showNotification({
				title: "Error",
				message: "An error occured while fetching stats",
				color: "red",
			});
			setFaceitUser(null);
			setLoading(false);
			return;
		}
		setLast20Stats({
			winRate,
			averageKills,
			averageHSPerc,
			averageKDRatio,
			averageKRRatio,
		});
		const formattedStats = formatStats(stats);
		setPlayerStats(formattedStats);
		setLoading(false);
	};

	const isBigScreen = useMediaQuery("(min-width: 768px)");

	return (
		<>
			<Head>
				<title>FACEIT Charts</title>
				<meta
					name="description"
					content="Generate beautiful charts for your faceit stats !"
				/>
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link rel="icon" href="/favicon.ico" />
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link rel="preconnect" href="https://fonts.gstatic.com" />
				<link
					href="https://fonts.googleapis.com/css2?family=Play:wght@700&display=swap"
					rel="stylesheet"
				/>
			</Head>
			<main>
				<Modal
					opened={askForToken}
					onClose={() => setAskForToken(false)}
					title={<Title>Enter your FACEIT client token</Title>}
					size={isBigScreen ? "lg" : "md"}
				>
					<TextInput
						label={<Text mb={5}>FACEIT token</Text>}
						placeholder="Token"
						sx={{
							width: "100%",
						}}
						value={faceitClientToken}
						onChange={(e) => setFaceitClientToken(e.currentTarget.value)}
						size="md"
						rightSection={
							<MTooltip
								label={
									<Text>
										You can find your token by logging in to{" "}
										<Anchor href="https://www.faceit.com/en" target="_blank">
											FACEIT
										</Anchor>{" "}
										and opening the developer tools (F12) and going to the{" "}
										<Code>Storage</Code> tab. Then click on <Code>Cookies</Code>
										, select
										<Code>https://www.faceit.com</Code> and copy the{" "}
										<Code>t</Code> value.
									</Text>
								}
								multiline
								width={300}
								closeDelay={1000}
								openDelay={500}
							>
								<IconHelp
									size={20}
									color={theme.colors.gray[7]}
									style={{ cursor: "pointer" }}
								/>
							</MTooltip>
						}
					/>
					<Button
						onClick={() => {
							getStatus(faceitClientToken).then((res) => {
								if (res) {
									setAskForToken(false);
									setFaceitClientToken(faceitClientToken);
								} else {
									showNotification({
										title: "Error",
										message: "Invalid token",
										color: "red",
									});
								}
							});
						}}
						sx={{
							marginTop: "1rem",
						}}
						size="md"
					>
						Ok
					</Button>
				</Modal>
				<Modal
					opened={FAQOpen}
					onClose={() => setFAQOpen(false)}
					title={<Title>FAQ</Title>}
					size={isBigScreen ? "lg" : "md"}
				>
					<Accordion defaultValue="token-usage">
						<Accordion.Item value="token-usage">
							<Accordion.Control>FACEIT Token</Accordion.Control>
							<Accordion.Panel>
								What is my token used for? <br />
								Your FACEIT token is used to fetch your stats. <br />
								It is only stored in your browser and is proxied through the
								API, which is open source and can be found{" "}
								<Anchor
									href="https://github.com/cestef/faceit-charts"
									target="_blank"
								>
									here
								</Anchor>
								. <br />
							</Accordion.Panel>
						</Accordion.Item>
						<Accordion.Item value="token-get">
							<Accordion.Control>How do I get my token?</Accordion.Control>
							<Accordion.Panel>
								You can find your token by logging in to{" "}
								<Anchor href="https://www.faceit.com/en" target="_blank">
									FACEIT
								</Anchor>{" "}
								and opening the developer tools (F12) and going to the{" "}
								<Code>Storage</Code> tab. Then click on <Code>Cookies</Code>,
								select
								<Code>https://www.faceit.com</Code> and copy the <Code>t</Code>{" "}
								value.
							</Accordion.Panel>
						</Accordion.Item>
						<Accordion.Item value="token-why">
							<Accordion.Control>
								Why do I need to provide my token ?
							</Accordion.Control>
							<Accordion.Panel>
								The production FACEIT API does not allow{" "}
								<Anchor href="https://developer.mozilla.org/fr/docs/Web/HTTP/CORS">
									CORS
								</Anchor>{" "}
								requests, and requires authentication for every endpoint, so it
								is not possible to fetch your stats from the client. <br />
								To get around this, the API is hosted on a server and the token
								is proxied through it. <br />
							</Accordion.Panel>
						</Accordion.Item>
					</Accordion>
				</Modal>
				<Container
					sx={{
						display: "flex",
						justifyContent: "center",
						flexDirection: "column",
					}}
					mb={40}
				>
					<Box
						sx={{
							display: "flex",
							alignItems: "center",
							flexDirection: "row",
							gap: "1rem",
						}}
					>
						<Title
							sx={{
								fontSize: "5rem",
								flexGrow: 1,
							}}
						>
							<Text
								component="span"
								sx={{
									fontFamily: "Play",
									fontWeight: 700,
								}}
								variant="gradient"
								gradient={{
									from: "orange",
									to: "red",
								}}
							>
								FACEIT
							</Text>{" "}
							Charts
						</Title>
						<ActionIcon onClick={() => setAskForToken(true)}>
							<ThemeIcon variant="light" size={40} color="gray">
								<IconSettings size={30} style={{ cursor: "pointer" }} />
							</ThemeIcon>
						</ActionIcon>
					</Box>
					<form
						onSubmit={(e) => {
							e.preventDefault();
							if (!faceitClientToken) return setAskForToken(true);
							else if (!username) return;
							search();
						}}
					>
						<Box
							sx={{
								display: "flex",
								flexDirection: "row",
								gap: "1rem",
								alignItems: "center",
							}}
							my={20}
						>
							<Box
								sx={{
									display: "flex",
									flexDirection: "column",
									gap: "1rem",
									flexGrow: 1,
								}}
							>
								<TextInput
									label={<Text mb={5}>FACEIT Username</Text>}
									placeholder="Username"
									sx={{
										width: "100%",
									}}
									size="lg"
									value={username}
									onChange={(e) => setUsername(e.currentTarget.value)}
									radius="md"
									onSubmit={search}
								/>
								<Button
									size="lg"
									type="submit"
									radius="md"
									sx={{
										width: "100%",
									}}
									variant="filled"
								>
									Search
								</Button>
								<NumberInput
									label={<Text mb={5}>Number of matches</Text>}
									placeholder="Number of matches"
									sx={{
										width: "100%",
									}}
									size="lg"
									value={matches}
									onChange={(e) => e && setMatches(e)}
									radius="md"
									onSubmit={search}
								/>
							</Box>
							<Card
								sx={{
									width: 550,
									height: 200,
									display: "flex",
								}}
								radius="md"
								p="md"
							>
								<Box
									sx={{
										display: "flex",
										flexDirection: "row",
										gap: "1rem",
									}}
								>
									{!faceitUser ? (
										<Skeleton
											width={120}
											height={120}
											radius="md"
											animate={loading}
											sx={{
												alignSelf: "center",
											}}
										/>
									) : (
										<Image
											src={faceitUser?.avatar}
											width={120}
											height={120}
											alt="Faceit user avatar"
											radius="md"
											sx={{
												alignSelf: "center",
											}}
										/>
									)}
									<Box
										sx={{
											display: "flex",
											flexDirection: "column",
											gap: "1rem",
										}}
										ml={5}
									>
										<Text
											size={30}
											weight={700}
											component={faceitUser?.nickname ? "a" : "div"}
											href={`https://www.faceit.com/en/players/${faceitUser?.nickname}`}
										>
											{!faceitUser ? (
												<>
													<Skeleton
														width={100}
														height={25}
														animate={loading}
														mt={10}
													/>
												</>
											) : (
												<>
													{faceitUser?.nickname}{" "}
													<Twemoji emoji={getFlagEmoji(faceitUser?.country)} />
												</>
											)}
										</Text>
										<Box
											sx={{
												display: "flex",
												flexDirection: "row",
												gap: "1rem",
												alignItems: "center",
											}}
										>
											{!faceitUser ? (
												<>
													<Skeleton
														width="2.5rem"
														height="2.5rem"
														animate={loading}
														circle
													/>
													<Skeleton width={100} height={25} animate={loading} />
												</>
											) : (
												<>
													<Image
														src={`/faceit/${faceitUser?.games.csgo.skill_level}.svg`}
														width="2.5rem"
														height="2.5rem"
													/>
													<Text size={20} weight={700}>
														{faceitUser?.games.csgo.faceit_elo} Elo
													</Text>
												</>
											)}
										</Box>
										<Box
											sx={{
												display: "flex",
												flexDirection: "row",
												gap: "1rem",
											}}
										>
											<Text size={17} weight={700} px={5}>
												{!last20Stats ? (
													<>
														<Skeleton
															width={50}
															height={20}
															animate={loading}
															mb={5}
														/>{" "}
														Kills
													</>
												) : (
													<>
														{last20Stats?.averageKills.toFixed(0)} <br />
														Kills
													</>
												)}
											</Text>
											<Text size={17} weight={700} px={5}>
												{!last20Stats ? (
													<>
														<Skeleton
															width={50}
															height={20}
															animate={loading}
															mb={5}
														/>{" "}
														Winrate
													</>
												) : (
													<>
														{(last20Stats?.winRate * 100).toFixed(0)}% <br />
														Winrate
													</>
												)}
											</Text>
											<Text size={17} weight={700} px={5}>
												{!last20Stats ? (
													<>
														<Skeleton
															width={50}
															height={20}
															animate={loading}
															mb={5}
														/>{" "}
														K/D
													</>
												) : (
													<>
														{last20Stats?.averageKDRatio.toFixed(2)} <br />
														K/D
													</>
												)}
											</Text>
											<Text size={17} weight={700} px={5}>
												{!last20Stats ? (
													<>
														<Skeleton
															width={50}
															height={20}
															animate={loading}
															mb={5}
														/>{" "}
														HS
													</>
												) : (
													<>
														{last20Stats?.averageHSPerc.toFixed(0)}% <br />
														HS
													</>
												)}
											</Text>
											<Text size={17} weight={700} px={5}>
												{!last20Stats ? (
													<>
														<Skeleton
															width={50}
															height={20}
															animate={loading}
															mb={5}
														/>{" "}
														K/R
													</>
												) : (
													<>
														{last20Stats?.averageKRRatio.toFixed(2)} <br />
														K/R
													</>
												)}
											</Text>
										</Box>
									</Box>
								</Box>
							</Card>
						</Box>
					</form>

					<Card
						mt={20}
						sx={{
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
							flexDirection: "column",
							height: isBigScreen ? 500 : "100vh",
							width: "100%",
							position: "relative",
							filter:
								!loading && (playerStats?.length === 0 || !playerStats)
									? "blur(3px)"
									: "none",
						}}
						radius="md"
						py={15}
					>
						<LoadingOverlay
							visible={loading}
							overlayBlur={3}
							radius="md"
							overlayColor={theme.colors.gray[9]}
							overlayOpacity={0.8}
						/>
						<ResponsiveContainer width="100%" height="100%">
							<LineChart
								data={playerStats
									?.map((stat, index) => ({
										...stat,
										index: index + 1,
									}))
									.reverse()}
								margin={{ top: 20, right: 20, left: -20, bottom: 10 }}
								innerRadius={isBigScreen ? 0 : 50}
							>
								{/* <Brush
									dataKey="index"
									travellerWidth={10}
									startIndex={(playerStats?.length || 0) - 20}
									style={{
										backgroundColor: theme.colors.gray[9],
										borderRadius: "0.5rem",
										border: "none",
									}}
								/> */}
								<XAxis dataKey="index" stroke={theme.colors.gray[0]} />
								<YAxis stroke={theme.colors.gray[0]} />
								<CartesianGrid
									stroke={theme.colors.gray[7]}
									strokeDasharray="3 3"
								/>
								<Tooltip
									contentStyle={{
										backgroundColor: theme.colors.gray[9],
										borderRadius: "0.5rem",
										border: "none",
									}}
									labelFormatter={(value: string) => {
										if (playerStats === undefined) return null;
										return `Match #${value}`;
									}}
									formatter={(value: string, name: string) => {
										if (playerStats === undefined) return ["", ""];
										return [
											value,
											name.slice(0, 1).toUpperCase() + name.slice(1),
										];
									}}
								/>
								<Line
									type="monotone"
									dataKey="kills"
									stroke={theme.colors.orange[5]}
									strokeWidth={3}
									activeDot={{ r: 8 }}
									dot={false}
									label={{
										position: "top",
										formatter: (value: string) => {
											if (playerStats === undefined) return null;
											if (
												parseInt(value) ===
													Math.max.apply(
														Math,
														playerStats.map((stat) => stat.kills),
													) ||
												parseInt(value) ===
													Math.min.apply(
														Math,
														playerStats.map((stat) => stat.kills),
													)
											) {
												return value;
											}

											return null;
										},
										fill: theme.colors.orange[3],
									}}
								/>
								<Line
									type="monotone"
									dataKey="deaths"
									stroke={theme.colors.red[5]}
									strokeWidth={3}
									activeDot={{ r: 8 }}
									dot={false}
									label={{
										position: "top",
										formatter: (value: string) => {
											// Check if the value is an extrema (min or max)
											if (playerStats === undefined) return null;
											if (
												parseInt(value) ===
													Math.max.apply(
														Math,
														playerStats.map((stat) => stat.deaths),
													) ||
												parseInt(value) ===
													Math.min.apply(
														Math,
														playerStats.map((stat) => stat.deaths),
													)
											) {
												return value;
											}

											return null;
										},
										fill: theme.colors.red[3],
									}}
								/>
								<Line
									type="monotone"
									dataKey="assists"
									stroke={theme.colors.blue[5]}
									strokeWidth={3}
									activeDot={{ r: 8 }}
									dot={false}
									label={{
										position: "top",
										formatter: (value: string) => {
											// Check if the value is an extrema (min or max)
											if (playerStats === undefined) return null;
											if (
												parseInt(value) ===
													Math.max.apply(
														Math,
														playerStats.map((stat) => stat.assists),
													) ||
												parseInt(value) ===
													Math.min.apply(
														Math,
														playerStats.map((stat) => stat.assists),
													)
											) {
												return value;
											}

											return null;
										},
										fill: theme.colors.blue[3],
									}}
								/>
								<Line
									type="monotone"
									dataKey="headshots"
									stroke={theme.colors.green[5]}
									strokeWidth={3}
									activeDot={{ r: 8 }}
									dot={false}
									label={{
										position: "top",
										formatter: (value: string) => {
											// Check if the value is an extrema (min or max)
											if (playerStats === undefined) return null;
											if (
												parseInt(value) ===
													Math.max.apply(
														Math,
														playerStats.map((stat) => stat.headshots),
													) ||
												parseInt(value) ===
													Math.min.apply(
														Math,
														playerStats.map((stat) => stat.headshots),
													)
											) {
												return value;
											}

											return null;
										},
										fill: theme.colors.green[3],
									}}
								/>
								<Legend
									verticalAlign="bottom"
									align="center"
									layout="horizontal"
									iconType="circle"
									iconSize={10}
									payload={[
										{
											value: "Kills",
											type: "circle",
											id: "kills",
											color: theme.colors.orange[5],
										},
										{
											value: "Deaths",
											type: "circle",
											id: "deaths",
											color: theme.colors.red[5],
										},
										{
											value: "Assists",
											type: "circle",
											id: "assists",
											color: theme.colors.blue[5],
										},
										{
											value: "Headshots",
											type: "circle",
											id: "headshots",
											color: theme.colors.green[5],
										},
									]}
								/>
							</LineChart>
						</ResponsiveContainer>
					</Card>

					<Box
						mt={10}
						sx={{
							display: "flex",
							flexDirection: "row",
							gap: 5,
						}}
					>
						<Text component="span">Powered by</Text>{" "}
						<Anchor
							href="https://faceit.com/en"
							target="_blank"
							rel="noopener noreferrer"
						>
							FACEIT
						</Anchor>
						{" | "}
						<Anchor onClick={() => setFAQOpen(true)}>FAQ</Anchor>
					</Box>
				</Container>
			</main>
		</>
	);
};

export default Home;
