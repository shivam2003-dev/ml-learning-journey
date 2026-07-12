from market_sim.core import *
def test_ev_kelly_and_inventory_skew():
    assert expected_value(.6,1)>0; assert 0<kelly_fraction(.6,2)<.2
    c=MarketConfig(); b0,a0=quotes(100,0,1,c); b5,a5=quotes(100,5,1,c); assert b5<b0 and a5<a0
def test_seeded_simulation_risk_limits():
    c=MarketConfig(); o=simulate(c); assert abs(o["inventory"])<=c.max_inventory; assert o["fills"]>10; assert o["max_drawdown"]>=0
