# Changelog

All notable changes to this project will be documented in this file.

## [1.5.0] - 2022-03-15

### Changed
- deprecated `isValid` in favor of `isExpired`

## [1.4.0] - 2022-02-24

## Added
- Request ID in error logs and error responses for API Errors
- `isValid` method for validating Service Account bearer token   

## [1.3.0] - 2022-01-11

### Added
- Logging functionality
- `setLogLevel` function for setting the package-level LogLevel
- `generateBearerTokenFromCreds` function which takes credentials as string

### Changed
- Renamed and deprecated `generateToken` in favor of `generateBearerToken`
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
