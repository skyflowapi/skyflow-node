# Changelog

All notable changes to this project will be documented in this file.

## [1.3.0] - 2022-01-11

### Added
- Logging functionality
- `setLogLevel` function for setting the package-level LogLevel
- `GenerateBearerTokenFromCreds` function which takes credentials as string

### Changed
- Renamed and deprecated `GenerateToken` in favor of `GenerateBearerToken`
- Make `vaultID` and `vaultURL` optional in `Client` constructor


## [1.2.0] - 2021-11-10

### Added

- insert vault API
- detokenize vault API
- getById vault API
- invokeConnection
 
## [1.1.1] - 2021-10-20

### Added

- Service Account Token generation
