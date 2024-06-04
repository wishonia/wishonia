import {put} from "@vercel/blob";

export async function uploadImageToVercel(buffer: Buffer, fileName: string) {
    const blob = await put(fileName, buffer, {
        access: 'public',
    });
    return blob.url;
}

export async function vercelImageExists(fileName: string) {
    try {
        await fetch(`https://cdn.vercel.com/${fileName}`);
        return true;
    } catch (e) {
        return false;
    }
}