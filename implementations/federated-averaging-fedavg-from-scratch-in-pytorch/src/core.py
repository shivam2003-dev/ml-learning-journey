import numpy as np

def local_sgd(w,x,y,epochs=4,lr=.15):
    w=w.copy()
    for _ in range(epochs):
        p=1/(1+np.exp(-(x@w))); w-=lr*x.T@(p-y)/len(y)
    return w
def fedavg(weights,sizes): return np.average(np.stack(weights),axis=0,weights=np.asarray(sizes))
def accuracy(w,x,y): return float(((x@w>0)==y).mean())
def run_demo(seed=0):
    r=np.random.default_rng(seed); clients=[]
    for n,shift in [(80,-.7),(140,.5),(45,1.2)]:
        x=r.normal(loc=shift,size=(n,3)); y=(x@np.array([1.,-.8,.5])+r.normal(scale=.3,size=n)>0).astype(float); clients.append((x,y))
    w=np.zeros(3); history=[]
    for _ in range(18):
        local=[local_sgd(w,x,y) for x,y in clients]; w=fedavg(local,[len(y) for _,y in clients]); history.append(np.mean([accuracy(w,x,y) for x,y in clients]))
    return {"initial_accuracy":float(history[0]),"final_accuracy":float(history[-1]),"rounds":len(history),"weights":w.tolist()}
