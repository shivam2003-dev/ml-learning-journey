from dataclasses import dataclass
import numpy as np
@dataclass
class MarketConfig:
    steps:int=500; mid:float=100.; volatility:float=.15; risk_aversion:float=.08; liquidity:float=1.5; max_inventory:int=8; fractional_kelly:float=.5; seed:int=21
def expected_value(win_prob,win_payoff,loss=1): return win_prob*win_payoff-(1-win_prob)*loss
def kelly_fraction(win_prob,decimal_odds,fraction=.5):
    b=decimal_odds-1; return fraction*max(0,(b*win_prob-(1-win_prob))/b)
def quotes(mid,inventory,time_left,c):
    reservation=mid-inventory*c.risk_aversion*c.volatility**2*time_left
    spread=c.risk_aversion*c.volatility**2*time_left+2/c.risk_aversion*np.log1p(c.risk_aversion/c.liquidity)
    return reservation-spread/2,reservation+spread/2
def simulate(c=MarketConfig()):
    r=np.random.default_rng(c.seed); mid=c.mid; cash=0.; inv=0; wealth=[]; fills=0
    for t in range(c.steps):
        bid,ask=quotes(mid,inv,1-t/c.steps,c); next_mid=mid+r.normal(0,c.volatility)
        pb=np.exp(-c.liquidity*max(mid-bid,0)); pa=np.exp(-c.liquidity*max(ask-mid,0))
        if inv<c.max_inventory and r.random()<pb*.25: cash-=bid; inv+=1; fills+=1
        if inv>-c.max_inventory and r.random()<pa*.25: cash+=ask; inv-=1; fills+=1
        mid=next_mid; wealth.append(cash+inv*mid)
    pnl=cash+inv*mid; dd=float(np.max(np.maximum.accumulate(wealth)-wealth)); return {"pnl":pnl,"inventory":inv,"fills":fills,"max_drawdown":dd,"wealth":wealth}
