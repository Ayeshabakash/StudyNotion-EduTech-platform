export const formattedDate = (date) => {
  console.log("date" , date);
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}