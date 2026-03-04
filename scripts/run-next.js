const { spawn } = require("node:child_process")

const disableWarningFlag = "--disable-warning=DEP0040"
const existingNodeOptions = process.env.NODE_OPTIONS?.trim() ?? ""
const nodeOptions = existingNodeOptions.includes(disableWarningFlag)
  ? existingNodeOptions
  : [existingNodeOptions, disableWarningFlag].filter(Boolean).join(" ")

const nextBin = require.resolve("next/dist/bin/next")
const child = spawn(process.execPath, [nextBin, ...process.argv.slice(2)], {
  stdio: "inherit",
  env: {
    ...process.env,
    NODE_OPTIONS: nodeOptions,
  },
})

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal)
    return
  }

  process.exit(code ?? 0)
})
