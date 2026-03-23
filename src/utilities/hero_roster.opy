#!mainFile "../dev_main.opy"

# indexing variable
globalvar hero_roster_i

globalvar hero_roster_gvar
#!defineMember _current_hero hero_roster_gvar[0]
# Currently enabled heroes
#!defineMember _available_tanks hero_roster_gvar[1]
#!defineMember _available_dps hero_roster_gvar[2]
#!defineMember _available_supports hero_roster_gvar[3]
#!defineMember _available_heroes hero_roster_gvar[4]
# Hero Role Definition
#!defineMember _tank_heroes hero_roster_gvar[5]
#!defineMember _damage_heroes hero_roster_gvar[6]
#!defineMember _support_heroes hero_roster_gvar[7]

macro getOW1TankHeroes():
    _tank_heroes

macro getOW1DamageHeroes():
    _damage_heroes

macro getOW1SupportHeroes():
    _support_heroes


rule "[utilities/hero_roster.opy]: Custom role definition":
    @Condition _available_heroes == null
    @Condition len(getAllPlayers().getAllowedHeroes()) > 0

    _available_heroes = getAllPlayers().getAllowedHeroes()

    # Tanks
    # Role lists come from constants/hero_roster.opy (auto-generated from web UI)
    _tank_heroes = OW1_TANK_HEROES
    _damage_heroes = OW1_DPS_HEROES
    _support_heroes = OW1_SUPPORT_HEROES

    _available_tanks = [h for h in _available_heroes if h in _tank_heroes]
    _available_dps = [h for h in _available_heroes if h in _damage_heroes]
    _available_supports = [h for h in _available_heroes if h in _support_heroes]
