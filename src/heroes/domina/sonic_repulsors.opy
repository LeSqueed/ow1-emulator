#!mainFile "../../dev_main.opy"

playervar repulsed_victims
playervar repulsor_wall_victims

rule "[domina/sonic_repulsors.opy]: Initialize sonic repulsors":
    @Event eachPlayer
    @Hero domina
    @Condition eventPlayer.isUsingAbility1()
    @Condition eventPlayer.isHoldingButton(Button.ABILITY_1)

    eventPlayer.repulsed_victims = []
    eventPlayer.repulsor_wall_victims = []

rule "[domina/sonic_repulsors.opy]: Find wall impacted victims":
    @Event playerDealtDamage
    @Hero domina
    @Condition eventAbility == Button.ABILITY_1
    @Condition victim in attacker.repulsed_victims
    @Condition victim not in attacker.repulsor_wall_victims

    attacker.repulsor_wall_victims.append(victim)
    heal(victim, null, eventDamage)

rule "[domina/sonic_repulsors.opy]: Find repulsed victims":
    @Event playerDealtDamage
    @Hero domina
    @Condition eventAbility == Button.ABILITY_1
    @Condition victim not in attacker.repulsed_victims

    attacker.repulsed_victims.append(victim)
    damage(victim, attacker, OW1_DOMINA_SONIC_REPULSORS_BASE_DAMAGE)

    #ToDo: Restore Domina shields based on damage.

rule "[domina/sonic_repulsors.opy]: Remove stun":
    @Event playerDealtDamage
    @Hero domina
    @Condition eventAbility == Button.ABILITY_1
    @Condition victim in eventPlayer.repulsor_wall_victims

    victim.clearStatusEffect(Status.STUNNED)