from q_learning.core import demo

def test_end_to_end():
    result=demo(seed=7)
    assert .9 <= result['success_rate'] <= 1.0
