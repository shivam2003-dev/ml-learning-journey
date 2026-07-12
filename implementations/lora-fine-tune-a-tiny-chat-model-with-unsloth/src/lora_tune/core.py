from dataclasses import dataclass
import numpy as np
@dataclass
class LoRAConfig:
    input_dim:int=8; output_dim:int=5; rank:int=3; alpha:float=6.; learning_rate:float=.25; steps:int=160; quant_bits:int=4; seed:int=9
def quantize(w,bits=4):
    qmax=2**(bits-1)-1; scale=max(float(np.max(abs(w)))/qmax,1e-8); return np.clip(np.round(w/scale),-qmax,qmax).astype(np.int8),scale
def dequantize(q,s): return q.astype(np.float32)*s
def chat_template(system,user,assistant=""): return f"<|system|>{system}<|user|>{user}<|assistant|>{assistant}<|eos|>"
def init(c):
    r=np.random.default_rng(c.seed); base=r.normal(0,.25,(c.input_dim,c.output_dim)); q,s=quantize(base,c.quant_bits)
    return {"q":q,"scale":s,"A":r.normal(0,.03,(c.input_dim,c.rank)),"B":np.zeros((c.rank,c.output_dim))}
def weight(p,c): return dequantize(p["q"],p["scale"])+(c.alpha/c.rank)*(p["A"]@p["B"])
def train(c=LoRAConfig()):
    r=np.random.default_rng(c.seed+1); x=r.normal(size=(96,c.input_dim)); target_w=dequantize(init(c)["q"],init(c)["scale"])+r.normal(0,.12,(c.input_dim,c.output_dim)); y=x@target_w
    p=init(c); frozen=p["q"].copy(); hist=[]
    for _ in range(c.steps):
        err=(x@weight(p,c)-y)/len(x); hist.append(float(np.mean(err**2)*len(x)**2)); scale=c.alpha/c.rank
        gB=scale*p["A"].T@x.T@err; gA=scale*x.T@err@p["B"].T
        p["A"]-=c.learning_rate*gA; p["B"]-=c.learning_rate*gB
    return {"params":p,"history":hist,"frozen_unchanged":bool(np.array_equal(frozen,p["q"])),"merged":weight(p,c)}
