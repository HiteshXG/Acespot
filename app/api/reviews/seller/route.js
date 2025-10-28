import connectDB from '@/config/db';
import Review from '@/models/Review';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// GET - Fetch reviews for seller's products
export async function GET(request) {
  try {
    await connectDB();
    
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;
    
    // First, get all products that belong to this seller
    // Note: You'll need to implement this query based on your Product model
    // For now, I'll create a placeholder that you can modify
    
    // Fetch reviews for seller's products
    // This is a simplified version - you'll need to join with Product collection
    // to filter by seller
    const reviews = await Review.find({ 
      status: { $in: ['active', 'reported'] }
    })
    .populate('productId', 'name sellerId') // Assuming Product has sellerId field
    .sort({ date: -1 })
    .skip(skip)
    .limit(limit);

    // Filter reviews for products owned by this seller
    const sellerReviews = reviews.filter(review => 
      review.productId && review.productId.sellerId === userId
    );

    // Get total count
    const totalReviews = await Review.countDocuments({
      status: { $in: ['active', 'reported'] }
    });

    // Get review statistics
    const reviewStats = await Review.aggregate([
      {
        $lookup: {
          from: 'products', // Collection name for products
          localField: 'productId',
          foreignField: '_id',
          as: 'product'
        }
      },
      {
        $match: {
          'product.sellerId': userId,
          status: { $in: ['active', 'reported'] }
        }
      },
      {
        $group: {
          _id: null,
          totalReviews: { $sum: 1 },
          averageRating: { $avg: '$rating' },
          ratingDistribution: {
            $push: '$rating'
          },
          reportedCount: {
            $sum: { $cond: [{ $eq: ['$status', 'reported'] }, 1, 0] }
          }
        }
      }
    ]);

    const stats = reviewStats[0] || {
      totalReviews: 0,
      averageRating: 0,
      ratingDistribution: [],
      reportedCount: 0
    };

    return NextResponse.json({
      success: true,
      reviews: sellerReviews,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(sellerReviews.length / limit),
        totalReviews: sellerReviews.length,
        hasMore: skip + sellerReviews.length < sellerReviews.length
      },
      stats: {
        ...stats,
        averageRating: Math.round(stats.averageRating * 10) / 10
      }
    });

  } catch (error) {
    console.error('Error fetching seller reviews:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}

// PATCH - Update review status (hide/show)
export async function PATCH(request) {
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
    const { reviewId, action } = body; // action can be 'hide', 'show', or 'report'

    if (!reviewId || !action) {
      return NextResponse.json(
        { success: false, message: 'Review ID and action are required' },
        { status: 400 }
      );
    }

    // Verify the review belongs to a product owned by this seller
    const review = await Review.findById(reviewId).populate('productId', 'sellerId');
    
    if (!review) {
      return NextResponse.json(
        { success: false, message: 'Review not found' },
        { status: 404 }
      );
    }

    if (!review.productId || review.productId.sellerId !== userId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized to modify this review' },
        { status: 403 }
      );
    }

    // Update review status based on action
    let newStatus;
    switch (action) {
      case 'hide':
        newStatus = 'hidden';
        break;
      case 'show':
        newStatus = 'active';
        break;
      case 'report':
        newStatus = 'reported';
        break;
      default:
        return NextResponse.json(
          { success: false, message: 'Invalid action' },
          { status: 400 }
        );
    }

    const updatedReview = await Review.findByIdAndUpdate(
      reviewId,
      { status: newStatus },
      { new: true }
    );

    return NextResponse.json({
      success: true,
      message: `Review ${action}${action.endsWith('e') ? 'd' : action.endsWith('t') ? 'ed' : 'ed'} successfully`,
      review: updatedReview
    });

  } catch (error) {
    console.error('Error updating review:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update review' },
      { status: 500 }
    );
  }
}