"use client";
import React, { useState, useEffect } from 'react';
import StarRating from '../StarRating';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';

const SellerReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalReviews: 0,
    averageRating: 0,
    reportedCount: 0
  });
  const [filter, setFilter] = useState('all'); // 'all', 'active', 'reported', 'hidden'
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/reviews/seller');
      const data = await response.json();

      if (data.success) {
        setReviews(data.reviews);
        setStats(data.stats);
      } else {
        toast.error(data.message || 'Failed to fetch reviews');
      }
    } catch (error) {
      toast.error('Failed to fetch reviews');
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewAction = async (reviewId, action) => {
    try {
      const response = await fetch('/api/reviews/seller', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reviewId, action }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message);
        // Update the review in the local state
        setReviews(prev => 
          prev.map(review => 
            review._id === reviewId 
              ? { ...review, status: data.review.status }
              : review
          )
        );
      } else {
        toast.error(data.message || 'Failed to update review');
      }
    } catch (error) {
      toast.error('Failed to update review');
      console.error('Error updating review:', error);
    }
  };

  const formatDate = (dateString) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return 'Recently';
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      active: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200',
      reported: 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200',
      hidden: 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status] || styles.active}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const filteredReviews = reviews.filter(review => {
    if (filter === 'all') return true;
    return review.status === filter;
  });

  const sortedReviews = filteredReviews.sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.date) - new Date(a.date);
      case 'oldest':
        return new Date(a.date) - new Date(b.date);
      case 'highest':
        return b.rating - a.rating;
      case 'lowest':
        return a.rating - b.rating;
      default:
        return 0;
    }
  });

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-white dark:bg-gray-900 transition-colors">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Review Management
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Manage customer reviews for your products
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">
            Total Reviews
          </h3>
          <p className="text-3xl font-bold text-blue-900 dark:text-blue-100 mt-2">
            {stats.totalReviews}
          </p>
        </div>

        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-green-900 dark:text-green-100">
            Average Rating
          </h3>
          <div className="flex items-center gap-2 mt-2">
            <p className="text-3xl font-bold text-green-900 dark:text-green-100">
              {stats.averageRating || '0.0'}
            </p>
            <StarRating rating={stats.averageRating || 0} readonly size="sm" showRating={false} />
          </div>
        </div>

        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-red-900 dark:text-red-100">
            Reported Reviews
          </h3>
          <p className="text-3xl font-bold text-red-900 dark:text-red-100 mt-2">
            {stats.reportedCount}
          </p>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="flex flex-wrap gap-4 items-center justify-between bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-2">
              Filter:
            </label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Reviews</option>
              <option value="active">Active</option>
              <option value="reported">Reported</option>
              <option value="hidden">Hidden</option>
            </select>
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-2">
              Sort:
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm dark:bg-gray-700 dark:text-white"
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="highest">Highest rating</option>
              <option value="lowest">Lowest rating</option>
            </select>
          </div>
        </div>
        
        <button
          onClick={fetchReviews}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Refresh
        </button>
      </div>

      {/* Reviews List */}
      {sortedReviews.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            {filter === 'all' ? 'No reviews found' : `No ${filter} reviews found`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedReviews.map((review) => (
            <div
              key={review._id}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {review.userName}
                    </h4>
                    {review.isVerifiedPurchase && (
                      <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs rounded-full">
                        Verified Purchase
                      </span>
                    )}
                    {getStatusBadge(review.status)}
                  </div>
                  
                  <div className="flex items-center gap-2 mb-2">
                    <StarRating rating={review.rating} readonly size="sm" showRating={false} />
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(review.date)}
                    </span>
                  </div>

                  {review.productId && (
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                      Product: {review.productId.name}
                    </p>
                  )}
                </div>
              </div>
              
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                {review.comment}
              </p>
              
              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2">
                {review.status === 'active' && (
                  <button
                    onClick={() => handleReviewAction(review._id, 'hide')}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    Hide
                  </button>
                )}
                
                {review.status === 'hidden' && (
                  <button
                    onClick={() => handleReviewAction(review._id, 'show')}
                    className="px-3 py-1 bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-200 text-sm rounded hover:bg-green-200 dark:hover:bg-green-700 transition-colors"
                  >
                    Show
                  </button>
                )}
                
                {review.status !== 'reported' && (
                  <button
                    onClick={() => handleReviewAction(review._id, 'report')}
                    className="px-3 py-1 bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-200 text-sm rounded hover:bg-red-200 dark:hover:bg-red-700 transition-colors"
                  >
                    Report
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SellerReviews;