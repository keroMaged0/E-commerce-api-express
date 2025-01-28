import { createServer } from "http";

import { dbConnection } from "./config/db-connection";
import { app } from "./app";

const server = createServer(app);

dbConnection();

const port = process.env.PORT;
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
