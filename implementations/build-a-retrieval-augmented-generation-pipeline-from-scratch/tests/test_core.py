from tiny_rag.core import demo

def test_end_to_end():
    result=demo(seed=7)
    assert 'Paris' in result['answer'] and result['top_score'] > 0
