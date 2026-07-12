import jax, jax.numpy as jnp

def init_params(key,d_in=2,hidden=16,d_out=2):
    k1,k2=jax.random.split(key); return [(jax.random.normal(k1,(d_in,hidden))*.2,jnp.zeros(hidden)),(jax.random.normal(k2,(hidden,d_out))*.2,jnp.zeros(d_out))]
def forward(params,x):
    (w1,b1),(w2,b2)=params; return jax.nn.tanh(x@w1+b1)@w2+b2
def loss_fn(params,x,y): return -jnp.mean(jax.nn.log_softmax(forward(params,x))[jnp.arange(len(y)),y])
@jax.jit
def step(params,x,y,lr=.1):
    loss,grads=jax.value_and_grad(loss_fn)(params,x,y); return jax.tree.map(lambda p,g:p-lr*g,params,grads),loss
def run_demo(seed=0):
    key=jax.random.key(seed); x=jax.random.normal(key,(128,2)); y=(x[:,0]*x[:,1]>0).astype(jnp.int32); params=init_params(jax.random.fold_in(key,1)); start=float(loss_fn(params,x,y))
    for _ in range(1200): params,loss=step(params,x,y)
    acc=float(jnp.mean(jnp.argmax(forward(params,x),1)==y)); return {"initial_loss":start,"final_loss":float(loss),"accuracy":acc}
