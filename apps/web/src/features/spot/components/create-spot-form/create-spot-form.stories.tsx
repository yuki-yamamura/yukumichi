import preview from "#.storybook/preview";

import { CreateSpotForm } from "./create-spot-form";

const meta = preview.meta({
  component: CreateSpotForm,
  decorators: [
    (Story) => (
      <div style={{ maxWidth: "400px" }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/spots/new",
      },
    },
  },
  title: "Features/Spot/CreateSpotForm",
});

export const Default = meta.story();
