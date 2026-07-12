from tiny_transformer.core import demo

def test_end_to_end():
    result=demo(seed=7)
    assert result['output_shape']==[7,12] and result['future_mass'] < 1e-8
