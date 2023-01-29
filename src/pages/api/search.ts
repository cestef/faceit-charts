// API key is stored in .env.local: FACEIT_API_KEY
// Authorization: Bearer <API key>
// Base URL: https://open.faceit.com/data/v4
// Search endpoints:
// - /search/players (GET)
// - /players (GET)

import { NextApiRequest, NextApiResponse } from "next";

import axios from "axios";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const { username } = req.query;
    console.log(username);
    const { data } = await axios.get(
        `https://open.faceit.com/data/v4/search/players?nickname=${username}&game=csgo&offset=0&limit=1`,
        {
            headers: {
                Authorization: `Bearer ${process.env.FACEIT_API_KEY}`,
            },
        }
    );
    console.log(data);
    const player = data.items[0];
    if (player === undefined) {
        res.status(404).json({ error: "Player not found" });
        return;
    }
    res.json(player);
};
