import axios from "axios";

const client = axios.create({ baseURL: "/api" });

export const getFaceitID = async (username: string): Promise<string | null> => {
    return client
        .get("/search", { params: { username } })
        .then((res) => {
            return res.data.player_id;
        })
        .catch((err) => {
            console.log(err);
            return null;
        });
};

/*
{
  "player_id": "962ffac5-dd86-4c56-84ab-3222f25310a2",
  "game_id": "csgo",
  "lifetime": {
    "Total Headshots %": "7117",
    "K/D Ratio": "176.49",
    "Recent Results": [
      "1",
      "1",
      "0",
      "0",
      "1"
    ],
    "Average Headshots %": "40",
    "Win Rate %": "53",
    "Longest Win Streak": "9",
    "Matches": "176",
    "Current Win Streak": "1",
    "Average K/D Ratio": "1",
    "Wins": "93"
  },
  "segments": [
    {
      "type": "Map",
      "mode": "5v5",
      "label": "de_cache",
      "img_small": "https://cdn.faceit.com/static/stats_assets/csgo/maps/110x55/csgo-votable-maps-de_cache-110x55.jpg",
      "img_regular": "https://cdn.faceit.com/static/stats_assets/csgo/maps/200x125/csgo-votable-maps-de_cache-200x125.jpg",
      "stats": {
        "Wins": "0",
        "Average Kills": "7",
        "Average Triple Kills": "0",
        "Assists": "2",
        "Quadro Kills": "0",
        "Average Quadro Kills": "0",
        "Deaths": "20",
        "K/R Ratio": "0.28",
        "Rounds": "25",
        "Average K/D Ratio": "0.35",
        "Headshots per Match": "4",
        "Headshots": "4",
        "Average Deaths": "20",
        "Matches": "1",
        "Kills": "7",
        "K/D Ratio": "0.35",
        "Penta Kills": "0",
        "Average Headshots %": "57",
        "Average K/R Ratio": "0.28",
        "MVPs": "1",
        "Average Assists": "2",
        "Triple Kills": "0",
        "Total Headshots %": "57",
        "Average Penta Kills": "0",
        "Win Rate %": "0",
        "Average MVPs": "1"
      }
    },
  ]
}
*/

export interface PlayerStats {
    player_id: string;
    game_id: string;
    lifetime: {
        "Total Headshots %": string;
        "K/D Ratio": string;
        "Recent Results": string[];
        "Average Headshots %": string;
        "Win Rate %": string;
        "Longest Win Streak": string;
        Matches: string;
        "Current Win Streak": string;
        "Average K/D Ratio": string;
        Wins: string;
    };
    segments: {
        type: string;
        mode: string;
        label: string;
        img_small: string;
        img_regular: string;
        stats: {
            Wins: string;
            "Average Kills": string;
            "Average Triple Kills": string;
            Assists: string;
            "Quadro Kills": string;
            "Average Quadro Kills": string;
            Deaths: string;
            "K/R Ratio": string;
            Rounds: string;
            "Average K/D Ratio": string;
            "Headshots per Match": string;
            Headshots: string;
            "Average Deaths": string;
            Matches: string;
            Kills: string;
            "K/D Ratio": string;
            "Penta Kills": string;
            "Average Headshots %": string;
            "Average K/R Ratio": string;
            MVPs: string;
            "Average Assists": string;
            "Triple Kills": string;
            "Total Headshots %": string;
            "Average Penta Kills": string;
            "Win Rate %": string;
            "Average MVPs": string;
        };
    }[];
}

export const getPlayerStats = async (playerID: string): Promise<PlayerStats> => {
    return client
        .get("/player", { params: { player_id: playerID } })
        .then((res) => {
            return res.data;
        })
        .catch((err) => {
            console.log(err);
            return null;
        });
};

/*
{
  "match_id": "1-d34401d4-e3cf-4f75-8805-88b32a5de8fa",
  "game_id": "csgo",
  "region": "EU",
  "match_type": "",
  "game_mode": "5v5",
  "max_players": 10,
  "teams_size": 5,
  "teams": {
    "faction2": {
      "team_id": "e736883a-dced-43b6-914c-1575517f872b",
      "nickname": "team_eikoNagi",
      "avatar": "https://distribution.faceit-cdn.net/images/0286d037-e25e-4f60-a648-8a694fff57e5.jpeg",
      "type": "",
      "players": [
        {
          "player_id": "e736883a-dced-43b6-914c-1575517f872b",
          "nickname": "eikoNagi",
          "avatar": "https://distribution.faceit-cdn.net/images/0286d037-e25e-4f60-a648-8a694fff57e5.jpeg",
          "skill_level": 8,
          "game_player_id": "76561199084220642",
          "game_player_name": "Shympai",
          "faceit_url": "https://www.faceit.com/{lang}/players/eikoNagi"
        },
      ]
    },
    "faction1": {
      "team_id": "67579630-9fda-4ddb-bc7e-ebb7770edb8d",
      "nickname": "team_kudriaviyzzz",
      "avatar": "https://distribution.faceit-cdn.net/images/6cb25211-f383-4709-bc9a-74cb75bab3b3.jpeg",
      "type": "",
      "players": [
        {
          "player_id": "67579630-9fda-4ddb-bc7e-ebb7770edb8d",
          "nickname": "kudriaviyzzz",
          "avatar": "https://distribution.faceit-cdn.net/images/6cb25211-f383-4709-bc9a-74cb75bab3b3.jpeg",
          "skill_level": 7,
          "game_player_id": "76561199017584625",
          "game_player_name": "LaDa LaRgus",
          "faceit_url": "https://www.faceit.com/{lang}/players/kudriaviyzzz"
        },
      ]
    }
  },
  "playing_players": [
    "67579630-9fda-4ddb-bc7e-ebb7770edb8d",
  ],
  "competition_id": "a3c75828-7f0f-4940-adb9-994b4b389070",
  "competition_name": "5v5 RANKED PREMIUM",
  "competition_type": "matchmaking",
  "organizer_id": "faceit",
  "status": "finished",
  "started_at": 1675001066,
  "finished_at": 1675003414,
  "results": {
    "winner": "faction1",
    "score": {
      "faction2": 0,
      "faction1": 1
    }
  },
  "faceit_url": "https://www.faceit.com/{lang}/csgo/room/1-d34401d4-e3cf-4f75-8805-88b32a5de8fa"
}
*/

export interface MatchHistory {
    match_id: string;
    game_id: string;
    region: string;
    match_type: string;
    game_mode: string;
    max_players: number;
    teams_size: number;
    teams: {
        [key: string]: {
            team_id: string;
            nickname: string;
            avatar: string;
            type: string;
            players: {
                player_id: string;
                nickname: string;
                avatar: string;
                skill_level: number;
                game_player_id: string;
                game_player_name: string;
                faceit_url: string;
            }[];
        };
    };
    playing_players: string[];
    competition_id: string;
    competition_name: string;
    competition_type: string;
    organizer_id: string;
    status: string;
    started_at: number;
    finished_at: number;
    results: {
        winner: string;
        score: {
            faction1: number;
            faction2: number;
        };
    };
    faceit_url: string;
}

export const getMatchHistory = async (
    playerID: string,
    limit: number = 20
): Promise<MatchHistory[]> => {
    return client
        .get("/matches", { params: { player_id: playerID, limit } })
        .then((res) => {
            return res.data.items;
        })
        .catch((err) => {
            console.log(err);
            return null;
        });
};

/**
{
  "rounds": [
    {
      "best_of": "2",
      "competition_id": null,
      "game_id": "csgo",
      "game_mode": "5v5",
      "match_id": "1-d34401d4-e3cf-4f75-8805-88b32a5de8fa",
      "match_round": "1",
      "played": "1",
      "round_stats": {
        "Region": "EU",
        "Map": "de_vertigo",
        "Score": "16 / 11",
        "Winner": "67579630-9fda-4ddb-bc7e-ebb7770edb8d",
        "Rounds": "27"
      },
      "teams": [
        {
          "team_id": "67579630-9fda-4ddb-bc7e-ebb7770edb8d",
          "premade": false,
          "team_stats": {
            "Team": "team_kudriaviyzzz",
            "Team Win": "1",
            "First Half Score": "7",
            "Second Half Score": "9",
            "Team Headshots": "10",
            "Final Score": "16",
            "Overtime score": "0"
          },
          "players": [
            {
              "player_id": "67579630-9fda-4ddb-bc7e-ebb7770edb8d",
              "nickname": "kudriaviyzzz",
              "player_stats": {
                "Result": "1",
                "Quadro Kills": "0",
                "Kills": "22",
                "Penta Kills": "0",
                "Deaths": "18",
                "MVPs": "5",
                "Headshots": "6",
                "Triple Kills": "0",
                "Headshots %": "27",
                "Assists": "9",
                "K/R Ratio": "0.81",
                "K/D Ratio": "1.22"
              }
            },
          ]
        },
      ]
    }
  ]
}
 */

export interface MatchStats {
    rounds: Round[];
}

export interface Round {
    best_of: string;
    competition_id: string;
    game_id: string;
    game_mode: string;
    match_id: string;
    match_round: string;
    played: string;
    round_stats: {
        Region: string;
        Map: string;
        Score: string;
        Winner: string;
        Rounds: string;
    };
    teams: Team[];
}

export interface Team {
    team_id: string;
    premade: boolean;
    team_stats: {
        Team: string;
        "Team Win": string;
        "First Half Score": string;
        "Second Half Score": string;
        "Team Headshots": string;
        "Final Score": string;
        "Overtime score": string;
    };
    players: Player[];
}

export interface Player {
    player_id: string;
    nickname: string;
    player_stats: {
        Result: string;
        "Quadro Kills": string;
        Kills: string;
        "Penta Kills": string;
        Deaths: string;
        MVPs: string;
        Headshots: string;
        "Triple Kills": string;
        "Headshots %": string;
        Assists: string;
        "K/R Ratio": string;
        "K/D Ratio": string;
    };
}

export const getMatchStats = async (matchID: string): Promise<MatchStats> => {
    return client
        .get("/match", { params: { match_id: matchID } })
        .then((res) => {
            return res.data;
        })
        .catch((err) => {
            console.log(err);
            return null;
        });
};
