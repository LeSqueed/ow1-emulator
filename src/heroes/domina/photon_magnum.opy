#!mainFile "../../dev_main.opy"

#!define DOMINA_BEAM_DURATION 0.8

playervar beamPhase
playervar beamTimer

rule "[domina/photon_magnum.opy]: Track beam phase start":
    @Event eachPlayer
    @Hero domina
    @Condition eventPlayer.isHoldingButton(Button.PRIMARY_FIRE) == true
    @Condition eventPlayer.beamPhase == false
    
    eventPlayer.beamPhase = true
    eventPlayer.beamTimer = 0
    chaseOverTime(eventPlayer.beamTimer, DOMINA_BEAM_DURATION, DOMINA_BEAM_DURATION, ChaseTimeReeval.NONE)

rule "[domina/photon_magnum.opy]: Transition to hitscan phase when charge completes":
    @Event eachPlayer
    @Hero domina
    @Condition eventPlayer.beamTimer >= DOMINA_BEAM_DURATION
    
    stopChasingVariable(eventPlayer.beamTimer)
    eventPlayer.beamPhase = false

rule "[domina/photon_magnum.opy]: Reset beam phase on release":
    @Event eachPlayer
    @Hero domina
    @Condition eventPlayer.isHoldingButton(Button.PRIMARY_FIRE) == false
    
    stopChasingVariable(eventPlayer.beamTimer)
    eventPlayer.beamTimer = 0
    eventPlayer.beamPhase = false