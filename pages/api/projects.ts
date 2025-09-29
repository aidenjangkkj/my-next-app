import type { NextApiRequest, NextApiResponse } from "next";
import { projectSummaries } from "@/data/projects";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  res.status(200).json(projectSummaries);
}
