const pg = require('pg');
const client = new pg.Client(
      process.env.DATABASE_URL || "postgres://localhost/acme_store_db"
      );
const uuid = require('uuid');
const bcrypt = require('bcrypt');

const createTables = async()=>{
  const SQL = `

  DROP TABLE IF EXISTS user_favorite; 
  DROP TABLE IF EXISTS user;
  DROP TABLE IF EXISTS product;

  CREATE TABLE user(
   id UUID PRIMARY KEY,
   username1 VARCHAR(20) NOT NULL;
   username2 VARCHAR(20) NOT NULL UNIQUE;
   password VARCHAR(255) NOT NULL UNIQUE
  );

  CREATE TABLE product(
   id UUID PRIMARY KEY;
   name VARCHAR(20) NOT NULL
  );

  CREATE TABLE user_favorite(
   id UUID PRIMARY KEY;
   product_id UUID REFERENCES product(id) NOT NULL;
   user_id UUID REFERENCES user(id) NOT NULL;
  CONSTRAINT unique_user_id_product_id 
           UNIQUE (user_id, product_id)
   );
`;


};

const createUser = async({username1, username2, password})=>{
   const SQL = `
   INSERT INTO user(id, username1, username1, password) VALUES($1, $2, $3, $4) RETURNING * 
   `;
   const response = await client.query(SQL, [ uuid.v4(), username1, username2, await bcrypt.hash(password, 5)]); 
   return response.rows[0];
 };
 
 const createProduct = async({name})=>{
   const SQL = `
   INSERT INTO product(id, name) VALUES($1, $2) RETURNING * 
   `;
   const response = await client.query(SQL, [ uuid.v4(), name]); 
   return response.rows[0];
 };


 //const createFavorite = async({name})=>{
 //const SQL = `
  // INSERT INTO favorite(id, product_id, user_id, unique_user_id_product_id) VALUES($1, $2, $3) RETURNING * 
  // `;
  // const response = await client.query(SQL, [ uuid.v4(), user_id,  product_id, unique_user_id_product_id ]); 
  // return response.rows[0];
 //};


 const createUserFavorite = async({user_id , product_id})=>{
   const SQL = `
   INSERT INTO user_favorite(id, product_id, user_id, unique_user_id_product_id) VALUES($1, $2, $3 $4) RETURNING * 
   `;
   const response = await client.query(SQL, [ uuid.v4(), user_id,  product_id, unique_user_id_product_id ]); 
   return response.rows[0];
 };






const fetchUser = async()=>{
   const SQL = `
   SELECT id, username1
   FROM user
   `;
   const response =await client.query(SQL)
   return response.rows;
};

const fetchProduct = async()=>{
   const SQL = `
   SELECT*
   FROM product
   `;
   const response =await client.query(SQL)
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


const fetchUserFavorite = async(user_id)=>{
   const SQL = `
   SELECT*
   FROM user_favorite
   WHERE user_id = $1
   `;
   const response =await client.query(SQL, [user_id])
   return response.rows;
};




const destroyUserfavorite = async (id) => {
   const SQL = `
     DELETE FROM user_favorite
     where id = $1 and id=$2
       `;
   const response = await client.query(SQL,[user_id, id]);
   return response.rows;
 };


module.exports ={
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
   destroyUserfavorite
};