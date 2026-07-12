# AlphaZero on Connect-4

A deterministic, lightweight, end-to-end NumPy implementation designed for study and CI.

## Layout

- `src/connect4_zero/core.py`: modular algorithm and evaluation demo
- `src/connect4_zero/cli.py`: JSON CLI output
- `tutorial.ipynb`: executable teaching walkthrough
- `tests/test_core.py`: end-to-end behavioral verification
- `config.json`: reproducibility defaults

## Run

```bash
python -m connect4_zero.cli
pytest -q
jupyter nbconvert --to notebook --execute tutorial.ipynb --inplace
```
