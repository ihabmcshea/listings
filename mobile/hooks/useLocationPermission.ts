import { useEffect, useState } from 'react';
import * as Location from 'expo-location';

export const useLocationPermission = () => {
  const [permissionStatus, setPermissionStatus] = useState<Location.PermissionResponse | null>(null);

  useEffect(() => {
    const requestPermission = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setPermissionStatus(status);
    };

    requestPermission();
  }, []);

  return permissionStatus;
};
