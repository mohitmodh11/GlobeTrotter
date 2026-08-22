import React, { useState } from 'react';
import { useTrips } from '../../context/TripContext';
import { ActivityCard } from '../../components/search/ActivityCard';
import { EmptyState } from '../../components/common/EmptyState';
import { Button } from '../../components/common/Button';
import { ACTIVITY_CATEGORIES } from '../../utils/constants';
import { Search, Sparkles, SlidersHorizontal, MapPin } from 'lucide-react';

export const ActivitySearchPage = () => {
  const { activities, cities } = useTrips();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedCity, setSelectedCity] = useState('ALL');
  const [selectedPriceRange, setSelectedPriceRange] = useState('ALL');

  const filteredActivities = activities.filter((act) => {
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = act.title.toLowerCase().includes(q);
      const matchCity = act.cityName.toLowerCase().includes(q);
      const matchDesc = act.description?.toLowerCase().includes(q);
      if (!matchTitle && !matchCity && !matchDesc) return false;
    }

    // Category
    if (selectedCategory !== 'ALL' && act.category !== selectedCategory) {
      return false;
    }

    // City
    if (selectedCity !== 'ALL' && act.cityName !== selectedCity) {
      return false;
    }

    // Price
    if (selectedPriceRange === 'free' && act.cost > 0) return false;
    if (selectedPriceRange === 'under4000' && (act.cost <= 0 || act.cost > 4000)) return false;
    if (selectedPriceRange === '4000plus' && act.cost < 4000) return false;

    return true;
  });

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('ALL');
    setSelectedCity('ALL');
    setSelectedPriceRange('ALL');
  };

  return (
    <div>
      {/* Header */}
      <div className="section-header" style={{ marginBottom: '24px' }}>
        <div>
          <h1 className="section-title" style={{ fontSize: '1.75rem' }}>
            Discover Things to Do & Experiences
          </h1>
          <p className="section-subtitle">
            Find guided tours, foodie excursions, adventure hikes, and cultural monuments.
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
            placeholder="Search activities, tours, food tastings, or landmarks..."
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Category Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#64748b', marginRight: '4px' }}>
            Category:
          </span>
          <button
            onClick={() => setSelectedCategory('ALL')}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              border: '1px solid',
              borderColor: selectedCategory === 'ALL' ? '#15803d' : '#cbd5e1',
              backgroundColor: selectedCategory === 'ALL' ? '#f0fdf4' : '#ffffff',
              color: selectedCategory === 'ALL' ? '#15803d' : '#475569',
              fontSize: '0.8125rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            All Categories
          </button>
          {ACTIVITY_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                border: '1px solid',
                borderColor: selectedCategory === cat.id ? '#15803d' : '#cbd5e1',
                backgroundColor: selectedCategory === cat.id ? '#f0fdf4' : '#ffffff',
                color: selectedCategory === cat.id ? '#15803d' : '#475569',
                fontSize: '0.8125rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* City & Price Selectors */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            flexWrap: 'wrap',
            borderTop: '1px solid #f1f5f9',
            paddingTop: '14px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#64748b' }}>
              Destination City:
            </span>
            <select
              className="form-select"
              style={{ padding: '6px 12px', fontSize: '0.8125rem', width: 'auto' }}
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
            >
              <option value="ALL">All Cities</option>
              {cities.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name} ({c.country})
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#64748b' }}>
              Pricing:
            </span>
            <select
              className="form-select"
              style={{ padding: '6px 12px', fontSize: '0.8125rem', width: 'auto' }}
              value={selectedPriceRange}
              onChange={(e) => setSelectedPriceRange(e.target.value)}
            >
              <option value="ALL">Any Price</option>
              <option value="free">Free Activities (₹0)</option>
              <option value="under4000">Under ₹4,000</option>
              <option value="4000plus">₹4,000 and above</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#64748b' }}>
          Showing {filteredActivities.length} experience{filteredActivities.length !== 1 ? 's' : ''}
        </p>
        {(searchQuery || selectedCategory !== 'ALL' || selectedCity !== 'ALL' || selectedPriceRange !== 'ALL') && (
          <Button variant="ghost" size="sm" onClick={handleResetFilters}>
            Reset Filters
          </Button>
        )}
      </div>

      {/* Activities Grid */}
      {filteredActivities.length > 0 ? (
        <div className="grid-3">
          {filteredActivities.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Sparkles}
          title="No experiences match your filters"
          description="Try broadening your search or resetting category filters."
          actionLabel="Clear Filters"
          onAction={handleResetFilters}
        />
      )}
    </div>
  );
};
