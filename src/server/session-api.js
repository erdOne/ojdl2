import { signInUid, getUser } from "./api.js";

export async function signInCookie(req) {
  const uid = req.body.uid || req.session.uid;
  const result = await signInUid({ uid });
  if (!req.session.uid) {
    req.session.uid = uid;
  }
  return { uid, ...result };
}

export async function signOutCookie(req) {
  const uid = req.session.uid;
  const user = await getUser({ uid });
  req.session.destroy();
}