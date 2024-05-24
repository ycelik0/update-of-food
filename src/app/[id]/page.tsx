import React from "react";
import axios from "axios";
import FoodItem from "./FoodItem";

export default async function Page({ params }: { params: { id: string } }) {
  try {
    const response = await axios.get(
      `http://localhost:3000/api/food/${params.id}`
    );
    return <FoodItem food={response.data.food} />;
  } catch (error) {
    return (
      <div>
        <p>Error Loading food</p>
        <p>{JSON.stringify(error)}</p>
      </div>
    );
  }
}
