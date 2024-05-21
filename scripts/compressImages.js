const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Function to check if a file is an image
function isImage(file) {
    const ext = path.extname(file).toLowerCase();
    return ['.png', '.jpg', '.jpeg', '.gif'].includes(ext);
}

// Recursive function to traverse directories
function traverseDir(dir) {
    fs.readdirSync(dir).forEach(file => {
        let fullPath = path.join(dir, file);
        if (fs.lstatSync(fullPath).isDirectory()) {
            traverseDir(fullPath);
        } else if (isImage(fullPath)) {
            compressImage(fullPath);
        }
    });
}

// Function to compress image
function compressImage(imagePath) {
    // Convert imagePath to an absolute path
    imagePath = path.resolve(imagePath);
    // create a new directory for compressed images
    fs.mkdirSync(path.join(path.dirname(imagePath), 'compressed'), { recursive: true });
    const output = path.join(path.dirname(imagePath),
        'compressed',
        path.basename(imagePath));
    const ext = path.extname(imagePath).toLowerCase();

    let sharpInstance;
    switch (ext) {
        case '.jpg':
        case '.jpeg':
            sharpInstance = sharp(imagePath).jpeg({ quality: 50 });
            break;
        case '.png':
            sharpInstance = sharp(imagePath).png({ quality: 10 });
            break;
        default:
            console.log(`Unsupported image format: ${ext}`);
            return;
    }

    sharpInstance.toFile(output, (err, info) => {
        if (err) console.log(err);
        else console.log(`Image compressed: ${output}`);
    });
}

// Start the script with the directory you want to traverse
traverseDir('../public/wishingWells');
traverseDir('../public/globalProblems');