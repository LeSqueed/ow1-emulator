#!mainFile "../dev_main.opy"

globalvar DEBUG_MODE = createWorkshopSetting(bool, "Dev Tools", "debug mode", true)
globalvar _debug_dps_window = createWorkshopSetting(int[1:200], "Dev Tools", "DPS Window (seconds)", 20)
globalvar _debug_bot

#!define STAT_KEEP_ALIVE (2)
#!define STAT_SPACING (0.5)

playervar debug_pvar
#!define _total_damage_received debug_pvar[0]
#!define _last_damage_received debug_pvar[1]
#!define _total_healing_received debug_pvar[2]
#!define _last_healing_received debug_pvar[3]
playervar _total_compensation_healed
# Tracks null-healer healing amounts from damage compensation (OW2 -> OW1 adjustment)

playervar _dps_timer
playervar _dps_damage
playervar _dps_healing
playervar _dps_active
playervar _debug_float_pos
playervar _debug_float_id


rule "[utilities/debug.opy] Disable Inspector for performance":
    @Event global
    @Condition not DEBUG_MODE

    disableInspector()


rule "[utilities/debug.opy]: global debug (Top Left)":
    @Event global
    @Condition DEBUG_MODE == true

    hudHeader(getAllPlayers(), "Global", HudPosition.LEFT, 0, Color.WHITE, HudReeval.VISIBILITY_AND_STRING)
    hudSubheader(getAllPlayers(), "Server Load = {}%".format(getServerLoad()), HudPosition.LEFT, 1, Color.WHITE, HudReeval.VISIBILITY_AND_STRING)
    hudSubheader(getAllPlayers(), "Server Load Average = {}%".format(getAverageServerLoad()), HudPosition.LEFT, 1, Color.WHITE, HudReeval.VISIBILITY_AND_STRING)
    hudSubheader(getAllPlayers(), "Server Load Peak = {}%".format(getPeakServerLoad()), HudPosition.LEFT, 1, Color.WHITE, HudReeval.VISIBILITY_AND_STRING)
    hudSubheader(getAllPlayers(), "isGameInProgress() = {}".format(isGameInProgress()), HudPosition.LEFT, 1, Color.WHITE, HudReeval.VISIBILITY_AND_STRING)
    hudSubheader(getAllPlayers(), "isInSetup() = {}".format(isInSetup()), HudPosition.LEFT, 1, Color.WHITE, HudReeval.VISIBILITY_AND_STRING)
    # hudSubheader(getAllPlayers(), "getTotalTimeElapsed() = {}".format(getTotalTimeElapsed()), HudPosition.LEFT, 1, Color.WHITE, HudReeval.VISIBILITY_AND_STRING)
    # hudSubheader(getAllPlayers(), "len(_available_heroes) = {}".format(len(_available_heroes)), HudPosition.LEFT, 1, Color.WHITE, HudReeval.VISIBILITY_AND_STRING)
    # hudSubheader(getAllPlayers(), "len(_player_queue) = {}".format(len(_player_queue)), HudPosition.LEFT, 1, Color.WHITE, HudReeval.VISIBILITY_AND_STRING)
    # hudSubheader(getAllPlayers(), "_arena0_fighters = {} vs {}".format(_arena0_fighter0, _arena0_fighter1), HudPosition.LEFT, 1, Color.WHITE, HudReeval.VISIBILITY_AND_STRING)
    # hudSubheader(getAllPlayers(), "_arena1_fighters = {} vs {}".format(_arena1_fighter0, _arena1_fighter1), HudPosition.LEFT, 1, Color.WHITE, HudReeval.VISIBILITY_AND_STRING)
    # hudSubheader(getAllPlayers(), "_arena2_fighters = {} vs {}".format(_arena2_fighter0, _arena2_fighter1), HudPosition.LEFT, 1, Color.WHITE, HudReeval.VISIBILITY_AND_STRING)
    # hudSubheader(getAllPlayers(), "_arena0_winner = {}".format(_arena0_winner), HudPosition.LEFT, 1, Color.WHITE, HudReeval.VISIBILITY_AND_STRING)
    # hudSubheader(getAllPlayers(), "_arena1_winner = {}".format(_arena1_winner), HudPosition.LEFT, 1, Color.WHITE, HudReeval.VISIBILITY_AND_STRING)
    # hudSubheader(getAllPlayers(), "_arena2_winner = {}".format(_arena2_winner), HudPosition.LEFT, 1, Color.WHITE, HudReeval.VISIBILITY_AND_STRING)


rule "[utilities/debug.opy]: player debug (Top Right)":
    @Event eachPlayer
    @Condition DEBUG_MODE == true

    hudHeader(eventPlayer, "Event Player", HudPosition.RIGHT, 0, Color.WHITE, HudReeval.STRING)
    # hudSubheader(eventPlayer, "_hp_health = {}".format(eventPlayer._hp_health), HudPosition.RIGHT, 1, Color.WHITE, HudReeval.STRING)
    # hudSubheader(eventPlayer, "_hp_armor = {}".format(eventPlayer._hp_armor), HudPosition.RIGHT, 1, Color.WHITE, HudReeval.STRING)
    # hudSubheader(eventPlayer, "_hp_shields = {}".format(eventPlayer._hp_shields), HudPosition.RIGHT, 1, Color.WHITE, HudReeval.STRING)
    # hudSubheader(eventPlayer, "_hp_health_ow2 = {}".format(eventPlayer._hp_health_ow2), HudPosition.RIGHT, 1, Color.WHITE, HudReeval.STRING)
    # hudSubheader(eventPlayer, "_hp_armor_ow2 = {}".format(eventPlayer._hp_armor_ow2), HudPosition.RIGHT, 1, Color.WHITE, HudReeval.STRING)
    # hudSubheader(eventPlayer, "_hp_shields_ow2 = {}".format(eventPlayer._hp_shields_ow2), HudPosition.RIGHT, 1, Color.WHITE, HudReeval.STRING)
    hudSubheader(eventPlayer, "_hp_scalar = {}".format(eventPlayer._hp_scalar), HudPosition.RIGHT, 1, Color.WHITE, HudReeval.STRING)
    # hudSubheader(eventPlayer, "_primal_exit_health = {}".format(eventPlayer._primal_exit_health), HudPosition.RIGHT, 1, Color.WHITE, HudReeval.STRING)
    # hudSubheader(eventPlayer, "_primal_exit_armor = {}".format(eventPlayer._primal_exit_armor), HudPosition.RIGHT, 1, Color.WHITE, HudReeval.STRING)
    # hudSubheader(eventPlayer, "isResetComplete() = {}".format(isResetComplete(eventPlayer)), HudPosition.RIGHT, 1, Color.WHITE, HudReeval.STRING)
    # hudSubheader(eventPlayer, "current_configuration = {}".format(eventPlayer.current_configuration), HudPosition.RIGHT, 1, Color.WHITE, HudReeval.STRING)
    # hudSubheader(eventPlayer, "len(getAllowedHeroes()) = {}".format(len(eventPlayer.getAllowedHeroes())), HudPosition.RIGHT, 1, Color.WHITE, HudReeval.STRING)
    # hudSubheader(eventPlayer, "_is_using_flashbang = {}".format(eventPlayer._is_using_flashbang), HudPosition.RIGHT, 1, Color.WHITE, HudReeval.STRING)
    # hudSubheader(eventPlayer, "_hero_setup = {}".format(eventPlayer._hero_setup), HudPosition.RIGHT, 1, Color.WHITE, HudReeval.STRING)
    # hudSubheader(eventPlayer, "_base_movement_scalar = {}".format(eventPlayer._base_movement_scalar), HudPosition.RIGHT, 1, Color.WHITE, HudReeval.STRING)
    # hudSubheader(eventPlayer, "_hero_switched = {}".format(switchedHero(eventPlayer)), HudPosition.RIGHT, 1, Color.WHITE, HudReeval.STRING)
    # hudSubheader(eventPlayer, "getAltitude() = {}".format(eventPlayer.getAltitude()), HudPosition.RIGHT, 1, Color.WHITE, HudReeval.STRING)
    # hudSubheader(eventPlayer, "hasStatusEffect(Status.HACKED) = {}".format(eventPlayer.hasStatusEffect(Status.HACKED)), HudPosition.RIGHT, 1, Color.WHITE, HudReeval.STRING)
    # hudSubheader(eventPlayer, "hasStatusEffect(Status.STUNNED) = {}".format(eventPlayer.hasStatusEffect(Status.STUNNED)), HudPosition.RIGHT, 1, Color.WHITE, HudReeval.STRING)
    # hudSubheader(eventPlayer, "getStatistic(Stat.HERO_DAMAGE_DEALT) = {}".format(eventPlayer.getStatistic(Stat.HERO_DAMAGE_DEALT)), HudPosition.RIGHT, 1, Color.WHITE, HudReeval.STRING)
    # hudSubheader(eventPlayer, "len(allowed_heroes) = {}".format(len(eventPlayer.allowed_heroes)), HudPosition.RIGHT, 1, Color.WHITE, HudReeval.STRING)
    # hudSubheader(eventPlayer, "len(getAllowedHeroes()) = {}".format(len(eventPlayer.getAllowedHeroes())), HudPosition.RIGHT, 1, Color.WHITE, HudReeval.STRING)
    # hudSubheader(eventPlayer, "isUsingUltimate() = {}".format(eventPlayer.isUsingUltimate()), HudPosition.RIGHT, 1, Color.WHITE, HudReeval.STRING)
    # hudSubheader(eventPlayer, "_is_casting_emp = {}".format(eventPlayer._is_casting_emp), HudPosition.RIGHT, 1, Color.WHITE, HudReeval.STRING)
    # hudSubheader(eventPlayer, "_passive_healing_active = {}".format(eventPlayer._passive_healing_active), HudPosition.RIGHT, 1, Color.WHITE, HudReeval.STRING)
    # hudSubheader(eventPlayer, "_missing_ult_points = {}".format(eventPlayer._missing_ult_points), HudPosition.RIGHT, 1, Color.WHITE, HudReeval.STRING)
    # hudSubheader(eventPlayer, "getUltPoints() = {}".format(getUltPoints(eventPlayer)), HudPosition.RIGHT, 1, Color.WHITE, HudReeval.STRING)
    # hudSubheader(eventPlayer, "getUltCharge() = {}".format(eventPlayer.getUltCharge()), HudPosition.RIGHT, 1, Color.WHITE, HudReeval.STRING)
    # hudSubheader(eventPlayer, "getUltCharge() >= 100 = {}".format(eventPlayer.getUltCharge() >= 100), HudPosition.RIGHT, 1, Color.WHITE, HudReeval.STRING)
    # hudSubheader(eventPlayer, "isHoldingButton(Button.PRIMARY_FIRE) = {}".format(eventPlayer.isHoldingButton(Button.PRIMARY_FIRE)), HudPosition.RIGHT, 1, Color.WHITE, HudReeval.STRING)
    # hudSubheader(eventPlayer, "isFiringPrimaryFire() = {}".format(eventPlayer.isFiringPrimaryFire()), HudPosition.RIGHT, 1, Color.WHITE, HudReeval.STRING)
    # hudSubheader(eventPlayer, "isHoldingButton(Button.SECONDARY_FIRE) = {}".format(eventPlayer.isHoldingButton(Button.SECONDARY_FIRE)), HudPosition.RIGHT, 1, Color.WHITE, HudReeval.STRING)
    # hudSubheader(eventPlayer, "isFiringSecondaryFire() = {}".format(eventPlayer.isFiringSecondaryFire()), HudPosition.RIGHT, 1, Color.WHITE, HudReeval.STRING)
    # hudSubheader(eventPlayer, "isHoldingButton(Button.ABILITY_1) = {}".format(eventPlayer.isHoldingButton(Button.ABILITY_1)), HudPosition.RIGHT, 1, Color.WHITE, HudReeval.STRING)
    # hudSubheader(eventPlayer, "isUsingAbility1() = {}".format(eventPlayer.isUsingAbility1()), HudPosition.RIGHT, 1, Color.WHITE, HudReeval.STRING)
    # hudSubheader(eventPlayer, "Ability 1 Cooldown = {}".format(eventPlayer.getAbilityCooldown(Button.ABILITY_1)), HudPosition.RIGHT, 1, Color.WHITE, HudReeval.STRING)
    # hudSubheader(eventPlayer, "isUsingAbility2() = {}".format(eventPlayer.isUsingAbility2()), HudPosition.RIGHT, 1, Color.WHITE, HudReeval.STRING)
    # hudSubheader(eventPlayer, "Ability 2 Cooldown = {}".format(eventPlayer.getAbilityCooldown(Button.ABILITY_2)), HudPosition.RIGHT, 1, Color.WHITE, HudReeval.STRING)
    # hudSubheader(eventPlayer, "getAbilityCharge(ABILITY_2) = {}".format(eventPlayer.getAbilityCharge(Button.ABILITY_2)), HudPosition.RIGHT, 1, Color.WHITE, HudReeval.STRING)
    # hudSubheader(eventPlayer, "getSpeed() = {}".format(eventPlayer.getSpeed()), HudPosition.RIGHT, 1, Color.WHITE, HudReeval.STRING)
    # hudSubheader(eventPlayer, "_ult_cost = {}".format(eventPlayer._ult_cost), HudPosition.RIGHT, 1, Color.WHITE, HudReeval.STRING)
    # hudSubheader(eventPlayer, "_ult_percent_compensated = {}".format(eventPlayer._ult_percent_compensated), HudPosition.RIGHT, 1, Color.WHITE, HudReeval.STRING)
    # hudSubheader(eventPlayer, "getMaxHealth() = {}".format(eventPlayer.getMaxHealth()), HudPosition.RIGHT, 1, Color.WHITE, HudReeval.STRING)
    # hudSubheader(eventPlayer, "getMaxHealthOfType(NORMAL) = {}".format(eventPlayer.getMaxHealthOfType(Health.NORMAL)), HudPosition.RIGHT, 1, Color.WHITE, HudReeval.STRING)
    # hudSubheader(eventPlayer, "getMaxHealthOfType(ARMOR) = {}".format(eventPlayer.getMaxHealthOfType(Health.ARMOR)), HudPosition.RIGHT, 1, Color.WHITE, HudReeval.STRING)
    # hudSubheader(eventPlayer, "getMaxHealthOfType(SHIELDS) = {}".format(eventPlayer.getMaxHealthOfType(Health.SHIELDS)), HudPosition.RIGHT, 1, Color.WHITE, HudReeval.STRING)
    # hudSubheader(eventPlayer, "getHealth() = {}".format(eventPlayer.getHealth()), HudPosition.RIGHT, 1, Color.WHITE, HudReeval.STRING)
    # hudSubheader(eventPlayer, "getHealthOfType(NORMAL) = {}".format(eventPlayer.getHealthOfType(Health.NORMAL)), HudPosition.RIGHT, 1, Color.WHITE, HudReeval.STRING)
    # hudSubheader(eventPlayer, "getHealthOfType(ARMOR) = {}".format(eventPlayer.getHealthOfType(Health.ARMOR)), HudPosition.RIGHT, 1, Color.WHITE, HudReeval.STRING)
    # hudSubheader(eventPlayer, "getHealthOfType(SHIELDS) = {}".format(eventPlayer.getHealthOfType(Health.SHIELDS)), HudPosition.RIGHT, 1, Color.WHITE, HudReeval.STRING)
    # hudSubheader(eventPlayer, "getNaturalArmor() = {}".format(getNaturalArmor()), HudPosition.RIGHT, 1, Color.WHITE, HudReeval.STRING)
    # hudSubheader(eventPlayer, "getExtraArmor() = {}".format(getExtraArmor()), HudPosition.RIGHT, 1, Color.WHITE, HudReeval.STRING)
    # hudSubheader(eventPlayer, "orisa_ammo = {}".format(eventPlayer.orisa_ammo), HudPosition.RIGHT, 1, Color.WHITE, HudReeval.STRING)
    # hudSubheader(eventPlayer, "isReloading() = {}".format(eventPlayer.isReloading()), HudPosition.RIGHT, 1, Color.WHITE, HudReeval.STRING)
    # hudSubheader(eventPlayer, "getAmmo(0) = {}".format(eventPlayer.getAmmo(0)), HudPosition.RIGHT, 1, Color.WHITE, HudReeval.STRING)
    # hudSubheader(eventPlayer, "isHoldingButton(Button.PRIMARY_FIRE) = {}".format(eventPlayer.isHoldingButton(Button.PRIMARY_FIRE)), HudPosition.RIGHT, 1, Color.WHITE, HudReeval.STRING)
    # hudSubheader(eventPlayer, "len(_self_healing_source) = {}".format(len(eventPlayer._self_healing_source)), HudPosition.RIGHT, 1, Color.WHITE, HudReeval.STRING)
    # hudSubheader(eventPlayer, "_self_healing_percent = {}".format(eventPlayer._self_healing_percent), HudPosition.RIGHT, 1, Color.WHITE, HudReeval.STRING)
    # hudSubheader(eventPlayer, "_passive_healing_active = {}".format(eventPlayer._passive_healing_active), HudPosition.RIGHT, 1, Color.WHITE, HudReeval.STRING)
    # hudSubheader(eventPlayer, "_suppress_passive_healing = {}".format(eventPlayer._suppress_passive_healing), HudPosition.RIGHT, 1, Color.WHITE, HudReeval.STRING)
    # hudSubheader(eventPlayer, "getPosition() = {}".format(eventPlayer.getPosition()), HudPosition.RIGHT, 1, Color.WHITE, HudReeval.STRING)
    # hudSubheader(eventPlayer, "role = {}".format(eventPlayer.role), HudPosition.RIGHT, 1, Color.WHITE, HudReeval.STRING)
    # hudSubheader(eventPlayer, "isInAlternateForm() = {}".format(eventPlayer.isInAlternateForm()), HudPosition.RIGHT, 1, Color.WHITE, HudReeval.STRING)
    # hudSubheader(eventPlayer, "Primary Fire Cooldown = {}".format(eventPlayer.getAbilityCooldown(Button.PRIMARY_FIRE)), HudPosition.RIGHT, 1, Color.WHITE, HudReeval.STRING)
    # hudSubheader(eventPlayer, "is_using_guardian_angel = {}".format(eventPlayer.is_using_guardian_angel), HudPosition.RIGHT, 1, Color.WHITE, HudReeval.STRING)
    # hudSubheader(eventPlayer, "is_slingshotting = {}".format(eventPlayer.is_slingshotting), HudPosition.RIGHT, 1, Color.WHITE, HudReeval.STRING)
    # hudSubheader(eventPlayer, "slam_damage = {}".format(eventPlayer.slam_damage), HudPosition.RIGHT, 1, Color.WHITE, HudReeval.STRING)
    # hudSubheader(eventPlayer, "is_using_uppercut = {}".format(eventPlayer.is_using_uppercut), HudPosition.RIGHT, 1, Color.WHITE, HudReeval.STRING)
    # hudSubheader(eventPlayer, "is_uppercut_locked = {}".format(eventPlayer.is_uppercut_locked), HudPosition.RIGHT, 1, Color.WHITE, HudReeval.STRING)
    # hudSubheader(eventPlayer, "uppercut_shields = {}".format(eventPlayer.uppercut_shields), HudPosition.RIGHT, 1, Color.WHITE, HudReeval.STRING)
    # hudSubheader(eventPlayer, "isUsingSelfRepair() = {}".format(isUsingSelfRepair(eventPlayer)), HudPosition.RIGHT, 1, Color.WHITE, HudReeval.STRING)
    # hudSubheader(eventPlayer, "barrier_damage_block_id = {}".format(eventPlayer.barrier_damage_block_id), HudPosition.RIGHT, 1, Color.WHITE, HudReeval.STRING)
    # hudSubheader(eventPlayer, "len(enemies_behind_barrier) = {}".format(len(eventPlayer.enemies_behind_barrier)), HudPosition.RIGHT, 1, Color.WHITE, HudReeval.STRING)
    # hudSubheader(eventPlayer, "isAimingAtOrisaBarrier() = {}".format(isAimingAtOrisaBarrier()), HudPosition.RIGHT, 1, Color.WHITE, HudReeval.STRING)
    # hudSubheader(eventPlayer, "_ow1_adaptive_shield_n = {}".format(eventPlayer._ow1_adaptive_shield_n), HudPosition.RIGHT, 1, Color.WHITE, HudReeval.STRING)
    # hudSubheader(eventPlayer, "_ow2_adaptive_shield_n = {}".format(eventPlayer._ow2_adaptive_shield_n), HudPosition.RIGHT, 1, Color.WHITE, HudReeval.STRING)
    # hudSubheader(eventPlayer, "_expected_adapt_shields = {}".format(eventPlayer._expected_adapt_shields), HudPosition.RIGHT, 1, Color.WHITE, HudReeval.STRING)
    # hudSubheader(eventPlayer, "_actual_adapt_shields = {}".format(eventPlayer._actual_adapt_shields), HudPosition.RIGHT, 1, Color.WHITE, HudReeval.STRING)
    # hudSubheader(eventPlayer, "is_using_shield_bash = {}".format(eventPlayer.is_using_shield_bash), HudPosition.RIGHT, 1, Color.WHITE, HudReeval.STRING)
    # hudSubheader(eventPlayer, "shield_bash_through_barrier = {}".format(eventPlayer.shield_bash_through_barrier), HudPosition.RIGHT, 1, Color.WHITE, HudReeval.STRING)
    # hudSubheader(eventPlayer, "transloc_time = {}".format(eventPlayer.transloc_time), HudPosition.RIGHT, 1, Color.WHITE, HudReeval.STRING)
    # hudSubheader(eventPlayer, "transloc_position = {}".format(eventPlayer.transloc_position), HudPosition.RIGHT, 1, Color.WHITE, HudReeval.STRING)
    # hudSubheader(eventPlayer, "trasnloc_velocity = {}".format(eventPlayer.trasnloc_velocity), HudPosition.RIGHT, 1, Color.WHITE, HudReeval.STRING)
    # hudSubheader(eventPlayer, "_seed_hit_surface_normal = {}".format(eventPlayer._seed_hit_surface_normal), HudPosition.RIGHT, 1, Color.WHITE, HudReeval.STRING)
    # hudSubheader(eventPlayer, "_is_using_translocator = {}".format(eventPlayer._is_using_translocator), HudPosition.RIGHT, 1, Color.WHITE, HudReeval.STRING)
    # hudSubheader(eventPlayer, "isOnGround() = {}".format(eventPlayer.isOnGround()), HudPosition.RIGHT, 1, Color.WHITE, HudReeval.STRING)
    # hudSubheader(eventPlayer, "isJumping() = {}".format(eventPlayer.isJumping()), HudPosition.RIGHT, 1, Color.WHITE, HudReeval.STRING)
    # hudSubheader(eventPlayer, "jet_fuel = {}".format(eventPlayer.jet_fuel), HudPosition.RIGHT, 1, Color.WHITE, HudReeval.STRING)
    # hudSubheader(eventPlayer, "_hover_jet_button = {}".format(eventPlayer._hover_jet_button), HudPosition.RIGHT, 1, Color.WHITE, HudReeval.STRING)
    # hudSubheader(eventPlayer, "is_using_hover_jets() = {}".format(is_using_hover_jets()), HudPosition.RIGHT, 1, Color.WHITE, HudReeval.STRING)
    # hudSubheader(eventPlayer, "getAbilityCooldown(JUMP) = {}".format(eventPlayer.getAbilityCooldown(Button.JUMP)), HudPosition.RIGHT, 1, Color.WHITE, HudReeval.STRING)
    # hudSubheader(eventPlayer, "getAbilityCooldown(SECONDARY) = {}".format(eventPlayer.getAbilityCooldown(Button.SECONDARY_FIRE)), HudPosition.RIGHT, 1, Color.WHITE, HudReeval.STRING)
    # hudSubheader(eventPlayer, "_is_exiting_wholehog = {}".format(eventPlayer._is_exiting_wholehog), HudPosition.RIGHT, 1, Color.WHITE, HudReeval.STRING)
    # hudSubheader(eventPlayer, "isGlidingOnRoof = {}".format(isGlidingOnRoof()), HudPosition.RIGHT, 1, Color.WHITE, HudReeval.STRING)
    # hudSubheader(eventPlayer, "_tank_sleep_start_time = {}".format(eventPlayer._tank_sleep_start_time), HudPosition.RIGHT, 1, Color.WHITE, HudReeval.STRING)
    # hudSubheader(eventPlayer, "_tank_sleeping = {}".format(eventPlayer._tank_sleeping), HudPosition.RIGHT, 1, Color.WHITE, HudReeval.STRING)
    # hudSubheader(eventPlayer, "_scrap_last_fire_time = {}".format(eventPlayer._scrap_last_fire_time), HudPosition.RIGHT, 1, Color.WHITE, HudReeval.STRING)
    # hudSubheader(eventPlayer, "distance(scrap_start, scrap_detonation) = {}".format(distance(eventPlayer._scrap_start_pos, eventPlayer._scrap_detonation_pos)), HudPosition.RIGHT, 1, Color.WHITE, HudReeval.STRING)
    # hudSubheader(eventPlayer, "_current_arena = {}".format(eventPlayer._current_arena), HudPosition.RIGHT, 1, Color.WHITE, HudReeval.STRING)
    # hudSubheader(eventPlayer, "hero_number = {}".format(eventPlayer.hero_number), HudPosition.RIGHT, 1, Color.WHITE, HudReeval.STRING)
    # hudSubheader(eventPlayer, "len(hero_bag) = {}".format(len(eventPlayer.hero_bag)), HudPosition.RIGHT, 1, Color.WHITE, HudReeval.STRING)
    # hudSubheader(eventPlayer, "isIndicatorVisible() = {}".format(isIndicatorVisible()), HudPosition.RIGHT, 1, Color.WHITE, HudReeval.STRING)
    # hudSubheader(eventPlayer, "slam_indicator_ring_id[0] == null = {}".format(eventPlayer.slam_indicator_ring_id[0] == null), HudPosition.RIGHT, 1, Color.WHITE, HudReeval.STRING)
    # hudSubheader(eventPlayer, "slam_indicator_ring_id[1] = {}".format(eventPlayer.slam_indicator_ring_id[1]), HudPosition.RIGHT, 1, Color.WHITE, HudReeval.STRING)
    # hudSubheader(eventPlayer, "slam_indicator_ring_id[2] = {}".format(eventPlayer.slam_indicator_ring_id[2]), HudPosition.RIGHT, 1, Color.WHITE, HudReeval.STRING)
    # hudSubheader(eventPlayer, "perk_ult_charge_backup_ = {}".format(eventPlayer.perk_ult_charge_backup_), HudPosition.RIGHT, 1, Color.WHITE, HudReeval.STRING)
    # hudSubheader(eventPlayer, "perk_points_ = {}".format(eventPlayer.perk_points_), HudPosition.RIGHT, 1, Color.WHITE, HudReeval.STRING)
    # hudSubheader(eventPlayer, "max_perk_points_ = {}".format(eventPlayer.max_perk_points_), HudPosition.RIGHT, 1, Color.WHITE, HudReeval.STRING)


rule "[utilities/debug.opy]: do something on interact":
    @Event eachPlayer
    @Condition DEBUG_MODE
    @Condition eventPlayer.isHoldingButton(Button.INTERACT)
    @Condition not eventPlayer.isHoldingButton(Button.CROUCH)

    damage(eventPlayer, eventPlayer, 25)
    # eventPlayer.setHealth(1)
    eventPlayer.setAbilityCooldown(Button.ABILITY_1, 0)
    eventPlayer.setAbilityCooldown(Button.ABILITY_2, 0)
    eventPlayer.setAbilityCooldown(Button.SECONDARY_FIRE, 0)
    #setPerkCost(5000)
    #unlockAllPerks()
    eventPlayer.setUltCharge(100)


rule "[utilities/debug.opy]: Show Player Damage/Healing":
    @Event eachPlayer
    @Condition DEBUG_MODE

    # most recent damage
    createInWorldText(
        getAllPlayers() if eventPlayer._last_damage_received > 0 else null, 
        eventPlayer._last_damage_received, 
        eventPlayer.getEyePosition() + 1 * STAT_SPACING * Vector.UP, 
        1, 
        Clip.NONE, 
        WorldTextReeval.VISIBILITY_POSITION_AND_STRING, 
        Color.RED, 
        SpecVisibility.DEFAULT)

    # most recent healing
    createInWorldText(
        getAllPlayers() if eventPlayer._last_healing_received > 0 else null, 
        eventPlayer._last_healing_received, 
        eventPlayer.getEyePosition() + 2 * STAT_SPACING * Vector.UP, 
        1, 
        Clip.NONE, 
        WorldTextReeval.VISIBILITY_POSITION_AND_STRING, 
        Color.YELLOW, 
        SpecVisibility.DEFAULT)

    # total damage (raw OW2)
    createInWorldText(
        getAllPlayers() if eventPlayer._total_damage_received > 0 else null, 
        "Raw {:.0f}".format(eventPlayer._total_damage_received), 
        eventPlayer.getEyePosition() + 3 * STAT_SPACING * Vector.UP, 
        2, 
        Clip.NONE, 
        WorldTextReeval.VISIBILITY_POSITION_AND_STRING, 
        Color.RED, 
        SpecVisibility.DEFAULT)

    # total adjusted damage (OW1 - compensation subtracted from raw OW2)
    createInWorldText(
        getAllPlayers() if eventPlayer._total_damage_received > 0 and eventPlayer._total_compensation_healed > 0 else null,
        "Adj {:.0f}".format(eventPlayer._total_damage_received - eventPlayer._total_compensation_healed),
        eventPlayer.getEyePosition() + 3 * STAT_SPACING * Vector.UP,
        2,
        Clip.NONE,
        WorldTextReeval.VISIBILITY_POSITION_AND_STRING,
        Color.YELLOW,
        SpecVisibility.DEFAULT)

    # total healing (raw OW2)
    createInWorldText(
        getAllPlayers() if eventPlayer._total_healing_received > 0 else null,
        "Raw {:.0f}".format(eventPlayer._total_healing_received),
        eventPlayer.getEyePosition() + 4 * STAT_SPACING * Vector.UP,
        2,
        Clip.NONE,
        WorldTextReeval.VISIBILITY_POSITION_AND_STRING,
        Color.GREEN,
        SpecVisibility.DEFAULT)

    # total healing
    createInWorldText(
        getAllPlayers() if eventPlayer._total_healing_received > 0 else null,
        eventPlayer._total_healing_received,
        eventPlayer.getEyePosition() + 4 * STAT_SPACING * Vector.UP,
        2,
        Clip.NONE,
        WorldTextReeval.VISIBILITY_POSITION_AND_STRING,
        Color.YELLOW,
        SpecVisibility.DEFAULT)

    # passive regen
    createInWorldText(
        getAllPlayers() if eventPlayer._regen_display_timeout > 0 else null,
        "+{} regen".format(round(eventPlayer._regen_display)),
        eventPlayer.getEyePosition() + 5 * STAT_SPACING * Vector.UP,
        2,
        Clip.NONE,
        WorldTextReeval.VISIBILITY_POSITION_AND_STRING,
        Color.GREEN,
        SpecVisibility.DEFAULT)


rule "[utilities/debug.opy]: Debug damage instance":
    @Event playerTookDamage
    @Condition DEBUG_MODE

    printLog("attacker={}, victim={}, ability={}, amount={}, crit={}".format(attacker, victim, eventAbility, eventDamage, eventWasCriticalHit))

    victim._last_damage_received = eventDamage
    victim._total_damage_received += eventDamage
    wait(STAT_KEEP_ALIVE, Wait.RESTART_WHEN_TRUE)
    victim._last_damage_received = 0
    victim._total_damage_received = 0


rule "[utilities/debug.opy]: Debug healing instance with correction tracking":
    @Event playerReceivedHealing
    @Condition DEBUG_MODE

    printLog("healer={}, healee={}, ability={}, amount={}".format(healer, healee, eventAbility, eventHealing))

    healee._last_healing_received = eventHealing
    healee._total_healing_received += eventHealing
    wait(STAT_KEEP_ALIVE, Wait.RESTART_WHEN_TRUE)
    healee._last_healing_received = 0
    healee._total_healing_received = 0


rule "[utilities/debug.opy]: Debug correction damage instance (same-team damage)":
    @Event playerTookDamage
    @Condition DEBUG_MODE
    @Condition attacker == null

    wait(STAT_KEEP_ALIVE, Wait.RESTART_WHEN_TRUE)


rule "[utilities/debug.opy]: Track compensation heals (null-healer OW2->OW1 offset)":
    @Event playerReceivedHealing
    @Condition DEBUG_MODE
    @Condition healer == null

    # Null-healer healing - this is damage compensaton from scaled OW1 damage
    healee._total_compensation_healed += eventHealing
    wait(STAT_KEEP_ALIVE, Wait.RESTART_WHEN_TRUE)
    healee._total_compensation_healed = 0


# ---- Features ported from FSJQS-6v6 ----

rule "[utilities/debug.opy]: Keybind hints":
    @Event global
    @Condition DEBUG_MODE == true

    hudSubtext(getAllPlayers(), "[Crouch]+[Interact] -- Start/reset DPS timer", HudPosition.LEFT, 10, Color.GREEN, HudReeval.VISIBILITY_AND_STRING)
    hudSubtext(getAllPlayers(), "[Crouch]+[Jump] -- Spawn bot", HudPosition.LEFT, 11, Color.TURQUOISE, HudReeval.VISIBILITY_AND_STRING)
    hudSubtext(getAllPlayers(), "[Crouch]+[Melee] -- Remove all bots", HudPosition.LEFT, 12, Color.ORANGE, HudReeval.VISIBILITY_AND_STRING)
    hudSubtext(getAllPlayers(), "Hold [Melee] (1s) -- Change hero", HudPosition.LEFT, 13, Color.ROSE, HudReeval.VISIBILITY_AND_STRING)


rule "[utilities/debug.opy]: DPS/HPS player HUD":
    @Event eachPlayer
    @Condition DEBUG_MODE == true

    chaseAtRate(eventPlayer._dps_timer, 0, 1)
    hudText(eventPlayer, eventPlayer._dps_damage, "Damage dealt", null, HudPosition.LEFT, 13, Color.YELLOW, Color.WHITE, Color.WHITE, HudReeval.VISIBILITY_AND_STRING)
    hudText(eventPlayer, eventPlayer._dps_damage / max(_debug_dps_window - eventPlayer._dps_timer, 0.001), "DPS", null, HudPosition.LEFT, 14, Color.RED, Color.WHITE, Color.WHITE, HudReeval.VISIBILITY_AND_STRING)
    hudText(eventPlayer, eventPlayer._dps_healing, "Healing dealt", null, HudPosition.LEFT, 15, Color.YELLOW, Color.WHITE, Color.WHITE, HudReeval.VISIBILITY_AND_STRING)
    hudText(eventPlayer, eventPlayer._dps_healing / max(_debug_dps_window - eventPlayer._dps_timer, 0.001), "HPS", null, HudPosition.LEFT, 16, Color.GREEN, Color.WHITE, Color.WHITE, HudReeval.VISIBILITY_AND_STRING)
    hudHeader(eventPlayer, "Speed: {0}".format(eventPlayer.getSpeed()), HudPosition.TOP, 1, Color.WHITE, HudReeval.VISIBILITY_AND_STRING)


rule "[utilities/debug.opy]: Reset DPS/HPS on crouch+interact":
    @Event eachPlayer
    @Condition DEBUG_MODE == true
    @Condition eventPlayer.isHoldingButton(Button.INTERACT) == true
    @Condition eventPlayer.isHoldingButton(Button.CROUCH) == true

    eventPlayer._dps_active = true
    eventPlayer._dps_timer = _debug_dps_window
    eventPlayer._dps_damage = 0
    eventPlayer._dps_healing = 0


rule "[utilities/debug.opy]: Track DPS damage":
    @Event playerDealtDamage
    @Condition DEBUG_MODE == true
    @Condition victim != attacker
    @Condition eventPlayer._dps_active == true

    destroyInWorldText(eventPlayer._debug_float_id)
    eventPlayer._debug_float_pos = victim.getEyePosition()
    createInWorldText(eventPlayer, eventDamage, eventPlayer._debug_float_pos, 0.85 + eventDamage / 30, Clip.SURFACES, WorldTextReeval.VISIBILITY_POSITION_AND_STRING)
    eventPlayer._debug_float_id = getLastCreatedText()
    chaseAtRate(eventPlayer._debug_float_pos, victim.getEyePosition() + Vector.UP, 0.9, ChaseRateReeval.NONE)
    eventPlayer._dps_damage += eventDamage


rule "[utilities/debug.opy]: Track HPS healing":
    @Event playerDealtHealing
    @Condition DEBUG_MODE == true
    @Condition healee != healer
    @Condition eventPlayer._dps_active == true

    destroyInWorldText(eventPlayer._debug_float_id)
    eventPlayer._debug_float_pos = healee.getEyePosition()
    createInWorldText(eventPlayer, eventHealing, eventPlayer._debug_float_pos, 0.85 + eventHealing / 30, Clip.SURFACES, WorldTextReeval.VISIBILITY_POSITION_AND_STRING, Color.YELLOW)
    eventPlayer._debug_float_id = getLastCreatedText()
    chaseAtRate(eventPlayer._debug_float_pos, healee.getEyePosition() + Vector.UP, 0.9, ChaseRateReeval.NONE)
    eventPlayer._dps_healing += eventHealing


rule "[utilities/debug.opy]: Spawn bot":
    @Event eachPlayer
    @Condition DEBUG_MODE == true
    @Condition eventPlayer.isHoldingButton(Button.CROUCH) == true
    @Condition eventPlayer.isHoldingButton(Button.JUMP) == true

    createDummy(Hero.ANA, getOppositeTeam(eventPlayer.getTeam()), -1, eventPlayer.getPosition(), eventPlayer.getFacingDirection())
    _debug_bot = getLastCreatedEntity()
    wait(0.1)
    _debug_bot.setMaxHealth(1000)
    _debug_bot.startHealingOverTime(null, Math.INFINITY, 50)


rule "[utilities/debug.opy]: Remove all bots":
    @Event eachPlayer
    @Condition DEBUG_MODE == true
    @Condition eventPlayer.isHoldingButton(Button.CROUCH) == true
    @Condition eventPlayer.isHoldingButton(Button.MELEE) == true

    destroyAllDummies()
    destroyInWorldText(eventPlayer._debug_float_id)


rule "[utilities/debug.opy]: Change hero":
    @Event eachPlayer
    @Condition DEBUG_MODE == true
    @Condition eventPlayer.isHoldingButton(Button.MELEE) == true

    wait(1, Wait.ABORT_WHEN_FALSE)
    eventPlayer._debug_float_pos = eventPlayer.getPosition()
    eventPlayer.setAllowedHeroes(getAllHeroes().exclude(eventPlayer.getCurrentHero()))
    wait(0.1)
    eventPlayer.setAllowedHeroes(getAllHeroes())
    destroyInWorldText(eventPlayer._debug_float_id)
    waitUntil(eventPlayer.hasSpawned(), Math.INFINITY)
    eventPlayer.teleport(eventPlayer._debug_float_pos)
