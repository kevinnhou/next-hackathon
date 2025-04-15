"use client";

import React, { useEffect, useRef, useState } from "react";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { LatLngExpression, Marker as LeafletMarker } from "leaflet";
import L from "leaflet";
import markerIconPng from "leaflet/dist/images/marker-icon.png";

// Add console log to verify component is loaded
console.log("Map component loaded");

interface DraggableMapPinProps {
  value: { lat: number; lng: number };
  onChange: (location: { lat: number; lng: number }) => void;
}

// Create custom marker icon
const customIcon = new L.Icon({
  iconUrl: markerIconPng?.src ?? markerIconPng,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// DraggableMarker component defined outside of the main component for better readability and performance
const DraggableMarker: React.FC<{
  position: LatLngExpression;
  onChange: (location: { lat: number; lng: number }) => void;
}> = ({ position, onChange }) => {
  const markerRef = useRef<LeafletMarker>(null);

  useMapEvents({
    click(e) {
      const newPos = { lat: e.latlng.lat, lng: e.latlng.lng };
      console.log("Map clicked at:", newPos);
      onChange(newPos);
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
            console.log("Marker dragged to:", { lat, lng });
            onChange({ lat, lng });
          }
        },
      }}
      ref={markerRef}
    />
  );
};

const DraggableMapPin: React.FC<DraggableMapPinProps> = ({
  value,
  onChange,
}) => {
  const [position, setPosition] = useState<LatLngExpression>([
    value.lat,
    value.lng,
  ]);

  useEffect(() => {
    console.log("Map position updated:", value);
    setPosition([value.lat, value.lng]);
  }, [value.lat, value.lng]);

  // Log Geoapify API key (first few characters only)
  const apiKey = process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY;
  console.log(
    "Geoapify API key available:",
    apiKey ? `${apiKey.substring(0, 4)}...` : "No API key found",
  );

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
        <DraggableMarker position={position} onChange={onChange} />
      </MapContainer>
    </div>
  );
};

export default DraggableMapPin;
