# Racing Server Configuration UI - Project Summary

## Project Goal
Create a React-based web interface for configuring racing simulation dedicated servers. The UI allows users to intuitively configure server settings that would normally require manual editing of configuration files (`server.cfg` and `sms_rotate_config.json`).

## Legal Disclaimer
This is an unofficial tool created for educational and personal use only. This software is not affiliated with, endorsed by, or connected to any game studio or racing simulation company. Users are responsible for ensuring their use complies with applicable terms of service and licenses for any games or software they configure with this tool.

## Context
AMS2 is a racing simulation game that supports dedicated servers. Server configuration typically involves:
- Manual editing of `server.cfg` (basic server settings)
- Manual editing of `sms_rotate_config.json` (map rotation and session settings)
- Understanding complex ID mappings for tracks, cars, and weather
- Managing session flags and game settings

This project provides a user-friendly interface to replace manual configuration file editing.

## Implementation Details

### Core Architecture
- **React 18** with functional components and hooks
- **Modular component structure** - each configuration section is a separate component
- **State management** using React useState hooks

### Key Features
1. **Tabbed Interface**: Organized configuration sections
   - Basic Settings (server name, password, max players, etc.)
   - Network Settings (ports, IP binding, HTTP API)
   - Session Settings (practice/qualify/race lengths, AI difficulty)
   - Cars (vehicle class selection)
   - Flags (session flags management)
   - Game Settings (damage, tire wear, fuel usage, penalties)
   - Rotation (map rotation management)

2. **Map Rotation System**:
   - Always enabled (single map = one map in rotation)
   - Per-map configuration (track, vehicle class, session lengths, weather)
   - Add/remove maps from rotation
   - Global flags applied to all maps

3. **Configuration Export**:
   - Generates `server.cfg` with basic settings
   - Generates `sms_rotate_config.json` with rotation settings
   - Packages both files in a ZIP named after the server
   - Downloads to user's device

### Data Sources
- **Tracks**: `assets/tracks.txt` - Track IDs and names with grid sizes
- **Cars**: `assets/cars.txt` - Vehicle class IDs and translated names
- **Weather**: `assets/weather.txt` - Weather condition IDs and names
- **Session Flags**: `src/data/sessionFlags.js` - Flag definitions and descriptions

**⚠️ CRITICAL: Assets Folder Protection**
The `assets/` folder contains files that are the **source of truth** for the project, with real-life functioning files for an AMS2 server. These files include:
- `server.cfg` - Working AMS2 server configuration template
- `sms_rotate_config.json` - Working SMS rotation configuration
- `tracks.txt`, `cars.txt`, `weather.txt` - Official AMS2 data files
- `Session flags.txt` - Official session flag definitions

**Under NO circumstances should these files be modified or deleted.** They serve as:
1. **Reference templates** for configuration generation
2. **Data validation** sources for the UI
3. **Backup copies** of working configurations
4. **Development testing** resources

Any modifications to these files could break the application's ability to generate valid AMS2 server configurations.

## Project Structure

```
AMS2-Server-UI/
├── src/
│   ├── components/           # Modular UI components
│   │   ├── BasicSettings.jsx
│   │   ├── NetworkSettings.jsx
│   │   ├── SessionSettings.jsx
│   │   ├── CarSelection.jsx
│   │   ├── FlagsSettings.jsx
│   │   └── GameSettings.jsx
│   ├── views/
│   │   └── ServerConfigView.jsx  # Main application view
│   ├── data/
│   │   ├── ams2Data.js      # Track, car, weather data
│   │   └── sessionFlags.js  # Session flag definitions
│   ├── utils/
│   │   └── configHelpers.js # Helper functions for config generation
│   ├── App.jsx
│   └── index.jsx
├── assets/                   # Original AMS2 data files
│   ├── tracks.txt
│   ├── cars.txt
│   └── weather.txt
├── exports/                  # Generated configuration files (created on export)
├── eslint.config.js         # ESLint configuration
└── package.json
```

## Technical Decisions

### Component Modularization
- Broke down large `ServerConfigView.jsx` into focused components
- Each component handles one configuration section
- Shared state passed down via props
- Helper functions centralized in `configHelpers.js`

### State Management
- Main config state in `ServerConfigView.jsx`
- Rotation maps as separate state array
- Active tab state for UI navigation
- Saved configuration state for export validation

### Configuration File Generation
- `server.cfg`: Basic server settings with first rotation map as defaults
- `sms_rotate_config.json`: Complete rotation configuration
- Uses helper functions to convert values to proper string formats
- Validates server name for file system compatibility

### UI/UX Design
- Dark theme with red/orange/yellow accents (AMS2 game aesthetic)
- Tabbed interface for organized configuration
- Form validation and user feedback
- Responsive design with proper spacing and typography

## Dependencies
- **React 18**: Core framework
- **ESLint**: Code quality and formatting
- **@babel/eslint-parser**: JSX parsing support

## Development Workflow
1. **Linting**: `npm run lint` - ESLint with Babel parser for JSX
2. **Code Quality**: Follows established patterns for components, imports, and state management
3. **Refactoring**: Modular approach allows easy component updates and additions

## Key Configuration Concepts

### Server.cfg vs sms_rotate_config.json
- **server.cfg**: Basic server settings, fallback values
- **sms_rotate_config.json**: Map rotation system (always enabled)
- Rotation config takes priority when rotation system is active

### Session Flags
- Global flags applied to all maps in rotation
- Managed in dedicated Flags tab
- Converted to numeric values for config files

### Weather System
- Per-map weather configuration (not global)
- Multiple weather slots per map
- Weather selection only available in rotation settings

### Vehicle System
- Car class selection (not individual car models)
- Per-map vehicle class configuration
- Simplified to avoid complex model ID management

## Future Considerations
- Add individual car model selection if data becomes available
- Implement configuration import functionality
- Add validation for network port conflicts
- Consider adding preset configurations for common racing series
- Add real-time server status monitoring (if API endpoints available)

## Notes for Future Development
- Always maintain modular component structure
- Follow established naming conventions (CarSelection, not VehicleSelection)
- Keep helper functions in utils folder
- Maintain consistent ESLint rules and formatting
- Weather configuration belongs in rotation, not as standalone tab
- Vehicle model IDs are not user-friendly - prefer class selection
- **Update PROJECT_SUMMARY.md after any relevant changes** - This ensures AI can quickly understand the current state and continue development effectively

## Quick Start for AI Development
When resuming work on this project:
1. **Read PROJECT_SUMMARY.md first** - Contains all essential context
2. **Run `npm run lint`** - Verify code quality and identify any issues
3. **Check current state** - Review recent changes in git or file timestamps
4. **Follow established patterns** - Use modular components, utils for helpers, consistent naming
5. **Test configuration export** - Ensure generated files are valid for AMS2 servers
6. **Maintain AMS2 compatibility** - All generated configs must work with actual AMS2 dedicated servers

## Common Development Tasks
- **Adding new config options**: Add to appropriate component, update state, include in export
- **Modifying rotation system**: Update rotation logic in ServerConfigView.jsx
- **Adding new data sources**: Update ams2Data.js and related components
- **UI improvements**: Follow existing dark theme with red/orange/yellow accents
- **Bug fixes**: Check console for errors, verify state management, test export functionality
- **Code changes**: All relevant changes in the codebase should have corresponding tests or modifications to existing tests 