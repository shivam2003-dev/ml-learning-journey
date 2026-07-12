from dataclasses import dataclass
from statistics import NormalDist
import math, numpy as np
@dataclass
class CausalConfig: alpha:float=.05; power:float=.8; baseline_rate:float=.1; mde:float=.02; seed:int=12
def proportion_effect(xa,na,xb,nb,alpha=.05):
    pa,pb=xa/na,xb/nb; d=pb-pa; se=math.sqrt(pa*(1-pa)/na+pb*(1-pb)/nb); z=d/se; p=2*(1-NormalDist().cdf(abs(z))); q=NormalDist().inv_cdf(1-alpha/2)
    return {"effect":d,"se":se,"z":z,"p_value":p,"ci":(d-q*se,d+q*se)}
def sample_size(p0,mde,alpha=.05,power=.8):
    p1=p0+mde; p=(p0+p1)/2; z=NormalDist().inv_cdf(1-alpha/2)+NormalDist().inv_cdf(power); return math.ceil(2*z*z*p*(1-p)/(mde*mde))
def benjamini_hochberg(pvalues,q=.05):
    p=np.asarray(pvalues); order=np.argsort(p); threshold=q*np.arange(1,len(p)+1)/len(p); passed=p[order]<=threshold; cutoff=p[order][np.where(passed)[0][-1]] if passed.any() else -1; return p<=cutoff
def did(tp,tpost,cp,cpost): return float((tpost-tp)-(cpost-cp))
def synthetic_control(donors,treated_pre,treated_post,steps=1000,lr=.08):
    donors=np.asarray(donors,float); w=np.ones(donors.shape[0])/donors.shape[0]
    for _ in range(steps):
        grad=2*donors@(donors.T@w-treated_pre)/donors.shape[1]; w=np.maximum(w-lr*grad,0); w/=max(w.sum(),1e-12)
    fit=donors.T@w; effect=float(treated_post-np.dot(w,donors[:,-1])); return {"weights":w,"pre_rmse":float(np.sqrt(np.mean((fit-treated_pre)**2))),"effect":effect}

def analyze(c=CausalConfig()):
    """Run a deterministic miniature report suitable for the CLI smoke path."""
    n=sample_size(c.baseline_rate,c.mde,c.alpha,c.power)
    control=round(c.baseline_rate*n); treatment=round((c.baseline_rate+c.mde)*n)
    result=proportion_effect(control,n,treatment,n,c.alpha)
    return {"sample_size_per_arm":n,"estimated_effect":result["effect"],"p_value":result["p_value"],"ci_low":result["ci"][0],"ci_high":result["ci"][1]}
