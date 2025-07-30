export const clearCookie = (res ) => {
  try {
    res.clearCookie("auth", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
    return res.status(200).json({ message: "Cookie cleared successfully" });
  } catch (error) {
    console.error("Error clearing cookie:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
