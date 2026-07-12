import numpy as np

class Tensor:
    def __init__(self,data,children=(),backward=lambda:None): self.data=np.asarray(data,dtype=float); self.grad=np.zeros_like(self.data); self.children=children; self._backward=backward
    def __add__(self,o):
        o=o if isinstance(o,Tensor) else Tensor(o); out=Tensor(self.data+o.data,(self,o))
        def back(): self.grad+=unbroadcast(out.grad,self.data.shape); o.grad+=unbroadcast(out.grad,o.data.shape)
        out._backward=back; return out
    def __mul__(self,o):
        o=o if isinstance(o,Tensor) else Tensor(o); out=Tensor(self.data*o.data,(self,o))
        def back(): self.grad+=unbroadcast(out.grad*o.data,self.data.shape); o.grad+=unbroadcast(out.grad*self.data,o.data.shape)
        out._backward=back; return out
    def sum(self):
        out=Tensor(self.data.sum(),(self,)); out._backward=lambda:self.grad.__iadd__(np.ones_like(self.data)*out.grad); return out
    def backward(self):
        topo=[]; seen=set()
        def build(v):
            if id(v) not in seen: seen.add(id(v)); [build(c) for c in v.children]; topo.append(v)
        build(self); self.grad=np.ones_like(self.data)
        for v in reversed(topo): v._backward()
def unbroadcast(g,shape):
    while g.ndim>len(shape): g=g.sum(0)
    for i,s in enumerate(shape):
        if s==1: g=g.sum(i,keepdims=True)
    return g
def run_demo(seed=0):
    x=Tensor([[1.,2.],[3.,4.]]); w=Tensor([2.,-1.]); loss=(x*w).sum(); loss.backward(); expected=x.data.sum(0)
    return {"loss":float(loss.data),"gradient":w.grad.tolist(),"max_grad_error":float(np.max(np.abs(w.grad-expected)))}
