import App from "./app";

const app = new App();

app.start().catch((error) => {
  console.error("Failed to start application:", error);
  process.exit(1);
});

process.on("SIGTERM", async () => {
  console.log("SIGTERM received. Shutting down gracefully...");
  process.exit(0);
});

process.on("SIGINT", async () => {
  console.log("SIGINT received. Shutting down gracefully...");
  process.exit(0);
});
