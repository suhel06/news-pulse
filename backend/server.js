require("dotenv").config();
require("./src/models/cluster.model");
const app = require("./src/app");
const connectDB = require("./src/config/db");

const PORT = process.env.PORT || 5000;

connectDB();
const clusterRoutes = require("./src/routes/cluster.routes");
app.use("/api/clusters", clusterRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});