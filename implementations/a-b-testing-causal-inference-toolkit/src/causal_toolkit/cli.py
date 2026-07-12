from __future__ import annotations
import argparse, json
from dataclasses import fields
from .core import *

def main():
    parser=argparse.ArgumentParser(description='Statistical primitives for powered proportion experiments, confidence intervals, multiplicity, difference-in-differences, and synthetic controls.')
    parser.add_argument("--config", default="config.json")
    args=parser.parse_args()
    cfg_data=json.load(open(args.config,encoding="utf-8"))
    cfg_cls=CausalConfig
    cfg=cfg_cls(**{f.name:cfg_data[f.name] for f in fields(cfg_cls) if f.name in cfg_data})
    result=analyze(cfg)
    print(json.dumps({k:v for k,v in result.items() if isinstance(v,(int,float,str,bool))},indent=2))

if __name__=="__main__": main()
