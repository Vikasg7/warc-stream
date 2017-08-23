"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const stream_1 = require("stream");
class WarcStream extends stream_1.Transform {
    constructor(_opts = {}) {
        super(Object.assign(_opts, { objectMode: true }));
        this._opts = _opts;
        this._unused = [];
        this._hRegex = /([a-zA-Z_\-]+): *(.*)/g;
        this._CRLF = Buffer.from("\r\n");
        this._doubleCRLF = Buffer.from("\r\n\r\n");
        this._offset = 0;
    }
    _transform(chunk, enc, done) {
        this._unused.push(chunk);
        const unused = Buffer.concat(this._unused);
        this._unused.splice(0);
        this._offset = 0;
        while (true) {
            // Parsing headers
            const i = unused.indexOf(this._doubleCRLF, this._offset);
            if (i < 0) {
                this._unused.push(unused);
                break;
            }
            const hStr = unused.slice(this._offset, i);
            const version = hStr.slice(0, hStr.indexOf(this._CRLF)).toString();
            const headers = this._parseHeaders(hStr);
            // Parsing content
            this._offset = i + 4; // content starts
            const contentLength = parseInt(headers["Content-Length"]);
            const ii = unused.indexOf(this._doubleCRLF, this._offset + contentLength - 1);
            if (ii < 0) {
                this._unused.push(unused);
                break;
            }
            const content = unused.slice(this._offset, ii);
            this.push({ version, headers, content });
            this._offset = ii + 4; // next record starts
        }
        done();
    }
    _flush(done) {
        this._cleanUp();
        done();
    }
    _parseHeaders(findIn) {
        const headers = {};
        findIn.toString().replace(this._hRegex, (match, $1, $2) => headers[$1] = $2);
        return headers;
    }
    _cleanUp() {
        this._unused = null;
        this._hRegex = null;
        this._doubleCRLF = null;
        this._CRLF = null;
        this._offset = null;
    }
}
exports.WarcStream = WarcStream;
//# sourceMappingURL=warc-stream.js.map