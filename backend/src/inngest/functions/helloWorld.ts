import { inngest } from "../client.js";

export const helloWorld = inngest.createFunction(
  { id: "hello-world", triggers: [{ event: "test/hello.world" }] },
  async ({ event, step }) => {
    await step.sleep("wait", "2s");
    return { message: `Hello ${event.data.email}!` };
  },
);
