import Client from "../../src/vault-api/client";

describe("Client Class",()=>{
    beforeEach(()=>{
        jest.clearAllMocks();
        jest.resetAllMocks();
    });
    test("Client fromJson method",()=>{
        const testClientObject = Client.fromJSON({config:{},metadata:{}});
        expect(testClientObject).toBeInstanceOf(Client);
    });
    test("Client Request Method without errors",()=>{
        try{
            const xhrMock = {
                open: jest.fn(),
                send: jest.fn(),
                setRequestHeader: jest.fn(),
                onload: jest.fn(),
                readyState: 4,
                status: 200,
                response: JSON.stringify({'message':'Hello World!'}),
                getAllResponseHeaders:jest.fn().mockImplementation(()=>("content-type: application/json"))
              };
            
            const testClient = new Client({},{});
            const resp = testClient.request({
                requestMethod:"GET",
                url:"https://example-test.com",
                headers:{
                    "Auth":"eyde.ed.ewe"
                },
                body:{
                    "key":"value"
                }
            });
            expect(xhrMock.open).toBeCalledWith('GET', 'https://example-test.com');
            expect(xhrMock.setRequestHeader).toBeCalledWith("Auth","eyde.ed.ewe");
            expect(xhrMock.send).toBeCalledWith(JSON.stringify({
                "key":"value"
            }));
            xhrMock.onload();
        }catch(err){
            console.log(err);
        }
    });
    test("Client Request Method with error 1",()=>{
        try{
            const xhrMock = {
                open: jest.fn(),
                send: jest.fn(),
                setRequestHeader: jest.fn(),
                onload: jest.fn(),
                readyState: 4,
                status: 401,
                response: JSON.stringify({'message':'Hello World!'}),
                getAllResponseHeaders:jest.fn().mockImplementation(()=>("content-type: text/plain"))
              };
            
            jest.spyOn(window, 'XMLHttpRequest').mockImplementation(() => xhrMock);
            const testClient = new Client({},{});
            const resp = testClient.request({
                requestMethod:"GET",
                url:"https://example-test.com",
                headers:{
                    "Auth":"eyde.ed.ewe"
                },
                body:{
                    "key":"value"
                }
            });
            expect(xhrMock.open).toBeCalledWith('GET', 'https://example-test.com');
            expect(xhrMock.setRequestHeader).toBeCalledWith("Auth","eyde.ed.ewe");
            expect(xhrMock.send).toBeCalledWith(JSON.stringify({
                "key":"value"
            }));
            xhrMock.onload();
        }catch(err){
            console.log(err);
        }
    });
    test("Client Request Method with error 2",()=>{
        try{
            const xhrMock = {
                open: jest.fn(),
                send: jest.fn(),
                setRequestHeader: jest.fn(),
                onload: jest.fn(),
                readyState: 4,
                status: 401,
                response: JSON.stringify({'message':'Hello World!'}),
                getAllResponseHeaders:jest.fn().mockImplementation(()=>("content-type: application/json"))
              };
            
            jest.spyOn(window, 'XMLHttpRequest').mockImplementation(() => xhrMock);
            const testClient = new Client({},{});
            const resp = testClient.request({
                requestMethod:"GET",
                url:"https://example-test.com",
                headers:{
                    "Auth":"eyde.ed.ewe"
                },
                body:{
                    "key":"value"
                }
            });
            expect(xhrMock.open).toBeCalledWith('GET', 'https://example-test.com');
            expect(xhrMock.setRequestHeader).toBeCalledWith("Auth","eyde.ed.ewe");
            expect(xhrMock.send).toBeCalledWith(JSON.stringify({
                "key":"value"
            }));
            xhrMock.onload();
        }catch(err){
            console.log(err);
        }
    });
    
});