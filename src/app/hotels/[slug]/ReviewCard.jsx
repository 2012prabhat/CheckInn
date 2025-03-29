import Image from "next/image";
import { Star } from "lucide-react";

const ReviewCard = ({ review }) => {
  if (!review) return null;

  return (
    <div className="p-4 bg-white rounded-2xl shadow-md flex flex-col gap-3">
      {/* User Info */}
      <div className="flex items-center gap-3">
        <Image 
          src={review?.user?.profileImg || "/userAvatar.png"} 
          height={40} 
          width={40} 
          alt="User Avatar" 
          className="w-10 h-10 bg-gray-200 rounded-full"
        />
        <div>
          <h3 className="text-lg font-semibold">{review?.user?.name || "Anonymous"}</h3>
          <p className="text-sm text-gray-500">{review?.user?.email || "No email"}</p>
        </div>
      </div>

      {/* Rating */}
      {typeof review?.rating === "number" && review.rating > 0 ? (
        <div className="flex items-center gap-1 text-yellow-500">
          {[...Array(Math.floor(review.rating))].map((_, index) => (
            <Star key={index} size={18} fill="currentColor" />
          ))}
          {review.rating % 1 !== 0 && <Star size={18} fill="currentColor" opacity={0.5} />}
          <span className="ml-1 text-gray-600 text-sm">({review.rating})</span>
        </div>
      ) : (
        <p className="text-gray-500 text-sm">No rating</p>
      )}

      {/* Comment */}
      <p className="text-gray-700 text-sm">{review?.comment || "No comment provided."}</p>

      {/* Date */}
      <p className="text-xs text-gray-400">
        {review?.createdAt ? new Date(review.createdAt).toDateString() : "No date"}
      </p>
    </div>
  );
};

export default ReviewCard;
