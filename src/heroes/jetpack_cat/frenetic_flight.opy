#!mainFile "../../dev_main.opy"

rule "[jetpack_cat/frenetic_flight.opy]: OW1 Frenetic Flight speed":
    @Event eachPlayer
    @Hero jetpackCat
    @Condition eventPlayer.isHoldingButton(Button.SECONDARY_FIRE)

    eventPlayer.setMoveSpeed(OW1_JETPACK_CAT_FRENETIC_FLIGHT_SPEED_BUFF)


rule "[jetpack_cat/frenetic_flight.opy]: Restore speed after Frenetic Flight":
    @Event eachPlayer
    @Hero jetpackCat
    @Condition not eventPlayer.isHoldingButton(Button.SECONDARY_FIRE)

    eventPlayer.setMoveSpeed(100)
