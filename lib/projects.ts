export type Difficulty = "Easy" | "Medium" | "Hard";

export type Project = {
  slug: string;
  title: string;
  subtitle: string;
  difficulty: Difficulty;
  category: string;
  framework: string;
  minutes: number;
  steps: number;
  description: string;
  skills: string[];
  libraries: string[];
  concepts: string[];
  color: string;
  source: string;
};

const source = (slug: string) => `https://www.deep-ml.com/projects/${slug}`;

// The entire journey is generated from this array. Add one object to add a project.
export const projects: Project[] = [
  {
    slug: "random-forest-from-scratch", title: "Random Forest from Scratch", subtitle: "Trees become a forest", difficulty: "Medium", category: "Machine Learning", framework: "NumPy", minutes: 75, steps: 15, color: "#62a8ff",
    description: "Build a complete Random Forest classifier from impurity math to a bagged ensemble with bootstrapping and feature subsampling.", skills: ["Decision trees", "Ensembles", "Classification"], libraries: ["NumPy"], concepts: ["Gini impurity", "Bagging", "Feature sampling"], source: source("random-forest-from-scratch")
  },
  {
    slug: "support-vector-machine-from-scratch", title: "Support Vector Machine from Scratch", subtitle: "Find the widest margin", difficulty: "Medium", category: "Machine Learning", framework: "NumPy", minutes: 55, steps: 11, color: "#7f8cff",
    description: "Build a linear SVM using hinge loss, a regularized objective, and gradient-based optimization.", skills: ["Optimization", "Classification", "Linear algebra"], libraries: ["NumPy"], concepts: ["Hinge loss", "Margins", "Regularization"], source: source("support-vector-machine-from-scratch")
  },
  {
    slug: "build-a-trainable-cnn-from-scratch-in-numpy", title: "Build a Trainable CNN from Scratch", subtitle: "See through convolutions", difficulty: "Hard", category: "Deep Learning", framework: "NumPy", minutes: 295, steps: 59, color: "#9b7bff",
    description: "Assemble a LeNet-style convolutional network with im2col convolutions, gradients, Adam, and a complete training loop.", skills: ["Convolutions", "Backpropagation", "Training loops"], libraries: ["NumPy"], concepts: ["im2col", "Pooling", "Adam"], source: source("build-a-trainable-cnn-from-scratch-in-numpy")
  },
  {
    slug: "attention-is-all-you-need-build-the-transformer-from-scratch", title: "Transformer from Scratch", subtitle: "Attention changes everything", difficulty: "Hard", category: "Deep Learning", framework: "PyTorch", minutes: 395, steps: 79, color: "#c06cff",
    description: "Reimplement the original encoder-decoder Transformer with multi-head attention, scheduling, and beam search.", skills: ["Attention", "Sequence models", "Inference"], libraries: ["PyTorch"], concepts: ["Multi-head attention", "Positional encoding", "Beam search"], source: source("attention-is-all-you-need-build-the-transformer-from-scratch")
  },
  {
    slug: "tiny-gpt-from-scratch", title: "Tiny GPT From Scratch", subtitle: "Teach a model to write", difficulty: "Hard", category: "Deep Learning", framework: "NumPy · PyTorch", minutes: 830, steps: 166, color: "#ee68d3",
    description: "Grow a character-level language model from a bigram baseline into a working GPT with multi-head attention and sampling.", skills: ["Language modeling", "Autoregression", "Tokenization"], libraries: ["NumPy", "PyTorch"], concepts: ["Causal attention", "Adam", "Sampling"], source: source("tiny-gpt-from-scratch")
  },
  {
    slug: "q-learning-on-frozenlake-from-scratch", title: "Q-Learning on FrozenLake", subtitle: "Learn by exploring", difficulty: "Easy", category: "Reinforcement Learning", framework: "NumPy", minutes: 80, steps: 16, color: "#ff6fae",
    description: "Train a tabular Q-learning agent with epsilon-greedy exploration and greedy evaluation.", skills: ["Q-learning", "Exploration", "Evaluation"], libraries: ["NumPy", "Gymnasium"], concepts: ["Bellman update", "Epsilon greedy", "Q-table"], source: source("q-learning-on-frozenlake-from-scratch")
  },
  {
    slug: "alphazero-on-connect-4-from-scratch", title: "AlphaZero on Connect-4", subtitle: "Search, play, improve", difficulty: "Hard", category: "Reinforcement Learning", framework: "PyTorch", minutes: 285, steps: 57, color: "#ff707d",
    description: "Build the game engine, policy-value network, PUCT MCTS, self-play generation, training, and baseline evaluation.", skills: ["MCTS", "Self-play", "Policy learning"], libraries: ["PyTorch", "NumPy"], concepts: ["PUCT", "Value networks", "Replay buffer"], source: source("alphazero-on-connect-4-from-scratch")
  },
  {
    slug: "build-a-retrieval-augmented-generation-pipeline-from-scratch", title: "RAG Pipeline", subtitle: "Answers grounded in evidence", difficulty: "Hard", category: "LLMs", framework: "PyTorch", minutes: 255, steps: 51, color: "#ff835f",
    description: "Construct ingestion, chunking, embeddings, hybrid retrieval, grounded generation, evaluation, and conversational memory.", skills: ["Retrieval", "Embeddings", "LLM evaluation"], libraries: ["PyTorch", "FAISS"], concepts: ["Vector search", "Reranking", "Grounded generation"], source: source("build-a-retrieval-augmented-generation-pipeline-from-scratch")
  },
  {
    slug: "direct-preference-optimization-dpo-from-scratch", title: "DPO from Scratch", subtitle: "Align without an RL loop", difficulty: "Hard", category: "Alignment", framework: "NumPy", minutes: 135, steps: 27, color: "#ff9d52",
    description: "Implement log-prob utilities, Bradley–Terry preferences, DPO gradients, IPO variants, and a full evaluation pipeline.", skills: ["Preference learning", "Alignment", "Evaluation"], libraries: ["NumPy"], concepts: ["DPO loss", "Reference policy", "IPO"], source: source("direct-preference-optimization-dpo-from-scratch")
  },
  {
    slug: "rlhf-from-scratch-on-distilgpt2", title: "RLHF from Scratch", subtitle: "Shape helpful behavior", difficulty: "Hard", category: "LLMs", framework: "PyTorch", minutes: 325, steps: 65, color: "#ffb24c",
    description: "Build decoding, SFT, LoRA, reward modeling, PPO, preference optimization, evaluation, and a model comparison interface.", skills: ["Reward modeling", "PPO", "Fine-tuning"], libraries: ["PyTorch", "Transformers"], concepts: ["SFT", "LoRA", "Preference optimization"], source: source("rlhf-from-scratch-on-distilgpt2")
  },
  {
    slug: "vision-language-model-from-scratch-in-pytorch", title: "Vision-Language Model", subtitle: "Connect pixels and words", difficulty: "Hard", category: "Generative AI", framework: "PyTorch", minutes: 310, steps: 62, color: "#d6c14d",
    description: "Build a ViT encoder, multimodal projector, causal decoder, training loop, and caption generation from raw tensor operations.", skills: ["Computer vision", "Multimodal fusion", "Generation"], libraries: ["PyTorch"], concepts: ["ViT", "Projection layers", "Autoregressive decoding"], source: source("vision-language-model-from-scratch-in-pytorch")
  },
  {
    slug: "flash-attention-in-cuda-from-scratch", title: "Flash Attention in CUDA", subtitle: "Make attention fly", difficulty: "Hard", category: "CUDA", framework: "CUDA", minutes: 130, steps: 26, color: "#9bd15b",
    description: "Build a tiled, IO-aware Flash Attention kernel with online softmax and causal masking.", skills: ["GPU kernels", "Performance", "Attention"], libraries: ["CUDA C++"], concepts: ["Tiling", "Online softmax", "Memory hierarchy"], source: source("flash-attention-in-cuda-from-scratch")
  },
  {
    slug: "fused-llm-inference-kernels-in-cuda", title: "Fused LLM Inference Kernels", subtitle: "Fuse the hot path", difficulty: "Hard", category: "GPU / CUDA", framework: "CUDA", minutes: 100, steps: 20, color: "#52d38b",
    description: "Implement reductions, activations, fused RMSNorm, Softmax, RoPE, and SwiGLU kernels for efficient inference.", skills: ["CUDA", "Kernel fusion", "Profiling"], libraries: ["CUDA C++"], concepts: ["Warp reductions", "RoPE", "SwiGLU"], source: source("fused-llm-inference-kernels-in-cuda")
  },
  {
    slug: "build-a-mini-llm-inference-server", title: "Mini LLM Inference Server", subtitle: "Serve every token", difficulty: "Hard", category: "ML Systems", framework: "Python", minutes: 255, steps: 51, color: "#42d2b8",
    description: "Construct sampling, tokenization, KV caching, paged allocation, continuous batching, streaming, and benchmarking.", skills: ["Model serving", "Scheduling", "Benchmarking"], libraries: ["Python", "FastAPI"], concepts: ["KV cache", "Paged attention", "Continuous batching"], source: source("build-a-mini-llm-inference-server")
  },
  {
    slug: "verillm-publicly-verifiable-decentralized-llm-inference-from-scr", title: "VeriLLM", subtitle: "Trust, but verify", difficulty: "Hard", category: "Deep Learning", framework: "PyTorch", minutes: 285, steps: 57, color: "#42cad6",
    description: "Wrap cached GPT inference in Merkle commitments and spot checks, then simulate a decentralized committee with rewards and slashing.", skills: ["Verifiable compute", "Transformers", "Protocols"], libraries: ["PyTorch"], concepts: ["Merkle trees", "Spot checks", "Slashing"], source: source("verillm-publicly-verifiable-decentralized-llm-inference-from-scr")
  },
  {
    slug: "build-an-mlp-in-jax-from-scratch", title: "MLP in JAX from Scratch", subtitle: "Think functionally", difficulty: "Easy", category: "Deep Learning", framework: "JAX", minutes: 105, steps: 21, color: "#49b7ed",
    description: "Implement initialization, forward passes, loss, autodiff, and pure functional SGD updates in JAX.", skills: ["JAX", "Autodiff", "Functional programming"], libraries: ["JAX"], concepts: ["PRNG keys", "jit", "grad"], source: source("build-an-mlp-in-jax-from-scratch")
  },
  {
    slug: "build-your-own-teenygrad-a-tiny-tensor-autograd-engine", title: "Build Your Own teenygrad", subtitle: "Own every gradient", difficulty: "Hard", category: "Deep Learning", framework: "NumPy", minutes: 290, steps: 58, color: "#5999ff",
    description: "Construct a lazy buffer, reverse-mode autodiff engine, tensor API, neural primitives, and train a small MLP.", skills: ["Autograd", "Tensor systems", "Framework design"], libraries: ["NumPy"], concepts: ["Computation graphs", "Reverse mode", "Lazy execution"], source: source("build-your-own-teenygrad-a-tiny-tensor-autograd-engine")
  },
  {
    slug: "federated-averaging-fedavg-from-scratch-in-pytorch", title: "Federated Averaging", subtitle: "Learn without centralizing", difficulty: "Medium", category: "Federated Learning", framework: "PyTorch", minutes: 130, steps: 26, color: "#707cff",
    description: "Implement client partitioning, local SGD, weighted aggregation, partial participation, and non-IID experiments.", skills: ["Federated learning", "Distributed systems", "Experimentation"], libraries: ["PyTorch"], concepts: ["FedAvg", "Non-IID data", "Communication rounds"], source: source("federated-averaging-fedavg-from-scratch-in-pytorch")
  },
  {
    slug: "diloco-distributed-low-communication-training-of-language-models", title: "DiLoCo Distributed Training", subtitle: "Train more, talk less", difficulty: "Hard", category: "Distributed Training", framework: "PyTorch", minutes: 150, steps: 30, color: "#966fff",
    description: "Train workers locally, aggregate pseudo-gradients with an outer optimizer, and quantify communication savings.", skills: ["Distributed training", "Optimization", "Sharding"], libraries: ["PyTorch"], concepts: ["Inner/outer optimizers", "Pseudo-gradients", "Non-IID sharding"], source: source("diloco-distributed-low-communication-training-of-language-models")
  },
  {
    slug: "mini-distributed-training-and-memory-constrained-trainer-from-sc", title: "Memory-Constrained Trainer", subtitle: "Fit what should not fit", difficulty: "Hard", category: "Distributed Training", framework: "NumPy", minutes: 200, steps: 40, color: "#c366f5",
    description: "Implement accumulation, checkpointing, mixed precision, all-reduce, and ZeRO-style optimizer sharding.", skills: ["Memory optimization", "Parallelism", "Training systems"], libraries: ["NumPy"], concepts: ["Checkpointing", "Mixed precision", "ZeRO"], source: source("mini-distributed-training-and-memory-constrained-trainer-from-sc")
  },
  {
    slug: "trainable-mixture-of-experts-in-cuda", title: "Trainable MoE in CUDA", subtitle: "Route to the experts", difficulty: "Hard", category: "GPU Programming", framework: "CUDA", minutes: 260, steps: 52, color: "#e260d5",
    description: "Build CUDA kernels for a complete sparse mixture-of-experts forward, backward, and training loop.", skills: ["Sparse models", "CUDA", "Backpropagation"], libraries: ["CUDA C++"], concepts: ["Top-k routing", "Token dispatch", "Load balancing"], source: source("trainable-mixture-of-experts-in-cuda")
  },
  {
    slug: "multimodal-autoregressive-image-generator-from-scratch-in-jax", title: "Multimodal Image Generator", subtitle: "Turn words into worlds", difficulty: "Hard", category: "Generative AI", framework: "JAX", minutes: 320, steps: 64, color: "#ff63ab",
    description: "Train a VQ-VAE image tokenizer and an autoregressive text-conditioned transformer with guided sampling.", skills: ["Generative modeling", "JAX", "Multimodal learning"], libraries: ["JAX"], concepts: ["VQ-VAE", "Discrete tokens", "Classifier-free guidance"], source: source("multimodal-autoregressive-image-generator-from-scratch-in-jax")
  },
  {
    slug: "lora-fine-tune-a-tiny-chat-model-with-unsloth", title: "LoRA Fine-Tune a Chat Model", subtitle: "Make a model yours", difficulty: "Easy", category: "Fine-tuning", framework: "Unsloth", minutes: 100, steps: 20, color: "#ff7b76",
    description: "Load a 4-bit Qwen model, attach LoRA adapters, format instructions, run SFT, and generate with the tuned model.", skills: ["Fine-tuning", "Data formatting", "Inference"], libraries: ["Unsloth", "Transformers"], concepts: ["QLoRA", "SFT", "Quantization"], source: source("lora-fine-tune-a-tiny-chat-model-with-unsloth")
  },
  {
    slug: "a-b-testing-causal-inference-toolkit", title: "A/B Testing & Causal Inference", subtitle: "Ship with statistical rigor", difficulty: "Medium", category: "Machine Learning", framework: "Python", minutes: 110, steps: 22, color: "#ff9e53",
    description: "Build proportion tests, sample sizing, multiple-testing corrections, difference-in-differences, and synthetic control.", skills: ["Experimentation", "Causal inference", "Statistics"], libraries: ["NumPy", "SciPy"], concepts: ["Power analysis", "DiD", "Synthetic control"], source: source("a-b-testing-causal-inference-toolkit")
  },
  {
    slug: "market-making-betting-game-simulator", title: "Market-Making Simulator", subtitle: "Quote, trade, survive", difficulty: "Medium", category: "Optimization", framework: "Python", minutes: 70, steps: 14, color: "#ffc54f",
    description: "Build expected-value games and a quoting engine that manages inventory, adverse selection, and P&L.", skills: ["Optimization", "Simulation", "Risk"], libraries: ["NumPy"], concepts: ["Expected value", "Bid-ask spread", "Inventory risk"], source: source("market-making-betting-game-simulator")
  },
  {
    slug: "reinforcement-learning-for-tic-tac-toe-from-minimax-to-dqn", title: "Tic-Tac-Toe: Minimax to DQN", subtitle: "Master every move", difficulty: "Hard", category: "Reinforcement Learning", framework: "PyTorch", minutes: 460, steps: 92, color: "#d2d75a",
    description: "Build the game engine, minimax, tabular self-play, and a DQN agent, then compare value and policy learners.", skills: ["Minimax", "Deep RL", "Self-play"], libraries: ["PyTorch", "NumPy"], concepts: ["DQN", "Bootstrapping", "Exploration"], source: source("reinforcement-learning-for-tic-tac-toe-from-minimax-to-dqn")
  }
];

export const projectBySlug = (slug: string) => projects.find((project) => project.slug === slug);
export const totalMinutes = projects.reduce((sum, project) => sum + project.minutes, 0);
export const totalSteps = projects.reduce((sum, project) => sum + project.steps, 0);
