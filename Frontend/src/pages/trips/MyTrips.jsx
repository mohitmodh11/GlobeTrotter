import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTrips } from '../../context/TripContext';
import { TripCard } from '../../components/trips/TripCard';
import { formatCurrency } from '../../utils/formatCurrency';
import { Button } from '../../components/common/Button';
import { EmptyState } from '../../components/common/EmptyState';
import {
  Plus,
  Search,
  SlidersHorizontal,
  LayoutGrid,
  List as ListIcon,
  Plane,
  Calendar,
  MapPin,
} from 'lucide-react';

export const MyTrips = () => {
  const { trips } = useTrips();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('ALL'); // 'ALL' | 'Upcoming' | 'In Progress' | 'Completed' | 'Draft'
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date-asc'); // 'date-asc' | 'date-desc' | 'budget-high' | 'name'
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

  // Filter trips
  const filteredTrips = trips.filter((trip) => {
    // Tab filter
    if (activeTab !== 'ALL' && trip.status !== activeTab) {
      return false;
    }
    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = trip.name.toLowerCase().includes(q);
      const matchDesc = trip.description?.toLowerCase().includes(q);
      const matchStop = (trip.stops || []).some(
        (s) => s.cityName.toLowerCase().includes(q) || s.country?.toLowerCase().includes(q)
      );
      return matchName || matchDesc || matchStop;
    }
    return true;
  });

  // Sort trips
  const sortedTrips = [...filteredTrips].sort((a, b) => {
    if (sortBy === 'date-asc') {
      return new Date(a.startDate || 0) - new Date(b.startDate || 0);
    }
    if (sortBy === 'date-desc') {
      return new Date(b.startDate || 0) - new Date(a.startDate || 0);
    }
    if (sortBy === 'budget-high') {
      return (Number(b.targetBudget) || 0) - (Number(a.targetBudget) || 0);
    }
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    }
    return 0;
  });

  const tabCounts = {
    ALL: trips.length,
    Upcoming: trips.filter((t) => t.status === 'Upcoming').length,
    'In Progress': trips.filter((t) => t.status === 'In Progress').length,
    Completed: trips.filter((t) => t.status === 'Completed').length,
    Draft: trips.filter((t) => t.status === 'Draft').length,
  };

  return (
    <div>
      {/* Page Header */}
      <div className="section-header" style={{ marginBottom: '24px' }}>
        <div>
          <h1 className="section-title" style={{ fontSize: '1.75rem' }}>
            My Travel Itineraries
          </h1>
          <p className="section-subtitle">
            Manage, organize, and monitor all your customized multi-city adventures.
          </p>
        </div>
        <Button
          variant="primary"
          icon={Plus}
          onClick={() => navigate('/trips/new')}
        >
          Plan New Trip
        </Button>
      </div>

      {/* Filter Tabs, Search Bar, and View Controls */}
      <div
        style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '14px',
          padding: '16px',
          marginBottom: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        {/* Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div className="tabs-container">
            {['ALL', 'Upcoming', 'In Progress', 'Completed', 'Draft'].map((tab) => (
              <button
                key={tab}
                className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === 'ALL' ? 'All Trips' : tab}
                <span
                  style={{
                    fontSize: '0.6875rem',
                    padding: '1px 6px',
                    borderRadius: '9999px',
                    backgroundColor: activeTab === tab ? '#dcfce7' : '#e2e8f0',
                    color: activeTab === tab ? '#15803d' : '#64748b',
                  }}
                >
                  {tabCounts[tab] || 0}
                </span>
              </button>
            ))}
          </div>

          {/* View Mode Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <button
              onClick={() => setViewMode('grid')}
              style={{
                padding: '6px 10px',
                borderRadius: '6px',
                border: '1px solid',
                borderColor: viewMode === 'grid' ? '#15803d' : '#cbd5e1',
                backgroundColor: viewMode === 'grid' ? '#f0fdf4' : '#ffffff',
                color: viewMode === 'grid' ? '#15803d' : '#64748b',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '0.8125rem',
                fontWeight: 600,
              }}
            >
              <LayoutGrid size={15} /> Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              style={{
                padding: '6px 10px',
                borderRadius: '6px',
                border: '1px solid',
                borderColor: viewMode === 'list' ? '#15803d' : '#cbd5e1',
                backgroundColor: viewMode === 'list' ? '#f0fdf4' : '#ffffff',
                color: viewMode === 'list' ? '#15803d' : '#64748b',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '0.8125rem',
                fontWeight: 600,
              }}
            >
              <ListIcon size={15} /> List
            </button>
          </div>
        </div>

        {/* Search & Sort Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <div className="search-wrapper" style={{ flex: 1, minWidth: '220px' }}>
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Search by trip name, destination city, country..."
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '180px' }}>
            <span style={{ fontSize: '0.8125rem', color: '#64748b', whiteSpace: 'nowrap' }}>
              Sort by:
            </span>
            <select
              className="form-select"
              style={{ padding: '8px 12px', fontSize: '0.875rem' }}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="date-asc">Date (Earliest First)</option>
              <option value="date-desc">Date (Latest First)</option>
              <option value="budget-high">Budget (High to Low)</option>
              <option value="name">Name (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Trips Display */}
      {sortedTrips.length > 0 ? (
        viewMode === 'grid' ? (
          <div className="grid-3">
            {sortedTrips.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        ) : (
          /* List Mode */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {sortedTrips.map((trip) => (
              <div
                key={trip.id}
                className="card card-hover"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '16px 20px',
                  backgroundColor: '#ffffff',
                  gap: '20px',
                  flexWrap: 'wrap',
                  cursor: 'pointer',
                }}
                onClick={() => navigate(`/trips/${trip.id}`)}
              >
                <img
                  src={trip.coverImage}
                  alt={trip.name}
                  style={{
                    width: '100px',
                    height: '70px',
                    borderRadius: '8px',
                    objectFit: 'cover',
                    flexShrink: 0,
                  }}
                />
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, color: '#0f172a' }}>
                      {trip.name}
                    </h3>
                    <span
                      style={{
                        fontSize: '0.6875rem',
                        fontWeight: 700,
                        backgroundColor: '#f0fdf4',
                        color: '#15803d',
                        padding: '2px 8px',
                        borderRadius: '9999px',
                        border: '1px solid #bbf7d0',
                      }}
                    >
                      {trip.status}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.8125rem', color: '#64748b' }}>
                    {trip.startDate} to {trip.endDate} • {trip.stops?.length || 0} stops
                  </p>
                </div>

                <div style={{ textAlign: 'right', minWidth: '120px' }}>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Budget Target</span>
                  <p style={{ fontSize: '1rem', fontWeight: 800, color: '#15803d' }}>
                    {formatCurrency(trip.targetBudget, trip.currency)}
                  </p>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/trips/${trip.id}/builder`);
                  }}
                >
                  Edit Plan
                </Button>
              </div>
            ))}
          </div>
        )
      ) : (
        <EmptyState
          icon={Plane}
          title="No matching trips found"
          description={
            searchQuery
              ? `No itineraries matching "${searchQuery}". Try clearing search filters.`
              : 'You have no trips in this category yet. Plan a new trip now!'
          }
          actionLabel={searchQuery ? 'Clear Search' : 'Plan New Trip'}
          onAction={() => {
            if (searchQuery) setSearchQuery('');
            else navigate('/trips/new');
          }}
        />
      )}
    </div>
  );
};
