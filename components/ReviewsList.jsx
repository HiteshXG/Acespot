"use client";
import React, { useState, useEffect } from 'react';
import StarRating from './StarRating';
import { formatDistanceToNow } from 'date-fns';

const ReviewsList = ({ productId, reviews, onReviewsUpdate }) => {
  const [sortBy, setSortBy] = useState('newest');
  const [filterBy, setFilterBy] = useState('all');
  const [sortedReviews, setSortedReviews] = useState([]);

  useEffect(() => {
    let filtered = [...reviews];
    
    // Filter reviews
    if (filterBy !== 'all') {
      const rating = parseInt(filterBy);
      filtered = filtered.filter(review => review.rating === rating);
    }
    
    // Sort reviews
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.date) - new Date(a.date);
        case 'oldest':
          return new Date(a.date) - new Date(b.date);
        case 'highest':
          return b.rating - a.rating;
        case 'lowest':
          return a.rating - b.rating;
        case 'helpful':
          return b.helpful - a.helpful;
        default:
          return 0;
      }
    });
    
    setSortedReviews(filtered);
  }, [reviews, sortBy, filterBy]);

  const formatDate = (dateString) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return 'Recently';
    }
  };

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(review => {
      distribution[review.rating]++;
    });
    return distribution;
  };

  const getAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  const distribution = getRatingDistribution();
  const averageRating = getAverageRating();

  if (reviews.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-200 rounded-lg border border-gray-200 dark:border-gray-700 p-8 text-center">
        <div className="text-gray-500 dark:text-gray-500">
          <h3 className="text-lg font-semibold mb-2">No Reviews Yet</h3>
          <p>Be the first to review this product!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Average Rating */}
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              {averageRating}
            </div>
            <StarRating rating={parseFloat(averageRating)} readonly size="lg" showRating={false} />
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
              Based on {reviews.length} review{reviews.length !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Rating Distribution */}
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = distribution[rating];
              const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
              
              return (
                <div key={rating} className="flex items-center gap-3 text-sm">
                  <span className="text-gray-600 dark:text-gray-300 w-8">
                    {rating}★
                  </span>
                  <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-gray-600 dark:text-gray-300 w-8">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Filters and Sort */}
      <div className="flex flex-wrap gap-4 items-center justify-between bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-2">
              Filter:
            </label>
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All ratings</option>
              <option value="5">5 stars</option>
              <option value="4">4 stars</option>
              <option value="3">3 stars</option>
              <option value="2">2 stars</option>
              <option value="1">1 star</option>
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
              <option value="helpful">Most helpful</option>
            </select>
          </div>
        </div>
        
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Showing {sortedReviews.length} of {reviews.length} reviews
        </p>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {sortedReviews.map((review) => (
          <div
            key={review._id}
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {review.userName}
                  </h4>
                  {review.isVerifiedPurchase && (
                    <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs rounded-full">
                      Verified Purchase
                    </span>
                  )}
                </div>
                <StarRating rating={review.rating} readonly size="sm" showRating={false} />
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {formatDate(review.date)}
              </span>
            </div>
            
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              {review.comment}
            </p>
            
            {review.helpful > 0 && (
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <span>👍</span>
                <span>{review.helpful} people found this helpful</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewsList;