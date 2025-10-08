import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/api.js';
import './AlbumViewer.css';

const AlbumViewer = () => {
  const { albumId } = useParams();
  const navigate = useNavigate();
  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);

  useEffect(() => {
    loadAlbum();
  }, [albumId]);

  const loadAlbum = async () => {
    try {
      const response = await api.get(`/api/public/albums/${albumId}`);
      setAlbum(response.data);
    } catch (error) {
      console.error('Error loading album:', error);
    }
    setLoading(false);
  };

  const openLightbox = (index) => {
    setLightboxIndex(index);
    setShowLightbox(true);
  };

  const closeLightbox = () => {
    setShowLightbox(false);
  };

  const navigateLightbox = (direction) => {
    const totalImages = album.images.length;
    if (direction === 'next') {
      setLightboxIndex((prevIndex) => (prevIndex + 1) % totalImages);
    } else if (direction === 'prev') {
      setLightboxIndex((prevIndex) => (prevIndex - 1 + totalImages) % totalImages);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowRight') {
      navigateLightbox('next');
    } else if (e.key === 'ArrowLeft') {
      navigateLightbox('prev');
    }
  };

  useEffect(() => {
    if (showLightbox) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [showLightbox, lightboxIndex]);

  if (loading) {
    return (
      <div className="album-viewer-loading">
        <div className="loading-spinner"></div>
        <p>Loading album...</p>
      </div>
    );
  }

  if (!album) {
    return (
      <div className="album-viewer-error">
        <h2>Album not found</h2>
        <button onClick={() => navigate('/')} className="back-btn">
          ← Back to Home
        </button>
      </div>
    );
  }

  const getCategoryColor = (category) => {
    const colors = {
      academic: '#3b82f6',
      sports: '#ef4444',
      cultural: '#8b5cf6',
      events: '#10b981',
      graduation: '#f59e0b',
      general: '#6b7280'
    };
    return colors[category] || colors.general;
  };

  return (
    <div className="album-viewer">
      {/* Header */}
      <div className="album-header">
        <div className="container">
          <button onClick={() => navigate('/')} className="back-btn">
            ← Back to Home
          </button>
          
          <div className="album-info">
            <div className="album-category" style={{ backgroundColor: getCategoryColor(album.category) }}>
              {album.category.charAt(0).toUpperCase() + album.category.slice(1)}
            </div>
            <h1 className="album-title">{album.title}</h1>
            <p className="album-description">{album.description}</p>
            <div className="album-meta">
              <span className="album-date">
                📅 {new Date(album.date).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </span>
              <span className="album-count">
                📸 {album.images?.length || album.photoCount || 0} photos
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Photo Grid */}
      <div className="album-content">
        <div className="container">
          {album.images && album.images.length > 0 ? (
            <div className="photo-grid">
              {album.images.map((image, index) => (
                <div 
                  key={index} 
                  className="photo-item"
                  onClick={() => openLightbox(index)}
                >
                  <img 
                    src={image.startsWith('http') ? image : `http://localhost:3001${image}`} 
                    alt={`${album.title} - Photo ${index + 1}`}
                    loading="lazy"
                  />
                  <div className="photo-overlay">
                    <span className="view-icon">🔍</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-photos">
              <div className="no-photos-icon">📷</div>
              <h3>No photos yet</h3>
              <p>Photos for this album will be added soon.</p>
            </div>
          )}
        </div>
      </div>

      {/* Lightbox */}
      {showLightbox && album.images && album.images.length > 0 && (
        <div className="lightbox-overlay" onClick={closeLightbox}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" onClick={closeLightbox}>
              ✕
            </button>
            
            {album.images.length > 1 && (
              <>
                <button 
                  className="lightbox-nav lightbox-prev" 
                  onClick={() => navigateLightbox('prev')}
                >
                  ‹
                </button>
                <button 
                  className="lightbox-nav lightbox-next" 
                  onClick={() => navigateLightbox('next')}
                >
                  ›
                </button>
              </>
            )}
            
            <img 
              src={album.images[lightboxIndex].startsWith('http') 
                ? album.images[lightboxIndex] 
                : `http://localhost:3001${album.images[lightboxIndex]}`
              } 
              alt={`${album.title} - Photo ${lightboxIndex + 1}`}
              className="lightbox-image"
            />
            
            <div className="lightbox-info">
              <span className="lightbox-counter">
                {lightboxIndex + 1} / {album.images.length}
              </span>
              <span className="lightbox-title">{album.title}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlbumViewer;
