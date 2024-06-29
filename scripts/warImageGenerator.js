const fs = require("fs")
const path = require("path")

const directoryPath = path.join(process.cwd(), "public/img/war")
const outputPath = path.join(process.cwd(), "lib", "warImagePaths.js")

fs.readdir(directoryPath, (err, files) => {
  if (err) {
    console.error("Unable to scan directory: ", err)
    process.exit(1)
  }
  const filePaths = files.map((file) => `/img/war/${file}`)
  const content = `export const warImages = ${JSON.stringify(filePaths)};\n`
  fs.writeFile(outputPath, content, (err) => {
    if (err) {
      console.error("Unable to write file: ", err)
      process.exit(1)
    }
    console.log("Image paths generated successfully.")
  })
})
