const fs = require('fs');
const path = require('path');

// Find the project root path
const projectRoot = path.resolve(__dirname, '..');

// Directory containing React components
const componentsDir = path.join(projectRoot, 'components');
const appComponentsDir = path.join(projectRoot, 'app', '_components'); // Additional components directory

// Helper function to recursively list all files in a directory
function listFiles(dir) {
    const files = fs.readdirSync(dir, { withFileTypes: true });
    let fileList = [];
    files.forEach(file => {
        if (file.isDirectory() && !file.name.startsWith('.')) {
            fileList = [...fileList, ...listFiles(path.join(dir, file.name))];
        } else if (!file.isDirectory()) {
            fileList.push(path.join(dir, file.name));
        }
    });
    return fileList;
}

// Helper function to check if a component is used in any file
function isComponentUsed(componentPath, projectFiles) {
    const componentName = path.basename(componentPath, path.extname(componentPath));
    const importRegex = new RegExp(`import\\s+(\\{.*?\\}|.*?\\s+)from\\s+['"].*${componentName}['"];?`, 'm');
    return projectFiles.some(file => {
        if (!fs.statSync(file).isDirectory()) { // Ensure fs.readFileSync is only called on files
            const fileContent = fs.readFileSync(file, 'utf8');
            return importRegex.test(fileContent);
        }
        return false;
    });
}

// Main function to find and delete unused components
function cleanupUnusedComponents() {
    const allFiles = listFiles(projectRoot);
    const componentFiles = [...listFiles(componentsDir), ...listFiles(appComponentsDir)]; // Include both components directories

    componentFiles.forEach(component => {
        if (!isComponentUsed(component, allFiles)) {
            console.log(`Component marked for deletion: ${component}`);

                //fs.unlinkSync(component);
                console.log(`Deleted unused component: ${component}`);
        }
    });
}

cleanupUnusedComponents();
