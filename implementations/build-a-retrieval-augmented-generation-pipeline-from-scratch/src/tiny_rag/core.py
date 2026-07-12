import re, numpy as np
def tokenize(s):return re.findall(r'[a-z0-9]+',s.lower())
class RAG:
    def __init__(self,docs):self.docs=list(docs);self.vocab=sorted(set(sum((tokenize(d) for d in docs),[])));self.index={w:i for i,w in enumerate(self.vocab)};self.mat=np.stack([self.vec(d) for d in docs])
    def vec(self,s):
        v=np.zeros(len(self.vocab));
        for w in tokenize(s):
            if w in self.index:v[self.index[w]]+=1
        n=np.linalg.norm(v);return v/(n or 1)
    def retrieve(self,q,k=2):
        scores=self.mat@self.vec(q);ix=np.argsort(scores)[::-1][:k];return [(self.docs[i],float(scores[i])) for i in ix]
    def answer(self,q):
        hits=self.retrieve(q);return {'answer':hits[0][0],'citations':[h[0] for h in hits],'scores':[h[1] for h in hits]}
def demo(seed=0):
    docs=['Paris is the capital of France.','Berlin is the capital of Germany.','Tokyo is the capital of Japan.'];r=RAG(docs).answer('What is the capital of France?');return {'answer':r['answer'],'top_score':r['scores'][0],'citations':r['citations']}
