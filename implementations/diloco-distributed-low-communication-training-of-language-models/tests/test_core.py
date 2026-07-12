import numpy as np
from diloco.core import DiLoCoConfig, make_shards, local_train, train, loss
def test_local_step_and_global_convergence():
    c=DiLoCoConfig(rounds=30); shards,_=make_shards(c); z=np.zeros(c.features)
    assert loss(local_train(z,shards[0],c),shards[0]) < loss(z,shards[0])
    out=train(c); assert out["history"][-1]["loss"] < out["history"][0]["loss"]*.2
    assert np.linalg.norm(out["weights"]-out["truth"]) < .2
def test_communication_reduction():
    out=train(DiLoCoConfig(inner_steps=5,rounds=3)); assert out["local_steps"]/out["communication_rounds"]==5
