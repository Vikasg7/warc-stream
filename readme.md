# warc-stream

- ### Intro  
   **warc-stream** is a Tranform stream to read .warc or .warc.gz file member by member in nodejs

- ### Install  
   `npm install git+https://github.com/Vikasg7/warc-stream.git`  

- ### Usage (in TypeScript)  
   ````javascript  
   import { WarcStream, WarcRecord, WarcHeaders } from "warc-stream"
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
   ````

- ### Example
   Check the tests folder in src folder for an example.