import argparse, json
from pathlib import Path
from .core import run_demo

def main():
 p=argparse.ArgumentParser(); p.add_argument("--config",default="config.json"); a=p.parse_args(); cfg=json.loads(Path(a.config).read_text()); print(json.dumps(run_demo(cfg.get("seed",0)),indent=2))
if __name__=="__main__": main()
