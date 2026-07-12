from tiny_gpt.core import demo

def test_end_to_end():
    result=demo(seed=7)
    assert result['nll'] < 2.0 and len(result['sample'])==31
