# RAG Pipeline from Scratch

A deterministic, lightweight, end-to-end NumPy implementation designed for study and CI.

## Layout

- `src/tiny_rag/core.py`: modular algorithm and evaluation demo
- `src/tiny_rag/cli.py`: JSON CLI output
- `tutorial.ipynb`: executable teaching walkthrough
- `tests/test_core.py`: end-to-end behavioral verification
- `config.json`: reproducibility defaults

## Run

```bash
python -m tiny_rag.cli
pytest -q
jupyter nbconvert --to notebook --execute tutorial.ipynb --inplace
```
