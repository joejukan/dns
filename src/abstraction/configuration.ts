import { ARecord, DNSEndpoint } from "native-dns";

export interface Configuration {
    address?: string;
    port: number;
    ttl?: number;
    forwarders: DNSEndpoint[];
    record: {
        A: ARecord[];
    }
}