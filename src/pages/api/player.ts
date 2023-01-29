import { NextApiRequest, NextApiResponse } from "next";

import axios from "axios";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const { player_id } = req.query;
        // Input can be either:
        // - Faceit nickname
        // - SteamID64
        // - steam profile link (https://steamcommunity.com/id/username)
        // - steam profile link (https://steamcommunity.com/profiles/steamid64)

        const data = await axios.get(
            `https://open.faceit.com/data/v4/players/${player_id}/stats/csgo`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.FACEIT_API_KEY}`,
                },
            }
        );
        if (data.status !== 200 || data.data === undefined) {
            res.status(404).json({ error: "Player not found" });
            return;
        }
        res.json(data.data);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Something went wrong" });
    }
};
