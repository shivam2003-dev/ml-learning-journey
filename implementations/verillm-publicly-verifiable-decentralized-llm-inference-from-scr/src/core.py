import hashlib, random

def h(x): return hashlib.sha256(x).digest()
def merkle_root(values):
    level=[h(str(v).encode()) for v in values]
    while len(level)>1:
        if len(level)%2: level.append(level[-1])
        level=[h(level[i]+level[i+1]) for i in range(0,len(level),2)]
    return level[0].hex()
def spot_check(committed, recompute, indices): return all(committed[i]==recompute(i) for i in indices)
def committee_vote(votes,stake):
    totals={};
    for node,out in votes.items(): totals[out]=totals.get(out,0)+stake[node]
    return max(totals,key=totals.get)
def run_demo(seed=0):
    trace=[i*i+3 for i in range(32)]; root=merkle_root(trace); rng=random.Random(seed); checks=rng.sample(range(32),6)
    honest=spot_check(trace,lambda i:i*i+3,checks); bad=trace.copy(); bad[checks[0]]+=1
    detected=not spot_check(bad,lambda i:i*i+3,checks); winner=committee_vote({"n1":"ok","n2":"ok","n3":"bad"},{"n1":3,"n2":2,"n3":4})
    return {"root":root,"honest_passes":honest,"tamper_detected":detected,"committee_output":winner}
