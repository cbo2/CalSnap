// README - This mini node app will seed the mongo db with food items based on user input
//
//  - to run this app, execute this from the root directory:  node models/seedapp
//  - it will prompt you for a username (assumption is that the user is already in the mongodb!)
//  - it will prompt you for number of food items to seed per day
//  - it will prompt you for the number of days to provide data (going back from today's date)
//
// example:
//      node models/seedapp
//      node models/seedapp
//  ** running with MONGODB_URI=mongodb://localhost/CalSnap
//  ? Enter the associated username?  talk2cbo
//  ? How many food items per day?  10
//  ? How many days to generate data?  7
//
// NOTE: it will read the MONGODB_URI from your .env if present.  If not present or if
//       commented out in your .env, it will use your mongodb on localhost.  If present
//       in your .env it CAN SEED YOUR MONGODB UP ON HEROKU!
//
// LASTLY, be careful....it adds a lot of calories to your consumption ;-)

const mongoose = require("mongoose");
var inquirer = require("inquirer");
require("dotenv").config({
    silent: true
});
const db = require("../models");

const appKey = process.env.REACT_APP_NUTRITION_KEY


const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/CalSnap"
// Connect to the Mongo DB
console.log(`** running with MONGODB_URI=${MONGODB_URI}`)
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });
mongoose.set('debug', true);

let username = ""
let numItems = 0
let days = 0

let d = new Date();

const food_array = [
    { item_name: 'Fried Chicken - 3 oz', quantity: 1, nf_calories: 228.65, nf_protein: 24.28, nf_serving_size_unit: 'oz', nf_total_carbohydrate: 222222.68, username: 'talk2cbo', meal: 'Select Meal', date: new Date() },
    { item_name: 'Avocados, raw, California - 1 cup, pureed', quantity: 1, nf_calories: 384.1, nf_protein: 4.51, nf_serving_size_unit: 'cup, pureed', nf_total_carbohydrate: 19.87, username: 'talk2cbo', meal: 'Select Meal', date: '' },
    { item_name: 'Pistacios', quantity: 1, nf_calories: 190, nf_protein: 6, nf_serving_size_unit: 'cup', nf_total_carbohydrate: 4, username: 'talk2cbo', meal: 'Select Meal', date: '' },
    { item_name: 'Fried Chicken - 0.5 chicken, bone removed', quantity: 1, nf_calories: 844.66, nf_protein: 89.68, nf_serving_size_unit: 'chicken, bone removed', nf_total_carbohydrate: 9.89, username: 'talk2cbo', meal: 'Select Meal', date: '' },
    { item_name: 'Ribeye', quantity: 1, nf_calories: 1000, nf_protein: 91, nf_serving_size_unit: 'oz.', nf_total_carbohydrate: 1, username: 'talk2cbo', meal: 'Select Meal', date: '' },
    { item_name: 'Bananas, raw - 1 medium (7" to 7-7/8" long)', quantity: 1, nf_calories: 105.02, nf_protein: 1.29, nf_serving_size_unit: 'medium (7" to 7-7/8" long)', nf_total_carbohydrate: 26.95, username: 'talk2cbo', meal: 'Select Meal', date: '' },
    { item_name: 'Mac+Cheese', quantity: 1, nf_calories: 420, nf_protein: 13, nf_serving_size_unit: 'oz', nf_total_carbohydrate: 61, username: 'talk2cbo', meal: 'Select Meal', date: '' },
    { item_name: 'Egg, whole, cooked, fried - 1 large', quantity: 1, nf_calories: 90.16, nf_protein: 6.26, nf_serving_size_unit: 'large', nf_total_carbohydrate: 0.38, username: 'talk2cbo', meal: 'Select Meal', date: '' },
    { item_name: 'McDONALD\'S, BIG MAC - 1 sandwich', quantity: 1, nf_calories: 562.83, nf_protein: 25.89, nf_serving_size_unit: 'sandwich', nf_total_carbohydrate: 43.98, username: 'talk2cbo', meal: 'Select Meal', date: '' },
    { item_name: 'Fries, Fast Food Style', quantity: 1, nf_calories: 160, nf_protein: 2, nf_serving_size_unit: 'pcs', nf_total_carbohydrate: 21, username: 'talk2cbo', meal: 'Select Meal', date: '' },
    { item_name: 'Pancake - 1 pancake (6" dia)', quantity: 1, nf_calories: 174.79, nf_protein: 4.93, nf_serving_size_unit: 'pancake (6" dia)', nf_total_carbohydrate: 21.79, username: 'talk2cbo', meal: 'Select Meal', date: '' },
    { item_name: 'Grapes, raw - 1 grape', quantity: 20, nf_calories: 69, nf_protein: 0.8, nf_serving_size_unit: 'grape', nf_total_carbohydrate: 18, username: 'talk2cbo', meal: 'Select Meal', date: '' },
    { item_name: 'Starbucks Mocha Frappuccino', quantity: 1, nf_calories: 180, nf_protein: 7, nf_serving_size_unit: 'bottle', nf_total_carbohydrate: 33, username: 'talk2cbo', meal: 'Select Meal', date: '' },
    { item_name: 'Coke - 1 serving medium 21 fl oz,without ice', quantity: 1, nf_calories: 179.82, nf_protein: 0.34, nf_serving_size_unit: 'serving medium 21 fl oz, without ice', nf_total_carbohydrate: 46.46, username: 'talk2cbo', meal: 'Select Meal', date: '' },
    { item_name: 'Cheerios - 1 cup', quantity: 1, nf_calories: 105.28, nf_protein: 3.39, nf_serving_size_unit: 'cup', nf_total_carbohydrate: 20.5, username: 'talk2cbo', meal: 'Select Meal', date: '' },
    { item_name: 'Pulled Pork Sandwich', quantity: 1, nf_calories: 420, nf_protein: 21, nf_serving_size_unit: 'sandwich', nf_total_carbohydrate: 58, username: 'talk2cbo', meal: 'Select Meal', date: '' },
    { item_name: 'BBQ Chicken - 1 serving', quantity: 1, nf_calories: 202.02, nf_protein: 21.56, nf_serving_size_unit: 'serving', nf_total_carbohydrate: 14.22, username: 'talk2cbo', meal: 'Select Meal', date: '' },
    { item_name: 'Fast Food, Pizza Chain, 14" pizza, pepperoni topping, regular crust - 1 large slice', quantity: 1, nf_calories: 313.02, nf_protein: 13.03, nf_serving_size_unit: 'large slice', nf_total_carbohydrate: 35.5, username: 'talk2cbo', meal: 'Select Meal', date: '' },
    { item_name: 'Mangos, raw - 1 fruit without refuse', quantity: 1, nf_calories: 201.6, nf_protein: 2.76, nf_serving_size_unit: 'fruit without refuse', nf_total_carbohydrate: 50.33, username: 'talk2cbo', meal: 'Select Meal', date: '' },
    { item_name: 'Medium Cooked Shrimp', quantity: 1, nf_calories: 45, nf_protein: 10, nf_serving_size_unit: 'oz', nf_total_carbohydrate: 0, username: 'talk2cbo', meal: 'Select Meal', date: '' },
    { item_name: 'Crustaceans, crab, alaska king, cooked, moist heat - 3 oz', quantity: 5, nf_calories: 412.25, nf_protein: 82.25, nf_serving_size_unit: 'oz', nf_total_carbohydrate: 0, username: 'talk2cbo', meal: 'Select Meal', date: '' },
    { item_name: 'Salmon, cooked - 1 fillet', quantity: 1, nf_calories: 467.62, nf_protein: 50.18, nf_serving_size_unit: 'fillet', nf_total_carbohydrate: 0, username: 'talk2cbo', meal: 'Select Meal', date: '' },
    { item_name: 'Halibut', quantity: 1, nf_calories: 200, nf_protein: 15, nf_serving_size_unit: 'fillets', nf_total_carbohydrate: 17, username: 'talk2cbo', meal: 'Select Meal', date: '' },
    { item_name: 'Spaghetti and Meatballs', quantity: 1, nf_calories: 320, nf_protein: 22, nf_serving_size_unit: 'meal', nf_total_carbohydrate: 41, username: 'talk2cbo', meal: 'Select Meal', date: '' },
    { item_name: 'Cereal', quantity: 1, nf_calories: 110, nf_protein: 2, nf_serving_size_unit: 'cup', nf_total_carbohydrate: 24, username: 'talk2cbo', meal: 'Select Meal', date: '' },
    { item_name: 'Waffle - 1 waffle, round (8" dia)', quantity: 1, nf_calories: 357.94, nf_protein: 9.72, nf_serving_size_unit: 'waffle, round (8" dia)', nf_total_carbohydrate: 40.48, username: 'talk2cbo', meal: 'Select Meal', date: '' },
    { item_name: 'Bacon - 1 slice', quantity: 4, nf_calories: 177.56, nf_protein: 11.56, nf_serving_size_unit: 'slice', nf_total_carbohydrate: 0.44, username: 'talk2cbo', meal: 'Select Meal', date: '' },
    { item_name: 'Frozen yogurts, flavors other than chocolate - 1 cup', quantity: 1, nf_calories: 220.98, nf_protein: 5.22, nf_serving_size_unit: 'cup', nf_total_carbohydrate: 37.58, username: 'talk2cbo', meal: 'Select Meal', date: '' },
    { item_name: 'Turkey Sandwich - 1 sandwich', quantity: 1, nf_calories: 323.7, nf_protein: 20.7, nf_serving_size_unit: 'sandwich', nf_total_carbohydrate: 29.12, username: 'talk2cbo', meal: 'Select Meal', date: '' },
    { item_name: 'A Wreck, BIGS', quantity: 1, nf_calories: 870, nf_protein: 45, nf_serving_size_unit: 'Sandwich', nf_total_carbohydrate: 79, username: 'talk2cbo', meal: 'Select Meal', date: '' },
    { item_name: 'Ravioli', quantity: 1, nf_calories: 230, nf_protein: 10, nf_serving_size_unit: 'cup', nf_total_carbohydrate: 37, username: 'talk2cbo', meal: 'Select Meal', date: '' },
    { item_name: 'Italian Beef - 1 serving', quantity: 1, nf_calories: 925.77, nf_protein: 109.66, nf_serving_size_unit: 'serving', nf_total_carbohydrate: 29.31, username: 'talk2cbo', meal: 'Select Meal', date: '' },
    { item_name: 'Baklava - 1 piece', quantity: 1, nf_calories: 306.32, nf_protein: 5.46, nf_serving_size_unit: 'piece', nf_total_carbohydrate: 29.41, username: 'talk2cbo', meal: 'Select Meal', date: '' },
    { item_name: 'Cake, chocolate, commercially prepared with chocolate frosting, in - 1 piece', quantity: 1, nf_calories: 424.01, nf_protein: 3.79, nf_serving_size_unit: 'piece', nf_total_carbohydrate: 57.6, username: 'talk2cbo', meal: 'Select Meal', date: '' },
    { item_name: 'Cheesecake commercially prepared - 1 piece (1 NLEA serving)', quantity: 1, nf_calories: 401.25, nf_protein: 6.88, nf_serving_size_unit: 'piece (1 NLEA serving)', nf_total_carbohydrate: 31.88, username: 'talk2cbo', meal: 'Select Meal', date: '' },
    { item_name: 'Sausage - 2 links', quantity: 1, nf_calories: 149.5, nf_protein: 8.52, nf_serving_size_unit: 'links', nf_total_carbohydrate: 0.65, username: 'talk2cbo', meal: 'Select Meal', date: '' },
    { item_name: 'Vanilla Icecream Sandwich', quantity: 1, nf_calories: 180, nf_protein: 3, nf_serving_size_unit: 'sandwich', nf_total_carbohydrate: 33, username: 'talk2cbo', meal: 'Select Meal', date: '' },
    { item_name: 'Carrot Cake - 1 cupcake', quantity: 1, nf_calories: 326.75, nf_protein: 3.71, nf_serving_size_unit: 'cupcake', nf_total_carbohydrate: 41.32, username: 'talk2cbo', meal: 'Select Meal', date: '' }
]


processAnswers = (answers) => {
    console.log(`================================================================`)
    console.log(`username is: ${answers.username}`)
    username = answers.username
    console.log(`number of items to generate per day is: ${answers.numItems}`)
    numItems = answers.numItems
    console.log(`number of days worth of data to generate: ${answers.days}`)
    days = answers.days
    console.log(`================================================================`)
    startLoading()
}

startLoading = () => {
    console.log(`starting the load processing`)

    for (let numdays = days; numdays > 0; numdays--) {
        console.log(`running with current numdays = ${numdays}`)
        // subtract numdays from date
        d = new Date();
        d.setDate(d.getDate() - numdays + 1);
        for (let items = 0; items < numItems; items++) {
            console.log(`running for item = ${items}`)

            // randomly select a food item from our array
            let selected_item = food_array[Math.floor(Math.random() * food_array.length)]
            selected_item.date = d           // overlay with the desired date
            selected_item.username = username    // overaly with the preferred username

            db.Food
                .create(selected_item)
                .then(dbFood => {
                    return db.User.findOneAndUpdate({ username: username }, { $push: { food: dbFood._id } })
                })
                .then(dbUser => console.log(`completed adding: ${dbUser}`))
                .catch(err => console.log(`we've got an error from the db: ${err}`))
        }
    }

    console.log(`finished loading`)
}

inquirer.prompt([
    {
        type: 'input',
        name: 'username',
        message: 'Enter the associated username? '
    },
    {
        type: 'input',
        name: 'numItems',
        message: 'How many food items per day? '
    },
    {
        type: 'input',
        name: 'days',
        message: 'How many days to generate data? '
    }
]).then((answers) => {
    processAnswers(answers)
})