'use client';

//Map component Component from library
import { GoogleMap } from '@react-google-maps/api';

//Map's styling
export const defaultMapContainerStyle = {
  width: '100%',
  height: '80vh',
  borderRadius: '15px 0px 0px 15px',
};

const MapComponent = ({ lat: number, long: number }) => {
  let mapCenter = {
    lat,
    long,
  };

  return (
    <div className="w-full">
      <GoogleMap center={mapCenter} mapContainerStyle={defaultMapContainerStyle}></GoogleMap>
    </div>
  );
};

export { MapComponent };
