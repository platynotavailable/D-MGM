import { useEffect, useRef } from "react";
import { Map as MapLibreMap, Marker } from "maplibre-gl";

import "maplibre-gl/dist/maplibre-gl.css";
import "./LiveMap.css";

const CENTER: [number, number] = [77.5946, 12.9716];
const INCIDENT: [number, number] = [77.5956, 12.9722];

const SATELLITE_STYLE = {
  version: 8,
  sources: {
    satellite: {
      type: "raster",
      tiles: [
        "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      ],
      tileSize: 256,
      attribution: "Imagery © Esri, Maxar, Earthstar Geographics and the GIS User Community",
    },
  },
  layers: [{
    id: "satellite",
    type: "raster",
    source: "satellite",
    paint: {
      "raster-saturation": -0.12,
      "raster-contrast": 0.04,
      "raster-brightness-min": 0.05,
      "raster-brightness-max": 0.92,
    },
  }],
};

export default function LiveMap() {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const cameraTimerRef = useRef<number | null>(null);
  const userInteractedRef = useRef(false);
  const incidentMarkerRef = useRef<Marker | null>(null);

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    const map = new MapLibreMap({
      container: mapContainer.current,
      style: SATELLITE_STYLE,
      center: CENTER,
      zoom: 13.25,
      pitch: 38,
      bearing: -8,
      attributionControl: false,
      dragPan: true,
      scrollZoom: true,
      doubleClickZoom: true,
      dragRotate: false,
      touchZoomRotate: true,
    });

    mapRef.current = map;

    const stopCinematicMovement = () => {
      userInteractedRef.current = true;
      if (cameraTimerRef.current !== null) {
        window.clearTimeout(cameraTimerRef.current);
        cameraTimerRef.current = null;
      }
    };

    map.on("dragstart", stopCinematicMovement);
    map.on("zoomstart", stopCinematicMovement);

    map.on("load", () => {
      map.jumpTo({ center: CENTER, zoom: 12.9, pitch: 34, bearing: -6 });
      map.flyTo({ center: CENTER, zoom: 13.25, pitch: 38, bearing: -8, duration: 3200, essential: true });

      const markerElement = document.createElement("div");
      markerElement.className = "incident-marker";
      markerElement.style.position = "relative";
      markerElement.style.width = "18px";
      markerElement.style.height = "18px";
      markerElement.style.borderRadius = "50%";
      markerElement.style.cursor = "pointer";
      markerElement.innerHTML = `
        <span style="position:absolute;inset:-15px;border-radius:50%;border:1px solid rgba(255,75,75,.48);box-shadow:0 0 26px rgba(255,55,55,.28);animation:dmgmIncidentPulse 1.7s ease-out infinite;"></span>
        <span style="position:absolute;inset:5px;border-radius:50%;background:#ff4747;box-shadow:0 0 18px rgba(255,65,65,.95),0 0 4px rgba(255,255,255,.75);"></span>
        <span style="position:absolute;left:28px;top:-7px;padding:5px 8px;border:1px solid rgba(255,120,120,.3);border-radius:5px;background:rgba(12,12,15,.76);backdrop-filter:blur(8px);color:rgba(255,235,235,.9);font:600 8px/1 Inter,system-ui,sans-serif;letter-spacing:1.1px;white-space:nowrap;">ACTIVE FIRE</span>
      `;

      if (!document.getElementById("dmgm-marker-keyframes")) {
        const style = document.createElement("style");
        style.id = "dmgm-marker-keyframes";
        style.textContent = `@keyframes dmgmIncidentPulse { 0% { transform: scale(.45); opacity:.95; } 75% { transform: scale(1); opacity:0; } 100% { transform: scale(1); opacity:0; } }`;
        document.head.appendChild(style);
      }

      incidentMarkerRef.current = new Marker({ element: markerElement, anchor: "center" }).setLngLat(INCIDENT).addTo(map);

      let direction = 1;
      const cinematicMovement = () => {
        if (!mapRef.current || userInteractedRef.current) return;
        const currentCenter = mapRef.current.getCenter();
        const currentZoom = mapRef.current.getZoom();
        const currentBearing = mapRef.current.getBearing();
        mapRef.current.easeTo({
          center: [currentCenter.lng + 0.00024 * direction, currentCenter.lat + 0.00004],
          zoom: currentZoom + 0.006 * direction,
          bearing: currentBearing + 0.025 * direction,
          duration: 8500,
          essential: false,
        });
        direction *= -1;
        cameraTimerRef.current = window.setTimeout(cinematicMovement, 8700);
      };

      cameraTimerRef.current = window.setTimeout(cinematicMovement, 4800);
    });

    return () => {
      map.off("dragstart", stopCinematicMovement);
      map.off("zoomstart", stopCinematicMovement);
      if (cameraTimerRef.current !== null) window.clearTimeout(cameraTimerRef.current);
      incidentMarkerRef.current?.remove();
      incidentMarkerRef.current = null;
      map.remove();
      mapRef.current = null;
    };
  }, []);

  return (
    <section className="live-map">
      <div ref={mapContainer} className="map-container" />
      <div className="map-reveal" />
      <div className="map-dark-overlay" />
      <div className="cloud-layer">
        <div className="cloud cloud-one" />
        <div className="cloud cloud-two" />
        <div className="cloud cloud-three" />
        <div className="cloud cloud-four" />
        <div className="cloud cloud-five" />
      </div>
      <div className="monitoring-badge"><span className="monitoring-dot" /><span>LIVE MONITORING</span></div>
      <div className="system-identity">
        <div className="identity-symbol">+</div>
        <div className="identity-text">
          <div className="identity-title">D-MGM</div>
          <div className="identity-subtitle">DISASTER MANAGEMENT <span> &amp; </span> INFRASTRUCTURE MONITORING</div>
        </div>
      </div>
      <div className="map-information">
        <div className="map-information-title">URBAN RESILIENCE NETWORK</div>
        <div className="map-information-subtitle">REAL-TIME DISASTER INTELLIGENCE</div>
      </div>
      <div className="map-vignette" />
    </section>
  );
}
