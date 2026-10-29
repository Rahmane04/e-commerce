import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
  images: {
    // En local, Laravel tourne sur localhost : Next refuse par défaut de
    // récupérer une image sur une adresse privée (protection SSRF).
    // Autorisé uniquement en développement, jamais en production.
    dangerouslyAllowLocalIP: isDev,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        // Photos uploadées via Laravel (php artisan storage:link).
        // À remplacer par l'URL du stockage objet en production.
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/storage/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/scmnltzx/**",
      },
    ],
  },
};

export default nextConfig;
