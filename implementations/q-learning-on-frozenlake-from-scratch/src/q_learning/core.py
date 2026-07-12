import numpy as np
HOLES={5,7,11,12};GOAL=15
def step(s,a):
    r,c=divmod(s,4);drdc=[(0,-1),(1,0),(0,1),(-1,0)][a];ns=max(0,min(3,r+drdc[0]))*4+max(0,min(3,c+drdc[1]));return ns,float(ns==GOAL),ns in HOLES or ns==GOAL
def train(episodes=2500,seed=0):
    rng=np.random.default_rng(seed);q=np.zeros((16,4));
    for ep in range(episodes):
        s=0
        for _ in range(50):
            a=rng.integers(4) if rng.random()<max(.05,1-ep/1500) else q[s].argmax();ns,r,d=step(s,a);q[s,a]+=.3*(r+.95*(0 if d else q[ns].max())-q[s,a]);s=ns
            if d:break
    return q
def evaluate(q,n=50):
    wins=0
    for _ in range(n):
        s=0
        for _ in range(30):
            s,r,d=step(s,q[s].argmax())
            if d:
                wins+=int(r)
                break
    return wins/n
def demo(seed=0):q=train(seed=seed);return {'success_rate':evaluate(q),'start_action':int(q[0].argmax())}
