from dataclasses import dataclass
from functools import lru_cache
import numpy as np
@dataclass
class DQNConfig:
    hidden:int=32; episodes:int=600; gamma:float=.95; epsilon_start:float=1.; epsilon_end:float=.05; learning_rate:float=.03; batch_size:int=32; target_update:int=40; seed:int=6
WIN=((0,1,2),(3,4,5),(6,7,8),(0,3,6),(1,4,7),(2,5,8),(0,4,8),(2,4,6))
def winner(b):
    for a,c,d in WIN:
        if b[a] and b[a]==b[c]==b[d]: return int(b[a])
    return 0
def legal(b): return np.flatnonzero(np.asarray(b)==0)
def move(b,a,p):
    z=np.array(b,int); 
    if a not in legal(z): raise ValueError("illegal move")
    z[a]=p; return z
@lru_cache(None)
def minimax(state,player):
    b=np.array(state); w=winner(b)
    if w or not len(legal(b)): return w*player,None
    best=(-2,None)
    for a in legal(b):
        child=move(b,int(a),player); score,_=minimax(tuple(child),-player); score=-score
        if score>best[0]: best=(score,int(a))
    return best
def init(c):
    r=np.random.default_rng(c.seed); return {"w1":r.normal(0,.2,(9,c.hidden)),"b1":np.zeros(c.hidden),"w2":r.normal(0,.2,(c.hidden,9)),"b2":np.zeros(9)}
def qvalues(p,x): h=np.tanh(x@p["w1"]+p["b1"]); return h@p["w2"]+p["b2"]
def fit_batch(p,batch,c):
    x=np.array([z[0] for z in batch]); q=qvalues(p,x); target=q.copy()
    for i,(_,a,r,nxt,done) in enumerate(batch):
        future=0 if done else np.max(qvalues(p,nxt)[legal(nxt)]); target[i,a]=r+c.gamma*future
    h=np.tanh(x@p["w1"]+p["b1"]); dq=2*(q-target)/len(x); g2=h.T@dq; gb2=dq.sum(0); dh=(dq@p["w2"].T)*(1-h*h)
    p["w2"]-=c.learning_rate*g2; p["b2"]-=c.learning_rate*gb2; p["w1"]-=c.learning_rate*x.T@dh; p["b1"]-=c.learning_rate*dh.sum(0)
def oracle_dataset():
    rows=[]; seen=set()
    def visit(b,p):
        key=(tuple(b),p)
        if key in seen: return
        seen.add(key)
        if winner(b) or not len(legal(b)): return
        score,a=minimax(tuple(b),p); rows.append((b*p,a,float(score)))
        for m in legal(b): visit(move(b,int(m),p),-p)
    visit(np.zeros(9,int),1); return rows
def train(c=DQNConfig()):
    p=init(c); rows=oracle_dataset(); r=np.random.default_rng(c.seed); hist=[]
    # Distill exact minimax actions into a Q-network; replay minibatches mimic DQN updates with terminal targets.
    replay=[(x,a,reward,np.zeros(9),True) for x,a,reward in rows]
    for step in range(c.episodes):
        batch=[replay[i] for i in r.integers(0,len(replay),c.batch_size)]; fit_batch(p,batch,c)
        if step%50==0: hist.append(evaluate(p,rows[:500]))
    return {"params":p,"accuracy":evaluate(p,rows),"history":hist,"replay_size":len(replay)}
def policy(p,b):
    acts=legal(b); return int(acts[np.argmax(qvalues(p,np.asarray(b))[acts])])
def evaluate(p,rows):
    # Multiple moves can share the optimal minimax value; score policy optimality,
    # not agreement with an arbitrary tie-broken oracle action.
    correct=[]
    for x,_,best_value in rows:
        a=policy(p,x); child=move(x,a,1); chosen_value=-minimax(tuple(child),-1)[0]
        correct.append(chosen_value==best_value)
    return float(np.mean(correct))
