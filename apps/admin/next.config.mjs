// Importing env files here to validate on build
// import "./src/env.mjs"


/** @type {import("next").NextConfig} */
const config = {
    reactStrictMode: true,
    /** Enables hot reloading for local packages without a build step */
    transpilePackages: [ "@solu/db", "@solu/admin-api"],
    
    /** We already do linting and typechecking as separate tasks in CI */
    eslint: { ignoreDuringBuilds: true },
    typescript: { ignoreBuildErrors: true },
    env: {
        NEXT_PUBLIC_IMG_SERVER_URL: process.env.NEXT_PUBLIC_IMG_SERVER_URL 
        // 'https://solu-file-bucket.vercel.app' 

    }
}

export default config