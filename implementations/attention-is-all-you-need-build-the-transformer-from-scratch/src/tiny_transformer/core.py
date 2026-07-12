import numpy as np
def softmax(x):x=x-x.max(-1,keepdims=True);e=np.exp(x);return e/e.sum(-1,keepdims=True)
def positional_encoding(n,d):
    p=np.arange(n)[:,None];i=np.arange(d)[None,:];a=p/np.power(10000,(2*(i//2))/d);return np.where(i%2==0,np.sin(a),np.cos(a))
def causal_attention(x,wq,wk,wv):
    q=x@wq;k=x@wk;v=x@wv;s=q@k.T/np.sqrt(q.shape[-1]);s+=np.triu(np.full_like(s,-1e9),1);a=softmax(s);return a@v,a
class TinyTransformer:
    def __init__(self,d=12,seed=0):
        r=np.random.default_rng(seed);self.w=[r.normal(0,1/np.sqrt(d),(d,d)) for _ in range(3)]
    def forward(self,x):return causal_attention(np.asarray(x)+positional_encoding(len(x),x.shape[1]),*self.w)
def demo(seed=0):
    r=np.random.default_rng(seed);x=r.normal(size=(7,12));y,a=TinyTransformer(seed=seed).forward(x);return {'output_shape':list(y.shape),'row_sums':a.sum(1).round(6).tolist(),'future_mass':float(np.triu(a,1).sum())}
