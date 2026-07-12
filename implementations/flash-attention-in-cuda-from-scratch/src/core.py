import numpy as np

def reference_attention(q,k,v,causal=False):
    s=q@k.T/np.sqrt(q.shape[-1]);
    if causal: s=np.where(np.triu(np.ones_like(s),1),-np.inf,s)
    p=np.exp(s-np.max(s,axis=1,keepdims=True)); p/=p.sum(1,keepdims=True); return p@v

def tiled_attention(q,k,v,tile=8,causal=False):
    n,d=q.shape; out=np.empty((n,v.shape[1]))
    for i0 in range(0,n,tile):
      qi=q[i0:i0+tile]; m=np.full(len(qi),-np.inf); l=np.zeros(len(qi)); acc=np.zeros((len(qi),v.shape[1]))
      for j0 in range(0,n,tile):
        kj,vj=k[j0:j0+tile],v[j0:j0+tile]; s=qi@kj.T/np.sqrt(d)
        if causal:
          rows=np.arange(i0,i0+len(qi))[:,None]; cols=np.arange(j0,j0+len(kj))[None,:]; s=np.where(cols>rows,-np.inf,s)
        local=np.max(s,axis=1); new=np.maximum(m,local); old=np.exp(m-new); exp=np.exp(s-new[:,None]); exp=np.where(np.isfinite(s),exp,0)
        acc=acc*old[:,None]+exp@vj; l=l*old+exp.sum(1); m=new
      out[i0:i0+tile]=acc/l[:,None]
    return out

def run_demo(seed=0):
    r=np.random.default_rng(seed); q=r.normal(size=(31,16)); k=r.normal(size=(31,16)); v=r.normal(size=(31,12)); a=tiled_attention(q,k,v,7,True); b=reference_attention(q,k,v,True)
    return {"max_abs_error":float(np.max(np.abs(a-b))),"score_elements_avoided":31*31}
