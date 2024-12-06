import { db } from "@/lib/db";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { username, schedule } = req.body;

    if (!username || !schedule) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      await db.user.update({
        where: { username },
        data: { schedule },
      });

      return res.status(200).json({ message: "Schedule saved successfully" });
    } catch (error) {
      console.error("Error saving schedule:", error);
      return res.status(500).json({ error: "Failed to save schedule" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
