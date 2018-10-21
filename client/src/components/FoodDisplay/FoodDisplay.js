import React from "react";
import "./FoodDisplay.css";

const FoodDisplay = props => (
    // table hard-coded as placeholder. Will map through results in future version
    <table className="table-striped food-list">
        <thead>
            <tr>
                <th scope="col">Item</th>
                <th scope="col">Calories</th>
                <th scope="col">Quantity</th>

            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Apple</td>
                <td>100</td>
                <td>2</td>

            </tr>
            <tr>
                <td>Clif Bar</td>
                <td>300</td>
                <td>1</td>

            </tr>
            <tr>
                <td>Banana</td>
                <td>85</td>
                <td>1</td>

            </tr>
        </tbody>
    </table>

);

export default FoodDisplay;