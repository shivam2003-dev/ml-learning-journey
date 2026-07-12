import numpy as np

class LinearSVM:
    def __init__(self,lr=.03,reg=.01,epochs=500):self.lr=lr;self.reg=reg;self.epochs=epochs
    def fit(self,X,y):
        X=np.asarray(X,float);y=np.where(np.asarray(y)>0,1.,-1.);self.w=np.zeros(X.shape[1]);self.b=0.
        for _ in range(self.epochs):
            margin=y*(X@self.w+self.b);bad=margin<1;dw=self.reg*self.w-(X[bad].T@y[bad])/len(y);db=-y[bad].sum()/len(y);self.w-=self.lr*dw;self.b-=self.lr*db
        return self
    def decision_function(self,X):return np.asarray(X)@self.w+self.b
    def predict(self,X):return (self.decision_function(X)>=0).astype(int)
def demo(seed=0):
    r=np.random.default_rng(seed);X=np.r_[r.normal([-1,-1],.5,(80,2)),r.normal([1,1],.5,(80,2))];y=np.r_[np.zeros(80,int),np.ones(80,int)];m=LinearSVM().fit(X,y);return {'accuracy':float((m.predict(X)==y).mean()),'margin':float(2/np.linalg.norm(m.w))}
