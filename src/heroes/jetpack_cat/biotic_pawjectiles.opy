#!mainFile "../../dev_main.opy"

rule "[jetpack_cat/biotic_pawjectiles.opy]: Scale primary fire damage":
    @Event playerDealtDamage
    @Hero jetpackCat
    @Condition eventAbility != Button.MELEE
    @Condition eventAbility != Button.ABILITY_1
    @Condition eventAbility != Button.ABILITY_2
    @Condition eventAbility != Button.ULTIMATE

    heal(victim, null, eventDamage - eventDamage * (OW1_JETPACK_CAT_PRIMARY_CENTER_DAMAGE/OW2_JETPACK_CAT_PRIMARY_CENTER_DAMAGE))