// One Vercel function handles every /api/* request (see "rewrites" in vercel.json).
import handler from "../server/router.js";

export default handler;
