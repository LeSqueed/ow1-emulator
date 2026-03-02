#!mainFile "../../dev_main.opy"

rule "[domina/photon_magnum.opy]: Scale beam damage":
    @Event playerDealtDamage
    @Hero domina
    @Condition eventAbility == Button.PRIMARY_FIRE
    @Condition eventDamage < OW2_DOMINA_PHOTON_MAGNUM_SHOT_DAMAGE

    heal(victim, null, eventDamage - eventDamage * (OW1_DOMINA_PHOTON_MAGNUM_BEAM_DAMAGE/OW2_DOMINA_PHOTON_MAGNUM_BEAM_DAMAGE))


rule "[domina/photon_magnum.opy]: Scale shot damage":
    @Event playerDealtDamage
    @Hero domina
    @Condition eventAbility != Button.ABILITY_1
    @Condition eventAbility != Button.ABILITY_2
    @Condition eventAbility != Button.ULTIMATE
    @Condition eventAbility != Button.MELEE
    @Condition eventDamage >= OW2_DOMINA_PHOTON_MAGNUM_SHOT_DAMAGE

    heal(victim, null, eventDamage - eventDamage * (OW1_DOMINA_PHOTON_MAGNUM_SHOT_DAMAGE/OW2_DOMINA_PHOTON_MAGNUM_SHOT_DAMAGE))
