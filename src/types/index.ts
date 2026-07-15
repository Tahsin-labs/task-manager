// export const USER_ROLE ={
//     admin:"admin",
//     agent:"agent",
//     user:"user",

// } as const;


// export type ROLE = "admin" | "agent" | "user";

export const USER_ROLE = {
  maintainer: "maintainer",
  contributor: "contributor",
} as const;

export type ROLE = "maintainer" | "contributor";