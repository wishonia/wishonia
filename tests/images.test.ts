/**
 * @jest-environment node
 */
import {downloadAllBlobImages, uploadPublicImagesToVercel} from "@/lib/imageUploader";
describe("Test Images", () => {
    it("should upload all images", async () => {
        const urls = await uploadPublicImagesToVercel()
        expect(urls).toBeDefined();
    });
    it("should download all blobs", async () => {
        await downloadAllBlobImages()
    });
});