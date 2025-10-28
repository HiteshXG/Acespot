import Image from "next/image";
import { assets } from "@/assets/assets";
import { useAppContext } from "@/context/AppContext";
import StarRating from "@/components/StarRating";
import { useProductReviews } from "@/hooks/useProductReviews";

const ProductCard = ({ product }) => {
  const { currency, router } = useAppContext();
  const { averageRating, totalReviews, loading } = useProductReviews(product._id);

  return (
    <div
      onClick={() => {
        router.push("/product/" + product._id);
        scrollTo(0, 0);
      }}
      className="flex flex-col items-start gap-0.5 max-w-[200px] w-full cursor-pointer"
    >
      <div className="cursor-pointer group relative bg-gray-500/10 dark:bg-gray-700/20 rounded-lg w-full h-52 flex items-center justify-center">
        <Image
          src={product.image[0]}
          alt={product.name}
          className="group-hover:scale-105 transition object-cover w-4/5 h-4/5 md:w-full md:h-full"
          width={800}
          height={800}
        />
        <button className="absolute top-2 right-2 bg-white dark:bg-gray-800 p-2 rounded-full shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          <svg width="12" height="12" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_3268_47)">
              <path d="M8.68355 1.92062C8.47073 1.7077 8.21805 1.5388 7.93994 1.42357C7.66184 1.30833 7.36375 1.24902 7.06271 1.24902C6.76168 1.24902 6.46359 1.30833 6.18548 1.42357C5.90737 1.5388 5.65469 1.7077 5.44188 1.92062L5.00021 2.36228L4.55855 1.92062C4.12867 1.49075 3.54564 1.24925 2.93771 1.24925C2.32978 1.24925 1.74675 1.49075 1.31688 1.92062C0.887007 2.35049 0.645508 2.93352 0.645508 3.54145C0.645508 4.14938 0.887007 4.73241 1.31688 5.16228L5.00021 8.84562L8.68355 5.16228C8.89646 4.94947 9.06536 4.69679 9.18059 4.41868C9.29583 4.14057 9.35514 3.84249 9.35514 3.54145C9.35514 3.24041 9.29583 2.94233 9.18059 2.66422C9.06536 2.38611 8.89646 2.13343 8.68355 1.92062Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600 dark:text-gray-300"/>
            </g>
            <defs>
              <clipPath id="clip0_3268_47">
                <rect width="10" height="10" fill="white"/>
              </clipPath>
            </defs>
          </svg>
        </button>
      </div>

      <p className="md:text-base font-medium pt-2 w-full truncate text-gray-900 dark:text-gray-400">
        {product.name}
      </p>
      <p className="w-full text-xs text-gray-500 dark:text-gray-400 max-sm:hidden truncate">
      {product.description}
      </p>
      <div className="flex items-center gap-2">
        {loading ? (
          <div className="flex items-center gap-1">
            <div className="h-3 w-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>
        ) : (
          <div className="flex items-center gap-1">
            <StarRating 
              rating={averageRating} 
              readonly 
              size="sm" 
              showRating={false}
            />
            <span className="text-xs text-gray-600 dark:text-gray-300 ml-1">
              ({totalReviews})
            </span>
          </div>
        )}
      </div>

      <div className="flex items-end justify-between w-full mt-1">
        <p className="text-base font-medium text-gray-800 dark:text-gray-400">
          {currency}{product.offerPrice}
        </p>
        <button className="max-sm:hidden px-4 py-1.5 text-gray-500 dark:text-gray-400 border border-gray-500/20 dark:border-gray-600/50 rounded-full text-xs hover:bg-slate-50 dark:hover:bg-gray-800 transition-colors">
          Buy Now
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
