import { faker } from "@faker-js/faker";

export function createPublicId(): string {
  return faker.string.alphanumeric({ length: 22 });
}
