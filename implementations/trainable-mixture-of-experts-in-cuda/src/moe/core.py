from dataclasses import dataclass
import numpy as np
@dataclass
class MoEConfig:
    tokens:int=64; d_model:int=6; experts:int=4; top_k:int=2; capacity_factor:float=1.5; learning_rate:float=.15; steps:int=30; seed:int=3
def softmax(x): x=x-x.max(1,keepdims=True); e=np.exp(x); return e/e.sum(1,keepdims=True)
def init(c):
    r=np.random.default_rng(c.seed); return {"router":r.normal(0,.2,(c.d_model,c.experts)),"experts":r.normal(0,.2,(c.experts,c.d_model,c.d_model))}
def route(x,router,k):
    probs=softmax(x@router); idx=np.argpartition(probs,-k,axis=1)[:,-k:]; gates=np.take_along_axis(probs,idx,1); gates/=gates.sum(1,keepdims=True); return probs,idx,gates
def forward(p,x,c):
    probs,idx,gates=route(x,p["router"],c.top_k); out=np.zeros_like(x); counts=np.zeros(c.experts,int)
    cap=int(np.ceil(c.capacity_factor*len(x)*c.top_k/c.experts))
    for t in range(len(x)):
        for j,e in enumerate(idx[t]):
            if counts[e]<cap: out[t]+=gates[t,j]*(x[t]@p["experts"][e]); counts[e]+=1
    aux=float(c.experts*np.sum(probs.mean(0)*(counts/max(counts.sum(),1)))); return out,{"counts":counts,"capacity":cap,"aux_loss":aux,"indices":idx}
def train(c=MoEConfig()):
    r=np.random.default_rng(c.seed+1); x=r.normal(size=(c.tokens,c.d_model)); target=np.tanh(x); p=init(c); hist=[]
    # Train expert matrices with fixed routed assignments; this reference isolates dispatch/backward correctness.
    for _ in range(c.steps):
        y,meta=forward(p,x,c); err=(y-target)/len(x); hist.append(float(np.mean((y-target)**2)))
        _,idx,gates=route(x,p["router"],c.top_k)
        for t in range(len(x)):
            for j,e in enumerate(idx[t]): p["experts"][e]-=c.learning_rate*gates[t,j]*np.outer(x[t],err[t])
    y,meta=forward(p,x,c); return {"loss":float(np.mean((y-target)**2)),"history":hist,"metadata":meta}
