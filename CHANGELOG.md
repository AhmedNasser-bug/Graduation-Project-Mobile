# Changelog

All notable changes to the NephroGuard / NephroEdge Bedside Mobile Prototype (`Graduation-Project-Mobile`) are documented here.

## [0.2.0.0] - 2026-11-15

### Added
- Package the offline-first Bedside Nurse Mobile Prototype (`React 18` + `Vite 6` + `TypeScript` + `Tailwind CSS` + `sql.js` WebAssembly SQLite + `Capacitor 8` Android) into `Graduation-Project-Mobile`.
- Include core bedside workflows: `HomeNurseScreen`, `NursePatientsScreen`, `NurseSessionsScreen`, `PatientProfileScreen`, `SessionDetailsScreen`, `AlertScreen`, `ChoosePositionScreen`, `OnboardingScreen`, `SignInScreen`, `SignUpScreen`, `NurseProfileScreen`, `MachineSettingsDrawer`, `NumericKeypadModal`, `TreeSHAPModal`, and offline `outboxSyncService` / `telemetryService`.
- Add 1-command Docker setup (`Dockerfile`, `docker-compose.yml`, `nginx.conf` with `application/wasm` support) and cross-platform native setup scripts (`setup.ps1`, `setup.sh`, `.env.example`, `.gitignore`).
