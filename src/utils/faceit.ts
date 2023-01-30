import axios from "axios";

const client = axios.create({ baseURL: "/api" });

export const getStatus = async (token: string): Promise<boolean> => {
    return client
        .get("/status", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then((res) => {
            return res.status === 200;
        })
        .catch((err) => {
            console.log(err);
            return false;
        });
};
export interface User {
    id: string;
    activated_at: string;
    avatar: string;
    country: string;
    cover_image_url: string;
    created_at: string;
    flag: string;
    friends: string[];
    games: {
        csgo: {
            game_id: string;
            game_name: string;
            faceit_elo: number;
            region: string;
            region_updated_at: string;
            skill_level: number;
            skill_level_label: string;
            tags: string[];
            elo_refreshed_by_user_at: string;
        };
    };
    gender: string;
    guest_info: {};
    matching_sound: string;
    memberships: string[];
    nickname: string;
    phone_verified: boolean;
    registration_status: string;
    settings: {
        language: string;
    };
    socials: {
        twitter: {
            value: string;
        };
    };
    status: string;
    streaming: {
        twitch_id: string;
    };
    tags: string[];
    updated_by: string;
    user_type: string;
    verified: boolean;
    version: number;
    website: string;
    platforms: {
        steam: {
            id: string;
            nickname: string;
            id64: string;
        };
    };
}

export const getUser = async (username: string, token: string): Promise<User> => {
    return client
        .get("/user", {
            params: {
                username,
            },
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then((res) => {
            return res.data;
        })
        .catch((err) => {
            console.log(err);
            return null;
        });
};

/**
{
  "_id": {
    "matchId": "63d7f0350a4d3f0008ba4441",
    "playerId": "962ffac5-dd86-4c56-84ab-3222f25310a2"
  },
  "created_at": 1675096117967,
  "updated_at": 1675096207827,
  "i9": "2", // MVPs
  "nickname": "cistef",
  "i10": "1",  // Won ?
  "i13": "10", // Headshots
  "i15": "0",
  "i6": "22", // Kills
  "i14": "2",
  "i7": "5", // Assists
  "i16": "0",
  "i8": "16", // Deaths
  "playerId": "962ffac5-dd86-4c56-84ab-3222f25310a2",
  "c3": "0.85", // K/R
  "c2": "1.38", // K/D
  "c4": "45", // HS%
  "c1": "1", 
  "i19": "0",
  "teamId": "330db99c-d61b-4c0e-aea8-ac595741829b",
  "i3": "13", // First half score
  "i4": "3", // Second half score
  "i5": "team_61tEZcan", // Team name
  "premade": false,
  "c5": "16", // Final score
  "bestOf": "2",
  "competitionId": "a3c75828-7f0f-4940-adb9-994b4b389070",
  "date": 1675096117000,
  "game": "csgo",
  "gameMode": "5v5",
  "i0": "EU", // Region
  "i1": "de_dust2", // Map
  "i12": "26", // Total rounds
  "i18": "16 / 10", // Score
  "i2": "330db99c-d61b-4c0e-aea8-ac595741829b",
  "matchId": "1-dc2fb463-84f8-4613-aeab-fd69d4d91e6c",
  "matchRound": "1",
  "played": "1",
  "status": "APPLIED",
  "elo": "1160"
}
 */
// Rename fields to comprehensible names
export interface Stat {
    created_at: number;
    updated_at: number;
    kills: number;
    nickname: string;
    assists: number;
    deaths: number;
    headshots: number;
    mvps: number;
    score: number;
    kdr: number;
    krr: number;
    hs_percentage: number;
    team_name: string;
    first_half_score: number;
    second_half_score: number;
    region: string;
    map: string;
    total_rounds: number;
    match_round: number;
    match_id: string;
    player_id: string;
    team_id: string;
    competition_id: string;
    date: number;
    game: string;
    game_mode: string;
    premade: boolean;
    best_of: string;
    status: string;
    elo: number;
    won: boolean;
}

export const getStats = async (
    userID: string,
    token: string,
    size: number = 20,
    game: string = "csgo"
): Promise<Stat[]> => {
    return client
        .get("/stats", {
            params: {
                game,
                size,
                userID,
            },
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then((res) => {
            // rome-ignore lint/suspicious/noExplicitAny: <explanation>
            return res.data.map((stat: any) => ({
                created_at: stat.created_at,
                updated_at: stat.updated_at,
                kills: parseInt(stat.i6),
                nickname: stat.nickname,
                assists: parseInt(stat.i7),
                deaths: parseInt(stat.i8),
                headshots: parseInt(stat.i13),
                mvps: parseInt(stat.i9),
                score: parseInt(stat.c5),
                kdr: parseFloat(stat.c2),
                krr: parseFloat(stat.c3),
                hs_percentage: parseInt(stat.c4.replace("%", "")),
                team_name: stat.i5,
                first_half_score: parseInt(stat.i3),
                second_half_score: parseInt(stat.i4),
                region: stat.i0,
                map: stat.i1,
                total_rounds: parseInt(stat.i12),
                match_round: stat.matchRound,
                match_id: stat.matchId,
                player_id: stat.playerId,
                team_id: stat.teamId,
                competition_id: stat.competitionId,
                date: parseInt(stat.date),
                game: stat.game,
                game_mode: stat.gameMode,
                premade: stat.premade,
                best_of: parseInt(stat.bestOf),
                status: stat.status,
                elo: parseInt(stat.elo),
                won: stat.i10 === "1",
            }));
        })
        .catch((err) => {
            console.log(err);
            return null;
        });
};
