const getEmoji = (amenitie) => {
    switch (amenitie.toLowerCase()) { // ✅ Case insensitive matching
        case "pool":
            return "🏊‍♂️";
        case "wifi":
            return "🛜";
        case "spa":
            return "🧖";
        case "restaurant":
        case "fine dining":
        case "multiple restaurants":
            return "🍽️";  // ✅ Added Multiple Restaurants
        case "fitness center":
        case "gym":
            return "💪";
        case "boating":
            return "🚣";
        case "business center":
            return "🏢";  
        case "luxury suites":
            return "🏨";  
        case "hiking trails":
            return "🥾";  // ✅ Added Hiking Trails
        case "lake view":
            return "🌅";  // ✅ Added Lake View
        case "infinity pool":
            return "🌊";  // ✅ Added Infinity Pool
        case "yoga classes":
            return "🧘";  // ✅ Added Yoga Classes
        default:
            return "✨";  // ✅ Default emoji
    }
};

export default getEmoji;
