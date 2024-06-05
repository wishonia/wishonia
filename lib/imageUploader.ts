import {list, put} from "@vercel/blob";
import {absPathFromPublic, getNonIgnoredFiles, relativePathFromPublic} from "@/lib/fileHelper";
import fs from "fs";

export async function uploadImageToVercel(buffer: Buffer, pathFromPublic: string) {
    if(pathFromPublic.startsWith('/')) {
        pathFromPublic = pathFromPublic.slice(1);
    }
    const blob = await put(pathFromPublic, buffer, {
        access: 'public',
        addRandomSuffix: false,
    });
    return blob.url;
}

export async function vercelImageExists(pathFromPublic: string) {
    const url = generateImageUrl(pathFromPublic);
    const response = await fetch(url);
    return response.status === 200 ? url : null;
}

function generateImageUrl(pathFromPublic: string) {
    if(pathFromPublic.startsWith('/')) {
        pathFromPublic = pathFromPublic.slice(1);
    }
    return `https://pcpfoetqkuq7jmso.public.blob.vercel-storage.com/${pathFromPublic}`;
}

export async function uploadPublicImagesToVercel() {
    const urls = [];
    const imageFiles = getImagesFromPublic();
    for(const pathFromPublic of imageFiles) {
        let url = await uploadImageToVercelIfNecessary(pathFromPublic);
        urls.push(url);
    }
    return urls;
}

function getImagesFromPublic() {
    const allFiles = getNonIgnoredFiles(absPathFromPublic(''));
    const imageFiles = [];
    for(const file of allFiles) {
        if(file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.jpeg')) {
            imageFiles.push(file);
        }
    }
    return imageFiles.map(relativePathFromPublic);
}

export async function uploadImageToVercelIfNecessary(pathFromPublic: string) {
    let url = await vercelImageExists(pathFromPublic);
    if(url) {
        console.log(`Image already uploaded: ${pathFromPublic}`);
        return;
    }
    const buffer = fs.readFileSync(absPathFromPublic(pathFromPublic));
    url = await uploadImageToVercel(buffer, pathFromPublic);
    console.log(`Uploaded: ${url}`);
    return url;
}

export async function downloadAllBlobImages() {
    const listBlobResult = await list();
    const blobs = listBlobResult.blobs;
    // Loop through array of blobs
    for (const blob of blobs) {
        const url = blob.url;
        // Download image from url
        const response = await fetch(url);
        const buffer = await response.text();
        let pathname = relativePathFromPublic(blob.pathname);
        const absPath = absPathFromPublic(pathname);
        if(fs.existsSync(absPath)) {
            console.log(`Image already exists: ${absPath}`);
            continue;
        }
        fs.writeFileSync(absPath, buffer);
    }
}