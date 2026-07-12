import numpy as np
from lora_tune.core import *
def test_quantization_and_template():
    w=np.linspace(-1,1,20).reshape(4,5); q,s=quantize(w); assert q.dtype==np.int8; assert np.mean((w-dequantize(q,s))**2)<.01
    assert chat_template("s","u","a").endswith("<|eos|>")
def test_lora_trains_without_changing_base():
    o=train(); assert o["frozen_unchanged"]; assert o["history"][-1]<o["history"][0]*.3; assert np.isfinite(o["merged"]).all()
