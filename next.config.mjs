/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    compiler: {
        // Enables the styled-components SWC transform
        styledComponents: true
    },
    transpilePackages: ["geist"],
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "utfs.io",
                port: ""
            }
        ]
    }
};

export default nextConfig;
