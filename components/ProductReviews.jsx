"use client";
import React, { useState, useEffect } from 'react';
import ReviewForm from './ReviewForm';
import ReviewsList from './ReviewsList';
import { useUser } from '@clerk/nextjs';

const ProductReviews = ({ productId }) => {
  const { user } = useUser();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviewStats, setReviewStats] = useState({ averageRating: 0, totalReviews: 0 });
  const [userHasOrdered, setUserHasOrdered] = useState(false);
  const [userHasReviewed, setUserHasReviewed] = useState(false);

  // Fetch reviews when component mounts
  useEffect(() => {
    if (productId) {
      fetchReviews();
      if (user) {
        checkUserOrderStatus();
      }
    }
  }, [productId, user]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/reviews?productId=${productId}&limit=50`);
      const data = await response.json();

      if (data.success) {
        setReviews(data.reviews);
        setReviewStats(data.stats);
        
        // Check if current user has already reviewed
        if (user) {
          const userReview = data.reviews.find(review => review.userId === user.id);
          setUserHasReviewed(!!userReview);
        }
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setError('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const checkUserOrderStatus = async () => {
    try {
      // This would need an API endpoint to check if user has ordered the product
      // For now, we'll assume they can review (you can implement this later)
      setUserHasOrdered(true);
    } catch (error) {
      console.error('Error checking order status:', error);
    }
  };

  const handleReviewSubmitted = (newReview) => {
    // Add the new review to the top of the list
    setReviews(prev => [newReview, ...prev]);
    setUserHasReviewed(true);
    
    // Update stats
    const newTotal = reviewStats.totalReviews + 1;
    const newAverage = ((reviewStats.averageRating * reviewStats.totalReviews) + newReview.rating) / newTotal;
    setReviewStats({
      averageRating: Math.round(newAverage * 10) / 10,
      totalReviews: newTotal
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
        <p className="text-red-800 dark:text-red-200">
          Error loading reviews: {error}
        </p>
        <button 
          onClick={fetchReviews}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 ">
      {/* Section Header */}
      <div className="border-b border-gray-200 dark:border-gray-500 pb-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-500">
          Customer Reviews
        </h2>
        {reviewStats.totalReviews > 0 && (
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            {reviewStats.averageRating} out of 5 stars • {reviewStats.totalReviews} review{reviewStats.totalReviews !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      {/* Review Form - Only show if user is logged in and hasn't reviewed yet */}
      {user && !userHasReviewed && (
        <div>
          <ReviewForm 
            productId={productId}
            onReviewSubmitted={handleReviewSubmitted}
            isVerifiedPurchase={userHasOrdered}
          />
        </div>
      )}

      {/* Message if user has already reviewed */}
      {user && userHasReviewed && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <p className="text-blue-800 dark:text-blue-200">
            Thank you for your review! You have already reviewed this product.
          </p>
        </div>
      )}

      {/* Reviews List */}
      <div>
        <ReviewsList 
          productId={productId}
          reviews={reviews}
          onReviewsUpdate={fetchReviews}
        />
      </div>
    </div>
  );
};

export default ProductReviews;