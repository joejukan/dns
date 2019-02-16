import {Request, Question, ARecord} from "native-dns";
import { resolve } from "path";
import {readFileSync} from "fs";
import { Configuration } from "../src/abstraction";
import { DNSService } from "../src/classification";

let configuration: Configuration = JSON.parse(readFileSync(resolve('spec/resources/configuration.json'), 'utf-8'));
let service = new DNSService(configuration);

beforeAll(() => {
    service.start();
})

afterAll(() => {
    service.stop();
})

describe(`A record verification`, () => {
    it(`query unscoped A record`, (done) => {
        let question = Question({
            name: 'www.google.com',
            type: 'A'
        })
        
        let request = Request({
            question: question,
            server: { address: '127.0.0.1', port: 1053, type: 'udp'},
            timeout: 5000
        })
        
        request.on('timeout', () => {
            expect(false).toBeTruthy(`timed out waiting for response from DNS server!`)
            done()
        });
        
        request.on('message', (err, response) => {
            expect(response).toBeDefined(`the response from the DNS server was not defined!`);
            expect(Array.isArray(response.answer)).toBeTruthy('the response answer field was not an array type!');
            expect(response.answer.length).toBe(1, 'the response had more than one answer!');
            let answer = response.answer[0];
            done()
        });

        request.send();
    });

    it(`query scoped A record`, (done) => {
        let question = Question({
            name: 'www.web.com',
            type: 'A'
        })
        
        let request = Request({
            question: question,
            server: { address: '127.0.0.1', port: 1053, type: 'udp'},
            timeout: 5000
        })
        
        request.on('timeout', () => {
            expect(false).toBeTruthy(`timed out waiting for response from DNS server!`)
            done()
        });
        
        request.on('message', (err, response) => {
            expect(response).toBeDefined(`the response from the DNS server was not defined!`);
            expect(Array.isArray(response.answer)).toBeTruthy('the response answer field was not an array type!');
            expect(response.answer.length).toBe(1, 'the response had more than one answer!');
            let answer: ARecord = <ARecord> response.answer[0];
            expect(answer.address).toBe(`192.168.10.1`, `the response did not have the expected ip address!`)
            done()
        });

        request.send();
    });
})