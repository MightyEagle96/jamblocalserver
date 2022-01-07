const friends = [
  { name: "Moses", count: 0 },
  { name: "David", count: 0 },
];

const index = friends.findIndex((d) => d.name === "David");

friends[index].count++;

console.log(friends);
// console.log(index);
