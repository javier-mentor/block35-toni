const {
  client,
  createTables,
  createUser,
  createProduct,
  createUserFavorite,
  fetchUser,
  fetchProduct,
  // fetchFavorite,
  fetchUserFavorite,
  destroyUserFavorite,
} = require("./db");

const express = require("express");

const app = express();
app.use(express.json());

//routes

app.get("/app/product", async (req, res, next) => {
  try {
    res.send(await fetchProduct());
  } catch (ex) {
    next(ex);
  }
});

app.get("/app/user", async (req, res, next) => {
  try {
    res.send(await fetchUser());
  } catch (ex) {
    next(ex);
  }
});

app.get("/app/user/:id/user_favorite", async (req, res, next) => {
  try {
    res.send(await fetchUserFavorite(req.params.id));
  } catch (ex) {
    next(ex);
  }
});

app.delete("/app/user/:user_id/userFavorite/:id", async (req, res, next) => {
  try {
    await deleteUserFavorite({
      user_id: req.params.user_id,
      id: req.params.id,
    });
    res.sendStatus(204);
  } catch (ex) {
    next(ex);
  }
});

app.post("/app/user/:id/userFavorite", async (req, res, next) => {
  try {
    res.status(201).send(
      await createUserFavorite({
        user_id: req.params.id,
        id: req.body.product_id,
      })
    );
  } catch (ex) {
    next(ex);
  }
});

const init = async () => {
  console.log("connecting to database");
  await client.connect();
  console.log("connected to database");
  await createTables();
  console.log("Tables created");

  const [Tom, Steve, Bob, Eugene, chair, desk, lamp] = await Promise.all([
    createUser({ username: "Tom", password: "Tom_pw" }),
    createUser({ username: "Steve", password: "Steve_pw" }),
    createUser({ username: "Bob", password: "Bob_pw" }),
    createUser({ username: "Eugene", password: "Eugene_pw" }),
    createProduct({ name: "chair" }),
    createProduct({ name: "desk" }),
    createProduct({ name: "lamp" }),
  ]);

  console.log("TOM'S INFO:", Tom.id, Tom.username, Tom.password);
  console.log(await fetchUser());
  console.log(await fetchProduct());

  const userFavorite = await Promise.all([
    createUserFavorite({ user_id: Tom.id, product_id: chair.id }),
    createUserFavorite({ user_id: Steve.id, product_id: desk.id }),
    createUserFavorite({ user_id: Bob.id, product_id: chair.id }),
  ]);

  console.log("TOM ID: ", await fetchUserFavorite(Tom.id));
  // await destroyUserFavorite ({user_id, product})
  //   console.log(await fetchUserFavorite(Tom.id));
  await destroyUserFavorite({ user_id: Tom.id, product_id: chair.id });
  console.log(await fetchUserFavorite(Tom.id));

  //   console.log(`curl localhost:3000/api/user/${Tom.id}/userFavorite`);

  //   console.log(`curl -X POST localhost:3000/api/user/${Tom.id}/
  //     userFavorite -d '{"product_id": "${chair.id}"}' -H 'Content-Type:application/json'`);

  //   console.log(
  //     `curl -X DELETE localhost:3000/api/user/${Tom.id}/userFavorite_id_here`
  //   );

  console.log("data seeded");

  const PORT = 3000;
  const port = process.env.PORT || PORT;
  app.listen(port, () => console.log("listening on port ${port}"));
};
init();
