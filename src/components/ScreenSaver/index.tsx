import React from "react";
import "../../App.css";
import img1 from "./Peppermint Campaign grid-01.jpg";
import img2 from "./Peppermint Campaign grid-02.jpg";
import img3 from "./Peppermint Campaign grid-03.jpg";
import { useSettings } from "../SettingsProvider";

const images = [img1, img2, img3];

const ScreenSaver = () => {
  const { settings } = useSettings();
  const [currentSlide, setCurrentSlide] = React.useState(0); // set current slide index
  const sliderInterval = React.useRef<NodeJS.Timeout>(); // interval ref

  React.useEffect(() => {
    sliderInterval.current = setInterval(() => {
      setCurrentSlide((currentSlide + 1) % images.length); // change current slide to next after 3s
    }, settings.screenSaverInterval * 1000);

    return () => {
      clearInterval(sliderInterval.current);
    };
  });

  return (
    <div className="content">
      <div>
        {images.map((image, index) => (
          <img
            id={index + ""}
            key={index}
            className={index === currentSlide ? "image active" : "image"}
            src={image}
            style={{
              zIndex: `-${index + 1}`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default ScreenSaver;
