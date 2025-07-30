import { prisma } from "../prisma/prismaClient.js";

export const verifyAdmin = async (req, res, next) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await prisma.user.findUnique({
      where: { userId },
      select: { isAdmin: true },
    });

    if (!user || !user.isAdmin) {
      return res.status(403).json({ error: "Access denied: Admins only" });
    }

    next();
  } catch (err) {
    console.error("Admin check failed:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};
