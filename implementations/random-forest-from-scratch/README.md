# Random Forest from Scratch

A deterministic, lightweight, end-to-end NumPy implementation designed for study and CI.

## Layout

- `src/random_forest/core.py`: modular algorithm and evaluation demo
- `src/random_forest/cli.py`: JSON CLI output
- `tutorial.ipynb`: executable teaching walkthrough
- `tests/test_core.py`: end-to-end behavioral verification
- `config.json`: reproducibility defaults

## Run

```bash
python -m random_forest.cli
pytest -q
jupyter nbconvert --to notebook --execute tutorial.ipynb --inplace
```
