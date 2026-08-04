export type AdminAccessState =
  | "checking"
  | "signed-out"
  | "forbidden"
  | "allowed";

export function getAdminAccessState(
  checking: boolean,
  signedIn: boolean,
  hasAdminDocument: boolean,
): AdminAccessState {
  if (checking) return "checking";
  if (!signedIn) return "signed-out";
  return hasAdminDocument ? "allowed" : "forbidden";
}
