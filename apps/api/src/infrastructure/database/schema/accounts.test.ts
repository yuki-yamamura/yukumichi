import type { accountStatus } from "./accounts";
import type { AccountStatus } from "@/domain/account/models/account";

describe("accountStatus", () => {
  it("should match AccountStatus in domain", () => {
    type Db = (typeof accountStatus.enumValues)[number];

    expectTypeOf<Exclude<Db, AccountStatus>>().toEqualTypeOf<never>();
    expectTypeOf<Exclude<AccountStatus, Db>>().toEqualTypeOf<never>();
  });
});
