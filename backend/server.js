const app = require("./app");

const port = Number(process.env.PORT || 3000);

app.listen(port, err => {
  if (err) return console.log("Connection failed...", err);
  console.log(`Server listening at ${port}...`);
});
