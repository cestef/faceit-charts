import { NextApiRequest, NextApiResponse } from "next";

import axios from "axios";

// /players/{player_id}/history
export default async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const { player_id, limit } = req.query;
        const data = await axios.get(
            `https://open.faceit.com/data/v4/players/${player_id}/history?game=csgo&offset=0&limit=${limit}`,
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