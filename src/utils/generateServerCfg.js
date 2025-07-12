// Utility to generate server.cfg content for AMS2 Server UI
const { flagsToNumber } = require('./configHelpers');

function generateServerCfg(config, rotationMaps) {
  const defaultMap = rotationMaps[0] || {
    trackId: -1478712571, // Default Interlagos
    vehicleClassId: 492525831, // Default Stock Car Brasil
    vehicleModelId: 1323381033,
    practiceLength: 10,
    qualifyLength: 10,
    raceLength: 10,
    raceDateHour: 11,
    raceWeatherSlots: 1,
    weatherSlots: [-934211870, -934211870, -934211870, -934211870], // Default Clear weather
  };
  return `// Logging level of the server. Messages of this severity and more important will be logged. Can be any of debug/info/warning/error.
logLevel : "info"

// Number of gameplay events stored on the server. Oldest ones will be discarded once the game logs more.
eventsLogSize : 10000

// The server's name, this will appear in server browser (when implemented) and will be also the default name of sessions hosted on the server.
name : "${config.name}"

// Authenticate users with Steam to check VAC ban when set to true.
secure : ${config.secure}

// Password required to create sessions on the server as well as to join the sessions, password set in Create options is ignored on DS.
password : "${config.password}"

// Maximum size of sessions that can be created on this server.
maxPlayerCount : ${config.maxPlayerCount}

// IP address where the server's sockets should be bound. Leave empty for 'all interfaces'.
bindIP : "${config.bindIP}"

// ports used to communicate with Steam and game, they must all be accessible on the public IP of the server.
steamPort : ${config.steamPort}
hostPort : ${config.hostPort}
queryPort : ${config.queryPort}

// Delay between server ticks in milliseconds, when not hosting and when hosting a game, respectively.
sleepWaiting : ${config.sleepWaiting}
sleepActive : ${config.sleepActive}

// Sports Play will use system sockets instead of Steam networking API.
sportsPlay: false

// Master enable/disable toggle.
enableHttpApi : ${config.enableHttpApi}

// Similar to logLevel above but used only for libwebsockets output.
// Note that all logging still goes through the main filter, so you won't be able to use more verbose logging here than the main level.
httpApiLogLevel : "warning"

// Interface name or IP where to bind the local http server providing the API and web-based controls.
httpApiInterface : "${config.httpApiInterface}"

// Port where the local http server listens.
httpApiPort : ${config.httpApiPort}

// Map with extra HTTP headers to add to HTTP API responses.
httpApiExtraHeaders : {
    "*" : "Access-Control-Allow-Origin: *"
}

// Http API access level overrides.
httpApiAccessLevels : {
}

// Filtering rules for the access levels.
httpApiAccessFilters : {
    "public" : [
        { "type" : "accept" }
    ],
    "private" : [
        { "type" : "ip-accept", "ip" : "127.0.0.1/32" },
        { "type" : "group", "group" : "private" },
        { "type" : "reject-password" }
    ],
    "admin" : [
        { "type" : "ip-accept", "ip" : "127.0.0.1/32" },
        { "type" : "group", "group" : "admin" },
        { "type" : "reject-password" }
    ]
}

// User list. Map from user names to passwords, in plain text.
httpApiUsers : {
    "admin": "admin"
}

// User groups. Map from group names to lists of users in said groups.
httpApiGroups : {
    "private" : [ "admin" ],
    "admin" : [ "admin" ]
}

// Root directory where the static files for the web tool are located. Relative to current directory.
staticWebFiles: "web_files"

// Master enable/disable toggle.
enableLuaApi : true

// Root directory from which the Lua addons are loaded. Relative to current directory if it's not absolute.
luaAddonRoot: "lua"

// Root directory where the addon configs will be stored if written out by addons.
luaConfigRoot: "lua_config"

// Root directory where the addon output will be written, once supported.
luaOutputRoot: "lua_output"

// Names of all Lua addons to load.
luaApiAddons : [
    "sms_base",
    "sms_rotate",
    "sms_motd",
    "sms_stats"
]

// Names of all lua libraries that are allowed to be used by any addons.
luaAllowedLibraries : [
    "lib_rotate"
]

////////////////////////////////
// Game setup control options //
////////////////////////////////

// Set to true to make this server show up in the browser even if it's empty.
allowEmptyJoin : ${config.allowEmptyJoin}

// Set to true to enable API that allows the server to control the game's setup. The host will not be able to control the setup if this is set.
// This must be set to "true" for the following attributes to work: ServerControlsTrack, ServerControlsVehicleClass, ServerControlsVehicle
controlGameSetup : ${config.controlGameSetup}

// Initial attribute values, see /api/list/attributes/session for the full list.
// These attributes will be used when joining an empty server via the browser (if allowEmptyJoin is true) and as the initial attributes for the set_attributes and set_next_attributes APIs (if controlGameSetup is true)
sessionAttributes : {
    // The host player can control track selection if set to 0. Set to 1 to disable track selection in the game.
    "ServerControlsTrack" : ${config.serverControlsTrack},

    // The host player can change the vehicle class by going through the garage if set to 0. Set to 1 to disallow players changing the class.
    // Flag FORCE_SAME_VEHICLE_CLASS (1024) should be also set for this to make sense, otherwise players are able to choose cars from any class.
    "ServerControlsVehicleClass" : ${config.serverControlsVehicleClass},

    // Players can change their vehicle if set to 0. Set to 1 to disallow players changing the vehicle.
    // Flag FORCE_IDENTICAL_VEHICLES (2) should be also set for this to make sense.
    "ServerControlsVehicle" : ${config.serverControlsVehicle},

    // Grid size up to 32, all reserved to players, so no AI.
    // Note that 32-bit clients will not be able to join the game if this is larger than 16.
    "GridSize" : ${config.gridSize},
    "MaxPlayers" : ${config.maxPlayers},

    // Race flags - bitfield consisting of many flags
    "Flags" : ${flagsToNumber(config.selectedFlags)},

    // AI opponent difficulty, from 0 to 100. Applies only on loading if GridSize is larger than MaxPlayers, and the FILL_SESSION_WITH_AI flag is enabled.
    "OpponentDifficulty" : ${config.opponentDifficulty},

    // Damage type
    "DamageType" : ${config.damageType},

    // Tire wear type
    "TireWearType" : ${config.tireWearType},

    // Fuel usage type
    "FuelUsageType" : ${config.fuelUsageType},

    // Penalties type
    "PenaltiesType" : ${config.penaltiesType},

    // Any camera view allowed.
    "AllowedViews" : ${config.allowedViews},

    // Track from first rotation map
    "TrackId" : ${defaultMap.trackId},

    // Vehicle class from first rotation map
    "VehicleClassId" : ${defaultMap.vehicleClassId},

    // Vehicle model from first rotation map
    "VehicleModelId" : ${defaultMap.vehicleModelId},

    // Practice/Qualify/Race lengths from first rotation map
    "PracticeLength" : ${defaultMap.practiceLength},
    "QualifyLength" : ${defaultMap.qualifyLength},
    "RaceLength" : ${defaultMap.raceLength},

    // Starting date and time from first rotation map
    "RaceDateHour" : ${defaultMap.raceDateHour},

    // Weather slots from first rotation map
    "RaceWeatherSlots" : ${defaultMap.raceWeatherSlots},
    "RaceWeatherSlot1" : ${defaultMap.weatherSlots[0]},
    "RaceWeatherSlot2" : ${defaultMap.weatherSlots[1]},
    "RaceWeatherSlot3" : ${defaultMap.weatherSlots[2]},
    "RaceWeatherSlot4" : ${defaultMap.weatherSlots[3]},
}`;
}

module.exports = generateServerCfg; 