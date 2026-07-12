import numpy as np

def sigmoid(x): return 1.0 / (1.0 + np.exp(-x))

def train_reward_model(features, labels, steps=250, lr=0.15):
    w = np.zeros(features.shape[1])
    for _ in range(steps):
        p = sigmoid(features @ w)
        w -= lr * (features.T @ (p - labels)) / len(labels)
    return w

def optimize_policy(rewards, reference=None, beta=0.15, steps=120, lr=0.2):
    reference = np.zeros_like(rewards) if reference is None else np.asarray(reference)
    logits = reference.copy()
    for _ in range(steps):
        p = np.exp(logits - logits.max()); p /= p.sum()
        q = np.exp(reference - reference.max()); q /= q.sum()
        grad = p * (rewards - p @ rewards) - beta * (p - q)
        logits += lr * grad
    p = np.exp(logits-logits.max()); return p / p.sum()

def run_demo(seed=0):
    rng=np.random.default_rng(seed); x=rng.normal(size=(120,4)); true=np.array([1.2,-.7,.4,.9])
    y=(x@true+rng.normal(scale=.25,size=120)>0).astype(float); w=train_reward_model(x,y)
    acc=float(((x@w>0)==y).mean()); rewards=np.array([-.4,.2,1.0]); policy=optimize_policy(rewards)
    return {"reward_accuracy":acc,"best_action_probability":float(policy[-1]),"policy":policy.tolist()}
