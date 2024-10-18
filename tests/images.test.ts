/**
 * @jest-environment node
 */
import { generateGlobalSolutionImages } from "@/lib/globalSolutionsGenerator"
import { convertLargeImagesToJpg } from "@/lib/imageGenerator"
import {downloadAllBlobImages, uploadPublicImagesToVercel} from "@/lib/images/localImages";

describe("Test Images", () => {
  it("should upload all images", async () => {
    const urls = await uploadPublicImagesToVercel()
    expect(urls).toBeDefined()
  })
  it("should download all blobs", async () => {
    await downloadAllBlobImages()
  })
  it("should generateGlobalSolutionImages", async () => {
    await generateGlobalSolutionImages()
  })
  it("should convert large images to jpg", async () => {
    await convertLargeImagesToJpg()
  })
})
