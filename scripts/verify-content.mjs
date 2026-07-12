import fs from "node:fs";

const base = (process.argv[2] || process.env.CONTENT_BASE_URL || "http://127.0.0.1:3000").replace(/\/$/, "");
const outlines = JSON.parse(fs.readFileSync(new URL("../lib/project-outlines.generated.json", import.meta.url), "utf8"));
const strip = (html) => html.replace(/<script[\s\S]*?<\/script>/g, " ").replace(/<style[\s\S]*?<\/style>/g, " ").replace(/<[^>]+>/g, " ").replace(/&[^;]+;/g, " ").replace(/\s+/g, " ").trim();
const articleBody = (html) => html.split('<article class="research-article">')[1]?.split("</article></main>")[0] || "";
const failures = [];
const results = [];

for (const { slug } of outlines) {
  const articleResponse = await fetch(`${base}/projects/${slug}/article`);
  const articleHtml = await articleResponse.text();
  const wordCount = strip(articleBody(articleHtml)).split(/\s+/).filter(Boolean).length;
  const sourceCount = (articleHtml.match(/Primary source/g) || []).length;
  const mathematicsResponse = await fetch(`${base}/projects/${slug}/mathematics`);
  const mathematicsHtml = await mathematicsResponse.text();
  const equationCount = (mathematicsHtml.match(/Loading equation/g) || []).length;
  const result = { slug, wordCount, sourceCount, equationCount, articleStatus: articleResponse.status, mathematicsStatus: mathematicsResponse.status };
  results.push(result);
  if (articleResponse.status !== 200) failures.push(`${slug}: article HTTP ${articleResponse.status}`);
  if (wordCount < 10_000) failures.push(`${slug}: ${wordCount} words, expected at least 10000`);
  if (sourceCount < 3) failures.push(`${slug}: ${sourceCount} primary sources, expected at least 3`);
  if (mathematicsResponse.status !== 200) failures.push(`${slug}: mathematics HTTP ${mathematicsResponse.status}`);
  if (equationCount < 5) failures.push(`${slug}: ${equationCount} equation blocks, expected at least 5`);
}

console.table(results);
if (failures.length) {
  console.error("\nContent verification failed:\n" + failures.map((failure) => `- ${failure}`).join("\n"));
  process.exit(1);
}
console.log(`\nContent verification passed for ${results.length} projects.`);
