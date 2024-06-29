import { ComponentPreview, Previews } from "@react-buddy/ide-toolbox-next"

import { PollRandomWishingWells } from "@/components/poll-random-wishing-wells"

import { PaletteTree } from "./palette"

const ComponentPreviews = () => {
  return (
    <Previews palette={<PaletteTree />}>
      <ComponentPreview path="/PollRandom">
        <PollRandomWishingWells />
      </ComponentPreview>
    </Previews>
  )
}

export default ComponentPreviews
