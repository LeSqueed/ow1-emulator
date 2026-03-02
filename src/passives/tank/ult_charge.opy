#!mainFile "../../dev_main.opy"

playervar ult_charge_pvar
#!defineMember _missing_ult_points ult_charge_pvar[0]
#!defineMember _ult_cost ult_charge_pvar[1]

macro setUltCost(cost):
    eventPlayer._ult_cost = cost


def resetUltCharge():
    @Name "[passives/tank/ult_charge.opy]: resetUltCharge()"

    eventPlayer._ult_charge_reset = false

    eventPlayer._ult_cost = 0
    waitUntil(eventPlayer.getUltCharge() > 0, 1)
    eventPlayer.setUltCharge(0)

    eventPlayer._ult_charge_reset = true
