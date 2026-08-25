/** @type {import('next').NextConfig} */
const nextConfig = {
  // окрема тека збірки, коли треба перевірити build,
  // не зупиняючи дев-сервер (npm run build:check)
  distDir: process.env.NEXT_DIST_DIR || ".next",
};
export default nextConfig;
