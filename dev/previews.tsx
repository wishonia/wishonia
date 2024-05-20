import {ComponentPreview, Previews} from "@react-buddy/ide-toolbox-next";
import {PaletteTree} from "./palette";
import {PollRandomWishingWells} from "@/components/poll-random-wishing-wells";

const ComponentPreviews = () => {
    return (
        <Previews palette={<PaletteTree/>}>
            <ComponentPreview path="/PollRandom">
                <PollRandomWishingWells/>
            </ComponentPreview>
        </Previews>
    );
};

export default ComponentPreviews;