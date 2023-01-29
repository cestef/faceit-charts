import {
	Anchor,
	Box,
	Button,
	Card,
	Container,
	LoadingOverlay,
	Text,
	TextInput,
	Title,
	useMantineTheme,
} from "@mantine/core";
import { CartesianGrid, Legend, Line, Tooltip, XAxis } from "recharts";
import { FormattedStats, formatStats } from "@/utils/formatting";
import {
	getFaceitID,
	getMatchHistory,
	getMatchStats,
	getPlayerStats,
} from "@/utils/faceit";

import Head from "next/head";
import dynamic from "next/dynamic";
import { showNotification } from "@mantine/notifications";
import { useMediaQuery } from "@mantine/hooks";
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
	const [playerStats, setPlayerStats] = useState<FormattedStats[]>();
	const search = async () => {
		setPlayerStats([]);
		setLoading(true);
		const faceitID = await getFaceitID(username);
		if (faceitID) {
			const stats = await getPlayerStats(faceitID);
			console.log(stats);
			const matches = await getMatchHistory(faceitID, 20);
			console.log(matches);
			for (let match of matches) {
				const matchStats = await getMatchStats(match.match_id);
				const formattedStats = formatStats(matchStats, faceitID);
				if (formattedStats)
					setPlayerStats((prev) => [...(prev || []), ...formattedStats]);
			}
			setLoading(false);
		} else {
			showNotification({
				title: "Error",
				message: "User not found",
				color: "red",
			});
			setLoading(false);
		}
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
				<Container
					sx={{
						display: "flex",
						justifyContent: "center",
						flexDirection: "column",
					}}
				>
					<Title
						sx={{
							fontSize: "5rem",
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
					<Box
						sx={{
							display: "flex",
							flexDirection: "column",
							gap: "1rem",
						}}
					>
						<TextInput
							label={<Text mb={5}>FACEIT or Steam Username</Text>}
							placeholder="Username"
							sx={{
								width: "100%",
							}}
							size="lg"
							value={username}
							onChange={(e) => setUsername(e.currentTarget.value)}
							radius="md"
						/>
						<Button
							size="lg"
							onClick={search}
							radius="md"
							sx={{
								width: "100%",
							}}
							variant="filled"
						>
							Search
						</Button>
					</Box>

					<Card
						mt={20}
						sx={{
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
							flexDirection: "column",
							height: "100%",
							width: "fit-content",
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
						<LineChart
							width={isBigScreen ? 900 : 300}
							height={isBigScreen ? 500 : 150}
							data={playerStats
								?.map((stat, index) => ({
									...stat,
									index: index + 1,
								}))
								.reverse()}
							margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
							innerRadius={isBigScreen ? 0 : 50}
						>
							<XAxis dataKey="index" stroke={theme.colors.gray[0]} />
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
					</Card>

					<Box mt={10}>
						<Text component="span">Powered by</Text>{" "}
						<Anchor
							href="https://faceit.com/en"
							target="_blank"
							rel="noopener noreferrer"
						>
							FACEIT
						</Anchor>
					</Box>
				</Container>
			</main>
		</>
	);
};

export default Home;
