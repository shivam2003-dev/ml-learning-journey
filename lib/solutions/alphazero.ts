// Each value is deliberately a small, runnable reference for one lesson. The
// walkthrough introduces imports and shared types in the lessons that need them.
export const alphaZeroAdvancedSolutions: Record<string, string> = {
  encode_board: `def encode_board(board, current_player):
    opponent = 3 - current_player
    return np.stack([board == current_player, board == opponent, board == 0]).astype(np.float32)`,
  board_to_torch_tensor: `def board_to_torch_tensor(board, current_player, device="cpu"):
    encoded = encode_board(board, current_player)
    return torch.from_numpy(encoded).unsqueeze(0).to(device)`,
  init_conv_backbone: `def init_conv_backbone(channels=64):
    return nn.Sequential(
        nn.Conv2d(3, channels, 3, padding=1, bias=False), nn.BatchNorm2d(channels), nn.ReLU(),
        nn.Conv2d(channels, channels, 3, padding=1, bias=False), nn.BatchNorm2d(channels), nn.ReLU(),
    )`,
  init_policy_head: `def init_policy_head(channels=64):
    return nn.Sequential(nn.Conv2d(channels, 2, 1), nn.ReLU(), nn.Flatten(), nn.Linear(2 * 6 * 7, 7))`,
  init_value_head: `def init_value_head(channels=64):
    return nn.Sequential(nn.Conv2d(channels, 1, 1), nn.ReLU(), nn.Flatten(),
                         nn.Linear(6 * 7, 64), nn.ReLU(), nn.Linear(64, 1), nn.Tanh())`,
  build_policy_value_net: `class PolicyValueNet(nn.Module):
    def __init__(self, channels=64):
        super().__init__()
        self.backbone = init_conv_backbone(channels)
        self.policy_head = init_policy_head(channels)
        self.value_head = init_value_head(channels)

    def forward(self, x):
        features = self.backbone(x)
        return self.policy_head(features), self.value_head(features).squeeze(-1)

def build_policy_value_net(channels=64):
    return PolicyValueNet(channels)`,
  policy_value_forward: `def policy_value_forward(model, states):
    logits, values = model(states)
    if logits.shape[-1] != 7: raise ValueError("policy must score seven columns")
    return logits, values`,
  action_mask: `def action_mask(board):
    return torch.as_tensor(board[0] == 0, dtype=torch.bool)`,
  masked_policy_logits: `def masked_policy_logits(logits, mask):
    if not torch.any(mask): raise ValueError("terminal board has no legal action")
    return logits.masked_fill(~mask.to(logits.device), -torch.inf)`,
  masked_log_softmax: `def masked_log_softmax(logits, mask):
    return torch.log_softmax(masked_policy_logits(logits, mask), dim=-1)`,
  sample_action_from_policy: `def sample_action_from_policy(logits, mask, temperature=1.0):
    if temperature <= 0: return greedy_action_from_policy(logits, mask)
    probs = torch.softmax(masked_policy_logits(logits / temperature, mask), dim=-1)
    return int(torch.multinomial(probs, 1).item())`,
  greedy_action_from_policy: `def greedy_action_from_policy(logits, mask):
    return int(torch.argmax(masked_policy_logits(logits, mask)).item())`,
  make_mcts_node: `def make_mcts_node(board, player, prior=1.0, parent=None, action=None):
    return {"board": board.copy(), "player": player, "prior": float(prior), "parent": parent,
            "action": action, "children": {}, "visits": 0, "value_sum": 0.0, "expanded": False}`,
  node_q_value: `def node_q_value(node):
    return node["value_sum"] / node["visits"] if node["visits"] else 0.0`,
  ucb_score: `def ucb_score(parent, child, c_puct=1.5):
    exploration = c_puct * child["prior"] * np.sqrt(parent["visits"] + 1) / (child["visits"] + 1)
    return -node_q_value(child) + exploration`,
  select_best_child: `def select_best_child(node, c_puct=1.5):
    if not node["children"]: raise ValueError("cannot select from a leaf")
    return max(node["children"].items(), key=lambda item: ucb_score(node, item[1], c_puct))`,
  select_leaf: `def select_leaf(root, c_puct=1.5):
    node = root
    while node["expanded"] and node["children"]:
        _, node = select_best_child(node, c_puct)
    return node`,
  evaluate_with_network: `@torch.no_grad()
def evaluate_with_network(model, board, player, device="cpu"):
    logits, value = model(board_to_torch_tensor(board, player, device))
    mask = action_mask(board).to(device)
    priors = torch.softmax(masked_policy_logits(logits[0], mask), -1).cpu().numpy()
    return priors, float(value.item())`,
  expand_node: `def expand_node(node, priors):
    if is_terminal(node["board"]): return
    for action in valid_moves(node["board"]):
        board = drop_piece(node["board"], action, node["player"])
        node["children"][action] = make_mcts_node(board, other_player(node["player"]), priors[action], node, action)
    node["expanded"] = True`,
  backup_value: `def backup_value(node, value):
    while node is not None:
        node["visits"] += 1
        node["value_sum"] += value
        value = -value
        node = node["parent"]`,
  run_one_simulation: `def run_one_simulation(root, model, c_puct=1.5):
    leaf = select_leaf(root, c_puct)
    winner = check_winner(leaf["board"])
    if winner or board_is_full(leaf["board"]):
        value = 0.0 if not winner else (-1.0 if winner != leaf["player"] else 1.0)
    else:
        priors, value = evaluate_with_network(model, leaf["board"], leaf["player"])
        expand_node(leaf, priors)
    backup_value(leaf, value)`,
  run_mcts: `def run_mcts(board, player, model, simulations=100, c_puct=1.5):
    root = make_mcts_node(board, player)
    priors, _ = evaluate_with_network(model, board, player)
    expand_node(root, priors)
    for _ in range(simulations): run_one_simulation(root, model, c_puct)
    return root`,
  visit_count_policy: `def visit_count_policy(root, temperature=1.0):
    counts = np.array([root["children"].get(a, {"visits": 0})["visits"] for a in range(7)], dtype=np.float64)
    if temperature == 0:
        policy = np.zeros(7); policy[np.argmax(counts)] = 1.0; return policy
    counts = counts ** (1.0 / temperature)
    return counts / counts.sum()`,
  mcts_choose_action: `def mcts_choose_action(root, temperature=1.0):
    policy = visit_count_policy(root, temperature)
    return int(np.random.choice(7, p=policy)), policy`,
  record_self_play_step: `def record_self_play_step(history, board, player, policy):
    history.append({"state": encode_board(board, player), "policy": np.asarray(policy, np.float32),
                    "player": player, "value": None})`,
  play_self_play_game: `def play_self_play_game(model, simulations=100, temperature=1.0):
    board, player, history = make_empty_board(), 1, []
    while not is_terminal(board):
        root = run_mcts(board, player, model, simulations)
        action, policy = mcts_choose_action(root, temperature)
        record_self_play_step(history, board, player, policy)
        board = drop_piece(board, action, player); player = other_player(player)
    return assign_value_targets(history, check_winner(board))`,
  assign_value_targets: `def assign_value_targets(history, winner):
    for sample in history:
        sample["value"] = 0.0 if winner == 0 else (1.0 if sample["player"] == winner else -1.0)
    return history`,
  generate_self_play_batch: `def generate_self_play_batch(model, games=8, simulations=100):
    samples = []
    for _ in range(games): samples.extend(play_self_play_game(model, simulations))
    return samples`,
  value_loss_mse: `def value_loss_mse(predicted, target):
    return torch.mean((predicted - target) ** 2)`,
  policy_loss_cross_entropy: `def policy_loss_cross_entropy(logits, target_policy):
    return -(target_policy * torch.log_softmax(logits, dim=-1)).sum(-1).mean()`,
  l2_regularization_loss: `def l2_regularization_loss(model):
    return sum(parameter.square().sum() for parameter in model.parameters())`,
  combined_loss: `def combined_loss(logits, values, target_policy, target_value, model, weight_decay=1e-4):
    policy = policy_loss_cross_entropy(logits, target_policy)
    value = value_loss_mse(values, target_value)
    return policy + value + weight_decay * l2_regularization_loss(model)`,
  encode_batch_states: `def encode_batch_states(samples, device="cpu"):
    states = torch.from_numpy(np.stack([s["state"] for s in samples])).float().to(device)
    policies = torch.from_numpy(np.stack([s["policy"] for s in samples])).float().to(device)
    values = torch.tensor([s["value"] for s in samples], dtype=torch.float32, device=device)
    return states, policies, values`,
  iterate_minibatches: `def iterate_minibatches(samples, batch_size=64, shuffle=True):
    indices = np.arange(len(samples))
    if shuffle: np.random.shuffle(indices)
    for start in range(0, len(indices), batch_size):
        yield [samples[i] for i in indices[start:start + batch_size]]`,
  training_step: `def training_step(model, optimizer, batch):
    states, policies, values = encode_batch_states(batch, next(model.parameters()).device)
    optimizer.zero_grad(); logits, predictions = model(states)
    loss = combined_loss(logits, predictions, policies, values, model)
    loss.backward(); torch.nn.utils.clip_grad_norm_(model.parameters(), 1.0); optimizer.step()
    return float(loss.detach())`,
  training_epoch: `def training_epoch(model, optimizer, samples, batch_size=64):
    model.train()
    losses = [training_step(model, optimizer, batch) for batch in iterate_minibatches(samples, batch_size)]
    return float(np.mean(losses))`,
  self_play_iteration: `def self_play_iteration(model, optimizer, games=8, simulations=100, epochs=5):
    model.eval(); samples = generate_self_play_batch(model, games, simulations)
    losses = [training_epoch(model, optimizer, samples) for _ in range(epochs)]
    return {"samples": len(samples), "loss": losses[-1]}`,
  train_loop: `def train_loop(model, iterations=20, learning_rate=1e-3):
    optimizer = torch.optim.Adam(model.parameters(), lr=learning_rate)
    history = []
    for iteration in range(iterations):
        metrics = self_play_iteration(model, optimizer); metrics["iteration"] = iteration
        history.append(metrics)
    return history`,
  random_policy_action: `def random_policy_action(board):
    moves = valid_moves(board)
    if not moves: raise ValueError("no legal action")
    return int(np.random.choice(moves))`,
  greedy_agent_action: `def greedy_agent_action(model, board, player):
    logits, _ = model(board_to_torch_tensor(board, player))
    return greedy_action_from_policy(logits[0], action_mask(board))`,
  play_one_match: `def play_one_match(agent_a, agent_b):
    board, player = make_empty_board(), 1
    agents = {1: agent_a, 2: agent_b}
    while not is_terminal(board):
        board = drop_piece(board, agents[player](board, player), player); player = other_player(player)
    return check_winner(board)`,
  match_win_rate: `def match_win_rate(agent, baseline, games=100):
    wins = draws = 0
    for game in range(games):
        winner = play_one_match(agent, baseline) if game % 2 == 0 else play_one_match(baseline, agent)
        wins += winner == (1 if game % 2 == 0 else 2); draws += winner == 0
    return {"win_rate": wins / games, "draw_rate": draws / games}`,
  evaluate_against_random: `def evaluate_against_random(model, games=100):
    agent = lambda board, player: greedy_agent_action(model, board, player)
    baseline = lambda board, player: random_policy_action(board)
    return match_win_rate(agent, baseline, games)`,
};
