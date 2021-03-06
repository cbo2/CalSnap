import React from "react";
import "./FoodDisplay.css";

export const FoodDisplay = ({ children }) => {
    return (
        <table className="table table-striped food-list">
            <thead>
                <tr>
                    <th scope="col">Item</th>
                    <th scope="col">Calories</th>
                    <th scope="col">Quantity</th>
                    <th scope="col">Update</th>
                    <th scope="col">Remove</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    {children}
                </tr>

            </tbody>
        </table>

    );
};

