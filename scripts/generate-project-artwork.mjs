import fs from "node:fs/promises";
import outlines from "../lib/project-outlines.generated.json" with { type: "json" };

const palettes = [
  ["#5167d8", "#8ea0ff", "#111833"], ["#8e58d8", "#d28cff", "#21112e"],
  ["#d85c8d", "#ff9bc0", "#30131f"], ["#d97857", "#f2b190", "#2c1812"],
  ["#3f9f85", "#86dac1", "#102a24"], ["#c29a36", "#f3d77e", "#2d2510"],
];
const escape = (value) => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
const hash = (value) => [...value].reduce((sum, char) => (sum * 31 + char.charCodeAt(0)) >>> 0, 7);

await fs.mkdir(new URL("../public/project-art/", import.meta.url), { recursive: true });
for (const [index, project] of outlines.entries()) {
  const [a, b, bg] = palettes[index % palettes.length]; const seed = hash(project.slug);
  const nodes = Array.from({ length: 9 }, (_, i) => ({ x: 70 + ((seed >> (i % 16)) + i * 83) % 660, y: 45 + ((seed >> ((i + 5) % 16)) + i * 47) % 270 }));
  const lines = nodes.slice(1).map((node, i) => `<path d="M${nodes[i].x} ${nodes[i].y} Q400 ${80 + (i%3)*100} ${node.x} ${node.y}"/>`).join("");
  const circles = nodes.map((node, i) => `<circle cx="${node.x}" cy="${node.y}" r="${6 + (i%3)*3}" fill="${i%2?a:b}"/>`).join("");
  const initials = project.title.split(/\s+/).filter(word => /[A-Za-z]/.test(word)).slice(0, 3).map(word => word[0]).join("").toUpperCase();
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 400" role="img"><title>${escape(project.title)} abstract project artwork</title><defs><radialGradient id="glow"><stop stop-color="${a}" stop-opacity=".5"/><stop offset="1" stop-color="${bg}" stop-opacity="0"/></radialGradient><linearGradient id="grid" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${bg}"/><stop offset="1" stop-color="#080b12"/></linearGradient></defs><rect width="800" height="400" fill="url(#grid)"/><circle cx="400" cy="190" r="245" fill="url(#glow)"/><g opacity=".12" stroke="${b}">${Array.from({length:10},(_,i)=>`<path d="M0 ${i*44}H800M${i*88} 0V400"/>`).join("")}</g><g fill="none" stroke="${a}" stroke-opacity=".38" stroke-width="2">${lines}</g>${circles}<g transform="translate(400 195)"><circle r="82" fill="${bg}" fill-opacity=".78" stroke="${b}" stroke-width="2"/><circle r="67" fill="none" stroke="${a}" stroke-opacity=".4"/><text text-anchor="middle" dominant-baseline="central" fill="#f7f4ee" font-family="ui-sans-serif,system-ui" font-size="42" font-weight="750" letter-spacing="4">${initials}</text></g><text x="26" y="370" fill="${b}" fill-opacity=".8" font-family="ui-monospace,monospace" font-size="12" letter-spacing="3">PROJECT ${String(index+1).padStart(2,"0")} · ${project.totalSteps} STEPS</text></svg>`;
  await fs.writeFile(new URL(`../public/project-art/${project.slug}.svg`, import.meta.url), svg);
}
console.log(`generated ${outlines.length} project artworks`);
