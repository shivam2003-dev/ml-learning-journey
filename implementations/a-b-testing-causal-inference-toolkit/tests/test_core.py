import numpy as np
from causal_toolkit.core import *
def test_ab_and_power():
    r=proportion_effect(100,1000,130,1000); assert r["effect"]>.02; assert r["ci"][0]>0; assert sample_size(.1,.02)>1000
def test_multiplicity_did_synth():
    assert benjamini_hochberg([.001,.02,.3]).tolist()==[True,True,False]; assert did(10,15,9,11)==3
    donors=np.array([[1,2,3],[2,2,2],[3,2,1]],float); o=synthetic_control(donors,np.array([1.5,2,2.5]),4); assert o["pre_rmse"]<.05; assert o["effect"]>1
