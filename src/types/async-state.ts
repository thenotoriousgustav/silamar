export type AsyncState<T, E = string> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "error"; error: E }
  | { status: "success"; data: T };
