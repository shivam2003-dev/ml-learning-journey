import numpy as np
def sigmoid(x):return 1/(1+np.exp(-np.clip(x,-30,30)))
class DPO:
    def __init__(self,n_features,beta=.5,lr=.1):self.w=np.zeros(n_features);self.beta=beta;self.lr=lr
    def fit(self,chosen,rejected,reference=None,epochs=300):
        d=np.asarray(chosen)-np.asarray(rejected);ref=np.zeros(len(d)) if reference is None else np.asarray(reference)
        for _ in range(epochs):
            z=self.beta*(d@self.w-ref);g=-(self.beta/len(d))*d.T@(1-sigmoid(z));self.w-=self.lr*g
        return self
    def preference_probability(self,chosen,rejected,reference=None):
        d=np.asarray(chosen)-np.asarray(rejected);ref=0 if reference is None else np.asarray(reference);return sigmoid(self.beta*(d@self.w-ref))
    def loss(self,c,r,reference=None):return float(-np.log(self.preference_probability(c,r,reference)+1e-12).mean())
def demo(seed=0):
    g=np.random.default_rng(seed);true=np.array([1.2,-.8,.5]);c=[];r=[]
    for _ in range(160):
        a,b=g.normal(size=(2,3));c.append(a if a@true>b@true else b);r.append(b if a@true>b@true else a)
    m=DPO(3).fit(c,r);p=m.preference_probability(c,r);return {'accuracy':float((p>.5).mean()),'loss':m.loss(c,r),'weights':m.w.round(3).tolist()}
