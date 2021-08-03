import { createHash } from "crypto";
var sha256 = msg => createHash("sha256").update(msg).digest("hex");

export function hashPswInDB(password) {
  return sha256(`sAkAgUcHiTaMaMi:${password}`);
}

export function hashUid(handle, password) {
  return sha256(`${handle}:${password}:wAtAnAbErIsA`);
}

export function hashUidInDB(uid) {
  return sha256(`${uid}:nAgAhAmAnErU`);
}

export function hashPswAtClient(password) {
  return sha256(`iKuTaEriKa:${password}`);
}
