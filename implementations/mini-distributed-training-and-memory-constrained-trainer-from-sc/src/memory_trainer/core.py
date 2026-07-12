from dataclasses import dataclass
import numpy as np
@dataclass
class TrainerConfig:
    features:int=6; hidden:int=10; samples:int=96; microbatch:int=8; accumulation_steps:int=3
    learning_rate:float=.08; epochs:int=18; world_size:int=2; seed:int=4
def data(c):
    r=np.random.default_rng(c.seed); x=r.normal(size=(c.samples,c.features)).astype(np.float16)
    y=(x.astype(np.float32)@r.normal(size=c.features)>0).astype(np.float32); return x,y
def init(c):
    r=np.random.default_rng(c.seed+1); return {"w1":r.normal(0,.2,(c.features,c.hidden)).astype(np.float32),"w2":r.normal(0,.2,(c.hidden,1)).astype(np.float32)}
def forward(p,x,save=False):
    h=np.maximum(x.astype(np.float32)@p["w1"],0); logits=(h@p["w2"]).ravel(); return (logits,h) if save else logits
def micro_grad(p,x,y):
    logits=forward(p,x); prob=1/(1+np.exp(-np.clip(logits,-20,20))); dl=(prob-y)[:,None]/len(y)
    h=np.maximum(x.astype(np.float32)@p["w1"],0) # activation checkpoint recomputation
    return {"w2":h.T@dl,"w1":x.astype(np.float32).T@((dl@p["w2"].T)*(h>0))}
def all_reduce(gs): return {k:np.mean([g[k] for g in gs],axis=0) for k in gs[0]}
def zero_shards(p,world):
    flat=np.concatenate([v.ravel() for v in p.values()]); return [a.copy() for a in np.array_split(np.zeros_like(flat),world)]
def evaluate(p,x,y):
    pred=forward(p,x)>0; return float(np.mean(pred==y))
def train(c=TrainerConfig()):
    x,y=data(c); p=init(c); states=zero_shards(p,c.world_size); history=[]
    for epoch in range(c.epochs):
        accumulated=[]
        for start in range(0,len(x),c.microbatch):
            accumulated.append(micro_grad(p,x[start:start+c.microbatch],y[start:start+c.microbatch]))
            if len(accumulated)==c.accumulation_steps or start+c.microbatch>=len(x):
                g=all_reduce(accumulated); p={k:p[k]-c.learning_rate*g[k] for k in p}; accumulated=[]
        history.append(evaluate(p,x,y))
    return {"params":p,"accuracy":history[-1],"history":history,"optimizer_shards":states,"peak_saved_activations":c.microbatch*c.hidden}
