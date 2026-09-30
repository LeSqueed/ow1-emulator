# #!mainFile "../../main.opy"

# rule "[junkerqueen/shout.opy]: Set default Commanding Shout cooldown":
#     @Event eachPlayer
#     @Hero junkerQueen
#     @Condition eventPlayer.isUsingAbility1()

#     waitUntil(not eventPlayer.isUsingAbility1(), Math.INFINITY)
#     eventPlayer.setAbilityCooldown(Button.ABILITY_1, OW1_JUNKER_QUEEN_COMMANDING_SHOUT_COOLDOWN)
