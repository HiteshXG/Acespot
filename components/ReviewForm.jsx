"use client";
import React, { useState } from 'react';
import StarRating from './StarRating';
import { useAppContext } from '@/context/AppContext';
import { useUser } from '@clerk/nextjs';
import toast from 'react-hot-toast';

const ReviewForm = ({ productId, onReviewSubmitted, isVerifiedPurchase = false }) => {
  const { user } = useUser();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please sign in to write a review');
      return;
    }

    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    if (comment.trim().length < 10) {
      toast.error('Review must be at least 10 characters long');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          rating,
          comment: comment.trim(),
          userId: user.id,
          userName: user.fullName || user.firstName || 'Anonymous',
          isVerifiedPurchase
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Review submitted successfully!');
        setRating(0);
        setComment('');
        onReviewSubmitted?.(data.review);
      } else {
        toast.error(data.message || 'Failed to submit review');
      }
    } catch (error) {
      toast.error('Failed to submit review. Please try again.');
      console.error('Review submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 text-center">
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Please sign in to write a review
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Write a Review
        {isVerifiedPurchase && (
          <span className="ml-2 px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs rounded-full">
            Verified Purchase
          </span>
        )}
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Rating *
          </label>
          <StarRating 
            rating={rating} 
            onRatingChange={setRating} 
            size="lg" 
            showRating={false}
          />
        </div>

        <div>
          <label htmlFor="review-comment" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Your Review *
          </label>
          <textarea
            id="review-comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience with this product..."
            rows={4}
            maxLength={1000}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white resize-none"
            required
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {comment.length}/1000 characters (minimum 10)
          </p>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || rating === 0 || comment.trim().length < 10}
          className="w-full bg-blue-950 dark:bg-blue-600 text-white px-4 py-2 rounded-md font-semibold hover:opacity-95 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;