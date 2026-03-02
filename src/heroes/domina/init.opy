#!mainFile "../../dev_main.opy"

#!include "crystal_charge.opy"
#!include "panopticon.opy"
#!include "photon_magnum.opy"
#!include "sonic_repulsors.opy"


def initDomina():
    @Name "[domina/init.opy]: initDomina()"

    setCustomHp(OW1_DOMINA_HEALTH, OW1_DOMINA_ARMOR, OW1_DOMINA_SHIELDS)
    setUltCost(OW1_DOMINA_ULT_COST)
    eventPlayer.repulsed_victims = []
    eventPlayer.repulsor_wall_victims = []
