from dataclasses import dataclass
import numpy as np
@dataclass
class GeneratorConfig:
    image_size:int=8; codebook_size:int=8; samples:int=80; smoothing:float=.5; temperature:float=.8; seed:int=5
def make_data(c):
    r=np.random.default_rng(c.seed); images=[]; labels=[]
    for i in range(c.samples):
        label=i%2; a=np.zeros((c.image_size,c.image_size));
        if label==0: a[:,c.image_size//2-1:c.image_size//2+1]=1
        else: a[c.image_size//2-1:c.image_size//2+1,:]=1
        a=np.clip(a+r.normal(0,.08,a.shape),0,1); images.append(a); labels.append(label)
    return np.array(images),np.array(labels)
def fit_codebook(images,k): return np.linspace(float(images.min()),float(images.max()),k)
def encode(images,codebook): return np.argmin(abs(images[...,None]-codebook),axis=-1)
def decode(codes,codebook): return codebook[codes]
def train(c=GeneratorConfig()):
    images,labels=make_data(c); cb=fit_codebook(images,c.codebook_size); codes=encode(images,cb).reshape(len(images),-1)
    counts=np.full((2,codes.shape[1],c.codebook_size),c.smoothing)
    for row,label in zip(codes,labels):
        for pos,token in enumerate(row): counts[label,pos,token]+=1
    probs=counts/counts.sum(-1,keepdims=True); recon=decode(encode(images,cb),cb)
    return {"codebook":cb,"probs":probs,"reconstruction_mse":float(np.mean((images-recon)**2)),"shape":images.shape[1:]}
def generate(model,prompt,c=GeneratorConfig()):
    label=0 if "vertical" in prompt.lower() else 1; r=np.random.default_rng(c.seed+99); toks=[]
    for p in model["probs"][label]:
        q=np.log(p+1e-12)/c.temperature; q=np.exp(q-q.max()); q/=q.sum(); toks.append(r.choice(len(q),p=q))
    return decode(np.array(toks).reshape(model["shape"]),model["codebook"])
def orientation_score(image):
    m=image.shape[0]//2; return float(image[:,m-1:m+1].mean()-image[m-1:m+1,:].mean())
