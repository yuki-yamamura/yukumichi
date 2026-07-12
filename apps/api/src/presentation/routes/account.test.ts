import { faker } from "@faker-js/faker";
import { Hono } from "hono";
import { testClient } from "hono/testing";
import { err, ok } from "neverthrow";

import { createEmail } from "@/test/fixtures/account";

import { createAccountRoute } from "./account";

describe("createAccountRoute", () => {
  describe("post /accounts/sign-up", () => {
    it("should return 201 status code when sign-up succeeds", async () => {
      // Given
      const accountRoute = createAccountRoute(
        createAccountRouteDeps({
          signUpUsecase: { execute: vi.fn().mockResolvedValue(ok()) },
        }),
      );
      const client = testClient(new Hono().route("/accounts", accountRoute));

      // When
      const response = await client.accounts["sign-up"].$post({
        json: {
          email: createEmail(),
          password: faker.internet.password({ length: 12 }),
        },
      });

      // Then
      expect(response.status).toBe(201);
      expect(await response.text()).toBe("");
    });

    it.each([
      [{ email: "not-an-email", password: faker.internet.password({ length: 12 }) }],
      [{ email: createEmail(), password: "short" }],
    ])(
      "should return 400 status code when the request body is invalid: %o",
      async (requestBody) => {
        // Given
        const accountRoute = createAccountRoute(createAccountRouteDeps());
        const client = testClient(new Hono().route("/accounts", accountRoute));

        // When
        const response = await client.accounts["sign-up"].$post({ json: requestBody });

        // Then
        expect(response.status).toBe(400);
        expect(await response.json()).toEqual({
          code: "BAD_REQUEST_ERROR",
          message: expect.any(String),
        });
      },
    );

    it("should return 409 status code when the email is already registered", async () => {
      // Given
      const accountRoute = createAccountRoute(
        createAccountRouteDeps({
          signUpUsecase: {
            execute: vi.fn().mockResolvedValue(
              err({
                kind: "ACCOUNT_ALREADY_REGISTERED",
                message: faker.lorem.sentence(),
              }),
            ),
          },
        }),
      );
      const client = testClient(new Hono().route("/accounts", accountRoute));

      // When
      const response = await client.accounts["sign-up"].$post({
        json: {
          email: createEmail(),
          password: faker.internet.password({ length: 12 }),
        },
      });

      // Then
      expect(response.status).toBe(409);
      expect(await response.json()).toEqual({
        code: "ACCOUNT_ALREADY_REGISTERED_ERROR",
        message: expect.any(String),
      });
    });

    it("should return 502 status code when the auth gateway fails", async () => {
      // Given
      const accountRoute = createAccountRoute(
        createAccountRouteDeps({
          signUpUsecase: {
            execute: vi
              .fn()
              .mockResolvedValue(err({ kind: "AUTH_GATEWAY", message: faker.lorem.sentence() })),
          },
        }),
      );
      const client = testClient(new Hono().route("/accounts", accountRoute));

      // When
      const response = await client.accounts["sign-up"].$post({
        json: {
          email: createEmail(),
          password: faker.internet.password({ length: 12 }),
        },
      });

      // Then
      expect(response.status).toBe(502);
      expect(await response.json()).toEqual({
        code: "AUTH_GATEWAY_ERROR",
        message: expect.any(String),
      });
    });
  });

  describe("post /accounts/sign-up/confirm", () => {
    it("should return 204 status code when confirmation succeeds", async () => {
      // Given
      const accountRoute = createAccountRoute(
        createAccountRouteDeps({
          confirmSignUpUsecase: { execute: vi.fn().mockResolvedValue(ok()) },
        }),
      );
      const client = testClient(new Hono().route("/accounts", accountRoute));

      // When
      const response = await client.accounts["sign-up"].confirm.$post({
        json: {
          code: faker.string.numeric(6),
          email: createEmail(),
        },
      });

      // Then
      expect(response.status).toBe(204);
      expect(await response.text()).toBe("");
    });

    it.each([
      [{ code: "", email: createEmail() }],
      [{ code: faker.string.numeric(6), email: "not-an-email" }],
    ])(
      "should return 400 status code when the request body is invalid: %o",
      async (requestBody) => {
        // Given
        const accountRoute = createAccountRoute(createAccountRouteDeps());
        const client = testClient(new Hono().route("/accounts", accountRoute));

        // When
        const response = await client.accounts["sign-up"].confirm.$post({ json: requestBody });

        // Then
        expect(response.status).toBe(400);
        expect(await response.json()).toEqual({
          code: "BAD_REQUEST_ERROR",
          message: expect.any(String),
        });
      },
    );

    it("should return 400 status code when the verification code is invalid", async () => {
      // Given
      const accountRoute = createAccountRoute(
        createAccountRouteDeps({
          confirmSignUpUsecase: {
            execute: vi
              .fn()
              .mockResolvedValue(err({ kind: "CODE_INVALID", message: faker.lorem.sentence() })),
          },
        }),
      );
      const client = testClient(new Hono().route("/accounts", accountRoute));

      // When
      const response = await client.accounts["sign-up"].confirm.$post({
        json: {
          code: faker.string.numeric(6),
          email: createEmail(),
        },
      });

      // Then
      expect(response.status).toBe(400);
      expect(await response.json()).toEqual({
        code: "CODE_INVALID_ERROR",
        message: expect.any(String),
      });
    });

    it("should return 404 status code when no account exists for the email", async () => {
      // Given
      const accountRoute = createAccountRoute(
        createAccountRouteDeps({
          confirmSignUpUsecase: {
            execute: vi
              .fn()
              .mockResolvedValue(err({ kind: "NOT_FOUND", message: faker.lorem.sentence() })),
          },
        }),
      );
      const client = testClient(new Hono().route("/accounts", accountRoute));

      // When
      const response = await client.accounts["sign-up"].confirm.$post({
        json: {
          code: faker.string.numeric(6),
          email: createEmail(),
        },
      });

      // Then
      expect(response.status).toBe(404);
      expect(await response.json()).toEqual({
        code: "NOT_FOUND_ERROR",
        message: expect.any(String),
      });
    });

    it("should return 502 status code when the auth gateway fails", async () => {
      // Given
      const accountRoute = createAccountRoute(
        createAccountRouteDeps({
          confirmSignUpUsecase: {
            execute: vi
              .fn()
              .mockResolvedValue(err({ kind: "AUTH_GATEWAY", message: faker.lorem.sentence() })),
          },
        }),
      );
      const client = testClient(new Hono().route("/accounts", accountRoute));

      // When
      const response = await client.accounts["sign-up"].confirm.$post({
        json: {
          code: faker.string.numeric(6),
          email: createEmail(),
        },
      });

      // Then
      expect(response.status).toBe(502);
      expect(await response.json()).toEqual({
        code: "AUTH_GATEWAY_ERROR",
        message: expect.any(String),
      });
    });
  });
});

function createAccountRouteDeps(
  overwrites: Partial<Parameters<typeof createAccountRoute>[0]> = {},
): Parameters<typeof createAccountRoute>[0] {
  const defaultDeps = {
    confirmSignUpUsecase: { execute: vi.fn() },
    signUpUsecase: { execute: vi.fn() },
  };

  return { ...defaultDeps, ...overwrites };
}
