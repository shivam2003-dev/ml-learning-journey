import math
from src.core import run_demo

def test_end_to_end_metrics_are_finite():
    result=run_demo(0)
    assert result and all(not isinstance(v,float) or math.isfinite(v) for v in result.values())
    assert result["honest_passes"] and result["tamper_detected"]
    assert result["committee_output"] == "ok"
