# Multimodal Autoregressive Image Generator

A lightweight discrete image tokenizer and text-conditioned autoregressive code model with reproducible sampling and evaluation.

## Layout

- `src/image_gen/core.py`: deterministic, modular implementation.
- `src/image_gen/cli.py`: configuration-driven command line entry point.
- `tutorial.ipynb`: executable first-principles walkthrough.
- `tests/test_core.py`: behavioral and numerical checks.
- `config.json`: small reproducible default run.

## Run

```bash
python -m pip install -e '.[test]'
image-gen --config config.json
pytest
```

The default configuration is deliberately small enough for CPU execution. Scale dimensions and steps only after the reference assertions pass.
