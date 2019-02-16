declare module "native-dns" {
    export interface DNSResourceRecord {
        name: string;
        type?: number;
        class?: number;
        ttl?: number;
    }

    export interface ARecord extends DNSResourceRecord {
        address: string;
    }

    interface AAAARecord extends DNSResourceRecord {
        address: string;
    }

    interface SOARecord extends DNSResourceRecord {
        primary: string;
        admin: string;
        serial: number;
        refresh: number;
        retry: number;
        expiration: number;
        minimum: number;
    }

    interface MXRecord extends DNSResourceRecord {
        priority: number;
        exchange: string;
    }

    interface TXTRecord extends DNSResourceRecord {
        data: string;
    }

    interface SRVRecord extends DNSResourceRecord {
        priority: number;
        weight: number;
        port: number;
        target: string;
    }

    interface NSRecord extends DNSResourceRecord {
        data: string;
    }

    interface CNAMERecord extends DNSResourceRecord {
        data: string;
    }

    interface PTRRecord extends DNSResourceRecord {
        data: string;
    }

    interface NAPTRRecord extends DNSResourceRecord {
        order: number;
        preference: number;
        flags: string;
        service: string;
        regexp: string;
        replacement: string;
    }

    export interface DNSQuestion {
        name?: string;
        type?: number | 'A' | 'AAAA' | 'NS' | 'CNAME' | 'PTR' | 'NAPTR' | 'TXT' | 'MX' | 'SRV' | 'SOA' | 'TLSA';
    }
    

    interface DNSPacketHeader{
        id?: number;
        qdcount?: number;
        ancount?: number;
        nscount?: number;
        arcount?: number;
        qr?: number;
        opcode?: number;
        aa?: number;
        tc?: number;
        rd?: number;
        ra?: number;
        res1?: number;
        res2?: number;
        res3?: number;
        rcode?: number;
    }

    export interface DNSPacket {
        header?: DNSPacketHeader;
        send?: { (): void }
        question?: DNSQuestion [] | DNSQuestion;
        answer?: DNSResourceRecord [];
        authority?: DNSResourceRecord [];
        additional?: DNSResourceRecord [];
    }

    export interface DNSEndpoint {
        address: string;
        port: number;
        type: 'udp' | 'tcp';
    }

    export interface DNSRequest extends DNSPacket {
        server?: DNSEndpoint;
        timeout?: number;
        on?: {
            (event: 'timeout' | 'end' | 'message', callback: { (): void } | { (err:Error, response: DNSResponse): void }): void
        }
    }

    export interface DNSResponse extends DNSPacket {
        
    }

    export interface DNSServer {
        on?: { ( event: 'request' | 'error' | 'close', callback: {(request: DNSRequest, response: DNSResponse): void} | {(err:Error, buff: BufferSource, request: DNSRequest, response: DNSResponse): void} ): void }

        serve?: { (port: number, address?: string): void }
        close?: {(): void}
    }

    export function createServer(): DNSServer;
    export function Question(question: DNSQuestion): DNSQuestion;
    export function Request(request: DNSRequest): DNSRequest;
    export function A(record: ARecord): ARecord;
    export function AAAA(record: AAAARecord): AAAARecord;
    export function SOA(record: AAAARecord): SOARecord;
    export function MX(record: MXRecord): MXRecord;
    export function TXT(record: TXTRecord): TXTRecord;
    export function SRV(record: SRVRecord): SRVRecord;
    export function NS(record: NSRecord): NSRecord;
    export function CNAME(record: CNAMERecord): CNAMERecord;
    export function PTR(record: PTRRecord): PTRRecord;
    export function NAPTR(record: NAPTRRecord): NAPTRRecord;
}