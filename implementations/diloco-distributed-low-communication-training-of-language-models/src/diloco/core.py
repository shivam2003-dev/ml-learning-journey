from dataclasses import dataclass
import numpy as np

@dataclass
class DiLoCoConfig:
    workers:int=4; samples_per_worker:int=48; features:int=3; inner_steps:int=8
    inner_lr:float=.06; outer_lr:float=.8; momentum:float=.9; rounds:int=30; seed:int=7

def make_shards(c):
    rng=np.random.default_rng(c.seed); truth=np.arange(1,c.features+1)/c.features
    shards=[]
    for i in range(c.workers):
        x=rng.normal(loc=(i-(c.workers-1)/2)*.15,size=(c.samples_per_worker,c.features))
        y=x@truth+rng.normal(0,.04,c.samples_per_worker); shards.append((x,y))
    return shards,truth

def loss(w,data): x,y=data; return float(np.mean((x@w-y)**2))
def grad(w,data): x,y=data; return 2*x.T@(x@w-y)/len(x)

def local_train(global_w,data,c):
    w=global_w.copy()
    for _ in range(c.inner_steps): w-=c.inner_lr*grad(w,data)
    return w

def train(c=DiLoCoConfig()):
    shards,truth=make_shards(c); w=np.zeros(c.features); velocity=np.zeros_like(w); history=[]
    for rnd in range(c.rounds):
        locals_=[local_train(w,d,c) for d in shards]
        pseudo=np.mean([w-lw for lw in locals_],axis=0)
        velocity=c.momentum*velocity+pseudo
        w-=c.outer_lr*velocity
        history.append({"round":rnd+1,"loss":float(np.mean([loss(w,d) for d in shards])),"delta_norm":float(np.linalg.norm(pseudo))})
    return {"weights":w,"truth":truth,"history":history,"communication_rounds":c.rounds,"local_steps":c.rounds*c.inner_steps}
