import { Transform, TransformOptions } from "stream"

export interface WarcHeaders {
   'WARC-Type': string,
   'WARC-Date': string,
   'WARC-Record-ID': string,
   'Content-Length': string,
   'Content-Type': string,
   'WARC-Warcinfo-ID': string,
   'WARC-Concurrent-To': string,
   'WARC-IP-Address': string,
   'WARC-Target-URI': string,
   'WARC-Payload-Digest': string,
   'WARC-Block-Digest': string,
   [key: string]: string
}

export interface WarcRecord {
   version: string,
   headers: WarcHeaders,
   content: Buffer
}

export class WarcStream extends Transform {
   private _unused: Array<Buffer>
   private _hRegex: RegExp
   private _CRLF: Buffer
   private _doubleCRLF: Buffer
   private _offset: number

   constructor(private _opts: TransformOptions = {}) {
      super(Object.assign(_opts, {objectMode: true}))
      this._unused = []
      this._hRegex = /([a-zA-Z_\-]+): *(.*)/g
      this._CRLF = Buffer.from("\r\n")
      this._doubleCRLF = Buffer.from("\r\n\r\n")
      this._offset = 0
   }

   _transform(chunk: Buffer, enc: string, done: (value?: any) => void) {
      this._unused.push(chunk)
      const unused = Buffer.concat(this._unused)
      this._unused.splice(0)

      this._offset = 0
      while (true) {
         // Parsing headers
         const i = unused.indexOf(this._doubleCRLF, this._offset)
         if (i < 0) { this._unused.push(unused); break }
         
         const hStr = unused.slice(this._offset, i)
         const version = hStr.slice(0, hStr.indexOf(this._CRLF)).toString()
         const headers = this._parseHeaders(hStr)

         // Parsing content
         this._offset = i + 4 // content starts
         const contentLength = parseInt(headers["Content-Length"])
         const ii = unused.indexOf(this._doubleCRLF, this._offset + contentLength - 1)
         if (ii < 0) { this._unused.push(unused); break }
         const content = unused.slice(this._offset, ii)

         this.push(<WarcRecord>{ version, headers, content })

         this._offset = ii + 4 // next record starts
      }
      done()
   }
   
   _flush(done: (value?: any) => void) {
      this._cleanUp()
      done()
   }

   private _parseHeaders(findIn: Buffer): WarcHeaders {
      const headers = {}
      findIn.toString().replace(this._hRegex, (match, $1, $2) => headers[$1] = $2)
      return <WarcHeaders>headers
   }

   private _cleanUp() {
      this._unused = null
      this._hRegex = null
      this._doubleCRLF = null
      this._CRLF = null
      this._offset = null
   }
}