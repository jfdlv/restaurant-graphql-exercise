var { graphqlHTTP } = require("express-graphql");
var { buildSchema, assertInputType } = require("graphql");
var express = require("express");

// Construct a schema, using GraphQL schema language
var restaurants = [
  {
    id: 1,
    name: "WoodsHill ",
    description:
      "American cuisine, farm to table, with fresh produce every day",
    dishes: [
      {
        name: "Swordfish grill",
        price: 27,
      },
      {
        name: "Roasted Broccily ",
        price: 11,
      },
    ],
  },
  {
    id: 2,
    name: "Fiorellas",
    description:
      "Italian-American home cooked food with fresh pasta and sauces",
    dishes: [
      {
        name: "Flatbread",
        price: 14,
      },
      {
        name: "Carbonara",
        price: 18,
      },
      {
        name: "Spaghetti",
        price: 19,
      },
    ],
  },
  {
    id: 3,
    name: "Karma",
    description:
      "Malaysian-Chinese-Japanese fusion, with great bar and bartenders",
    dishes: [
      {
        name: "Dragon Roll",
        price: 12,
      },
      {
        name: "Pancake roll ",
        price: 11,
      },
      {
        name: "Cod cakes",
        price: 13,
      },
    ],
  },
];
var schema = buildSchema(`
type Query{
  restaurant(id: Int): restaurant
  restaurants: [restaurant]
},
type restaurant {
  id: Int
  name: String
  description: String
  dishes:[Dish]
}
type Dish{
  name: String
  price: Int
}
input restaurantInput{
  name: String
  description: String
}
type DeleteResponse{
  ok: Boolean!
}
type Mutation{
  setrestaurant(input: restaurantInput): restaurant
  deleterestaurant(id: Int!): DeleteResponse
  editrestaurant(id: Int!, name: String!): restaurant
}
`);
// The root provides a resolver function for each API endpoint

var root = {
  restaurant: (arg) => { 
    console.log(arg);
    return restaurants.find(element=> {
      return element.id === arg.id;
    })
  },
  restaurants: () => {
    return restaurants;
  },
  setrestaurant: ({ input:{name,description} }) => {
    const maxId = restaurants.reduce((prev, current) => (prev.id > current.id) ? prev.id : current.id)
    restaurants.push({id: maxId+1,name,description,dishes:[]});
    return {name,description};
  },
  deleterestaurant: ({ id }) => {
    if(restaurants.find(element => element.id === id)){
      restaurants = restaurants.filter(element=>{
        return element.id !== id;
      })
      console.log(restaurants);
      return {
        ok: true
      }
    } 
    else {
      return {
        ok:false
      }
    }
    
  },
  editrestaurant: ({ id,  name}) => {
    restaurants = restaurants.map(element => {
      if(element.id === id) {
        element.name = name;
      }
      return element;
    })
    return restaurants.find(element => element.id === id);
  },
};
var app = express();
app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
);
var port = 5500;
app.listen(5500, () => console.log("Running Graphql on Port:" + port));
