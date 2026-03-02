#!mainFile "../../dev_main.opy"

playervar lifeline_duration
playervar _lifeline_bar_id

subroutine showLifelineGui
subroutine hideLifelineGui


def showLifelineGui():
    @Name "[jetpack_cat/lifeline.opy]: showLifelineGui()"

    if eventPlayer._lifeline_bar_id == null:
        progressBarHud(
            eventPlayer if eventPlayer.isUsingAbility1() else null,
            roundedPercent(eventPlayer.lifeline_duration / OW1_JETPACK_CAT_LIFELINE_MAX_DURATION),
            "Lifeline",
            HudPosition.TOP,
            Math.INFINITY,
            Color.AQUA,
            Color.WHITE,
            ProgressHudReeval.VISIBILITY_VALUES_AND_COLOR,
            SpecVisibility.DEFAULT)
        eventPlayer._lifeline_bar_id = getLastCreatedText()


def hideLifelineGui():
    @Name "[jetpack_cat/lifeline.opy]: hideLifelineGui()"

    destroyProgressBarHud(eventPlayer._lifeline_bar_id)
    eventPlayer._lifeline_bar_id = null


rule "[jetpack_cat/lifeline.opy]: Scale Lifeline healing":
    @Event playerDealtHealing
    @Hero jetpackCat
    @Condition eventAbility == Button.ABILITY_1

    damage(healee, null, eventHealing - eventHealing * (OW1_JETPACK_CAT_LIFELINE_HEALING/OW2_JETPACK_CAT_LIFELINE_HEALING))


rule "[jetpack_cat/lifeline.opy]: Enforce Lifeline max duration":
    @Event eachPlayer
    @Hero jetpackCat
    @Condition eventPlayer.isUsingAbility1()

    wait(OW1_JETPACK_CAT_LIFELINE_MAX_DURATION, Wait.ABORT_WHEN_FALSE)
    eventPlayer.forceButtonPress(Button.ABILITY_1)


rule "[jetpack_cat/lifeline.opy]: Start lifeline timer":
    @Event eachPlayer
    @Hero jetpackCat
    @Condition eventPlayer.isUsingAbility1()

    eventPlayer.lifeline_duration = OW1_JETPACK_CAT_LIFELINE_MAX_DURATION
    chase(eventPlayer.lifeline_duration, 0, rate=1, ChaseReeval.DESTINATION_AND_RATE)


rule "[jetpack_cat/lifeline.opy]: Stop lifeline timer":
    @Event eachPlayer
    @Hero jetpackCat
    @Condition not eventPlayer.isUsingAbility1()

    stopChasingVariable(eventPlayer.lifeline_duration)
