# Trainable Mixture-of-Experts

A tested CPU reference for top-k routing, capacity-aware dispatch, expert execution, combination, and load diagnostics suitable for validating CUDA kernels.

## Layout

- `src/moe/core.py`: deterministic, modular implementation.
- `src/moe/cli.py`: configuration-driven command line entry point.
- `tutorial.ipynb`: executable first-principles walkthrough.
- `tests/test_core.py`: behavioral and numerical checks.
- `config.json`: small reproducible default run.

## Run

```bash
python -m pip install -e '.[test]'
moe --config config.json
pytest
```

The default configuration is deliberately small enough for CPU execution. Scale dimensions and steps only after the reference assertions pass.
