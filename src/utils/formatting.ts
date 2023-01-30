import type { Stat } from "./faceit";

export const formatStats = (match_stats: Stat[]) => {
    const formattedStats: FormattedStats[] = [];
    match_stats.forEach((match_stat) => {
        formattedStats.push({
            kills: match_stat.kills,
            assists: match_stat.assists,
            deaths: match_stat.deaths,
            headshots: match_stat.headshots,
            mvps: match_stat.mvps,
            headshots_percentage: match_stat.hs_percentage,
            kdr: match_stat.kdr,
            krr: match_stat.krr,
        });
    });
    return formattedStats;
};

export interface FormattedStats {
    kills: number;
    assists: number;
    deaths: number;
    headshots: number;
    mvps: number;
    headshots_percentage: number;
    kdr: number;
    krr: number;
}
