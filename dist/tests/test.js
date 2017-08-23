"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
const gzip_stream_1 = require("gzip-stream");
const graceful_fs_1 = require("graceful-fs");
const file = process.argv[2];
const reader = file.endsWith(".gz") ? graceful_fs_1.createReadStream(file).pipe(new gzip_stream_1.GzipStream()) : graceful_fs_1.createReadStream(file);
const warcStream = new index_1.WarcStream();
let i = 0;
reader.pipe(warcStream)
    .on("data", (member) => {
    const { version, headers: WarcHeaders, content } = member;
    process.stdout.write(content);
});
//# sourceMappingURL=test.js.map