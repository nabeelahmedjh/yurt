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
