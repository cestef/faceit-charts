import { NextApiRequest, NextApiResponse } from "next";

import { FACEIT_PROD } from "../../utils/constants";

export default (req: NextApiRequest, res: NextApiResponse) => {
    let auth = req.headers.authorization;
    if (!auth) {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }
    fetch(`${FACEIT_PROD}/status-message/v1/status`, {
        method: "GET",
        headers: {
            Authorization: auth,
        },
    })
        .then((resp) => {
            if (resp.status !== 200) {
                return res.status(resp.status).json({ error: resp.statusText });
            }
            res.status(200).json({ status: resp.statusText });
        })
        .catch((error) => {
            res.status(500).json({ error: error });
        });
};
