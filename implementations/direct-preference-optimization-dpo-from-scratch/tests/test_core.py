from tiny_dpo.core import demo

def test_end_to_end():
    result=demo(seed=7)
    assert result['accuracy'] > .9 and result['loss'] < .4
