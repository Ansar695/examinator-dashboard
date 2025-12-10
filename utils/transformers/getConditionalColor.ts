export const getStatusColor = (status: string) => {
  switch (status) {
    case "ACTIVE":
      return "bg-green-500";
    case "PENDING":
      return "bg-yellow-500";
    case "SUSPENDED":
      return "bg-red-500";
    case "INACTIVE":
      return "bg-gray-500";
    default:
      return "bg-gray-500";
  }
};

export const getPlanColor = (plan: string) => {
  switch (plan) {
    case "FREE":
      return "bg-gray-500";
    case "STANDARD":
      return "bg-blue-500";
    case "PREMIUM":
      return "bg-purple-500";
    default:
      return "bg-gray-500";
  }
};

export const getPlanStatusColor = (status: string) => {
  switch (status) {
    case "ACTIVE":
      return "text-green-600 bg-green-50";
    case "EXPIRED":
      return "text-red-600 bg-red-50";
    case "UPGRADED":
      return "text-blue-600 bg-blue-50";
    case "DOWNGRADED":
      return "text-orange-600 bg-orange-50";
    default:
      return "text-gray-600 bg-gray-50";
  }
};
