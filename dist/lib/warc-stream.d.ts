/// <reference types="node" />
import { Transform, TransformOptions } from "stream";
export interface WarcHeaders {
    'WARC-Type': string;
    'WARC-Date': string;
    'WARC-Record-ID': string;
    'Content-Length': string;
    'Content-Type': string;
    'WARC-Warcinfo-ID': string;
    'WARC-Concurrent-To': string;
    'WARC-IP-Address': string;
    'WARC-Target-URI': string;
    'WARC-Payload-Digest': string;
    'WARC-Block-Digest': string;
    [key: string]: string;
}
export interface WarcRecord {
    version: string;
    headers: WarcHeaders;
    content: Buffer;
}
export declare class WarcStream extends Transform {
    private _opts;
    private _unused;
    private _hRegex;
    private _CRLF;
    private _doubleCRLF;
    private _offset;
    constructor(_opts?: TransformOptions);
    _transform(chunk: Buffer, enc: string, done: (value?: any) => void): void;
    _flush(done: (value?: any) => void): void;
    private _parseHeaders(findIn);
    private _cleanUp();
}
