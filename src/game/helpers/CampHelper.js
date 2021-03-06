// Singleton with helper methods for movement, blockers etc
define([
    'ash',
    'game/GameGlobals',
    'game/constants/GameConstants',
    'game/constants/CampConstants',
	'game/components/common/CampComponent',
	'game/components/common/PositionComponent',
	'game/components/sector/improvements/SectorImprovementsComponent',
	'game/components/type/LevelComponent',
    'game/nodes/sector/CampNode',
    'game/nodes/tribe/TribeUpgradesNode',
], function (Ash, GameGlobals, GameConstants, CampConstants, CampComponent, PositionComponent, SectorImprovementsComponent, LevelComponent, CampNode, TribeUpgradesNode) {
    
    var CampHelper = Ash.Class.extend({
		
		constructor: function (engine) {
            this.tribeUpgradesNodes = engine.getNodeList(TribeUpgradesNode);
            this.campNodes = engine.getNodeList(CampNode);
		},
        
        getTotalNumImprovementsBuilt: function (improvementName) {
            if (!this.campNodes.head) return 0;
            var result = 0;
            for (var campNode = this.campNodes.head; campNode; campNode = campNode.next) {
                var improvements = campNode.entity.get(SectorImprovementsComponent);
                result += improvements.getCount(improvementName);
            }
            return result;
        },
        
        getMetalProductionPerSecond: function (workers, improvementsComponent) {
			var metalUpgradeBonus = this.getUpgradeBonus("scavenger");
			return workers * CampConstants.PRODUCTION_METAL_PER_WORKER_PER_S * metalUpgradeBonus * GameConstants.gameSpeedCamp;
        },
        
        getFoodProductionPerSecond: function (workers, improvementsComponent) {
			var foodUpgradeBonus = this.getUpgradeBonus("trapper");
			return workers * CampConstants.PRODUCTION_FOOD_PER_WORKER_PER_S * foodUpgradeBonus * GameConstants.gameSpeedCamp;
        },
        
        getWaterProductionPerSecond: function (workers, improvementsComponent) {
			var waterUpgradeBonus = this.getUpgradeBonus("collector");
			var waterImprovementBonus = 1 + (improvementsComponent.getCount(improvementNames.aqueduct) / 4);
            return CampConstants.PRODUCTION_WATER_PER_WORKER_PER_S * workers * waterUpgradeBonus * waterImprovementBonus * GameConstants.gameSpeedCamp;
        },
        
        getRopeProductionPerSecond: function (workers, improvementsComponent) {
			var ropeUpgradeBonus = this.getUpgradeBonus("weaver");
			return workers * CampConstants.PRODUCTION_ROPE_PER_WORKER_PER_S * ropeUpgradeBonus * GameConstants.gameSpeedCamp;
        },
        
        getFuelProductionPerSecond: function (workers, improvementsComponent) {
			var fuelUpgradeBonus = this.getUpgradeBonus("chemist");
			return workers * CampConstants.PRODUCTION_FUEL_PER_WORKER_PER_S * fuelUpgradeBonus * GameConstants.gameSpeedCamp;
        },
        
        getRubberProductionPerSecond: function (workers, improvementsComponent) {
			var upgradeBonus = this.getUpgradeBonus("rubbermaker");
			return workers * CampConstants.PRODUCTION_RUBBER_PER_WORKER_PER_S * upgradeBonus * GameConstants.gameSpeedCamp;
        },
        
        getHerbsProductionPerSecond: function (workers, improvementsComponent) {
            workers = workers || 0;
			var upgradeBonus = this.getUpgradeBonus(CampConstants.workerTypes.gardener.id) || 1;
			return workers * CampConstants.PRODUCTION_HERBS_PER_WORKER_PER_S * upgradeBonus * GameConstants.gameSpeedCamp;
        },
        
        getMedicineProductionPerSecond: function (workers, improvementsComponent) {
			var medicineUpgradeBonus = this.getUpgradeBonus("apothecary");
            var levelBonus = 1 + improvementsComponent.getLevel(improvementNames.apothecary) / 10;
			return workers * CampConstants.PRODUCTION_MEDICINE_PER_WORKER_PER_S * medicineUpgradeBonus * levelBonus * GameConstants.gameSpeedCamp;
        },
        
        getToolsProductionPerSecond: function (workers, improvementsComponent) {
			var toolsUpgradeBonus = this.getUpgradeBonus("smith");
            var levelBonus = 1 + improvementsComponent.getLevel(improvementNames.smithy) / 10;
			return workers * CampConstants.PRODUCTION_TOOLS_PER_WORKER_PER_S * toolsUpgradeBonus * levelBonus * GameConstants.gameSpeedCamp;
        },
        
        getConcreteProductionPerSecond: function (workers, improvementsComponent) {
			var concreteUpgradeBonus = this.getUpgradeBonus("concrete");
            var levelBonus = 1 + improvementsComponent.getLevel(improvementNames.cementmill) / 10;
			return workers * CampConstants.PRODUCTION_CONCRETE_PER_WORKER_PER_S * concreteUpgradeBonus * levelBonus * GameConstants.gameSpeedCamp;
        },
        
        getEvidenceProductionPerSecond: function (workers, improvementComponent) {
			var evidenceUpgradeBonus = this.getUpgradeBonus("scientist");
			return workers * CampConstants.PRODUCTION_EVIDENCE_PER_WORKER_PER_S * evidenceUpgradeBonus * GameConstants.gameSpeedCamp;
        },
        
        getFavourProductionPerSecond: function (workers, improvementComponent) {
			var upgradeBonus = this.getUpgradeBonus("cleric");
			return workers * CampConstants.PRODUCTION_FAVOUR_PER_WORKER_PER_S * upgradeBonus * GameConstants.gameSpeedCamp;
        },
        
        getWaterConsumptionPerSecond: function (population, useExplorationSpeed) {
            var speed = useExplorationSpeed ? GameConstants.gameSpeedExploration : GameConstants.gameSpeedCamp;
            return CampConstants.CONSUMPTION_WATER_PER_WORKER_PER_S * Math.floor(population) * speed;
        },
        
        getFoodConsumptionPerSecond: function (population, useExplorationSpeed) {
            var speed = useExplorationSpeed ? GameConstants.gameSpeedExploration : GameConstants.gameSpeedCamp;
            return CampConstants.CONSUMPTION_FOOD_PER_WORKER_PER_S * Math.floor(population) * speed;
        },
        
        getHerbsConsumptionPerSecond: function (workers) {
            return workers * CampConstants.CONSUMPTION_HERBS_PER_WORKER_PER_S * GameConstants.gameSpeedCamp;
        },
        
        getMetalConsumptionPerSecondSmith: function (workers) {
            return workers * CampConstants.CONSUMPTION_METAL_PER_TOOLSMITH_PER_S * GameConstants.gameSpeedCamp;
        },
        
        getMetalConsumptionPerSecondConcrete: function (workers) {
            return workers * CampConstants.CONSUMPTION_METAL_PER_CONCRETE_PER_S * GameConstants.gameSpeedCamp;
        },
        
        getLibraryEvidenceGenerationPerSecond: function (improvementsComponent, libraryUpgradeLevel) {
            var libraryCount = improvementsComponent.getCount(improvementNames.library);
            var libraryLevel = improvementsComponent.getLevel(improvementNames.library);
            var libraryLevelFactor = (1 + libraryLevel * CampConstants.EVIDENCE_BONUS_PER_LIBRARY_LEVEL);
            return 0.0015 * libraryCount * libraryUpgradeLevel * libraryLevelFactor * GameConstants.gameSpeedCamp;
        },
        
        getTempleFavourGenerationPerSecond: function (improvementsComponent, templeUpgradeLevel) {
            var templeCount = improvementsComponent.getCount(improvementNames.temple);
            var templeLevel = improvementsComponent.getLevel(improvementNames.temple);
            var templeLevelFactor = (1 + templeLevel * CampConstants.FAVOUR_BONUS_PER_TEMPLE_LEVEL);
            return 0.0015 * templeCount * templeUpgradeLevel * templeLevelFactor * GameConstants.gameSpeedCamp;
        },
        
        getCamprifeRumourGenerationPerSecond: function (improvementsComponent, campfireUpgradeLevel, accSpeedPopulation) {
            var campfireCount = improvementsComponent.getCount(improvementNames.campfire);
            var campfireLevel = improvementsComponent.getLevel(improvementNames.campfire);
            var campfireFactor = CampConstants.RUMOUR_BONUS_PER_CAMPFIRE_BASE;
            campfireFactor += campfireLevel > 1 ? (campfireLevel - 1) * CampConstants.RUMOURS_BONUS_PER_CAMPFIRE_PER_LEVEL : 0;
            campfireFactor += campfireUpgradeLevel > 1 ? (campfireUpgradeLevel - 1) * CampConstants.RUMOURS_BONUS_PER_CAMPFIRE_PER_UPGRADE : 0;
            return campfireCount > 0 ? Math.pow(campfireFactor, campfireCount) * accSpeedPopulation - accSpeedPopulation : 0;
        },
        
        getMarketRumourGenerationPerSecond: function (improvementsComponent, marketUpgradeLevel, accSpeedPopulation) {
            var marketCount = improvementsComponent.getCount(improvementNames.market);
            var marketFactor = CampConstants.RUMOUR_BONUS_PER_MARKET_BASE;
            marketFactor += marketUpgradeLevel > 1 ? (marketUpgradeLevel - 1) * CampConstants.RUMOURS_BONUS_PER_MARKET_PER_UPGRADE : 0;
            return marketCount > 0 ?  Math.pow(marketFactor, marketCount) * accSpeedPopulation - accSpeedPopulation : 0;
        },
        
        getInnRumourGenerationPerSecond: function (improvementsComponent, innUpgradeLevel, accSpeedPopulation) {
            var innCount = improvementsComponent.getCount(improvementNames.inn);
            var innFactor = CampConstants.RUMOUR_BONUS_PER_INN_BASE;
            innFactor += innUpgradeLevel > 1 ? (innUpgradeLevel - 1) * CampConstants.RUMOURS_BONUS_PER_INN_PER_UPGRADE : 0;
            return innCount > 0 ? Math.pow(innFactor, innCount) * accSpeedPopulation - accSpeedPopulation : 0;
        },

        getCampMaxPopulation: function (sector) {
            var improvements = sector.get(SectorImprovementsComponent);
            return CampConstants.getHousingCap(improvements);
        },
        
        getMaxWorkers: function (sector, id) {
            var def = CampConstants.workerTypes[id];
            var position = sector.get(PositionComponent);
            var level = position.level;
            var improvements = sector.get(SectorImprovementsComponent);
            var upgrades = this.tribeUpgradesNodes.head.upgrades;
            var campOrdinal = GameGlobals.gameState.getCampOrdinal(position.level);
        
            switch (def.id) {
                case CampConstants.workerTypes.scavenger.id:
                case CampConstants.workerTypes.water.id:
                case CampConstants.workerTypes.trapper.id:
                    return -1;
                case CampConstants.workerTypes.ropemaker.id:
                    var hasUnlockedRopers = GameGlobals.upgradeEffectsHelper.getWorkerLevel("weaver", upgrades) > 0;
                    return hasUnlockedRopers ? -1 : 0;
                case CampConstants.workerTypes.chemist.id:
                    return def.getLimitNum(campOrdinal, improvements) * CampConstants.CHEMISTS_PER_WORKSHOP;
                case CampConstants.workerTypes.rubbermaker.id:
                    return def.getLimitNum(campOrdinal, improvements) * CampConstants.RUBBER_WORKER_PER_WORKSHOP;
                case CampConstants.workerTypes.gardener.id:
                    return def.getLimitNum(campOrdinal, improvements) * CampConstants.GARDENER_PER_GREENHOUSE;
                case CampConstants.workerTypes.apothecary.id:
                    return def.getLimitNum(campOrdinal, improvements) * CampConstants.getApothecariesPerShop(GameGlobals.upgradeEffectsHelper.getBuildingUpgradeLevel(improvementNames.apothecary, upgrades));
                case CampConstants.workerTypes.concrete.id:
                    return def.getLimitNum(campOrdinal, improvements) * CampConstants.getWorkersPerMill(GameGlobals.upgradeEffectsHelper.getBuildingUpgradeLevel(improvementNames.cementmill, upgrades));
                case CampConstants.workerTypes.toolsmith.id:
                    return def.getLimitNum(campOrdinal, improvements) * CampConstants.getSmithsPerSmithy(GameGlobals.upgradeEffectsHelper.getBuildingUpgradeLevel(improvementNames.smithy, upgrades));
                case CampConstants.workerTypes.scientist.id:
                    var hasUnlockedScientists = GameGlobals.upgradeEffectsHelper.getWorkerLevel(def.id, upgrades) > 0;
                    return hasUnlockedScientists ? def.getLimitNum(campOrdinal, improvements) * CampConstants.getScientistsPerLibrary(GameGlobals.upgradeEffectsHelper.getBuildingUpgradeLevel(improvementNames.library, upgrades)) : 0;
                case CampConstants.workerTypes.cleric.id:
                    return def.getLimitNum(campOrdinal, improvements) * CampConstants.getClericsPerTemple(GameGlobals.upgradeEffectsHelper.getBuildingUpgradeLevel(improvementNames.temple, upgrades));
                case CampConstants.workerTypes.soldier.id:
                    return def.getLimitNum(campOrdinal, improvements) * CampConstants.getSoldiersPerBarracks(GameGlobals.upgradeEffectsHelper.getBuildingUpgradeLevel(improvementNames.barracks, upgrades));
                default:
                    return -1;
            }
        },
        
        getTargetReputation: function (campEntity, sectorImprovements, population, danger) {
            var result = 0;
            var sources = {}; // text -> value
            var penalties = {}; // id -> bool
            
            var addValue = function (value, name) {
                result += value;
                if (!sources[name]) sources[name] = 0;
                sources[name] += value;
            };
            
            var addPenalty = function (id, active) {
                penalties[id] = active;
            };
            
            // base: building happiness values
            var allImprovements = sectorImprovements.getAll(improvementTypes.camp);
            for (var i in allImprovements) {
                var improvementVO = allImprovements[i];
                var level = improvementVO.level || 1;
                var defaultBonus = improvementVO.getReputationBonus();
                switch (improvementVO.name) {
                    case improvementNames.generator:
                        var numHouses = sectorImprovements.getCount(improvementNames.house) + sectorImprovements.getCount(improvementNames.house2);
                        var generatorBonus = numHouses * CampConstants.REPUTATION_PER_HOUSE_FROM_GENERATOR * (1 + level * 0.02);
                        generatorBonus = Math.round(generatorBonus * 100) / 100;
                        addValue(generatorBonus, "Generator");
                        break;
                    case improvementNames.radio:
                        addValue(improvementVO.count * defaultBonus, "Radio");
                        break;
                    default:
                        addValue(improvementVO.count * defaultBonus, "Buildings");
                        break;
                }
            }
            
            var resultWithoutPenalties = result;
            
            // penalties: food and water
            var storage = GameGlobals.resourcesHelper.getCurrentCampStorage(campEntity);
            var resources = storage ? storage.resources : null;
            var noFood = resources && resources.getResource(resourceNames.food) <= 0;
            var noWater = resources && resources.getResource(resourceNames.water) <= 0;
            var penalty = Math.max(5, Math.ceil(resultWithoutPenalties));
            if (noFood) {
                addValue(-penalty, "No food");
            }
            if (noWater) {
                addValue(-penalty, "No water");
            }
            addPenalty(CampConstants.REPUTATION_PENALTY_TYPE_FOOD, noFood);
            addPenalty(CampConstants.REPUTATION_PENALTY_TYPE_WATER, noWater);
            
            // penalties: defences
            var defenceLimit = CampConstants.REPUTATION_PENALTY_DEFENCES_THRESHOLD;
            var noDefences = danger > defenceLimit;
            if (noDefences) {
                var steppedDanger = Math.ceil((danger - defenceLimit) * 100 / 5) * 5;
                var penaltyRatio = steppedDanger / (100 - defenceLimit);
                var defencePenalty = Math.ceil(resultWithoutPenalties * penaltyRatio * 4) / 4;
                if (penaltyRatio > 0.25) {
                    addValue(-defencePenalty, "Terrible defences");
                } else if (penaltyRatio > 0.15) {
                    addValue(-defencePenalty, "Poor defences");
                } else {
                    addValue(-defencePenalty, "Inadequate defences");
                }
            }
            addPenalty(CampConstants.REPUTATION_PENALTY_TYPE_DEFENCES, noDefences);
            
            // penalties: over-crowding
            var housingCap = CampConstants.getHousingCap(sectorImprovements);
            var population = Math.floor(population);
            var noHousing = population > housingCap;
            if (noHousing) {
                var housingPenaltyRatio = Math.ceil((population - housingCap) / population * 20) / 20;
                var housingPenalty = Math.ceil(resultWithoutPenalties * housingPenaltyRatio);
                addValue(-housingPenalty, "Overcrowding");
            }
            addPenalty(CampConstants.REPUTATION_PENALTY_TYPE_HOUSING, noHousing);
            
            // penalties: level population
            var levelVO = GameGlobals.levelHelper.getLevelEntityForSector(campEntity).get(LevelComponent).levelVO;
            if (levelVO.populationGrowthFactor < 1) {
                var levelPopPenalty = resultWithoutPenalties * (1 - levelVO.populationGrowthFactor);
                addValue(-levelPopPenalty, "Level population");
            }
            addPenalty(CampConstants.REPUTATION_PENALTY_TYPE_LEVEL_POP, levelVO.populationGrowthFactor < 1);
            
            return { value: Math.max(0, result), sources: sources, penalties: penalties };
        },
		
		getUpgradeBonus: function (worker) {
			var upgradeLevel = 1;
			var workerUpgrades = GameGlobals.upgradeEffectsHelper.getImprovingUpgradeIdsForWorker(worker);
			var workerUpgrade;
			for (var i in workerUpgrades) {
				workerUpgrade = workerUpgrades[i];
				if (this.tribeUpgradesNodes.head.upgrades.hasUpgrade(workerUpgrade)) upgradeLevel += 0.15;
			}
			return upgradeLevel;
		},
        
        getDefaultWorkerAssignment: function (sector) {
            var campComponent = sector.get(CampComponent);
            
            var pop = campComponent.population;
            var currentStorage = GameGlobals.resourcesHelper.getCurrentStorage();
            var maxStorage = currentStorage.storageCapacity;
            var currentFood = currentStorage.resources.getResource(resourceNames.food);
            var currentWater = currentStorage.resources.getResource(resourceNames.water);
            
            var currentFoodRatio = currentFood / maxStorage;
            var currentWaterRatio = currentWater / maxStorage;
            
            // sort worker types by priority
            var workersByPrio = [[], [], []];
            for (var key in CampConstants.workerTypes) {
                var prio = 1;
                var min = 0;
                var preferred = 1;
                var max = GameGlobals.campHelper.getMaxWorkers(sector, key);
                switch (key) {
                    case CampConstants.workerTypes.trapper.id:
                        prio = 0;
                        min = Math.max(1, Math.floor(pop / (currentFoodRatio > 0.5 ? 5 : 3)));
                        preferred = min;
                        break;
                    case CampConstants.workerTypes.water.id:
                        prio = 0;
                        min = Math.max(1, Math.floor(pop / (currentWaterRatio > 0.5 ? 5 : 2.25)));
                        preferred = min;
                        break;
                    case CampConstants.workerTypes.ropemaker.id:
                    case CampConstants.workerTypes.scavenger.id:
                        prio = 2;
                        break;
                }
                workersByPrio[prio].push({ id: key, min: min, preferred: preferred, max: max });
            }
            console.log(workersByPrio);
            
            // assign workers by priority
            var assignment = {};
            var remaining = pop;
            // - minimum
            for (var i = 0; i < workersByPrio.length; i++) {
                for (var j = 0; j < workersByPrio[i].length; j++) {
                    var def = workersByPrio[i][j];
                    var min = def.min;
                    var max = def.max < 0 ? remaining : def.max;
                    var num = Math.min(min, remaining, max);
                    assignment[def.id] = num;
                    remaining -= num;
                }
            }
            // - preferred
            if (remaining > 0) {
                for (var i = 0; i < workersByPrio.length; i++) {
                    for (var j = 0; j < workersByPrio[i].length; j++) {
                        var def = workersByPrio[i][j];
                        var max = def.max < 0 ? remaining : def.max;
                        var preferred = def.preferred;
                        var current = assignment[def.id];
                        var num = Math.min(preferred - current, remaining, max);
                        assignment[def.id] = current + num;
                        remaining -= num;
                    }
                }
            }
            // rest to scavengers
            assignment[CampConstants.workerTypes.scavenger.id] += remaining;
            
            return assignment;
        }
        
    });
    
    return CampHelper;
});
