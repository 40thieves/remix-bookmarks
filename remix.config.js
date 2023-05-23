/**
 * @type {import('@remix-run/dev').AppConfig}
 */
module.exports = {
  ignoredRouteFiles: [".*"],
  devServerPort: 8002,
  future: {
    v2_meta: true,
    v2_errorBoundary: true
  }
}
