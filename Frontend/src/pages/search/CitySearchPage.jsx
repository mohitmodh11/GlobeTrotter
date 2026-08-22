import React, { useState } from 'react';
import { useTrips } from '../../context/TripContext';
import { CityCard } from '../../components/search/CityCard';
import { EmptyState } from '../../components/common/EmptyState';
import { Button } from '../../components/common/Button';
import { Search, MapPin, SlidersHorizontal, Sparkles } from 'lucide-react';

export const CitySearchPage = () => {
  const { cities } = useTrips();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('ALL');
  const [selectedCostIndex, setSelectedCostIndex] = useState('ALL');
  const [selectedTag, setSelectedTag] = useState('ALL');

  const regions = ['ALL', 'Europe', 'Asia', 'Americas', 'Africa', 'Oceania'];
  const costLevels = ['ALL', '₹', '₹₹', '₹₹₹'];
  const popularTags = ['ALL', 'Culture', 'Food', 'Nature', 'Beaches', 'Architecture', 'Museums'];

  const filteredCities = cities.filter((city) => {
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = city.name.toLowerCase().includes(q);
      const matchCountry = city.country.toLowerCase().includes(q);
      const matchDesc = city.description.toLowerCase().includes(q);
      if (!matchName && !matchCountry && !matchDesc) return false;
    }

    // Region filter
    if (selectedRegion !== 'ALL' && city.region !== selectedRegion) {
      return false;
    }

    // Cost Index filter
    if (selectedCostIndex !== 'ALL' && city.costIndex !== selectedCostIndex) {
      return false;
    }

    // Tag filter
    if (selectedTag !== 'ALL' && !city.tags?.includes(selectedTag)) {
      return false;
    }

    return true;
  });

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedRegion('ALL');
    setSelectedCostIndex('ALL');
    setSelectedTag('ALL');
  };

  return (
    <div>
      {/* Header */}
      <div className="section-header" style={{ marginBottom: '24px' }}>
        <div>
          <h1 className="section-title" style={{ fontSize: '1.75rem' }}>
            Explore Destination Cities
          </h1>
          <p className="section-subtitle">
            Search world destinations, compare daily living costs, and add them into your itineraries.
          </p>
        </div>
      </div>

      {/* Filter and Search Container */}
      <div
        style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '16px',
          padding: '20px',
          marginBottom: '28px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        {/* Search Bar */}
        <div className="search-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search by city name, country, or keyword (e.g. Paris, Japan, Temples)..."
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Region & Cost Filters */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '14px',
          }}
        >
          {/* Region Tabs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#64748b', marginRight: '4px' }}>
              Region:
            </span>
            {regions.map((reg) => (
              <button
                key={reg}
                onClick={() => setSelectedRegion(reg)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: '1px solid',
                  borderColor: selectedRegion === reg ? '#15803d' : '#cbd5e1',
                  backgroundColor: selectedRegion === reg ? '#f0fdf4' : '#ffffff',
                  color: selectedRegion === reg ? '#15803d' : '#475569',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {reg === 'ALL' ? 'All Regions' : reg}
              </button>
            ))}
          </div>

          {/* Cost Index Chips */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#64748b', marginRight: '4px' }}>
              Cost Index:
            </span>
            {costLevels.map((cost) => (
              <button
                key={cost}
                onClick={() => setSelectedCostIndex(cost)}
                style={{
                  padding: '6px 10px',
                  borderRadius: '6px',
                  border: '1px solid',
                  borderColor: selectedCostIndex === cost ? '#15803d' : '#cbd5e1',
                  backgroundColor: selectedCostIndex === cost ? '#f0fdf4' : '#ffffff',
                  color: selectedCostIndex === cost ? '#15803d' : '#475569',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {cost === 'ALL' ? 'Any Cost' : cost}
              </button>
            ))}
          </div>
        </div>

        {/* Travel Interest Tags */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', borderTop: '1px solid #f1f5f9', paddingTop: '12px' }}>
          <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#64748b', marginRight: '4px' }}>
            Interests:
          </span>
          {popularTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              style={{
                padding: '4px 10px',
                borderRadius: '9999px',
                border: '1px solid',
                borderColor: selectedTag === tag ? '#15803d' : '#e2e8f0',
                backgroundColor: selectedTag === tag ? '#15803d' : '#f8fafc',
                color: selectedTag === tag ? '#ffffff' : '#475569',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {tag === 'ALL' ? 'All Interests' : tag}
            </button>
          ))}
        </div>
      </div>

      {/* Results Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#64748b' }}>
          Showing {filteredCities.length} destination{filteredCities.length !== 1 ? 's' : ''}
        </p>
        {(searchQuery || selectedRegion !== 'ALL' || selectedCostIndex !== 'ALL' || selectedTag !== 'ALL') && (
          <Button variant="ghost" size="sm" onClick={handleResetFilters}>
            Reset Filters
          </Button>
        )}
      </div>

      {/* Cities Grid */}
      {filteredCities.length > 0 ? (
        <div className="grid-3">
          {filteredCities.map((city) => (
            <CityCard key={city.id} city={city} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={MapPin}
          title="No cities match your criteria"
          description="Try clearing or adjusting your search keywords and filters."
          actionLabel="Clear All Filters"
          onAction={handleResetFilters}
        />
      )}
    </div>
  );
};
