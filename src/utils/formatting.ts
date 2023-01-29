import type { MatchStats, PlayerStats } from "./faceit";

export const formatStats = (match_stats: MatchStats, faceit_id: string) => {
    if (!(match_stats && faceit_id)) return null;
    const formattedStats: FormattedStats[] = [];
    match_stats.rounds.forEach((round) => {
        let team = round.teams.find((team) => {
            return team.players.find((player) => player.player_id === faceit_id);
        });
        if (team) {
            let player = team.players.find((player) => player.player_id === faceit_id);
            let stats = player?.player_stats;
            if (stats) {
                formattedStats.push({
                    kills: parseInt(stats.Kills) || 0,
                    assists: parseInt(stats.Assists) || 0,
                    deaths: parseInt(stats.Deaths) || 0,
                    headshots: parseInt(stats.Headshots) || 0,
                    mvps: parseInt(stats.MVPs) || 0,
                    penta_kills: parseInt(stats["Penta Kills"]) || 0,
                    quadro_kills: parseInt(stats["Quadro Kills"]) || 0,
                    triple_kills: parseInt(stats["Triple Kills"]) || 0,
                    headshots_percentage: parseFloat(stats["Headshots %"]) || 0,
                    kdr: parseFloat(stats["K/D Ratio"]) || 0,
                    krr: parseFloat(stats["K/R Ratio"]) || 0,
                });
            }
        }
    });
    return formattedStats;
};

export interface FormattedStats {
    kills: number;
    assists: number;
    deaths: number;
    headshots: number;
    mvps: number;
    penta_kills: number;
    quadro_kills: number;
    triple_kills: number;
    headshots_percentage: number;
    kdr: number;
    krr: number;
}
