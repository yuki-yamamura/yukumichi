import preview from "#.storybook/preview";

import { CreateSpotForm } from ".";

const meta = preview.meta({
  title: "Features/Spot/CreateSpotForm",
  component: CreateSpotForm,
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/spots/new",
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: "390px" }}>
        <Story />
      </div>
    ),
  ],
});

export const Default = meta.story();
