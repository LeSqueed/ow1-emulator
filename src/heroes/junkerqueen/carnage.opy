#!mainFile "../../dev_main.opy"

rule "[junkerqueen/carnage.opy]: OW1 carnage damage":
    @Event playerDealtDamage
    @Hero junkerQueen
    @Condition eventAbility == Button.ABILITY_2

    heal(victim, null, eventDamage - eventDamage/eventPlayer._base_damage_scalar*(OW1_JUNKER_QUEEN_CARNAGE_DAMAGE/OW2_JUNKER_QUEEN_CARNAGE_DAMAGE))
