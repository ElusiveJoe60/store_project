import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchOneDevice } from "../http/deviceAPI";
import { useBasket } from "../context/BasketContext";
import { BsCartPlus, BsCheckLg, BsStarFill } from "react-icons/bs";

const ProductsPage = () => {
  const [device, setDevice] = useState({ info: [] });
  const { id } = useParams();
  const { addToBasket } = useBasket();
  const [added, setAdded] = useState(false);
  const [tab, setTab] = useState("description");

  useEffect(() => {
    fetchOneDevice(id).then((data) => setDevice(data));
  }, [id]);

  const handleAdd = () => {
    addToBasket(device);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.imageSection}>
          <img
            src={process.env.REACT_APP_API_URL + device.img}
            alt={device.name}
            style={styles.image}
          />
        </div>

        <div style={styles.infoSection}>
          <h2 style={styles.title}>{device.name}</h2>

          <div style={styles.ratingBox}>
            {[...Array(5)].map((_, i) => (
              <BsStarFill
                key={i}
                color={i < device.rating ? "#ffc107" : "#555"}
                size={24}
              />
            ))}
            <span style={styles.ratingValue}>{device.rating}/5</span>
          </div>

          <div style={styles.price}>Цена: {device.sale_price} ₽</div>

          <button style={styles.button} onClick={handleAdd}>
            {added ? (
              <>
                <BsCheckLg size={18} style={{ marginRight: 8 }} />
                В корзине
              </>
            ) : (
              <>
                <BsCartPlus size={18} style={{ marginRight: 8 }} />
                Добавить в корзину
              </>
            )}
          </button>

          <div style={styles.tabs}>
            <button
              style={{
                ...styles.tab,
                backgroundColor: tab === "description" ? "#222" : "#111",
              }}
              onClick={() => setTab("description")}
            >
              Описание
            </button>
            <button
              style={{
                ...styles.tab,
                backgroundColor: tab === "specs" ? "#222" : "#111",
              }}
              onClick={() => setTab("specs")}
            >
              Характеристики
            </button>
          </div>

          <div style={styles.tabContent}>
            {tab === "description" ? (
              <p style={{ color: "#aaa", fontSize: "1rem" }}>
                {device.description || "Описание товара временно отсутствует."}
              </p>
            ) : (
              <div style={styles.specList}>
                {device.info.map((info) => (
                  <div key={info.id} style={styles.specItem}>
                    <strong>{info.title}:</strong> {info.description}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: {
    backgroundColor: "#000",
    color: "#fff",
    padding: "3rem 1rem",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
  },
  card: {
    display: "flex",
    flexDirection: "column",
    maxWidth: "900px",
    width: "100%",
    backgroundColor: "#111",
    borderRadius: "20px",
    boxShadow: "0 0 30px rgba(255,255,255,0.05)",
    overflow: "hidden",
  },
  imageSection: {
    flex: 1,
    backgroundColor: "#222",
    display: "flex",
    justifyContent: "center",
    padding: "2rem",
  },
  image: {
    maxWidth: "100%",
    maxHeight: "400px",
    objectFit: "cover",
    borderRadius: "15px",
    boxShadow: "0 0 20px rgba(255,255,255,0.1)",
  },
  infoSection: {
    flex: 1,
    padding: "2rem",
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
  },
  title: {
    fontSize: "2rem",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: "1rem",
  },
  ratingBox: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "0.5rem",
  },
  ratingValue: {
    color: "#bbb",
    marginLeft: "0.5rem",
  },
  price: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    textAlign: "center",
    color: "#fff",
  },
  button: {
    backgroundColor: "#ffc107",
    border: "none",
    borderRadius: "30px",
    padding: "12px 24px",
    fontWeight: "bold",
    fontSize: "1rem",
    cursor: "pointer",
    color: "#111",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    transition: "0.2s ease-in-out",
  },
  tabs: {
    display: "flex",
    justifyContent: "center",
    marginTop: "1rem",
  },
  tab: {
    flex: 1,
    padding: "0.75rem 1rem",
    fontWeight: "bold",
    cursor: "pointer",
    color: "#fff",
    border: "none",
    backgroundColor: "#111",
    transition: "0.3s",
  },
  tabContent: {
    padding: "1rem",
    borderRadius: "8px",
    backgroundColor: "#1a1a1a",
    marginTop: "1rem",
  },
  specList: {
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
  },
  specItem: {
    fontSize: "1rem",
    color: "#ccc",
    lineHeight: "1.4",
  },
};

export default ProductsPage;
