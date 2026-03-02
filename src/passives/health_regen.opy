#!mainFile "../dev_main.opy"

playervar _regen_timer
playervar _regen_display
playervar _regen_display_timeout

rule "[passives/health_regen.opy]: Initialize":
    @Event eachPlayer

    eventPlayer._regen_timer = 0
    eventPlayer._regen_display = 0
    eventPlayer._regen_display_timeout = 0


rule "[passives/health_regen.opy]: Reset regen timer on hero damage":
    @Event playerTookDamage
    @Condition attacker != null

    stopChasingVariable(eventPlayer._regen_timer)
    eventPlayer._regen_timer = OW1_HEALTH_REGEN_DELAY
    chase(eventPlayer._regen_timer, 0, rate=1, ChaseReeval.DESTINATION_AND_RATE)


rule "[passives/health_regen.opy]: Passive health regen":
    @Event eachPlayer
    @Condition eventPlayer._regen_timer <= 0
    @Condition eventPlayer.getHealth() < eventPlayer.getMaxHealth()

    if eventPlayer._regen_display_timeout <= 0:
        eventPlayer._regen_display = 0

    while eventPlayer._regen_timer <= 0 and eventPlayer.getHealth() < eventPlayer.getMaxHealth():
        stopChasingVariable(eventPlayer._regen_display_timeout)
        eventPlayer._regen_display_timeout = 2
        eventPlayer._regen_display += min(
            (OW1_HEALTH_REGEN_FLAT_HPS + unpercent(OW1_HEALTH_REGEN_PERCENT_HPS) * eventPlayer.getMaxHealth()) * 0.25,
            eventPlayer.getMaxHealth() - eventPlayer.getHealth()
        )
        heal(eventPlayer, null, min(
            (OW1_HEALTH_REGEN_FLAT_HPS + unpercent(OW1_HEALTH_REGEN_PERCENT_HPS) * eventPlayer.getMaxHealth()) * 0.25,
            eventPlayer.getMaxHealth() - eventPlayer.getHealth()
        ))
        chase(eventPlayer._regen_display_timeout, 0, rate=1, ChaseReeval.NONE)
        wait(0.25, Wait.ABORT_WHEN_FALSE)
