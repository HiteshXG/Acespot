"use client";
import React from 'react';

const StarRating = ({ 
  rating = 0, 
  onRatingChange = null, 
  readonly = false, 
  size = 'md',
  showRating = true 
}) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const handleStarClick = (starRating) => {
    if (!readonly && onRatingChange) {
      onRatingChange(starRating);
    }
  };

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {Array.from({ length: 5 }).map((_, index) => {
          const starRating = index + 1;
          const isFilled = starRating <= rating;
          const isHalf = !isFilled && starRating - 0.5 <= rating;
          
          return (
            <button
              key={index}
              type="button"
              onClick={() => handleStarClick(starRating)}
              disabled={readonly}
              className={`${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'} 
                         transition-transform duration-150 focus:outline-none`}
              aria-label={`Rate ${starRating} star${starRating !== 1 ? 's' : ''}`}
            >
              <svg
                className={`${sizes[size]} transition-colors duration-150
                  ${isFilled 
                    ? 'text-yellow-400 fill-current' 
                    : isHalf 
                      ? 'text-yellow-400 fill-current' 
                      : 'text-gray-300 dark:text-gray-600'
                  }`}
                fill={isFilled || isHalf ? 'currentColor' : 'none'}
                stroke="currentColor"
                strokeWidth="1"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                {isHalf ? (
                  <>
                    <defs>
                      <linearGradient id={`half-${index}`}>
                        <stop offset="50%" stopColor="currentColor" />
                        <stop offset="50%" stopColor="transparent" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
                      fill={`url(#half-${index})`}
                    />
                  </>
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
                  />
                )}
              </svg>
            </button>
          );
        })}
      </div>
      {showRating && (
        <span className="text-sm text-gray-600 dark:text-gray-300 ml-1">
          {rating > 0 ? rating.toFixed(1) : '0.0'}
        </span>
      )}
    </div>
  );
};

export default StarRating;