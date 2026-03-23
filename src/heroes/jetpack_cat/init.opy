#!mainFile "../../dev_main.opy"

#!include "biotic_pawjectiles.opy"
#!include "frenetic_flight.opy"
#!include "lifeline.opy"
#!include "purr.opy"
#!include "catnapper.opy"


def initJetpackCat():
    @Name "[jetpack_cat/init.opy]: initJetpackCat()"

    setCustomHp(OW1_JETPACK_CAT_HEALTH, OW1_JETPACK_CAT_SHIELDS, OW1_JETPACK_CAT_ARMOR)
    setUltCost(OW1_JETPACK_CAT_ULT_COST)
    eventPlayer.lifeline_duration = OW1_JETPACK_CAT_LIFELINE_MAX_DURATION
    showLifelineGui()
