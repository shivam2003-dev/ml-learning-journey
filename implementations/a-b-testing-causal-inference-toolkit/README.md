# A/B Testing and Causal Inference Toolkit

Statistical primitives for powered proportion experiments, confidence intervals, multiplicity, difference-in-differences, and synthetic controls.

## Layout

- `src/causal_toolkit/core.py`: deterministic, modular implementation.
- `src/causal_toolkit/cli.py`: configuration-driven command line entry point.
- `tutorial.ipynb`: executable first-principles walkthrough.
- `tests/test_core.py`: behavioral and numerical checks.
- `config.json`: small reproducible default run.

## Run

```bash
python -m pip install -e '.[test]'
causal-toolkit --config config.json
pytest
```

The default configuration is deliberately small enough for CPU execution. Scale dimensions and steps only after the reference assertions pass.
