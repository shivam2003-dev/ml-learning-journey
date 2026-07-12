# Flash Attention from Scratch

A compact, reproducible implementation accompanying the ML Learning Journey article. It separates reusable logic (`src/core.py`), configuration (`config.json`), a command-line entry point (`src/cli.py`), tests, and an executable tutorial notebook.

## Run

```bash
python -m src.cli --config config.json
pytest -q
```

The notebook is self-contained and imports the same production module, so tutorial and tested behavior cannot drift.
