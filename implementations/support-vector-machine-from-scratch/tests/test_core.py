from linear_svm.core import demo

def test_end_to_end():
    result=demo(seed=7)
    assert result['accuracy'] > .95 and result['margin'] > 0
