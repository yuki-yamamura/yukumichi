import { render, screen } from "@testing-library/react";
import { SpotNameHintPresenter } from "./presenter";
import { createSpot } from "../../../../test/helpers/spot";
import userEvent from "@testing-library/user-event";

describe("SpotNameHintPresenter", () => {
  it("should display place name and disable button after button is clicked", async () => {
    // Given
    const spot = createSpot({
      name: "東京タワー",
    });

    const user = userEvent.setup();
    render(<SpotNameHintPresenter spot={spot} />);

    expect(screen.getByText(/Click the button to show the spot name/)).toBeInTheDocument();
    expect(screen.queryByText("東京タワー")).not.toBeInTheDocument();

    // When
    const button = screen.getByRole("button", { name: "Show" });
    await user.click(button);

    // Then
    expect(screen.getByText("東京タワー")).toBeInTheDocument();
    expect(button).toBeDisabled();
  });
});
