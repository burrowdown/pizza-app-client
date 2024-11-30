import { useEffect, useState } from "react"
import "./App.css"
import { pizzaPrices } from "../../pizza-server/utils/pizza"

function App() {
  const [allToppings, setAllToppings] = useState([])
  const [showVeg, setShowVeg] = useState(false)
  const [toppings, setToppings] = useState([])
  const [size, setSize] = useState("")
  const [successMessage, setSuccessMessage] = useState("")

  const handleToppingChange = (topping) => {
    setToppings((prev) => {
      if (toppings.includes(topping)) return prev.filter((t) => t !== topping)
      else return [...prev, topping]
    })
  }

  const placeOrder = () => {
    fetch("http://localhost:4000/order/", {
      method: "POST",
      body: JSON.stringify({ toppings, size }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => setSuccessMessage(data.message))
      .then(() => {
        setToppings([])
        setSize("")
      })
      .catch((err) => console.warn(err))
  }

  // fetch toppings
  useEffect(() => {
    fetch(`http://localhost:4000/toppings/?vegetarian=${showVeg}`)
      .then((res) => res.json())
      .then((data) => setAllToppings(data))
      .catch((err) => console.warn(err))
  }, [showVeg])

  if (successMessage) {
    return (
      <div id="menu-wrapper">
        <h3>{successMessage}</h3>
        <h4 onClick={() => setSuccessMessage("")}>Place new Order</h4>
      </div>
    )
  }

  return (
    <div id="menu-wrapper">
      <h3>Size</h3>
      {Object.keys(pizzaPrices.basePrices).map((size) => (
        <div key={size}>
          <input
            type="radio"
            id={size}
            name="pizza-size"
            onChange={() => setSize(size)}
          />
          <label htmlFor={size}>{size}</label>
          <span className="item-price">${pizzaPrices.basePrices[size]}</span>
        </div>
      ))}

      <h3>Toppings</h3>
      <div className="tag-wrapper">
        <span
          className={`tag ${showVeg ? "active" : ""}`}
          onClick={() => setShowVeg(!showVeg)}
        >
          Show Vegetarian
        </span>
      </div>
      {allToppings.map((t) => (
        <div key={t._id}>
          <input
            type="checkbox"
            id={t.name}
            onChange={() => handleToppingChange(t)}
          />
          <label htmlFor={t.name}>{t.displayName}</label>
          <span className="item-price">${t.price}</span>
        </div>
      ))}
      <input
        type="submit"
        id="submit"
        value="Submit Order"
        onClick={placeOrder}
        disabled={!size}
      />
    </div>
  )
}

export default App
