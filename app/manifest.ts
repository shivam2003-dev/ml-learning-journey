import type { MetadataRoute } from "next";
export default function manifest(): MetadataRoute.Manifest { return { name: "ML Learning Journey", short_name: "ML Journey", description: "A gamified, project-first machine learning roadmap.", start_url: "/", display: "standalone", background_color: "#07080d", theme_color: "#7354f7", icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }] }; }
