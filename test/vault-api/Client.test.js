/*
	Copyright (c) 2022 Skyflow, Inc. 
*/
import Client from "../../src/vault-api/client";
import axios from "axios";
import { generateSDKMetrics } from "../../src/vault-api/utils/helpers";

jest.mock("axios", () => {
  return {
    __esModule: true,
    default: jest.fn(),
  };
});

describe("Client Class",()=>{
  
    const client = new Client(
      {
        vaultId: "123",
        vaultURL: "https://url.com",
        getBearerToken: jest.fn(),
      },
      {}
    );

    test("should make a request to client with the correct method, url, data and headers", async () => {
      const request = {
        requestMethod: "POST",
        url: "https://example.com",
        body: { name: "John Doe", age: 30 },
        headers: { "Content-Type": "application/json" },
      };
      const data = JSON.stringify({ name: "John Doe", age: 30 });
      const headers = { "content-type": "application/json","sky-metadata":JSON.stringify(generateSDKMetrics()) };
      axios.mockImplementation(() =>
        Promise.resolve({ data: { message: "Success" } })
      );

      const response = await client.request(request);

      expect(axios).toHaveBeenCalledWith({
        method: request.requestMethod,
        url: request.url,
        data: data,
        headers: headers,
      });
      expect(response).toEqual({ message: "Success" });
    });

    test("should return an error if the request to client fails", async () => {
      const request = {
        requestMethod: "GET",
        url: "https://example.com",
        body: { name: "John Doe", age: 30 },
        headers: { "Content-Type": "application/json" },
      };
      const error = new Error("Request failed");
      axios.mockImplementation(() => Promise.reject(error));
      client.failureResponse = jest.fn().mockReturnValue(Promise.reject(error));
      await expect(client.request(request)).rejects.toEqual(error);
    });

    test("test convertRequestBody",()=>{
        const client = new Client({vaultId:"<vaultid>",vaultURL:"https://url.com",getBearerToken:jest.fn()},{})
        let response = client.convertRequestBody({"type":"card","number":"123"},"application/x-www-form-urlencoded");
        expect(response).toBe("type=card&number=123")

        response = client.convertRequestBody({"type":"card","number":"123"},"application/json");
        expect(response).toBe("{\"type\":\"card\",\"number\":\"123\"}")

        response = client.convertRequestBody({"type":"card","number":"123"},"multipart/form-data");
        expect(response).toBeDefined()

    })

    test("test getHeaders",()=>{
        const client = new Client({vaultId:"<vaultid>",vaultURL:"https://url.com",getBearerToken:jest.fn()},{})
        const FormData = require("form-data");
        const formData = FormData();
        formData.append("type","card")
        let response = client.getHeaders(formData,{"content-type":"multipart/form-data"});
        expect(response).toBeDefined()
    })
    
    test("test failure response with json",()=>{
        const error = {
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
        const client = new Client({vaultId:"<vaultid>",vaultURL:"https://url.com",getBearerToken:jest.fn()},{})
        client.failureResponse(error).catch((err)=> expect(err).toBeDefined())
    })

    test("test failure response with text/plain content type",()=>{
        const error = {
            "response": {
                "headers": {
                    "content-type" : "text/plain",
                    "x-request-id": "123"
                },
                "data" : "unauthorized"
            }
        }
        const client = new Client({vaultId:"<vaultid>",vaultURL:"https://url.com",getBearerToken:jest.fn()},{})
        client.failureResponse(error).catch((err)=> expect(err).toBeDefined())
    })

    test("test failure response with other content type",()=>{
        const error = {
            "response": {
                "headers": {
                    "content-type" : "text/xml",
                    "x-request-id": "123"
                },
                "data" : "unauthorized"
            }
        }
        const client = new Client({vaultId:"<vaultid>",vaultURL:"https://url.com",getBearerToken:jest.fn()},{})
        client.failureResponse(error).catch((err)=> expect(err).toBeDefined())
    })
});