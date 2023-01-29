import { NextApiRequest, NextApiResponse } from "next";

import axios from "axios";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const { match_id } = req.query;
        const data = await axios.get(`https://open.faceit.com/data/v4/matches/${match_id}/stats`, {
            headers: {
                Authorization: `Bearer ${process.env.FACEIT_API_KEY}`,
            },
        });
        if (data.status !== 200 || data.data === undefined) {
            res.status(404).json({ error: "Match not found" });
            return;
        }
        res.json(data.data);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Something went wrong" });
    }
};
