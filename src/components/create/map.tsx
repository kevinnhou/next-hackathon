"use client";

import React, { useRef, useState } from "react";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { LatLngExpression, Marker as LeafletMarker } from "leaflet";
import L from "leaflet";
import markerIconPng from "leaflet/dist/images/marker-icon.png";

// Create custom marker icon
const customIcon = new L.Icon({
  iconUrl: markerIconPng.src || markerIconPng,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function DraggableMarker({
  position,
  setPosition,
}: {
  position: LatLngExpression;
  setPosition: (pos: LatLngExpression) => void;
}) {
  const markerRef = useRef<LeafletMarker>(null);

  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });

  return (
    <Marker
      position={position}
      draggable
      icon={customIcon}
      eventHandlers={{
        dragend() {
          const marker = markerRef.current;
          if (marker != null) {
            const { lat, lng } = marker.getLatLng();
            setPosition([lat, lng]);
          }
        },
      }}
      ref={markerRef}
    />
  );
}

function DraggableMapPin() {
  const [position, setPosition] = useState<LatLngExpression>([51.505, -0.09]);

  return (
    <div className="h-[400px] w-full overflow-hidden rounded-md">
      <MapContainer
        center={position}
        zoom={13}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url={`https://maps.geoapify.com/v1/tile/osm-carto/{z}/{x}/{y}.png?apiKey=${process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY}`}
          attribution="&copy; OpenStreetMap contributors, Geoapify"
        />
        <DraggableMarker position={position} setPosition={setPosition} />
      </MapContainer>
    </div>
  );
}

export default DraggableMapPin;
