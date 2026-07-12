from connect4_zero.core import demo

def test_end_to_end():
    result=demo(seed=7)
    assert result['stones']==result['moves'] and 4 <= result['moves'] <= 42
