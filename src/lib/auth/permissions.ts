import { createAccessControl } from "better-auth/plugins/access";
import {
  adminAc,
  defaultStatements,
  userAc,
} from "better-auth/plugins/admin/access";

const statement = {
  ...defaultStatements,
  associate: ["create", "read", "update", "delete", "list"],
  category: ["create", "read", "update", "delete", "list"],
  product: ["create", "read", "update", "delete", "list"],
  event: ["create", "read", "update", "delete", "list"],
  image: ["create", "delete"],
  stats: ["read"],
  "site-config": ["list", "update"],
} as const;

export const ac = createAccessControl(statement);
export const user = ac.newRole({
  ...userAc.statements,
  associate: ["create", "read", "update", "delete", "list"],
  category: ["create", "read", "update", "delete", "list"],
  product: ["create", "read", "update", "delete", "list"],
  event: ["create", "read", "update", "delete", "list"],
  image: ["create", "delete"],
  stats: ["read"],
  "site-config": ["list", "update"],
});

export const admin = ac.newRole({
  ...adminAc.statements,
  associate: ["create", "read", "update", "delete", "list"],
  category: ["create", "read", "update", "delete", "list"],
  product: ["create", "read", "update", "delete", "list"],
  event: ["create", "read", "update", "delete", "list"],
  image: ["create", "delete"],
  stats: ["read"],
  "site-config": ["list", "update"],
});

// Tipagens
export type Resource = keyof typeof statement;

export type PermissionOption = {
  [R in Resource]: {
    resource: R;
    action?: (typeof statement)[R][number][];
  };
}[Resource];
