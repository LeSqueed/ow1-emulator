#!mainFile "../../dev_main.opy"


rule "[echo/focusing_beam.opy]: Deal OW1 echo focusing beam under 50% hp":
    @Event playerDealtDamage
    @Hero echo
    @Condition eventPlayer.isUsingAbility2()
    @Condition percent(victim.getHealth()/victim.getMaxHealth()) < OW1_ECHO_FOCUSING_BEAM_THRESHOLD

    damage(victim, attacker, (eventDamage/eventPlayer._base_damage_scalar*(OW1_ECHO_FOCUSING_BEAM_DAMAGE/OW2_ECHO_FOCUSING_BEAM_DAMAGE) - eventDamage)/eventPlayer._base_damage_scalar)
