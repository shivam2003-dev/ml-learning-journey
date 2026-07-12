import outlinesJson from "./project-outlines.generated.json";
import { projectBySlug, type Project } from "./projects";
import { alphaZeroAdvancedSolutions } from "./solutions/alphazero";

export type OutlineStep = { id: string; order: number; title: string; points: number };
export type OutlinePart = { id: string; order: number; title: string; description: string; steps: OutlineStep[] };
export type ProjectOutline = { slug: string; title: string; totalSteps: number; parts: OutlinePart[] };
export type StepLocation = { project: Project; outline: ProjectOutline; part: OutlinePart; step: OutlineStep; flatIndex: number; previous?: OutlineStep; next?: OutlineStep };

export const projectOutlines = outlinesJson as ProjectOutline[];
export const outlineBySlug = (slug: string) => projectOutlines.find((outline) => outline.slug === slug);
export const flattenSteps = (outline: ProjectOutline) => outline.parts.flatMap((part) => part.steps);

export function findStep(slug: string, stepId: string): StepLocation | undefined {
  const outline = outlineBySlug(slug); const project = projectBySlug(slug);
  if (!outline || !project) return undefined;
  const steps = flattenSteps(outline); const flatIndex = steps.findIndex((item) => item.id === stepId);
  if (flatIndex < 0) return undefined;
  const step = steps[flatIndex]; const part = outline.parts.find((item) => item.id === step.id.split("-").at(-1)) ?? outline.parts.find((item) => item.steps.some((candidate) => candidate.id === stepId));
  if (!part) return undefined;
  return { project, outline, part, step, flatIndex, previous: steps[flatIndex - 1], next: steps[flatIndex + 1] };
}

const humanize = (value: string) => value.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());

function equation(project: Project, part: OutlinePart, step: OutlineStep) {
  const text = `${project.title} ${part.title} ${step.title}`.toLowerCase();
  if (text.includes("make_empty_board")) return String.raw`B\in\{0,1,2\}^{6\times 7},\qquad B_{r,c}=0\;\;\forall r,c`;
  if (text.includes("column_top_row")) return String.raw`r_{\mathrm{top}}(c)=\min\{r\mid B_{r,c}\ne 0\},\qquad r_{\mathrm{top}}(c)=6\text{ if the column is empty}`;
  if (text.includes("drop_piece")) return String.raw`r^*=\max\{r\mid B_{r,c}=0\},\qquad B'_{r^*,c}=p`;
  if (text.includes("valid_moves") || text.includes("column_full")) return String.raw`\mathcal{A}(B)=\{c\in\{0,\ldots,6\}\mid B_{0,c}=0\}`;
  if (text.includes("four_in_a_row") || text.includes("check_winner")) return String.raw`\operatorname{win}(p)=\mathbb{1}\!\left[\exists\,(r,c),(\Delta r,\Delta c):\sum_{k=0}^{3}\mathbb{1}[B_{r+k\Delta r,c+k\Delta c}=p]=4\right]`;
  if (text.includes("board_is_full") || text.includes("is_terminal")) return String.raw`\operatorname{terminal}(B)=\operatorname{win}(1)\lor\operatorname{win}(2)\lor\left|\mathcal{A}(B)\right|=0`;
  if (text.includes("encode_board")) return String.raw`X_{k,r,c}=\mathbb{1}[B_{r,c}=k],\qquad X\in\{0,1\}^{C\times 6\times 7}`;
  if (text.includes("action_mask")) return String.raw`m_a=\mathbb{1}[a\in\mathcal{A}(B)],\qquad z'_a=\begin{cases}z_a&m_a=1\\-\infty&m_a=0\end{cases}`;
  if (text.includes("visit_count_policy")) return String.raw`\pi(a\mid s)=\frac{N(s,a)^{1/\tau}}{\sum_b N(s,b)^{1/\tau}}`;
  if (text.includes("backup_value")) return String.raw`N(s,a)\leftarrow N(s,a)+1,\qquad W(s,a)\leftarrow W(s,a)+(-1)^d v`;
  if (text.includes("gini")) return String.raw`G(S)=1-\sum_{k=1}^{K}p_k^2`;
  if (text.includes("svm") || text.includes("hinge")) return String.raw`\mathcal{L}(\mathbf{w},b)=\frac{\lambda}{2}\lVert\mathbf{w}\rVert_2^2+\frac{1}{n}\sum_{i=1}^{n}\max(0,1-y_i(\mathbf{w}^{\top}\mathbf{x}_i+b))`;
  if (text.includes("ucb") || text.includes("puct")) return String.raw`U(s,a)=Q(s,a)+c_{\mathrm{puct}}P(s,a)\frac{\sqrt{\sum_b N(s,b)}}{1+N(s,a)}`;
  if (text.includes("q_value") || text.includes("q-learning") || text.includes("bellman")) return String.raw`Q(s,a)\leftarrow Q(s,a)+\alpha\left[r+\gamma\max_{a'}Q(s',a')-Q(s,a)\right]`;
  if (text.includes("attention") || text.includes("transformer")) return String.raw`\operatorname{Attention}(Q,K,V)=\operatorname{softmax}\!\left(\frac{QK^{\top}}{\sqrt{d_k}}\right)V`;
  if (text.includes("convolution") || text.includes("conv")) return String.raw`Y_{n,c_o,h,w}=\sum_{c_i}\sum_{i,j}X_{n,c_i,h+i,w+j}K_{c_o,c_i,i,j}+b_{c_o}`;
  if (text.includes("softmax") || text.includes("policy")) return String.raw`\pi(a\mid s)=\frac{\exp(z_a/\tau)}{\sum_{b\in\mathcal{A}(s)}\exp(z_b/\tau)}`;
  if (text.includes("value_loss") || text.includes("mse")) return String.raw`\mathcal{L}_{v}=\frac{1}{B}\sum_{i=1}^{B}(v_i-z_i)^2`;
  if (text.includes("cross_entropy") || text.includes("policy_loss")) return String.raw`\mathcal{L}_{\pi}=-\frac{1}{B}\sum_{i=1}^{B}\sum_a \pi_{i,a}\log p_{i,a}`;
  if (text.includes("dpo") || text.includes("preference")) return String.raw`\mathcal{L}_{\mathrm{DPO}}=-\log\sigma\!\left(\beta\left[\log\frac{\pi_\theta(y_w\mid x)}{\pi_{\mathrm{ref}}(y_w\mid x)}-\log\frac{\pi_\theta(y_l\mid x)}{\pi_{\mathrm{ref}}(y_l\mid x)}\right]\right)`;
  if (text.includes("cosine") || text.includes("retrieval") || text.includes("embedding")) return String.raw`\operatorname{sim}(\mathbf{q},\mathbf{d})=\frac{\mathbf{q}^{\top}\mathbf{d}}{\lVert\mathbf{q}\rVert_2\lVert\mathbf{d}\rVert_2}`;
  if (text.includes("lora")) return String.raw`W'=W+\Delta W,\qquad \Delta W=BA,\qquad \operatorname{rank}(\Delta W)\le r`;
  if (text.includes("federat") || text.includes("fedavg")) return String.raw`\mathbf{w}_{t+1}=\sum_{k=1}^{K}\frac{n_k}{\sum_j n_j}\mathbf{w}_{t+1}^{(k)}`;
  if (text.includes("flash") || text.includes("cuda") || text.includes("kernel")) return String.raw`\text{arithmetic intensity}=\frac{\text{floating-point operations}}{\text{bytes moved from global memory}}`;
  return String.raw`\theta_{t+1}=\theta_t-\eta\,\nabla_\theta\mathcal{L}(\theta_t)`;
}

const alphaZeroSolutions: Record<string, string> = {
  make_empty_board: `def make_empty_board():\n    return np.zeros((6, 7), dtype=np.int8)`,
  column_top_row: `def column_top_row(board, column):\n    filled = np.flatnonzero(board[:, column])\n    return int(filled[0]) if len(filled) else board.shape[0]`,
  drop_piece: `def drop_piece(board, column, player):\n    result = board.copy()\n    empty = np.flatnonzero(result[:, column] == 0)\n    if not len(empty): raise ValueError("column is full")\n    result[empty[-1], column] = player\n    return result`,
  column_full: `def column_full(board, column):\n    return bool(board[0, column] != 0)`,
  valid_moves: `def valid_moves(board):\n    return np.flatnonzero(board[0] == 0).tolist()`,
  four_in_a_row_horizontal: `def four_in_a_row_horizontal(board, player):\n    return any(np.all(board[r, c:c+4] == player) for r in range(6) for c in range(4))`,
  four_in_a_row_vertical: `def four_in_a_row_vertical(board, player):\n    return any(np.all(board[r:r+4, c] == player) for r in range(3) for c in range(7))`,
  four_in_a_row_diagonal_down_right: `def four_in_a_row_diagonal_down_right(board, player):\n    return any(all(board[r+i, c+i] == player for i in range(4)) for r in range(3) for c in range(4))`,
  four_in_a_row_diagonal_up_right: `def four_in_a_row_diagonal_up_right(board, player):\n    return any(all(board[r-i, c+i] == player for i in range(4)) for r in range(3, 6) for c in range(4))`,
  check_winner: `def check_winner(board):\n    for player in (1, 2):\n        if any((four_in_a_row_horizontal(board, player), four_in_a_row_vertical(board, player),\n                four_in_a_row_diagonal_down_right(board, player), four_in_a_row_diagonal_up_right(board, player))):\n            return player\n    return 0`,
  board_is_full: `def board_is_full(board):\n    return bool(np.all(board[0] != 0))`,
  is_terminal: `def is_terminal(board):\n    return check_winner(board) != 0 or board_is_full(board)`,
  other_player: `def other_player(player):\n    if player not in (1, 2): raise ValueError("player must be 1 or 2")\n    return 3 - player`,
  step_env: `def step_env(board, action, player):\n    next_board = drop_piece(board, action, player)\n    winner = check_winner(next_board)\n    done = winner != 0 or board_is_full(next_board)\n    reward = 1.0 if winner == player else 0.0\n    return next_board, reward, done, {"winner": winner}`,
  ...alphaZeroAdvancedSolutions,
};

function codeFor(location: StepLocation) {
  const { project, step } = location; const name = step.title.replace(/[^a-zA-Z0-9_]/g, "_");
  const explicit = project.slug === "alphazero-on-connect-4-from-scratch" ? alphaZeroSolutions[step.title] : undefined;
  if (explicit) {
    const imports = `import numpy as np\nimport torch\nfrom torch import nn`;
    return { starter: `${imports}\n\ndef ${name}(*args, **kwargs):\n    # Your turn: implement this step.\n    raise NotImplementedError`, solution: `${imports}\n\n${explicit}` };
  }
  const cuda = project.framework.includes("CUDA");
  if (cuda) return { starter: `// Step ${step.order}: ${step.title}\n#include <cuda_runtime.h>\n\n__global__ void ${name}_kernel(float* output, const float* input, int n) {\n    // TODO: implement the kernel for this step.\n}\n`, solution: `// Reference structure for ${step.title}\n#include <cuda_runtime.h>\n\n__global__ void ${name}_kernel(float* output, const float* input, int n) {\n    int i = blockIdx.x * blockDim.x + threadIdx.x;\n    if (i < n) output[i] = input[i]; // Replace with the operation derived above.\n}\n` };
  return { starter: `def ${name}(*args, **kwargs):\n    \"\"\"Implement ${humanize(step.title)}.\"\"\"\n    # TODO: follow the contracts and checks on this page.\n    raise NotImplementedError\n`, solution: `def ${name}(*args, **kwargs):\n    \"\"\"Reference scaffold for ${humanize(step.title)}.\n\n    Keep input validation separate from the core operation, then return a value\n    whose shape and dtype match the contract described above.\n    \"\"\"\n    if not args and not kwargs:\n        raise ValueError("${name} needs its documented inputs")\n    result = args[0] if args else next(iter(kwargs.values()))\n    return result\n` };
}

export function buildStepLesson(location: StepLocation) {
  const label = humanize(location.step.title); const code = codeFor(location);
  return {
    label,
    objective: `Build ${label} as one small, testable piece of ${location.part.title}.`,
    intuition: `${label} has one clear responsibility. Think of it as a small tool on a workbench: it should accept a well-defined input, perform exactly one job, and return an output the next step can trust. Keeping this boundary small is what lets a large ${location.project.title} system remain understandable.`,
    why: `This step exists because ${location.part.description.toLowerCase()} Later lessons assume this behavior already works, so correctness here removes uncertainty from everything downstream.`,
    equation: equation(location.project, location.part, location.step),
    derivation: [
      `Name every input and write down its shape, dtype, and legal range.`,
      `Express the transformation independently of the surrounding project.`,
      `Check the smallest normal case, an edge case, and an invalid case.`,
      `Only after those checks pass, connect the function to the next lesson.`,
    ],
    starter: code.starter,
    solution: code.solution,
    tests: `def test_${location.step.title.replace(/[^a-zA-Z0-9_]/g, "_")}():\n    # Arrange: create the smallest valid input.\n    # Act: call the function from this lesson.\n    # Assert: check value, shape, dtype, and input immutability.\n    assert True\n`,
    mistakes: [
      `Changing the input in place when later code expects it to remain unchanged.`,
      `Returning the right values with the wrong shape or dtype.`,
      `Testing only the happy path and missing empty, full, masked, or boundary inputs.`,
    ],
    quiz: { question: `What should you verify first for ${label}?`, options: ["Only runtime speed", "The input/output contract", "The final project score", "GPU utilization"], answer: 1 },
  };
}
