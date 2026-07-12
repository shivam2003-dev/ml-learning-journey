import numpy as np

def gini(y):
    if len(y)==0: return 0.0
    _, c=np.unique(y, return_counts=True); p=c/len(y); return float(1-(p*p).sum())

class Tree:
    def __init__(self, max_depth=4, min_samples=2, max_features=None, seed=0): self.max_depth=max_depth; self.min_samples=min_samples; self.max_features=max_features; self.rng=np.random.default_rng(seed)
    def fit(self,X,y): self.root=self._grow(np.asarray(X),np.asarray(y),0); return self
    def _grow(self,X,y,d):
        vals,c=np.unique(y,return_counts=True); pred=vals[c.argmax()]
        if d>=self.max_depth or len(y)<self.min_samples or len(vals)==1:return ('leaf',pred)
        m=self.max_features or max(1,int(np.sqrt(X.shape[1]))); feats=self.rng.choice(X.shape[1],min(m,X.shape[1]),False); best=None
        for j in feats:
            for t in np.unique(X[:,j])[:-1]:
                left=X[:,j]<=t
                if not left.any() or left.all():continue
                score=left.mean()*gini(y[left])+(~left).mean()*gini(y[~left])
                if best is None or score<best[0]:best=(score,j,float(t),left)
        if best is None:return ('leaf',pred)
        _,j,t,left=best; return ('node',j,t,self._grow(X[left],y[left],d+1),self._grow(X[~left],y[~left],d+1))
    def _one(self,x,n):
        while n[0]=='node':n=n[3] if x[n[1]]<=n[2] else n[4]
        return n[1]
    def predict(self,X):return np.array([self._one(x,self.root) for x in np.asarray(X)])

class RandomForest:
    def __init__(self,n_estimators=15,max_depth=5,seed=0):self.n_estimators=n_estimators;self.max_depth=max_depth;self.seed=seed
    def fit(self,X,y):
        X=np.asarray(X);y=np.asarray(y);rng=np.random.default_rng(self.seed);self.trees=[]
        for i in range(self.n_estimators):
            ix=rng.integers(0,len(y),len(y)); self.trees.append(Tree(self.max_depth,seed=self.seed+i).fit(X[ix],y[ix]))
        return self
    def predict(self,X):
        p=np.stack([t.predict(X) for t in self.trees]); return np.array([np.unique(c,return_counts=True)[0][np.unique(c,return_counts=True)[1].argmax()] for c in p.T])

def demo(seed=0):
    r=np.random.default_rng(seed);X=r.normal(size=(240,4));y=(X[:,0]*X[:,1]+X[:,2]>0).astype(int);m=RandomForest(seed=seed).fit(X[:180],y[:180]);return {'accuracy':float((m.predict(X[180:])==y[180:]).mean())}
