export const serverMockData = Array.from({ length: 10 }, (_, i) => ({
  _id: `66b9f5a47a37e38c4e6ddd0d${i}`,
  name: `new server ${i + 1}`,
  description: "ada",
  banner: "",
  spaces: [
    {
      _id: `66b9f5ac7a37e38c4e6ddd18${i}`,
      description: "adad",
      name: `new space ${i + 1}`,
      spaceBanner: "",
      createdAt: "2024-08-12T11:44:44.935Z",
      updatedAt: "2024-08-12T11:44:44.935Z",
      __v: 0,
    },
  ],
  admins: ["66b9f59b7a37e38c4e6ddcfe"],
  members: ["66b9f59b7a37e38c4e6ddcfe"],
  createdAt: "2024-08-12T11:44:36.469Z",
  updatedAt: "2024-08-12T11:51:27.653Z",
  __v: 4,
}));

export const spaceMockData = [
  {
    tags: [],
    _id: "66b9f8027a37e38c4e6dddee",
    name: "cool serverdddddddddddddddd",
    description: "adad",
    banner: "server.png",
    spaces: Array.from({ length: 20 }, (_, i) => ({
      type: "chat",
      _id: `66b9f8087a37e38c4e6dddfe${i}`,
      description: `ad ${i + 1}`,
      name: `cool looking spaceeeeeeeeeee${i + 1}`,
      spaceBanner: "space.png",
      createdAt: "2024-08-12T11:54:48.564Z",
      updatedAt: "2024-08-12T11:54:48.564Z",
      __v: 0,
    })),
    admins: ["66b9f59b7a37e38c4e6ddcfe"],
    members: ["66b9f59b7a37e38c4e6ddcfe"],
    createdAt: "2024-08-12T11:54:42.656Z",
    updatedAt: "2024-08-12T11:54:48.567Z",
    __v: 1,
  },
];

export const allServersMockData = Array.from({ length: 23 }, (_, i) => ({
  _id: "66c427da145e53ae1da4e11b",
  name: "Geography Tribe",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ",
  banner: {
    name: "Screenshot from 2024-08-17 15-00-14.png",
    size: 345998,
    type: "image/png",
    source:
      "uploads/Screenshot from 2024-08-17 15-00-14-991036115-1724131290674.png",
  },
  tags: [],
  userJoined: false,
  membersCount: 20,
}));

export const tagsMockData = Array.from({ length: 8 }, (_, i) => ({
  _id: `66c96bee61a2b783fe23742${i}`,
  name: `Geography`,
  description: `Geography is a subject${i}`,
  usageCount: 0,
  __v: 0,
  createdAt: "2024-08-24T05:13:18.483Z",
  updatedAt: "2024-08-24T05:13:18.483Z",
}));
