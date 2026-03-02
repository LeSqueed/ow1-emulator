#!mainFile "../../dev_main.opy"

#!include "biotic_pawjectiles.opy"
#!include "frenetic_flight.opy"
#!include "lifeline.opy"
#!include "purr.opy"
#!include "catnapper.opy"


def initJetpackCat():
    @Name "[jetpack_cat/init.opy]: initJetpackCat()"

    setCustomHp(OW1_JETPACK_CAT_HEALTH, 0, 0)
    setUltCost(OW1_JETPACK_CAT_ULT_COST)
    eventPlayer.lifeline_duration = OW1_JETPACK_CAT_LIFELINE_MAX_DURATION
    showLifelineGui()
