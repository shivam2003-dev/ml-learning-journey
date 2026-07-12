import numpy as np, pytest
from tictactoe_rl.core import *
def test_engine_and_minimax():
    b=np.array([1,1,0,-1,-1,0,0,0,0]); score,a=minimax(tuple(b),1); assert a==2 and score==1
    with pytest.raises(ValueError): move(b,0,1)
def test_dqn_distills_oracle():
    o=train(DQNConfig(episodes=900)); assert o["accuracy"]>.65; assert o["replay_size"]>1000
