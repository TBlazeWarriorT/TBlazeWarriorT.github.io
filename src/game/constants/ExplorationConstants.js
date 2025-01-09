define(['ash', 'game/vos/LocaleVO'], function (Ash, LocaleVO) {

	var ExplorationConstants = {
		
		MIN_EXCURSION_LENGTH: 1,
		BEACON_RADIUS: 4,
		THRESHOLD_SCAVENGED_PERCENT_REVEAL_NO_RESOURCES: 10,
		
		getScoutLocaleReward: function (localeType, campOrdinal) {
			switch (localeType) {
				case localeTypes.grove:
				case localeTypes.greenhouse:
				case localeTypes.tradingpartner:
					return 0;
				
				default:
					return Math.ceil(campOrdinal / 3);
			}
		},
		
	};
	return ExplorationConstants;
});
