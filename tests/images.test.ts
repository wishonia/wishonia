/**
 * @jest-environment node
 */
import { uploadPublicImagesToVercel} from "@/lib/imageUploader";
describe("Test Images", () => {
    it("should upload all images", async () => {
        const urls = await uploadPublicImagesToVercel()
        expect(urls).toBeDefined();
    });
    it("should generate a featured image", async () => {
        // Test code here
    });
});