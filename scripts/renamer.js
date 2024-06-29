const fs = require("fs")
const path = require("path")
const ignore = require("ignore")

// Define the search terms and their replacements
const searchTerms = [
  { old: "wishing_well", new: "global_wishing_well" },
  { old: "WishingWell", new: "GlobalWishingWell" },
  { old: "wishing-well", new: "global-wishing-well" },
  // Add more search terms and replacements as needed
]

// Get the project directory (one directory above the script)
const projectDir = path.resolve(__dirname, "..")

// Get the script file name
const scriptFile = path.basename(__filename)

// Read the .gitignore file
const gitignorePath = path.join(projectDir, ".gitignore")
let gitignorePatterns = []
if (fs.existsSync(gitignorePath)) {
  gitignorePatterns = fs
    .readFileSync(gitignorePath, "utf8")
    .split("\n")
    .filter(Boolean)
}

// Create an ignore instance with the .gitignore patterns
const ig = ignore().add(gitignorePatterns)

// Function to replace search terms in file contents
function replaceContents(filePath) {
  try {
    let contents = fs.readFileSync(filePath, "utf8")
    searchTerms.forEach(({ old, new: newTerm }) => {
      contents = contents.replace(new RegExp(old, "g"), newTerm)
    })
    fs.writeFileSync(filePath, contents)
  } catch (error) {
    console.error(`Error processing file '${filePath}':`, error)
  }
}

// Function to replace search terms in file and directory names
function replaceNames(directory) {
  fs.readdirSync(directory).forEach((item) => {
    const itemPath = path.join(directory, item)
    const relativePath = path.relative(projectDir, itemPath)

    if (ig.ignores(relativePath) || item === scriptFile) {
      return
    }

    if (fs.statSync(itemPath).isDirectory()) {
      replaceNames(itemPath)
      const newDirPath = searchTerms.reduce(
        (acc, { old, new: newTerm }) => acc.replace(old, newTerm),
        itemPath
      )
      if (newDirPath !== itemPath) {
        fs.renameSync(itemPath, newDirPath)
      }
    } else {
      replaceContents(itemPath)
      const newFilePath = searchTerms.reduce(
        (acc, { old, new: newTerm }) => acc.replace(old, newTerm),
        itemPath
      )
      if (newFilePath !== itemPath) {
        fs.renameSync(itemPath, newFilePath)
      }
    }
  })
}

// Start the replacement process
replaceNames(projectDir)
