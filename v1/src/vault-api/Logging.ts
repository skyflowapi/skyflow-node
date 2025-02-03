/*
	Copyright (c) 2022 Skyflow, Inc. 
*/
import { LogLevel } from "./utils/common";

const logging = {
    logLevel : LogLevel.ERROR,
}

export function setLogLevel(logLevel: LogLevel){
    logging.logLevel = logLevel
}

export function getLogLevel(): LogLevel{
    return logging.logLevel
}
