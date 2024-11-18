/**
 * @jest-environment node
 */
import { makeS3ImagesViewable } from "@/lib/images/s3ImageViewer";

describe("S3 Image Viewer tests", () => {
  jest.setTimeout(300000) // 5-minute timeout

  it("makes S3 images viewable in browser", async () => {
    const result = await makeS3ImagesViewable('static.crowdsourcingcures.org', 'dfda');
    
    expect(result).toBeDefined();
  });

});