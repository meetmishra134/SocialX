export const getRelativeTime = (dateString: string) => {
  const diffInHours =
    Math.abs(new Date().getTime() - new Date(dateString).getTime()) / 36e5;
  if (diffInHours < 1) return "Just now";
  if (diffInHours < 24) return `${Math.floor(diffInHours)}h`;
  return `${Math.floor(diffInHours / 24)}d`;
};
