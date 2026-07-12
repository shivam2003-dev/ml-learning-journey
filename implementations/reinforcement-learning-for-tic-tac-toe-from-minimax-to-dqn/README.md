# Tic-Tac-Toe from Minimax to DQN

A complete game engine, exact minimax oracle, replay-based NumPy DQN, legal-action masking, self-play data, and oracle evaluation.

## Layout

- `src/tictactoe_rl/core.py`: deterministic, modular implementation.
- `src/tictactoe_rl/cli.py`: configuration-driven command line entry point.
- `tutorial.ipynb`: executable first-principles walkthrough.
- `tests/test_core.py`: behavioral and numerical checks.
- `config.json`: small reproducible default run.

## Run

```bash
python -m pip install -e '.[test]'
tictactoe-rl --config config.json
pytest
```

The default configuration is deliberately small enough for CPU execution. Scale dimensions and steps only after the reference assertions pass.
