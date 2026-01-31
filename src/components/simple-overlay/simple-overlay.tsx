import { useEffect } from "react";
import { Overlay } from "ol";
import { Options } from "ol/Overlay";
import { useMap } from "react-openlayers";

export default function SimpleOverlay({
  ref,
  ...props
}: Options & { ref?: React.RefObject<Overlay> }) {
  const map = useMap();

  useEffect(() => {
    if (map) {
      const overlay = new Overlay({
        element: document.createElement("div"),
        positioning: "bottom-center",
        stopEvent: true,
        ...props,
      });
      map.addOverlay(overlay);
      if (ref) {
        ref.current = overlay;
      }
    }
  }, [map]);

  return null;
}
