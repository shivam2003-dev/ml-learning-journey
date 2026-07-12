import numpy as np
from memory_trainer.core import *
def test_accumulation_training_improves():
    out=train(TrainerConfig(epochs=25)); assert out["accuracy"]>.82; assert out["history"][-1]>=out["history"][0]
def test_zero_partition_and_allreduce():
    c=TrainerConfig(); p=init(c); shards=zero_shards(p,3)
    assert sum(map(len,shards))==sum(v.size for v in p.values())
    g={k:np.ones_like(v) for k,v in p.items()}; avg=all_reduce([g,{k:3*v for k,v in g.items()}]); assert np.allclose(avg["w1"],2)
