import servers from "./servers.json"
import concurrently from "concurrently"
import path from "path"
const root = process.cwd()

const config = servers.map((item)=>({
    name: item,
    command: `npm install --prefix "${path.join(root, "services", item)}"`
}))

concurrently(config)