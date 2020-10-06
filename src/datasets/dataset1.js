export default [
  {
    value: 40,
    label: "Parent0",
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
        children: [
          {
            value: 4,
            label: "P1L2Ch1",
          },

          {
            value: 6,
            label: "P1L2Ch2",
            children: [
              {
                value: 40,
                label: "P13Ch1",
                children: [
                  {
                    value: 20,
                    label: "P1L4Ch1",
                  },
                  {
                    value: 20,
                    label: "P1L4Ch2",
                  },
                ],
              },
              {
                value: 10,
                label: "P13Ch2",
              },
            ],
          },
        ],
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
