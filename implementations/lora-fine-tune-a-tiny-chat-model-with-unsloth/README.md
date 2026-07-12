# LoRA Fine-Tune a Tiny Chat Model

A dependency-light QLoRA reference demonstrating 4-bit loading, frozen weights, low-rank adapters, merge, and held-out evaluation.

## Layout

- `src/lora_tune/core.py`: deterministic, modular implementation.
- `src/lora_tune/cli.py`: configuration-driven command line entry point.
- `tutorial.ipynb`: executable first-principles walkthrough.
- `tests/test_core.py`: behavioral and numerical checks.
- `config.json`: small reproducible default run.

## Run

```bash
python -m pip install -e '.[test]'
lora-tune --config config.json
pytest
```

The default configuration is deliberately small enough for CPU execution. Scale dimensions and steps only after the reference assertions pass.
