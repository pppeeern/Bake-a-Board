export const category = [
  { cat: "Not selected", value: "no" },
  { cat: "Power", value: "pow" },
  { cat: "Input", value: "in" },
  { cat: "Output", value: "out" },
];

export const components = [
  {
    id: 1,
    name: "Battery 5V",
    detail: "",
    img: "Battery5V",
    category: "pow",
    quantity: 1,
    isPoleSensitivity: true,
    specs: {
      volt: 5,
    },
    pins: [
      { id: "pos", type: "VCC", label: "+" },
      { id: "neg", type: "GND", label: "-" },
    ],
  },
];
