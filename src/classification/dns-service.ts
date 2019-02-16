import { access } from "@joejukan/web-kit"
import { Configuration } from "../abstraction";
import { DNSType } from "../enumeration";
import { DNSEndpoint, DNSResourceRecord, ARecord, createServer, DNSServer, DNSResponse, DNSRequest, DNSQuestion, Request, Question, A } from "native-dns";

export class DNSService {
    private server: DNSServer;
    public constructor(private configuration: Configuration){
        let server = this.server = createServer();
        server.on('request', (request: DNSRequest, response: DNSResponse) =>{
            let question: DNSQuestion = request.question[0];
            let found = false;
            console.log(`[dns-service] received dns query (${question.name} ${DNSType[question.type]})`);
            
            if(question.type === DNSType.A){
                let records = this.getRecords('A');
                records.forEach( record => {
                    if(question.name === record.name){
                        found = true;
                        record.ttl = record.ttl || this.ttl;
                        record.type = DNSType.A;
                        
                        console.log(`[dns-service] found record (${record.name} ${DNSType[record.type]} ${record.address})`);
                        response.answer.push(A(record));
                    }
                })
            }

            if(found){
                console.log(`[dns-service] responding.`)
                response.send();
            }
            else{
                let query = Request({
                    question: question,
                    server: this.forwarder,
                    timeout: this.timeout
                })
                console.log(`[dns-service] forwarding request to ${this.forwarder.address}:${this.forwarder.port}`)
                query.on('timeout', () => {
                    console.error(`[error] timeout on ${question.name} (${question.type})`);
                    response.send();
                })

                query.on('message', (err:Error, reply: DNSResponse) => {
                    if(err){
                        console.error(`[error] ${err.message} on ${question.name} (${question.type})\n${err.stack}`);
                        response.send();
                    }
                    else{
                        reply.answer.forEach( answer => {
                            console.log(`[dns-service] received answer: ${JSON.stringify(answer)}`);
                            response.answer.push(answer)
                        });
                    }
                })

                query.on('end', () => {
                    response.send();
                });

                query.send();
            }
        })
    }

    public get ttl(): number {
        return access(this.configuration, 'ttl') || 600; 
    }

    public get address(): string {
        return access(this.configuration, 'address') || '0.0.0.0';
    }
    public get port(): number {
        return access(this.configuration, 'port') || 53;
    }

    public get forwarders(): DNSEndpoint[] {
        return access(this.configuration, 'forwarders') || [{address: '8.8.8.8', port: 53, type: 'udp'},  {address: '8.8.4.4', port: 53, type: 'udp'}];
    }

    public get forwarder(): DNSEndpoint {
        return this.forwarders[0];
    }

    public get timeout(): number {
        return access(this.configuration, 'timeout') || 1000;
    }

    public getRecords(type: 'A'): ARecord[];
    public getRecords(type: string): DNSResourceRecord [] {
        return access(this.configuration, `record.${type}`) || [];
    }

    public start(){
        console.log('starting service!')
        this.server.serve(this.port, this.address);
        console.log(`listening on ${this.address}:${this.port}`)
    }

    public stop(){
        console.log('stoping service!')
        this.server.close();
    }
}