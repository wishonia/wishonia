/**
 * @jest-environment node
 */
import {downloadAllBlobImages, uploadPublicImagesToVercel} from "@/lib/imageUploader";
import {generateGlobalSolutionImages} from "@/lib/globalSolutionsGenerator";
describe("Test Images", () => {
    it("should upload all images", async () => {
        const urls = await uploadPublicImagesToVercel()
        expect(urls).toBeDefined();
    });
    it("should download all blobs", async () => {
        await downloadAllBlobImages()
    });
    it("should generateGlobalSolutionImages", async () => {
        await generateGlobalSolutionImages();
    });
});