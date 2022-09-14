/*
	Copyright (c) 2022 Skyflow, Inc. 
*/
import Client from "../../src/vault-api/client";
import axios from "axios";

jest.mock("axios");

describe("Client Class",()=>{
  
    test("request function in client",()=>{
       axios.post.mockRejectedValueOnce(new Error("unauthorized")) 
        var client = new Client({vaultId:"123",vaultURL:"https://url.com",getBearerToken:jest.fn()},{})
        client.request({body:{"type":"card"},requestMethod:"post",headers:{"content-type":"application/json"},url:"https://url.com"})
        .catch((err)=> expect(err).toBeDefined())
    })
    test("test convertRequestBody",()=>{
        var client = new Client({vaultId:"<vaultid>",vaultURL:"https://url.com",getBearerToken:jest.fn()},{})
        let response = client.convertRequestBody({"type":"card","number":"123"},"application/x-www-form-urlencoded");
        expect(response).toBe("type=card&number=123")

        response = client.convertRequestBody({"type":"card","number":"123"},"application/json");
        expect(response).toBe("{\"type\":\"card\",\"number\":\"123\"}")

        response = client.convertRequestBody({"type":"card","number":"123"},"multipart/form-data");
        expect(response).toBeDefined()

    })

    test("test getHeaders",()=>{
        var client = new Client({vaultId:"<vaultid>",vaultURL:"https://url.com",getBearerToken:jest.fn()},{})
        const FormData = require("form-data");
        var formData = FormData();
        formData.append("type","card")
        let response = client.getHeaders(formData,{"content-type":"multipart/form-data"});
        expect(response).toBeDefined()
    })
    
    test("test failure response with json",()=>{
        var error = {
            "response": {
                "headers": {
                    "content-type" : "application/json",
                    "x-request-id": "123"
                },
                "data" : {
                    "error" : {
                        "message" : "unauthorized"
                    }
                }
            }
        }
        var client = new Client({vaultId:"<vaultid>",vaultURL:"https://url.com",getBearerToken:jest.fn()},{})
        client.failureResponse(error).catch((err)=> expect(err).toBeDefined())
    })

    test("test failure response with text/plain content type",()=>{
        var error = {
            "response": {
                "headers": {
                    "content-type" : "text/plain",
                    "x-request-id": "123"
                },
                "data" : "unauthorized"
            }
        }
        var client = new Client({vaultId:"<vaultid>",vaultURL:"https://url.com",getBearerToken:jest.fn()},{})
        client.failureResponse(error).catch((err)=> expect(err).toBeDefined())
    })

    test("test failure response with other content type",()=>{
        var error = {
            "response": {
                "headers": {
                    "content-type" : "text/xml",
                    "x-request-id": "123"
                },
                "data" : "unauthorized"
            }
        }
        var client = new Client({vaultId:"<vaultid>",vaultURL:"https://url.com",getBearerToken:jest.fn()},{})
        client.failureResponse(error).catch((err)=> expect(err).toBeDefined())
    })
});