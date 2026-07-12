from tiny_cnn.core import demo

def test_end_to_end():
    result=demo(seed=7)
    assert result['accuracy'] > .85 and result['patch_shape'] == [2,16,9]
