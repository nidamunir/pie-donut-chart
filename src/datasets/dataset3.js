export default [
  {
    value: 40,
    label: "Parent0",
    children: [
      {
        value: 5,
        label: "P0L1Ch1",
      },

      {
        value: 5,
        label: "P0L1Ch2",
      },
      {
        value: 10,
        label: "P0L1Ch3",
      },
    ],
  },
  {
    value: 60,
    label: "Parent1",
    children: [
      {
        value: 5,
        label: "P1L1Ch1",
      },

      {
        value: 5,
        label: "P1L1Ch2",
      },
      {
        value: 10,
        label: "P1L1Ch3",
      },
    ],
  },
  {
    value: 100,
    label: "Parent2*",
    children: [
      {
        value: 5,
        label: "P2L1C1*",
      },

      {
        value: 5,
        label: "P2L1C2*",
      },
      {
        value: 50,
        label: "P2L1C3*",
        children: [
          {
            value: 20,
            label: "P2L2Ch1*",
          },
          {
            value: 20,
            label: "P2L2Ch2*",
          },
        ],
      },
    ],
  },
];
