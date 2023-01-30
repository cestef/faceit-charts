// /stats/v1/stats/time/users/${userId}/games/${game}?size=${size}

import { NextApiRequest, NextApiResponse } from "next";

import { FACEIT_PROD } from "../../utils/constants";

export default (req: NextApiRequest, res: NextApiResponse) => {
    let auth = req.headers.authorization;
    if (!auth) {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }
    let userID = req.query.userID;
    if (!userID) {
        res.status(400).json({ error: "Missing userId" });
        return;
    }
    let game = req.query.game;
    if (!game) {
        res.status(400).json({ error: "Missing game" });
        return;
    }
    let size = req.query.size;
    if (!size) {
        res.status(400).json({ error: "Missing size" });
        return;
    }

    fetch(`${FACEIT_PROD}/stats/v1/stats/time/users/${userID}/games/${game}?size=${size}`, {
        method: "GET",
        headers: {
            Authorization: auth,
        },
    })
        .then((resp) => {
            if (resp.status !== 200) {
                return res.status(resp.status).json({ error: resp.statusText });
            }
            resp.json().then((data) => {
                res.status(200).json(data);
            });
        })
        .catch((error) => {
            res.status(500).json({ error: error });
        });
};
