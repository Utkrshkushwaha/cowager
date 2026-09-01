import React, { useEffect, useState, useCallback, useRef } from 'react';
import API from '../api/axios';
import WorkerCard from '../components/WorkerCard';
import LoadingSpinner from '../components/LoadingSpinner';

const categories = [
  'all','electrician','plumber','carpenter','painter',
  'cleaner','driver','gardener','caregiver','technician','domestic_helper'
];

const Workers = () => {
  const [workers, setWorkers]               = useState([]);
  const [filtered, setFiltered]             = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch]                 = useState('');
  const [onlyAvailable, setOnlyAvailable]   = useState(false);
  const [emergencyMode, setEmergencyMode]   = useState(false);
  const [loading, setLoading]               = useState(true);
  const [locationStatus, setLocationStatus] = useState('idle');
  const [userLocation, setUserLocation]     = useState(null);
  const locationFetched = useRef(false);

  // ── Fetch workers from server ──────────────────────────────────────────────
  const fetchWorkers = useCallback((lat, lng, emergency) => {
    setLoading(true);
    const params = new URLSearchParams();
    if (lat != null && lng != null) {
      params.set('lat', lat);
      params.set('lng', lng);
    }
    if (emergency) params.set('emergency', 'true');

    API.get(`/workers?${params.toString()}`)
      .then(res => {
        setWorkers(res.data);
        setFiltered(res.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // ── Auto-detect location on mount ─────────────────────────────────────────
  useEffect(() => {
    if (locationFetched.current) return;
    locationFetched.current = true;

    if (!navigator.geolocation) {
      setLocationStatus('denied');
      fetchWorkers(null, null, false);
      return;
    }

    setLocationStatus('detecting');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setUserLocation({ lat, lng });
        setLocationStatus('found');
        fetchWorkers(lat, lng, false);
      },
      () => {
        setLocationStatus('denied');
        fetchWorkers(null, null, false);
      },
      { timeout: 8000, maximumAge: 60000 }
    );
  }, [fetchWorkers]);

  // ── Re-fetch when emergency mode toggles ──────────────────────────────────
  useEffect(() => {
    // skip the very first render (auto-detect handles it)
    if (locationStatus === 'idle' || locationStatus === 'detecting') return;
    if (userLocation) {
      fetchWorkers(userLocation.lat, userLocation.lng, emergencyMode);
    } else {
      fetchWorkers(null, null, emergencyMode);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [emergencyMode]);

  // ── Manual re-detect ──────────────────────────────────────────────────────
  const detectLocation = () => {
    if (!navigator.geolocation) { setLocationStatus('denied'); return; }
    setLocationStatus('detecting');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setUserLocation({ lat, lng });
        setLocationStatus('found');
        fetchWorkers(lat, lng, emergencyMode);
      },
      () => {
        setLocationStatus('denied');
        fetchWorkers(null, null, emergencyMode);
      },
      { timeout: 8000 }
    );
  };

  // ── Client-side filter (category / search / available) ────────────────────
  useEffect(() => {
    let result = [...workers];
    if (activeCategory !== 'all')
      result = result.filter(w => w.category === activeCategory);
    if (onlyAvailable)
      result = result.filter(w => w.availabilityStatus === 'available');
    if (search)
      result = result.filter(w =>
        w.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
        w.skills?.some(s => s.toLowerCase().includes(search.toLowerCase()))
      );
    setFiltered(result);
  }, [activeCategory, onlyAvailable, search, workers]);

  // ── Derived counts ────────────────────────────────────────────────────────
  const availableCount = filtered.filter(w => w.availabilityStatus === 'available').length;
  const nearbyCount    = filtered.filter(w => w.distanceKm != null && w.distanceKm <= 5).length;

  // ── Location status bar ───────────────────────────────────────────────────
  const renderLocationBar = () => {
    if (locationStatus === 'detecting') return (
      <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 px-4 py-2.5 rounded-lg border border-gray-200">
        <div className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
        Detecting your location…
      </div>
    );

    if (locationStatus === 'found') return (
      <div className="flex items-center gap-3 flex-wrap">
        <span className="flex items-center gap-1.5 bg-green-50 text-green-700 border border-green-200 px-3 py-1.5 rounded-lg text-sm font-medium">
          ✅ Location detected
          {nearbyCount > 0 && (
            <span className="ml-1">· {nearbyCount} worker{nearbyCount > 1 ? 's' : ''} within 5 km</span>
          )}
        </span>
        <button onClick={detectLocation} className="text-xs text-gray-400 hover:text-gray-600 underline">
          Refresh location
        </button>
      </div>
    );

    if (locationStatus === 'denied') return (
      <div className="flex items-center gap-2 flex-wrap">
        <span className="flex items-center gap-1.5 bg-yellow-50 border border-yellow-200 text-yellow-700 px-3 py-1.5 rounded-lg text-sm">
          ⚠️ Location access denied — workers sorted by rating
        </span>
        <button
          onClick={detectLocation}
          className="text-xs text-primary-600 hover:underline font-medium"
        >
          Try again
        </button>
      </div>
    );

    // idle — shouldn't show long, auto-detect fires immediately
    return (
      <button
        onClick={detectLocation}
        className="flex items-center gap-2 px-4 py-2 bg-primary-50 border border-primary-200 text-primary-700 rounded-lg text-sm font-medium hover:bg-primary-100 transition-colors"
      >
        📍 Detect my location — show nearest workers first
      </button>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {/* ── Page Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Find Workers</h1>
          <p className="text-gray-500 mt-1">
            Verified cooperative workers —
            {userLocation ? ' sorted nearest to you first' : ' sorted by rating'}
          </p>
        </div>

        {/* Emergency toggle */}
        <button
          onClick={() => setEmergencyMode(e => !e)}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm transition-all shadow-sm ${
            emergencyMode
              ? 'bg-red-600 text-white shadow-red-200 shadow-md'
              : 'bg-white border-2 border-red-400 text-red-600 hover:bg-red-50'
          }`}
        >
          🚨 {emergencyMode ? 'Emergency Mode ON' : 'Emergency Mode'}
        </button>
      </div>

      {/* ── Emergency banner ── */}
      {emergencyMode && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
          <span className="text-2xl mt-0.5">🚨</span>
          <div>
            <p className="font-semibold text-red-800">Emergency Mode Active</p>
            <p className="text-sm text-red-600 mt-0.5">
              Showing only available workers, nearest first.
              {locationStatus === 'found'
                ? ' Your location is detected. ✅'
                : ' Enable location for distance-based sorting.'}
            </p>
          </div>
        </div>
      )}

      {/* ── Location bar ── */}
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-3 flex-wrap">
        {renderLocationBar()}

        {/* Stat pills — only when location found */}
        {locationStatus === 'found' && (
          <div className="flex gap-2 flex-wrap">
            <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
              {availableCount} available now
            </span>
            {nearbyCount > 0 && (
              <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
                📍 {nearbyCount} within 5 km
              </span>
            )}
          </div>
        )}
      </div>

      {/* ── Search & Available filter ── */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by name or skill…"
          className="input-field md:max-w-sm"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <label className="flex items-center gap-2 text-sm font-medium text-gray-600 cursor-pointer">
          <input
            type="checkbox"
            checked={onlyAvailable}
            onChange={e => setOnlyAvailable(e.target.checked)}
            className="w-4 h-4 accent-primary-600"
          />
          Available only
        </label>
      </div>

      {/* ── Category pills ── */}
      <div className="flex gap-2 flex-wrap mb-8">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-all ${
              activeCategory === cat
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-primary-300'
            }`}
          >
            {cat.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* ── Results ── */}
      {loading ? (
        <LoadingSpinner
          text={locationStatus === 'detecting' ? 'Finding nearest workers…' : 'Loading workers…'}
        />
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">👷</p>
          <p className="text-lg font-medium">No workers found</p>
          <p className="text-sm">
            {emergencyMode
              ? 'No available workers nearby. Try turning off emergency mode.'
              : 'Try adjusting your filters.'}
          </p>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-500 mb-6">
            {filtered.length} worker{filtered.length !== 1 ? 's' : ''} found
            {userLocation && ' · sorted by distance'}
            {emergencyMode && ' · emergency mode'}
          </p>

          {/* Section label when location is active */}
          {locationStatus === 'found' &&
            filtered.some(w => w.availabilityStatus === 'available') && (
            <div className="flex items-center gap-2 mb-5">
              <span className="text-sm font-semibold text-orange-600 whitespace-nowrap">
                🚨 Nearest Available Workers
              </span>
              <div className="flex-1 h-px bg-orange-100" />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((w, index) => (
              <WorkerCard key={w._id} worker={w} rank={index} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Workers;
