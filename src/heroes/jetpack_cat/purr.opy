#!mainFile "../../dev_main.opy"

rule "[jetpack_cat/purr.opy]: Remove Purr damage":
    @Event playerDealtDamage
    @Hero jetpackCat
    @Condition eventAbility == Button.ABILITY_2

    heal(victim, null, eventDamage)


rule "[jetpack_cat/purr.opy]: Scale Purr healing":
    @Event playerDealtHealing
    @Hero jetpackCat
    @Condition eventAbility == Button.ABILITY_2

    heal(healee, null, eventHealing * (OW1_JETPACK_CAT_PURR_HEALING/OW2_JETPACK_CAT_PURR_HEALING - 1))
