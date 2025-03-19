import { useQuery, useQueryClient  } from "@tanstack/react-query";
import ReviewCard from "./ReviewCard";
import api from "@/components/api";

const fetchReviews = async (hotelId) => {
  const { data } = await api.get(`/reviews?hotel=${hotelId}`);
  return data;
};

const ReviewsList = ({ hotelId }) => {
    const queryClient = useQueryClient();

    const { data: reviews = [], isLoading, error } = useQuery({
        queryKey: ["reviews", hotelId],
        queryFn: () => fetchReviews(hotelId),
        enabled: !!hotelId, // Fetch only if hotelId exists
        refetchOnMount: false, // ❌ Prevent refetching when remounting
        refetchOnWindowFocus: false, // ❌ Prevent refetching when switching tabs
        refetchOnReconnect: false, // ❌ Prevent refetching on network reconnect
      });

  if (isLoading) return <p>Loading reviews...</p>;
  if (error) return <p>Error fetching reviews!</p>;

  return (
    <div className="p-6 space-y-4">
      {reviews.map((review) => (
        <ReviewCard key={review._id} review={review} />
      ))}

    </div>
  );
};

export default ReviewsList;
