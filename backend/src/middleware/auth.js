// backend/src/middleware/auth.js
import jwt from "jsonwebtoken";

// export function requireUser(req, res, next) {
//   const authHeader = req.headers["authorization"];
//   const token = authHeader?.startsWith("Bearer ")
//     ? authHeader.split(" ")[1]
//     : null;
//   const headerId = req.header("x-user-id");

//   if (token) {
//     try {
//       const user = jwt.verify(token, process.env.JWT_SECRET);
//       req.user = user;
//       req.userId = Number(user?.id ?? user?.userId ?? user?.sub);
//       if (!req.userId && headerId) req.userId = Number(headerId);
//       if (!req.userId) {
//         return res.status(401).json({ error: "user_id_missing_in_token" });
//       }
//       return next();
//     } catch (e) {
//       return res.status(403).json({ error: "invalid_token" });
//     }
//   }

//   if (headerId) {
//     req.userId = Number(headerId);
//     return next();
//   }

//   return res.status(401).json({ error: "not_authenticated" });
// }


export function requireUser(req, res, next) {
  req.userId = req.header('x-user-id') || 1; // mock
  next();
}
