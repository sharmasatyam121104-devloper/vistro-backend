import servers from "./servers.json"
import concurrently from "concurrently"
import path from "path"
const root = process.cwd()

const config = servers.map((item)=>({
    name: item,
    command: `rm -rf "${path.join(root, "services", item, "node_modules")}"`
}))

concurrently(config)