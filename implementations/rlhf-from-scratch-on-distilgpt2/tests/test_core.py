import math
from src.core import run_demo

def test_end_to_end_metrics_are_finite():
    result=run_demo(0)
    assert result and all(not isinstance(v,float) or math.isfinite(v) for v in result.values())
    assert result["reward_accuracy"] > 0.85
    assert result["best_action_probability"] > 0.5
