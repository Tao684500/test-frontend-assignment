import React, { useState, useEffect } from "react";
import "../scss/TodoList.scss";

type Item = {
  id: number;
  name: string;
  type: "fruit" | "vegetable";
};

const initialItems: Item[] = [
  { id: 1, name: "Apple", type: "fruit" },
  { id: 2, name: "Carrot", type: "vegetable" },
  { id: 3, name: "Banana", type: "fruit" },
  { id: 4, name: "Broccoli", type: "vegetable" },
];

const TodoList: React.FC = () => {
  const [items, setItems] = useState<Item[]>(initialItems);
  const [fruits, setFruits] = useState<Item[]>([]);
  const [vegetables, setVegetables] = useState<Item[]>([]);

  // Function to move item to a category (Fruits or Vegetables)
  const moveToCategory = (item: Item) => {
    setItems((prevItems) => prevItems.filter((i) => i.id !== item.id));
    if (item.type === "fruit") {
      setFruits((prev) => [...prev, item]);
    } else {
      setVegetables((prev) => [...prev, item]);
    }
  };

  // Function to move item back to the main column (All Items)
  const moveToMainColumn = (item: Item) => {
    if (item.type === "fruit") {
      setFruits((prev) => prev.filter((i) => i.id !== item.id));
    } else {
      setVegetables((prev) => prev.filter((i) => i.id !== item.id));
    }
    setItems((prevItems) => [...prevItems, item]);
  };

  // useEffect to move items back after 5 seconds
  useEffect(() => {
    // If there are any items in fruits or vegetables, start the timer
    if (fruits.length > 0 || vegetables.length > 0) {
      const timer = setTimeout(() => {
        // Move items from fruits and vegetables back to All Items
        const allItems = [...fruits, ...vegetables];
        setItems((prevItems) => [...prevItems, ...allItems]);
        setFruits([]); // Clear fruits
        setVegetables([]); // Clear vegetables
      }, 5000);

      // Clear the timeout on cleanup
      return () => clearTimeout(timer);
    }
  }, [fruits, vegetables]);

  return (
    <div className="container">
      <div className="column">
        <h2>All Items</h2>
        {items.map((item) => (
          <button key={item.id} onClick={() => moveToCategory(item)}>
            {item.name}
          </button>
        ))}
      </div>
      <div className="column">
        <h2>Fruits</h2>
        {fruits.map((item) => (
          <button key={item.id} onClick={() => moveToMainColumn(item)}>
            {item.name}
          </button>
        ))}
      </div>
      <div className="column">
        <h2>Vegetables</h2>
        {vegetables.map((item) => (
          <button key={item.id} onClick={() => moveToMainColumn(item)}>
            {item.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TodoList;
