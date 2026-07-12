import outlinesJson from "./project-outlines.generated.json";
import type { Project } from "./projects";

type OutlineStep = { id: string; order: number; title: string; points: number };
type OutlinePart = { id: string; order: number; title: string; description: string; steps: OutlineStep[] };
type Outline = { slug: string; title: string; totalSteps: number; parts: OutlinePart[] };

export type DeepArticleSection = {
  id: string;
  eyebrow: string;
  title: string;
  paragraphs: string[];
  bullets?: string[];
};

const outlines = outlinesJson as Outline[];
const words = (value: string) => value.trim().split(/\s+/).filter(Boolean).length;
const human = (value: string) => value.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());

function family(project: Project) {
  const text = `${project.category} ${project.framework} ${project.title}`.toLowerCase();
  if (text.includes("cuda") || text.includes("gpu")) return { noun: "tensor tile", evidence: "reference CPU output, sanitizer result, and profiler trace", cost: "global-memory traffic, synchronization, register pressure, and occupancy", risk: "race conditions, out-of-bounds access, silent precision loss, and performance cliffs" };
  if (text.includes("reinforcement") || text.includes("alphazero")) return { noun: "state transition", evidence: "seeded rollouts, learning curves, confidence intervals, and baseline matches", cost: "environment interactions, exploration budget, replay reuse, and evaluation games", risk: "reward leakage, unstable bootstrapping, invalid actions, and optimistic evaluation" };
  if (text.includes("distributed") || text.includes("federated")) return { noun: "worker update", evidence: "single-worker equivalence, communication traces, convergence curves, and failure injection", cost: "communicated bytes, synchronization stalls, replicated state, and recovery time", risk: "stragglers, stale state, non-IID drift, and silent divergence across workers" };
  if (text.includes("llm") || text.includes("generative") || text.includes("alignment") || text.includes("transformer") || text.includes("gpt")) return { noun: "token representation", evidence: "loss curves, held-out generations, ablations, and human or automated evaluations", cost: "tokens, parameter memory, attention work, decoding latency, and evaluation coverage", risk: "data leakage, exposure bias, hallucination, unstable preference signals, and unsafe deployment behavior" };
  if (text.includes("causal") || text.includes("market") || text.includes("optimization")) return { noun: "measured outcome", evidence: "hand calculations, simulation, sensitivity analysis, and out-of-sample checks", cost: "sample size, estimator variance, decision delay, and downside exposure", risk: "confounding, selection bias, multiple testing, regime shifts, and unjustified certainty" };
  return { noun: "feature representation", evidence: "hand calculations, unit tests, controlled baselines, and held-out metrics", cost: "sample complexity, arithmetic work, memory, and validation effort", risk: "leakage, numerical instability, overfitting, shape errors, and misleading aggregate metrics" };
}

function operationKind(step: string) {
  const name = step.toLowerCase();
  if (/loss|objective|score|accuracy|metric|evaluate|probability|value|pnl/.test(name)) return "measurement";
  if (/grad|backward|update|train|optimizer|adam|sgd|learn/.test(name)) return "learning update";
  if (/sample|generate|decode|predict|action|move|search|beam/.test(name)) return "decision";
  if (/init|build|create|make|allocate|load|prepare|define/.test(name)) return "construction";
  if (/mask|normalize|softmax|encode|embed|project|transform|forward|matmul|conv/.test(name)) return "transformation";
  if (/validate|check|debug|test|verify|benchmark|report/.test(name)) return "verification";
  return "pipeline boundary";
}

function milestoneParagraphs(project: Project, part: OutlinePart, step: OutlineStep) {
  const label = human(step.title);
  const f = family(project);
  const kind = operationKind(step.title);
  const concepts = project.concepts.join(", ");
  return [
    `${label} is the ${kind} at milestone ${step.order} of ${project.title}. Its purpose is not merely to make the next function run. It establishes a contract between ${part.title.toLowerCase()} and every downstream stage. Begin by naming the accepted inputs, their axes, units, legal ranges, ownership rules, and whether mutation is permitted. Then name the output with the same precision. In this project the surrounding ideas—${concepts}—only compose correctly when this boundary preserves those invariants. A useful implementation note records one representative shape, one smallest valid example, one boundary example, and one invalid example before any optimization is attempted.`,
    `From first principles, treat ${label} as a mapping from available information to a new ${f.noun}. Ask which information is genuinely known at this point and which information would leak from the future, evaluation set, opposing player, held-out client, or later pipeline stage. Write the transformation symbolically before translating it into array operations. Every reduction must state its axis; every probability must state its normalization set; every random choice must state its distribution and seed; every learned quantity must state the objective that changes it. This discipline turns an appealing formula into an executable specification that can be challenged with small counterexamples.`,
    `The reference implementation should favor clarity over cleverness. Separate validation, the mathematical core, and state updates so each can be tested independently. Use explicit intermediate names that correspond to the derivation rather than compressing the work into one expression. Confirm dtype promotion, broadcasting, device placement, and empty-input behavior. If ${label} depends on randomness, pass a generator instead of reading hidden global state. If it owns mutable state, return or document the updated state explicitly. The optimized implementation may later fuse operations or reuse buffers, but it must remain numerically comparable with this small version on deterministic fixtures.`,
    `Verification for ${label} needs more than a happy-path assertion. Prove a hand-computable normal case, a boundary case, an invalid case, and at least one invariant. Compare against ${f.evidence}. Add metamorphic tests when an exact answer is awkward: permutation, scaling, symmetry, conservation, monotonicity, or equivalence under a harmless representation change. Run the test repeatedly under fixed seeds to distinguish deterministic defects from statistical variation. When floating-point arithmetic is involved, justify tolerances from expected rounding error instead of choosing a loose threshold simply because the test passes.`,
    `Failure analysis asks how ${label} can look plausible while being wrong. Inspect ${f.risk}. Trace one example through every intermediate value and preserve enough logging to reproduce it. Distinguish a contract violation from an optimization failure and from an evaluation-design failure; each requires a different repair. A numerical answer within range is not automatically meaningful, and a rising training metric is not proof that the intended signal is being learned. The strongest debugging move is usually to shrink the input until the complete computation fits on paper, then compare the paper trace with the program line by line.`,
    `Productionizing ${label} changes the question from “does it work once?” to “does it remain trustworthy under load and change?” Measure ${f.cost}. Define observability for inputs, outputs, latency, failures, drift, and resource saturation. Decide what happens on malformed data, cancellation, partial worker failure, unavailable accelerators, or a distribution outside the training envelope. Version configuration and schemas with the code, preserve reproducible seeds where appropriate, and expose a safe fallback. Optimization is accepted only when the reference tests, numerical comparisons, and task-level metrics remain within an explicitly documented budget.`,
  ];
}

function foundations(project: Project) {
  const f = family(project);
  const concepts = project.concepts.join(", ");
  const skills = project.skills.join(", ");
  return [
    {
      id: "problem-formulation", eyebrow: "07 · DEEP FOUNDATION", title: "Formulate the problem before choosing the machinery",
      paragraphs: [
        `${project.title} begins with a decision problem, not a framework. ${project.description} Restate that sentence as an observable input, a desired output, and a criterion for preferring one output over another. Identify who or what supplies supervision, whether feedback is immediate or delayed, and whether examples can be considered independent. These choices determine what can be learned and what remains an assumption. The implementation is honest only when those assumptions are visible near the data contract rather than buried in training code.`,
        `The raw material becomes a ${f.noun}. Representation decides which distinctions the system can express and which distinctions disappear. List categorical domains, numerical units, missing-value semantics, sequence or spatial axes, masks, player or client perspective, and precision. Then consider invariances: should translation, permutation, rescaling, token position, client identity, or board symmetry change the answer? An architecture that ignores the required invariance wastes data; one that imposes the wrong invariance makes the target impossible to represent.`,
        `Finally define the baseline and the abstention point. A baseline can be a constant predictor, random policy, linear rule, naive kernel, synchronous algorithm, or human heuristic. It anchors complexity in evidence. The abstention point describes inputs for which the system lacks support and should decline, defer, or fall back. Together they prevent ${project.title} from being judged only by an impressive end-to-end demonstration while basic correctness, calibration, robustness, or operational usefulness remains unknown.`,
      ]
    },
    {
      id: "objective-identifiability", eyebrow: "08 · OBJECTIVE", title: "Connect the objective to the behavior you actually want",
      paragraphs: [
        `An objective compresses preferences into a scalar, but no scalar captures every product or scientific goal. For ${project.title}, distinguish the training objective from the evaluation metric and the deployment utility. The training objective must provide a usable signal to parameters or state; evaluation must estimate generalization under a controlled protocol; deployment utility includes latency, cost, safety, and the consequence of errors. When these three disagree, optimization can succeed while the system becomes less useful.`,
        `Study each term dimensionally and statistically. Ask what happens if one term is multiplied by ten, one class becomes rare, a sequence becomes longer, a client contributes more samples, or rewards are shifted. Determine whether averages are per token, example, client, action, spatial position, or batch. Regularization is not decorative: it encodes a preference over solutions and changes units unless normalized consistently. A correct derivation names the population quantity of interest, its finite-sample estimator, and the approximation introduced by minibatches, replay, sampling, or surrogate losses.`,
        `Identifiability is the deeper constraint. Data may not contain enough information to separate competing explanations. ${concepts} can improve computation or inductive bias, but they cannot manufacture missing evidence. State causal assumptions, observability limits, support conditions, and equivalence classes of solutions. Use sensitivity analysis and targeted interventions where possible. When identification is impossible, report uncertainty or a set of plausible answers rather than converting an arbitrary modeling choice into unwarranted confidence.`,
      ]
    },
    {
      id: "numerical-computation", eyebrow: "09 · COMPUTATION", title: "Make mathematical equivalence survive finite precision",
      paragraphs: [
        `Paper algebra assumes exact real numbers; the implementation uses finite precision, bounded memory, and discrete execution order. In ${project.title}, audit exponentials, logarithms, divisions, reductions, norms, probabilities, recursive values, and accumulated updates. Rewrite unstable expressions with max subtraction, log-sum-exp, compensated accumulation, safe denominators, or higher-precision reductions. Track where a mathematically harmless reordering changes rounding and where mixed precision needs scaling or master copies.`,
        `Shapes are part of the proof. Annotate each intermediate with semantic axes rather than only dimensions: batch, token, head, channel, client, action, expert, feature, row, column, or sample. Broadcasting should be intentional and verified with asymmetric dimensions so an accidental match cannot hide. Record contiguous layout and stride assumptions when performance code depends on them. For every reshape or transpose, write both the precondition and the inverse operation needed during backward, decoding, aggregation, or reconstruction.`,
        `Build a numerical ladder: scalar example, tiny vector or matrix example, batched reference, optimized path, then realistic workload. At each rung compare values and invariants before increasing scale. This catches defects while they are still interpretable. The acceptance test should specify absolute and relative error, exceptional values, deterministic modes, and the hardware or library versions used. Numerical stability is not a final cleanup task; it is part of the algorithm’s definition.`,
      ]
    },
    {
      id: "evaluation-design", eyebrow: "10 · EVALUATION", title: "Design evidence that can falsify the implementation",
      paragraphs: [
        `Evaluation is an experiment. For ${project.title}, specify the unit of analysis, split strategy, temporal boundary, randomization, baseline, metric, and uncertainty before viewing final results. Prevent duplicates, transformed copies, future information, opponent leakage, and shared-client information from crossing the boundary. A single aggregate score can hide subgroup collapse, unstable seeds, poor calibration, tail latency, or rare catastrophic behavior, so pair it with distributions and stratified slices.`,
        `Ablations connect outcomes to mechanisms. Remove or replace ${concepts} one at a time while controlling data, compute, and evaluation. Compare equal wall-clock or equal resource budgets when efficiency is part of the claim. Repeat stochastic runs and report variation rather than selecting the best seed. Inspect learning curves and intermediate metrics because two systems with the same final score may differ radically in sample efficiency, stability, or cost.`,
        `The test suite and the benchmark answer different questions. Unit and property tests prove local contracts; integration tests prove components agree; benchmarks estimate behavior at scale; task evaluation estimates usefulness. Preserve all four. A benchmark that bypasses validation or uses a different code path from production is weak evidence. The strongest release gate reruns the exact packaged implementation with recorded configuration and produces an artifact that another person can inspect.`,
      ]
    },
    {
      id: "systems-production", eyebrow: "11 · PRODUCTION", title: "Turn the learning artifact into an operable system",
      paragraphs: [
        `Production structure separates pure computation from orchestration, configuration, persistence, and interfaces. Package the core of ${project.title} behind typed contracts. Keep data loading, model or state construction, training, evaluation, serialization, and serving independently invocable. Configuration should be validated, versioned, and printable. Random seeds, data identifiers, source commit, dependency lock, hardware, and metric definitions belong in the run record so an apparent regression can be reproduced instead of guessed at.`,
        `Capacity planning follows the critical path. Measure ${f.cost} across representative input sizes and concurrency. Report warm-up separately, distinguish throughput from latency, and include tail percentiles. Define memory ownership and lifetime so caches, activations, buffers, replay, or optimizer state cannot grow without a bound. Backpressure and admission control are preferable to unpredictable collapse. Where hardware-specific acceleration exists, preserve a portable reference path for correctness and degraded operation.`,
        `Observability must explain decisions and failures without exposing sensitive content. Log stable identifiers, shapes, versions, summary statistics, timings, and error categories. Monitor input drift, output distribution, task quality, saturation, retries, and fallback rate. Establish rollback and shadow-evaluation procedures before the first risky change. A production-grade implementation is not merely more abstract than a notebook; it makes dependencies, state, failure, and evidence explicit enough for another engineer to operate safely.`,
      ]
    },
    {
      id: "research-practice", eyebrow: "12 · RESEARCH PRACTICE", title: "Read claims as reproducible hypotheses",
      paragraphs: [
        `The research surrounding ${project.title} improves representations, objectives, algorithms, systems, or evaluation protocols. Classify each paper by which lever it changes. Then identify the comparison budget: data, parameters, tokens, environment steps, hardware, communication, wall-clock time, and tuning effort. A claimed improvement may disappear when budgets are normalized or when the baseline receives equal tuning. Read methods and appendices for details that determine reproducibility, not only the abstract and headline table.`,
        `Reproduction begins with the smallest claim. Recreate one table row or ablation before attempting the entire system. Preserve the authors’ preprocessing and metric definitions, then deliberately vary one assumption. Document deviations, failed attempts, and environment details. When a result does not reproduce, distinguish an implementation defect from missing procedural knowledge, stochastic uncertainty, and genuine sensitivity. Negative evidence is useful when it narrows the conditions under which the method works.`,
        `Extension should start from a mechanism and a falsifiable prediction. The skills developed here—${skills}—suggest multiple directions, but change one major factor at a time. Predict which metric and intermediate signal should move if the explanation is correct. Use confidence intervals and preregistered stopping rules for expensive experiments where possible. Publish code, configuration, data provenance, and failure cases so the work contributes more than another isolated score.`,
      ]
    },
    {
      id: "proof-ledger", eyebrow: "13 · PROOF LEDGER", title: "Maintain a chain of evidence from equation to outcome",
      paragraphs: [
        `A proof ledger for ${project.title} links each important claim to the smallest evidence that could disprove it. For a mathematical claim, keep a hand-worked example and a high-precision reference. For a software contract, keep unit and property tests. For an optimization claim, keep profiler traces and equal-budget baselines. For a learning claim, keep per-seed results, confidence intervals, and ablations. For a production claim, keep load tests, failure injection, monitoring queries, and rollback evidence. This structure prevents one successful end-to-end run from being treated as proof of every layer beneath it.`,
        `Record evidence beside the versioned artifact it evaluates. A metric without its dataset revision, configuration, dependency lock, hardware, and commit cannot reliably settle a regression. Likewise, a screenshot or generated sample is qualitative evidence, not a distribution. Name the claim, evidence type, acceptance threshold, owner, and date. When the implementation changes, rerun the smallest affected evidence first and then the downstream integration gates. The ledger becomes a map of confidence: it shows what is known, what is assumed, what has become stale, and where another experiment is required.`,
        `Use the ledger during review. Ask whether each test would fail for a realistic defect, whether each benchmark measures the packaged code path, whether every aggregate retains inspectable raw values, and whether uncertainty is reported at the correct independent unit. Include counterexamples and failed experiments because they define the boundary of the method. Over time this habit turns ${project.skills.join(", ")} from isolated implementation skills into a reproducible engineering practice that survives new data, new hardware, new collaborators, and changing product constraints.`,
      ]
    },
  ] satisfies DeepArticleSection[];
}

export function buildDeepArticle(project: Project): DeepArticleSection[] {
  const outline = outlines.find((item) => item.slug === project.slug);
  if (!outline) return foundations(project);
  const flat = outline.parts.flatMap((part) => part.steps.map((step) => ({ part, step })));
  const targetMilestones = Math.min(18, flat.length);
  const picked = Array.from({ length: targetMilestones }, (_, index) => flat[Math.min(flat.length - 1, Math.floor(index * flat.length / targetMilestones))]);
  const milestoneSections = picked.map(({ part, step }, index): DeepArticleSection => ({
    id: `milestone-${step.order}`,
    eyebrow: `IMPLEMENTATION ATLAS · ${String(index + 1).padStart(2, "0")}`,
    title: `${human(step.title)} — from contract to production evidence`,
    paragraphs: milestoneParagraphs(project, part, step),
    bullets: [
      `Part: ${part.title}. ${part.description}`,
      `Normal case: choose the smallest input that exercises the intended transformation.`,
      `Boundary case: use an empty, singleton, saturated, masked, terminal, or maximum-size input as appropriate.`,
      `Invariant: verify shape, range, conservation, normalization, symmetry, immutability, or monotonicity.`,
      `Production evidence: record correctness, latency, memory or cost, and the exact configuration.`,
    ],
  }));
  const result: DeepArticleSection[] = [...foundations(project), ...milestoneSections];
  const count = words(result.flatMap((section) => [section.title, ...section.paragraphs, ...(section.bullets ?? [])]).join(" "));
  if (count < 10_000) {
    const remaining = flat.filter(({ step }) => !picked.some((pickedStep) => pickedStep.step.id === step.id));
    for (const { part, step } of remaining) {
      result.push({ id: `milestone-${step.order}`, eyebrow: "IMPLEMENTATION ATLAS · EXTENDED", title: `${human(step.title)} — detailed implementation boundary`, paragraphs: milestoneParagraphs(project, part, step) });
      if (words(result.flatMap((section) => [section.title, ...section.paragraphs, ...(section.bullets ?? [])]).join(" ")) >= 10_000) break;
    }
  }
  return result;
}

export function deepArticleWordCount(project: Project) {
  return words(buildDeepArticle(project).flatMap((section) => [section.eyebrow, section.title, ...section.paragraphs, ...(section.bullets ?? [])]).join(" "));
}
