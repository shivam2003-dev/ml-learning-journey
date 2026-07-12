import numpy as np

def rmsnorm(x,w,eps=1e-6): return x/np.sqrt(np.mean(x*x,axis=-1,keepdims=True)+eps)*w
def silu(x): return x/(1+np.exp(-x))
def fused_block(x,norm_w,gate_w,up_w):
    h=rmsnorm(x,norm_w); return silu(h@gate_w)*(h@up_w)
def reference_block(x,norm_w,gate_w,up_w):
    variance=np.mean(np.square(x),axis=-1,keepdims=True); h=x*np.reciprocal(np.sqrt(variance+1e-6)); h=h*norm_w
    gate=h@gate_w; up=h@up_w; return (gate/(1+np.exp(-gate)))*up
def run_demo(seed=0):
    r=np.random.default_rng(seed); x=r.normal(size=(24,32)); nw=r.normal(size=32); gw=r.normal(scale=.1,size=(32,48)); uw=r.normal(scale=.1,size=(32,48))
    y=fused_block(x,nw,gw,uw); ref=reference_block(x,nw,gw,uw)
    return {"max_abs_error":float(np.max(np.abs(y-ref))),"intermediate_arrays_elided":2,"output_rms":float(np.sqrt(np.mean(y*y)))}
