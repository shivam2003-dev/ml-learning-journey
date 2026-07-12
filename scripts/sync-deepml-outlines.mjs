import fs from "node:fs/promises";

const source = await fs.readFile(new URL("../lib/projects.ts", import.meta.url), "utf8");
const slugs = [...source.matchAll(/slug: "([^"]+)"/g)].map((match) => match[1]);

const outlines = [];
const phaseNames = ["define", "derive", "prepare", "implement", "connect", "validate", "debug", "optimize", "benchmark", "integrate"];
const slugify = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
for (const slug of slugs) {
  const response = await fetch(`https://api.deep-ml.com/projects/${slug}`);
  if (!response.ok) throw new Error(`Could not load ${slug}: ${response.status}`);
  const project = await response.json();
  let syntheticOrder = 0;
  outlines.push({
    slug,
    title: project.title,
    totalSteps: project.total_steps,
    parts: [...project.parts]
      .sort((a, b) => a.order - b.order)
      .map((part) => ({
        id: part.id,
        order: part.order,
        title: part.title,
        description: part.description,
        steps: (() => {
          const sourceSteps = project.steps.filter((step) => step.part_id === part.id).sort((a, b) => a.order - b.order);
          if (sourceSteps.length) { syntheticOrder = sourceSteps.at(-1).order; return sourceSteps.map((step) => ({ id: step.id, order: step.order, title: step.title, points: step.flame_points })); }
          return Array.from({ length: part.step_count }, (_, index) => {
            syntheticOrder += 1;
            const topic = slugify(part.title);
            return { id: `${slug}-${String(syntheticOrder).padStart(4, "0")}`, order: syntheticOrder, title: `${phaseNames[index % phaseNames.length]}_${topic}`, points: project.flame_per_step ?? 5 };
          });
        })(),
      })),
  });
  process.stdout.write(`synced ${slug} (${project.total_steps} steps)\n`);
}

await fs.writeFile(new URL("../lib/project-outlines.generated.json", import.meta.url), `${JSON.stringify(outlines, null, 2)}\n`);
console.log(`wrote ${outlines.length} project outlines`);
