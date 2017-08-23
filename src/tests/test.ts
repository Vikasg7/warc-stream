import { WarcStream, WarcRecord, WarcHeaders } from "../index"
import { GzipStream } from "gzip-stream"
import { createReadStream } from "graceful-fs"

const file = process.argv[2]

const reader = file.endsWith(".gz") ? createReadStream(file).pipe(new GzipStream()) : createReadStream(file)

const warcStream = new WarcStream()

let i = 0
reader.pipe(warcStream)
   .on("data", (member: WarcRecord) =>{
      const {version, headers: WarcHeaders, content} = member
      process.stdout.write(content)
   })
