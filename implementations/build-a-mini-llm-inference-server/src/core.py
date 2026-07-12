from dataclasses import dataclass, field
from collections import deque

class PagedKV:
    def __init__(self,pages=16,page_size=4): self.free=deque(range(pages)); self.page_size=page_size; self.tables={}
    def append(self,rid,token):
        table=self.tables.setdefault(rid,[])
        if token%self.page_size==0:
            if not self.free: raise MemoryError("KV cache full")
            table.append(self.free.popleft())
    def release(self,rid):
        for p in self.tables.pop(rid,[]): self.free.append(p)

@dataclass
class Request: rid:str; prompt:list; max_tokens:int; output:list=field(default_factory=list); cancelled:bool=False

class Scheduler:
    def __init__(self,cache): self.waiting=deque(); self.running=[]; self.cache=cache
    def submit(self,r): self.waiting.append(r)
    def cancel(self,rid):
        for r in [*self.waiting,*self.running]:
            if r.rid==rid: r.cancelled=True
    def step(self,budget=2):
        while self.waiting and len(self.running)<budget: self.running.append(self.waiting.popleft())
        emitted=[]
        for r in list(self.running):
            if r.cancelled or len(r.output)>=r.max_tokens: self.cache.release(r.rid); self.running.remove(r); continue
            token=(sum(r.prompt)+sum(r.output)+1)%17; self.cache.append(r.rid,len(r.output)); r.output.append(token); emitted.append((r.rid,token))
        return emitted

def run_demo(seed=0):
    cache=PagedKV(); s=Scheduler(cache); a=Request("a",[1,2],4); b=Request("b",[3],3); s.submit(a); s.submit(b)
    streamed=[]
    for _ in range(5): streamed+=s.step()
    return {"streamed_tokens":len(streamed),"a_output":a.output,"b_output":b.output,"free_pages":len(cache.free)}
