const fs = require("fs")
const path = require("path")
const sharp = require("sharp")
const outputQuality = 10 // Set the output quality (0 to 100)
const outputFormat = "jpg" // Set to null to keep the original format

// Function to check if a file is an image
function isImage(file) {
  const ext = path.extname(file).toLowerCase()
  return [".png", ".jpg", ".jpeg", ".gif"].includes(ext)
}

// Recursive function to traverse directories
function traverseDir(dir) {
  fs.readdirSync(dir).forEach((file) => {
    let fullPath = path.join(dir, file)
    if (fs.lstatSync(fullPath).isDirectory()) {
      traverseDir(fullPath)
    } else if (isImage(fullPath)) {
      compressImage(fullPath)
    }
  })
}

// Function to compress image
function compressImage(imagePath) {
  // Convert imagePath to an absolute path
  imagePath = path.resolve(imagePath)
  // create a new directory for compressed images
  fs.mkdirSync(path.join(path.dirname(imagePath), "compressed"), {
    recursive: true,
  })
  let outputFilePath = path.join(
    path.dirname(imagePath),
    "compressed",
    path.basename(imagePath)
  )
  const ext = path.extname(imagePath).toLowerCase()

  let sharpInstance
  switch (ext) {
    case ".jpg":
    case ".jpeg":
      sharpInstance = sharp(imagePath).jpeg({ quality: outputQuality })
      break
    case ".png":
      if (outputFormat === "jpg") {
        sharpInstance = sharp(imagePath).jpeg({ quality: outputQuality })
        outputFilePath = outputFilePath.replace(".png", ".jpg")
      } else {
        sharpInstance = sharp(imagePath).png({ quality: outputQuality })
      }
      break
    default:
      console.log(`Unsupported image format: ${ext}`)
      return
  }

  sharpInstance.toFile(outputFilePath, (err, info) => {
    if (err) console.log(err)
    else console.log(`Image compressed: ${outputFilePath}`)
  })
}

// Start the script with the directory you want to traverse
traverseDir("public/docs/positron-network/agent-ideas")
//traverseDir("../public/globalProblems")
