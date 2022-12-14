# Changelog

All notable changes to this project will be documented in this file.

## [1.8.0] - 2022-12-14
### Added
- Added `update` interface.
- Added support for Get by Unique column values in `getById` interface.
## [1.7.1] - 2022-11-24

### Changed
- Rename context to 'ctx' in bearer token options.

## [1.7.0] - 2022-11-22

### Added
- Upsert support for `insert` method
- Added support to generate skyflow bearer tokens with context.
- Added support to generate scoped skyflow bearer tokens.
- Added support to generate signed data tokens.

## [1.6.1] - 2022-06-28

### Added
- Copyright header to all files
- Security email in README
## [1.6.0] - 2022-04-13

### Added
- support for application/x-www-form-urlencoded and multipart/form-data content-type's in connections.

## [1.5.1] - 2022-03-29

### Changed
- Added validation to token from TokenProvider

### Fixed 
-  requestHeaders are not case insensitive

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
