import connectDB from '@/config/db';
import Review from '@/models/Review';
import Order from '@/models/Order';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// GET - Fetch reviews for a product
export async function GET(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;
    
    if (!productId) {
      return NextResponse.json(
        { success: false, message: 'Product ID is required' },
        { status: 400 }
      );
    }

    // Fetch reviews with pagination
    const reviews = await Review.find({ 
      productId, 
      status: 'active' 
    })
    .sort({ date: -1 })
    .skip(skip)
    .limit(limit);

    // Get total count for pagination
    const totalReviews = await Review.countDocuments({ 
      productId, 
      status: 'active' 
    });

    // Calculate average rating
    const ratingStats = await Review.aggregate([
      { $match: { productId, status: 'active' } },
      {
        $group: {
          _id: null,
          avgRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 },
          ratingDistribution: {
            $push: '$rating'
          }
        }
      }
    ]);

    const stats = ratingStats[0] || { 
      avgRating: 0, 
      totalReviews: 0, 
      ratingDistribution: [] 
    };

    return NextResponse.json({
      success: true,
      reviews,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalReviews / limit),
        totalReviews,
        hasMore: skip + reviews.length < totalReviews
      },
      stats: {
        averageRating: Math.round(stats.avgRating * 10) / 10,
        totalReviews: stats.totalReviews
      }
    });

  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}

// POST - Create a new review
export async function POST(request) {
  try {
    await connectDB();
    
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { productId, rating, comment, userName } = body;

    // Validate required fields
    if (!productId || !rating || !comment || !userName) {
      return NextResponse.json(
        { success: false, message: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate rating range
    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { success: false, message: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({ userId, productId });
    if (existingReview) {
      return NextResponse.json(
        { success: false, message: 'You have already reviewed this product' },
        { status: 400 }
      );
    }

    // Check if user has purchased this product (verified purchase)
    const userOrder = await Order.findOne({
      userId,
      'items.product': productId,
      status: { $in: ['Order Placed', 'Delivered', 'Shipped'] }
    });

    const isVerifiedPurchase = !!userOrder;

    // Create new review
    const newReview = new Review({
      userId,
      userName,
      productId,
      rating: parseInt(rating),
      comment: comment.trim(),
      isVerifiedPurchase,
      date: new Date()
    });

    await newReview.save();

    return NextResponse.json({
      success: true,
      message: 'Review submitted successfully',
      review: newReview
    });

  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to submit review' },
      { status: 500 }
    );
  }
}