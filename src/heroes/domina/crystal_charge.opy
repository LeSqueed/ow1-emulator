#!mainFile "../../dev_main.opy"

rule "[domina/crystal_charge.opy]: Crystal charge damage":
    @Event playerDealtDamage
    @Hero domina
    @Condition eventAbility == Button.ABILITY_2

    heal(victim, null, eventDamage - eventDamage * (OW1_DOMINA_CRYSTAL_CHARGE_DAMAGE/OW2_DOMINA_CRYSTAL_CHARGE_DAMAGE))
    