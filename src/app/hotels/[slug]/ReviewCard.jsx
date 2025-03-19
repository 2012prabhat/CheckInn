import Image from "next/image";
import { Star } from "lucide-react";

const ReviewCard = ({ review }) => {
  return (
    <div className="p-4 bg-white rounded-2xl shadow-md flex flex-col gap-3">
      {/* User Info */}
      <div className="flex items-center gap-3">
        <Image src={review.user.profileImg || "/userAvatar.png"} height="100" alt=""
        width="100" className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 font-bold">
          
        </Image>
        <div>
          <h3 className="text-lg font-semibold">{review.user.name}</h3>
          <p className="text-sm text-gray-500">{review.user.email}</p>
        </div>
      </div>

      {/* Rating */}
      <div className="flex items-center gap-1 text-yellow-500">
        {[...Array(Math.floor(review.rating))].map((_, index) => (
          <Star key={index} size={18} fill="currentColor" />
        ))}
        {review.rating % 1 !== 0 && <Star size={18} fill="currentColor" opacity={0.5} />}
        <span className="ml-1 text-gray-600 text-sm">({review.rating})</span>
      </div>

      {/* Comment */}
      <p className="text-gray-700 text-sm">{review.comment}</p>

      {/* Date */}
      <p className="text-xs text-gray-400">{new Date(review.createdAt).toDateString()}</p>
    </div>
  );
};

export default ReviewCard;
