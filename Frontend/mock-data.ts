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
