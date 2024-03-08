const pg = require("pg");
const client = new pg.Client(
  process.env.DATABASE_URL || "postgres://localhost/acme_store_db"
);
const uuid = require("uuid");
const bcrypt = require("bcrypt");

const createTables = async () => {
  const SQL = `

  DROP TABLE IF EXISTS users cascade;
  DROP TABLE IF EXISTS products cascade;
  DROP TABLE IF EXISTS user_favorite; 

  CREATE TABLE users(
   id UUID PRIMARY KEY,
   username VARCHAR(20) NOT NULL,
   password VARCHAR(255) NOT NULL UNIQUE
  );

  CREATE TABLE products(
   id UUID PRIMARY KEY,
   name VARCHAR(20) NOT NULL
  );

  CREATE TABLE user_favorite(
   id UUID PRIMARY KEY,
   user_id UUID REFERENCES users(id) NOT NULL,
   product_id UUID REFERENCES products(id) NOT NULL,
   CONSTRAINT unique_user_id_product_id UNIQUE (user_id, product_id)
   );
`;

  await client.query(SQL);
};

const createUser = async ({ username, password }) => {
  const SQL = `
   INSERT INTO users(id, username, password) VALUES($1, $2, $3) RETURNING * 
   `;

  const response = await client.query(SQL, [
    uuid.v4(),
    username,
    await bcrypt.hash(password, 5),
  ]);
  return response.rows[0];
};

const createProduct = async ({ name }) => {
  const SQL = `
   INSERT INTO products(id, name) VALUES($1, $2) RETURNING *
   `;
  const response = await client.query(SQL, [uuid.v4(), name]);
  return response.rows[0];
};

//const createFavorite = async({name})=>{
//const SQL = `
// INSERT INTO favorite(id, product_id, user_id, unique_user_id_product_id) VALUES($1, $2, $3) RETURNING *
// `;
// const response = await client.query(SQL, [ uuid.v4(), user_id,  product_id, unique_user_id_product_id ]);
// return response.rows[0];
//};

const createUserFavorite = async ({ user_id, product_id }) => {
  const SQL = `
   INSERT INTO user_favorite(id, user_id, product_id) VALUES($1, $2, $3) RETURNING * 
   `;
  const response = await client.query(SQL, [uuid.v4(), user_id, product_id]);
  return response.rows[0];
};

const fetchUser = async () => {
  const SQL = `
   SELECT id, username
   FROM users
   `;
  const response = await client.query(SQL);
  return response.rows;
};

const fetchProduct = async () => {
  const SQL = `
   SELECT *
   FROM products
   `;
  const response = await client.query(SQL);
  return response.rows;
};

//const fetchFavorite = async()=>{
//  const SQL = `
//  SELECT*
//  FROM user_favorite
//  `;
//  const response =await client.query(SQL)
//  return response.rows;
//};

const fetchUserFavorite = async (user_id) => {
  const SQL = `
   SELECT *
   FROM user_favorite
   WHERE user_id = $1
   `;
  const response = await client.query(SQL, [user_id]);
  return response.rows;
};

// Make sure to specify the user_id and product_id
const destroyUserFavorite = async ({ user_id, product_id }) => {
  const SQL = `
     DELETE FROM user_favorite
     where user_id = $1 and product_id=$2
       `;
  const response = await client.query(SQL, [user_id, product_id]);
  return response.rows;
};

module.exports = {
  client,
  createTables,
  createProduct,
  createUser,
  fetchUser,
  fetchProduct,
  //fetchFavorite,
  // createFavorite,
  createUserFavorite,
  fetchUserFavorite,
  destroyUserFavorite,
};
