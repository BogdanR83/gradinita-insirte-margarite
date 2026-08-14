/** Bump this string whenever we need a visible deploy check in the browser. */
export const APP_VERSION = "2026.08.14-d";

export function getBuildLabel() {
  const sha = process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7);
  return sha ? `${APP_VERSION} · ${sha}` : `${APP_VERSION} · local`;
}
