import numpy as np
def im2col(x,k=3):
    n,h,w=x.shape;return np.stack([x[:,i:i+k,j:j+k].reshape(n,-1) for i in range(h-k+1) for j in range(w-k+1)],1)
class TinyCNN:
    def __init__(self,seed=0):
        r=np.random.default_rng(seed);self.k=r.normal(0,.2,(9,4));self.w=r.normal(0,.2,(4,2));self.b=np.zeros(2)
    def features(self,x):return np.maximum(0,im2col(x)@self.k).mean(1)
    def fit(self,x,y,epochs=250,lr=.15):
        y=np.asarray(y);oh=np.eye(2)[y]
        for _ in range(epochs):
            f=self.features(x);z=f@self.w+self.b;p=np.exp(z-z.max(1,keepdims=True));p/=p.sum(1,keepdims=True);g=(p-oh)/len(y);self.w-=lr*f.T@g;self.b-=lr*g.sum(0)
        return self
    def predict(self,x):return (self.features(x)@self.w+self.b).argmax(1)
def demo(seed=0):
    r=np.random.default_rng(seed);x=r.normal(0,.15,(120,6,6));y=np.arange(120)%2;x[y==0,:,2:4]+=1;x[y==1,2:4,:]+=1;m=TinyCNN(seed).fit(x[:90],y[:90]);return {'accuracy':float((m.predict(x[90:])==y[90:]).mean()),'patch_shape':list(im2col(x[:2]).shape)}
