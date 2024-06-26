import { parseArgs } from "node:util"
import { existsSync, createWriteStream } from "node:fs"
import { mkdir } from "node:fs/promises"
import { Readable } from 'node:stream'
import { finished } from 'node:stream/promises'
import type { ReadableStream } from 'node:stream/web'

import { Identity } from "@semaphore-protocol/identity"
import { Group } from "@semaphore-protocol/group"
import { generateProof } from "@semaphore-protocol/proof"

const treeDepth = 32
const baseUrl = `https://www.trusted-setup-pse.org/semaphore/${treeDepth}`
const basePath = `snark-artifacts/${treeDepth}`
const wasmFilePath = `${basePath}/semaphore.wasm`
const zkeyFilePath = `${basePath}/semaphore.zkey`

const { values: args } = parseArgs({
  options: {
    identityString: { type: "string", default: "super-secret-string" },
    groupId: { type: "string" },
    vote: { type: "string" }
  }
})

const cwd = process.cwd()
const script = process.argv[1].slice(cwd.length + 1)

const help = `
Usage: npx ts-node ${script} [options]

Options:
  --identityString <identityString>  Defaults to "super-secret-string"
  --groupId <groupId>
  --vote <vote>
`

if (!(args.groupId && args.vote)) {
  console.log(help)
  process.exit(2)
}

const downloadArtifact = async (path: string): Promise<void> => {
  if (existsSync(path)) return

  const file = path.split('/').pop()
  const writer = createWriteStream(path)
  await fetch(`${baseUrl}/${file}`)
    .then(r => Readable.fromWeb(r.body as ReadableStream<Uint8Array>))
    .then(body => finished(body.pipe(writer)))
}

const downloadArtifacts = async () => {
  await mkdir(basePath, { recursive: true })
  await downloadArtifact(wasmFilePath)
  await downloadArtifact(zkeyFilePath)
}

const main = async (groupId: number, vote: number): Promise<any> => {
  await downloadArtifacts()

  const identity = new Identity(args.identityString)
  console.log(identity)

  const group = new Group(groupId, treeDepth)
  const externalNullifier = group.id
  const signal = vote

  group.addMember(identity.commitment)

  return generateProof(identity, group, externalNullifier, signal, {
    wasmFilePath,
    zkeyFilePath
  }).then((fullProof) => console.log("Proof", fullProof))
}

main(parseInt(args.groupId), parseInt(args.vote)).then(process.exit)
