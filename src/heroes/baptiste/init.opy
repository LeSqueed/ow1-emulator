#!mainFile "../../dev_main.opy"

#!include "regen_burst.opy"
# !include "lamp.opy"


def initBaptiste():
    @Name "[baptiste/init.opy]: initBaptiste()"

    setCustomHp(OW1_BAPTISTE_HEALTH, 0, 0)
    setUltCost(OW1_BAPTISTE_ULT_COST)

    # setBaseDamage(eventPlayer, OW1_BAPTISTE_BIOTIC_LAUNCHER_DAMAGE/OW2_BAPTISTE_BIOTIC_LAUNCHER_DAMAGE)

    eventPlayer.setAmmo(0, OW1_BAPTISTE_BIOTIC_LAUNCHER_PRIMARY_CLIP_SIZE)
    eventPlayer.setMaxAmmo(0, OW1_BAPTISTE_BIOTIC_LAUNCHER_PRIMARY_CLIP_SIZE)

    eventPlayer.setAmmo(1, OW1_BAPTISTE_BIOTIC_LAUNCHER_SECONDARY_CLIP_SIZE)
    eventPlayer.setMaxAmmo(1, OW1_BAPTISTE_BIOTIC_LAUNCHER_SECONDARY_CLIP_SIZE)

    #removeSelfHealing()

    # eventPlayer.disallowButton(Button.ABILITY_2)
