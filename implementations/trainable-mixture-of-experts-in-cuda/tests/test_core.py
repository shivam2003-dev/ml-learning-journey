import numpy as np
from moe.core import *
def test_routing_and_capacity():
    c=MoEConfig(); r=np.random.default_rng(0); x=r.normal(size=(c.tokens,c.d_model)); p=init(c); probs,idx,g=route(x,p["router"],2)
    assert idx.shape==(c.tokens,2); assert np.allclose(g.sum(1),1); _,m=forward(p,x,c); assert np.all(m["counts"]<=m["capacity"])
def test_experts_learn():
    o=train(MoEConfig(steps=40)); assert o["loss"] < o["history"][0]*.75; assert o["metadata"]["aux_loss"]>0
