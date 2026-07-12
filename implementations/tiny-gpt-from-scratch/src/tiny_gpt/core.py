import numpy as np
class BigramGPT:
    def __init__(self,vocab,alpha=.1,seed=0):self.vocab=sorted(set(vocab));self.stoi={c:i for i,c in enumerate(self.vocab)};self.alpha=alpha;self.rng=np.random.default_rng(seed)
    def fit(self,text):
        v=len(self.vocab);self.counts=np.full((v,v),self.alpha)
        for a,b in zip(text,text[1:]):self.counts[self.stoi[a],self.stoi[b]]+=1
        self.p=self.counts/self.counts.sum(1,keepdims=True);return self
    def nll(self,text):return float(-np.mean([np.log(self.p[self.stoi[a],self.stoi[b]]) for a,b in zip(text,text[1:])]))
    def generate(self,start,n=60,temperature=1.):
        out=start
        for _ in range(n):
            p=np.power(self.p[self.stoi[out[-1]]],1/temperature);p/=p.sum();out+=self.vocab[self.rng.choice(len(p),p=p)]
        return out
def demo(seed=0):
    text=('to be or not to be, that is the question. ')*20;m=BigramGPT(text,seed=seed).fit(text);return {'nll':m.nll(text),'sample':m.generate('t',30)}
