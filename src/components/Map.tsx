import React, { useRef, useEffect, useState, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import { mapboxgl } from '../lib/mapbox';
import { Plus } from 'lucide-react';
import { Button } from './ui/Button';
import AddMemoryDialog from './memories/AddMemoryDialog';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import MemoryMarker from './memories/MemoryMarker';
import type { Memory } from '../types/memory';

export function Map() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<{ [key: string]: { marker: mapboxgl.Marker; root: ReturnType<typeof createRoot>; element: HTMLDivElement } }>({});
  const [showAddMemory, setShowAddMemory] = useState(false);
  const [memories, setMemories] = useState<Memory[]>([]);
  const { user } = useAuth();

  // Amélioration de la gestion des marqueurs
  const updateMarker = useCallback((memory: Memory) => {
    if (!map.current) return;

    // Supprimer l'ancien marqueur s'il existe
    if (markersRef.current[memory.id]) {
      const { marker, root, element } = markersRef.current[memory.id];
      marker.remove();
      setTimeout(() => {
        root.unmount();
        delete markersRef.current[memory.id];
      }, 0);
    }

    // Créer un nouveau marqueur
    const element = document.createElement('div');
    const root = createRoot(element);
    
    root.render(
      <MemoryMarker
        memory={memory}
        onClick={() => {
          if (map.current) {
            map.current.flyTo({
              center: [memory.location.lng, memory.location.lat],
              zoom: 15,
              duration: 1000,
            });
          }
        }}
      />
    );

    const marker = new mapboxgl.Marker({
      element,
      anchor: 'center',
    })
      .setLngLat([memory.location.lng, memory.location.lat])
      .addTo(map.current);

    markersRef.current[memory.id] = { marker, root, element };
  }, []);

  // Nettoyage des marqueurs
  const cleanupMarkers = useCallback(() => {
    Object.values(markersRef.current).forEach(({ marker, root, element }) => {
      marker.remove();
      setTimeout(() => {
        root.unmount();
      }, 0);
    });
    markersRef.current = {};
  }, []);

  // Initialisation de la carte
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [2.3488, 48.8534],
      zoom: 12,
    });

    map.current.addControl(new mapboxgl.NavigationControl());
    map.current.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        trackUserLocation: true,
        showUserHeading: true,
      })
    );

    return () => {
      cleanupMarkers();
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [cleanupMarkers]);

  // Souscription aux souvenirs
  useEffect(() => {
    if (!user || !map.current) return;

    const q = query(
      collection(db, 'memories'),
      where('userId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newMemories: Memory[] = [];
      snapshot.forEach((doc) => {
        newMemories.push({ id: doc.id, ...doc.data() } as Memory);
      });
      setMemories(newMemories);

      // Ajuster la vue pour inclure tous les marqueurs
      if (newMemories.length > 0) {
        const bounds = new mapboxgl.LngLatBounds();
        newMemories.forEach((memory) => {
          bounds.extend([memory.location.lng, memory.location.lat]);
        });

        map.current?.fitBounds(bounds, {
          padding: { top: 50, bottom: 50, left: 50, right: 50 },
          maxZoom: 15,
          duration: 2000,
        });
      }
    });

    return () => {
      unsubscribe();
      cleanupMarkers();
    };
  }, [user, cleanupMarkers]);

  // Mise à jour des marqueurs
  useEffect(() => {
    memories.forEach(updateMarker);
  }, [memories, updateMarker]);

  return (
    <>
      <div ref={mapContainer} className="w-full h-full" />
      
      <div className="absolute bottom-20 right-4 z-10">
        <Button
          onClick={() => setShowAddMemory(true)}
          className="rounded-full w-14 h-14 shadow-lg"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>

      <AddMemoryDialog
        isOpen={showAddMemory}
        onClose={() => setShowAddMemory(false)}
      />
    </>
  );
}