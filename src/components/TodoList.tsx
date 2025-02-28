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

  const moveToCategory = (item: Item) => {
    setItems((prevItems) => prevItems.filter((i) => i.id !== item.id));
    if (item.type === "fruit") {
      setFruits((prev) => [...prev, item]);
    } else {
      setVegetables((prev) => [...prev, item]);
    }
  };

  const moveToMainColumn = (item: Item) => {
    if (item.type === "fruit") {
      setFruits((prev) => prev.filter((i) => i.id !== item.id));
    } else {
      setVegetables((prev) => prev.filter((i) => i.id !== item.id));
    }
    setItems((prevItems) => [...prevItems, item]);
  };

  useEffect(() => {
    if (fruits.length > 0 || vegetables.length > 0) {
      const timer = setTimeout(() => {
        const allItems = [...fruits, ...vegetables];
        setItems((prevItems) => [...prevItems, ...allItems]);
        setFruits([]); 
        setVegetables([]); 
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [fruits, vegetables]);

  return (
    <div className="container">
      <h1>Auto Delete Todo List</h1>
      <div className="warp">
        <div className="column">
          <h2 className="head">All Items</h2>
          <div className="detail">
            {items.map((item) => (
              <button key={item.id} onClick={() => moveToCategory(item)}>
                {item.name}
              </button>
            ))}
          </div>
        </div>
        <div className="column">
          <h2 className="head">Fruits</h2>
          <div className="detail">
            {fruits.map((item) => (
              <button key={item.id} onClick={() => moveToMainColumn(item)}>
                {item.name}
              </button>
            ))}
          </div>
            <div className="btn"></div>
        </div>
        <div className="column">
          <h2 className="head">Vegetables</h2>
          <div className="detail">
            {vegetables.map((item) => (
              <button key={item.id} onClick={() => moveToMainColumn(item)}>
                {item.name}
              </button>
            ))}
            <div className="btn"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodoList;
