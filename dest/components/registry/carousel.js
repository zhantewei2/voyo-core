import { CarouselComponent } from "../carousel/carousel.component";
import { CarouselItemComponent } from "../carousel/carousel-item.component";
import { assemblyComponent } from "../../components";
export const registryCarousel = () => {
    assemblyComponent("voyoc-carousel", CarouselComponent);
    assemblyComponent("voyoc-carousel-item", CarouselItemComponent);
};
