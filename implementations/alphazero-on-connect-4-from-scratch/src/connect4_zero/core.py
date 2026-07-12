import numpy as np
ROWS,COLS=6,7
def valid(b):return np.where(b[0]==0)[0]
def play(b,a,p):
    b=b.copy();r=np.where(b[:,a]==0)[0][-1];b[r,a]=p;return b
def winner(b):
    for r in range(ROWS):
      for c in range(COLS):
       p=b[r,c]
       if p and any(all(0<=r+i*dr<ROWS and 0<=c+i*dc<COLS and b[r+i*dr,c+i*dc]==p for i in range(4)) for dr,dc in ((1,0),(0,1),(1,1),(1,-1))):return int(p)
    return 0
def heuristic(b,a,p):
    nb=play(b,a,p)
    if winner(nb)==p:return 100
    center=3-abs(3-a);opp=any(winner(play(nb,x,-p))==-p for x in valid(nb));return center-50*opp
def policy(b,p):
    acts=valid(b);scores=np.array([heuristic(b,a,p) for a in acts]);return int(acts[scores.argmax()])
def game(first=1):
    b=np.zeros((ROWS,COLS),int);p=first
    for moves in range(42):
        b=play(b,policy(b,p),p);w=winner(b)
        if w:return {'winner':w,'moves':moves+1,'board':b}
        p=-p
    return {'winner':0,'moves':42,'board':b}
def demo(seed=0):r=game();return {'winner':r['winner'],'moves':r['moves'],'stones':int(np.count_nonzero(r['board']))}
