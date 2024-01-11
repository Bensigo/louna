import type { NextApiRequest, NextApiResponse } from "next";



 function handler(req: NextApiRequest, res: NextApiResponse){
    res.end("Hello world")
}

export default handler;