# Market-Making Betting Game Simulator

Expected-value, fractional-Kelly, inventory-aware quoting, stochastic fills, and risk-adjusted evaluation in a seeded simulator.

## Layout

- `src/market_sim/core.py`: deterministic, modular implementation.
- `src/market_sim/cli.py`: configuration-driven command line entry point.
- `tutorial.ipynb`: executable first-principles walkthrough.
- `tests/test_core.py`: behavioral and numerical checks.
- `config.json`: small reproducible default run.

## Run

```bash
python -m pip install -e '.[test]'
market-sim --config config.json
pytest
```

The default configuration is deliberately small enough for CPU execution. Scale dimensions and steps only after the reference assertions pass.
