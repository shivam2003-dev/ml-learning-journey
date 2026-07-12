# Memory-Constrained Distributed Trainer

Gradient accumulation, activation recomputation, mixed precision, simulated all-reduce, and ZeRO-style state partitioning.

## Layout

- `src/memory_trainer/core.py`: deterministic, modular implementation.
- `src/memory_trainer/cli.py`: configuration-driven command line entry point.
- `tutorial.ipynb`: executable first-principles walkthrough.
- `tests/test_core.py`: behavioral and numerical checks.
- `config.json`: small reproducible default run.

## Run

```bash
python -m pip install -e '.[test]'
memory-trainer --config config.json
pytest
```

The default configuration is deliberately small enough for CPU execution. Scale dimensions and steps only after the reference assertions pass.
