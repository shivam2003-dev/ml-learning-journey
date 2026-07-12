from random_forest.core import demo

def test_end_to_end():
    result=demo(seed=7)
    assert result['accuracy'] >= 0.75
