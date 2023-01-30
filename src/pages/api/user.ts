import { NextApiRequest, NextApiResponse } from "next";

import { FACEIT_PROD } from "../../utils/constants";

export default (req: NextApiRequest, res: NextApiResponse) => {
    let auth = req.headers.authorization;
    if (!auth) {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }
    let username = req.query.username;
    if (!username) {
        res.status(400).json({ error: "Missing username" });
        return;
    }

    fetch(`${FACEIT_PROD}/users/v1/nicknames/${username}`, {
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
                res.status(200).json(data.payload);
            });
        })
        .catch((error) => {
            res.status(500).json({ error: error });
        });
};
