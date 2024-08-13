const mockChallenges = [
  {
    id: "1",
    name: "10K Steps Challenge",
    imageUrl:
      "https://xjhjbokiyhipxuumzpii.supabase.co/storage/v1/object/public/challenges/placeholder.png",
    description: "A challenge to walk 10,000 steps every day for a month.",
    location: {
      address: "123 Fitness Lane, Healthy City",
      lat: 40.7128,
      lng: -74.006,
    },
    startDateTime: new Date("2024-09-01T00:00:00Z"),
    endDateTime: new Date("2024-09-30T23:59:59Z"),
    activityType: "Walking",
    capacity: 100,
    visibility: true, // true for Public, false for Private
    ownerId: "user1",
    createdAt: new Date("2024-08-01T12:00:00Z"),
    updatedAt: new Date("2024-08-01T12:00:00Z"),
  },
  {
    id: "2",
    name: "Yoga for Beginners",
    imageUrl:
      "https://xjhjbokiyhipxuumzpii.supabase.co/storage/v1/object/public/challenges/placeholder.png",
    description: "A month-long challenge for beginners to practice yoga daily.",
    location: {
      address: "456 Wellness Ave, Relaxation Town",
      lat: 34.0522,
      lng: -118.2437,
    },
    startDateTime: new Date("2024-09-01T00:00:00Z"),
    endDateTime: new Date("2024-09-30T23:59:59Z"),
    activityType: "Yoga",
    capacity: 50,
    visibility: false, // true for Public, false for Private
    ownerId: "user2",
    createdAt: new Date("2024-08-02T15:30:00Z"),
    updatedAt: new Date("2024-08-02T15:30:00Z"),
  },
];

export default mockChallenges;
