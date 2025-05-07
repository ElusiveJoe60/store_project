-- Заполнение таблицы brand
INSERT INTO brand (id, name, "createdAt", "updatedAt") VALUES
(1, 'Nike', NOW(), NOW()),
(2, 'Adidas', NOW(), NOW()),
(3, 'Puma', NOW(), NOW()),
(4, 'Reebok', NOW(), NOW()),
(5, 'Under Armour', NOW(), NOW()),
(6, 'New Balance', NOW(), NOW()),
(7, 'Asics', NOW(), NOW()),
(8, 'Columbia', NOW(), NOW()),
(9, 'The North Face', NOW(), NOW()),
(10, 'Salomon', NOW(), NOW());

SELECT * FROM brand;


-- Заполнение таблицы products
-- TRUNCATE TABLE products RESTART IDENTITY CASCADE;

INSERT INTO products (id, name, purchase_price, sale_price, rating, img, quantity_in_stock, "createdAt", "updatedAt", "brandId")
VALUES
  (1, 'Nike Air Max 270', 7000, 9000, 4.8, 'nike_air_max_270.jpg', 100, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1),
  (2, 'Adidas UltraBoost 21', 9500, 11500, 4.7, 'adidas_ultraboost_21.jpg', 80, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2),
  (3, 'Puma RS-X3', 6000, 7500, 4.5, 'puma_rs_x3.jpg', 90, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 3),
  (4, 'Reebok Nano X1', 8000, 9500, 4.6, 'reebok_nano_x1.jpg', 70, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 4),
  (5, 'Under Armour HOVR Phantom', 10500, 12500, 4.7, 'under_armour_hovr_phantom.jpg', 60, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 5),
  (6, 'New Balance Fresh Foam 1080v11', 12000, 14000, 4.6, 'new_balance_fresh_foam_1080v11.jpg', 50, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 6),
  (7, 'Asics Gel-Kayano 28', 11000, 13000, 4.8, 'asics_gel_kayano_28.jpg', 75, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 7),
  (8, 'Columbia Montrail', 9500, 11500, 4.6, 'columbia_monttrail.jpg', 65, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 8),
  (9, 'The North Face Ultra', 10500, 12500, 4.7, 'the_north_face_ultra.jpg', 40, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 9),
  (10, 'Salomon Speedcross 5', 12000, 14500, 4.9, 'salomon_speedcross_5.jpg', 30, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 10);

SELECT * FROM products;


UPDATE device
SET img = REPLACE(img, '.jpg', '.webp')
WHERE img LIKE '%.jpg';


-- Заполнение таблицы product_info
-- TRUNCATE TABLE product_info RESTART IDENTITY CASCADE;

INSERT INTO product_info ("title", "description", "createdAt", "updatedAt", "productId")
VALUES
  ('Размер', '42, 43, 44, 45', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1),  -- Nike Air Max 270
  ('Материал', 'Сетчатый материал, синтетическая кожа', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1),
  ('Тип', 'Кроссовки для бега', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1),
  ('Цвет', 'Черный', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1),
  ('Особенности', 'Подошва с амортизацией, анатомическая стелька', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1),

  ('Размер', '40, 41, 42, 43', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2),  -- Adidas UltraBoost 21
  ('Материал', 'Плетеный текстиль, синтетика', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2),
  ('Тип', 'Кроссовки для бега', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2),
  ('Цвет', 'Белый с черным', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2),
  ('Особенности', 'Амортизация Boost, гибкая подошва', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2),

  ('Размер', '38, 39, 40, 41', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 3),  -- Puma RS-X3
  ('Материал', 'Синтетический материал, текстиль', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 3),
  ('Тип', 'Кроссовки для тренировки', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 3),
  ('Цвет', 'Серый, синий', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 3),
  ('Особенности', 'Система дыхания, легкая подошва', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 3),

  ('Размер', '36, 37, 38, 39', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 4),  -- Reebok Nano X1
  ('Материал', 'Текстиль, синтетический материал', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 4),
  ('Тип', 'Кроссовки для кроссфита', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 4),
  ('Цвет', 'Черный', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 4),
  ('Особенности', 'Жесткая подошва, поддержка стопы', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 4),

  -- Дополнительно добавим новые спортивные товары
  ('Размер', '38, 39, 40, 41', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 5),  -- Under Armour HOVR Phantom
  ('Материал', 'Ткань с мембраной, синтетика', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 5),
  ('Тип', 'Кроссовки для бега', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 5),
  ('Цвет', 'Синий', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 5),
  ('Особенности', 'Подошва с HOVR амортизацией, поддержка арки', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 5),

  ('Размер', '41, 42, 43, 44', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 6),  -- New Balance Fresh Foam 1080v11
  ('Материал', 'Текстиль, сетка', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 6),
  ('Тип', 'Кроссовки для бега', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 6),
  ('Цвет', 'Черный', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 6),
  ('Особенности', 'Технология Fresh Foam, водоотталкивающая мембрана', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 6),

  ('Размер', '39, 40, 41, 42', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 7),  -- Asics Gel-Kayano 28
  ('Материал', 'Синтетический материал, текстиль', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 7),
  ('Тип', 'Кроссовки для бега', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 7),
  ('Цвет', 'Серый, черный', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 7),
  ('Особенности', 'Подошва с амортизацией, стабильность при беге', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 7),

  ('Размер', '42, 43, 44, 45', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 8),  -- Columbia Montrail
  ('Материал', 'Синтетический, текстиль', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 8),
  ('Тип', 'Обувь для активного отдыха', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 8),
  ('Цвет', 'Зеленый', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 8),
  ('Особенности', 'Прочные, водоотталкивающие свойства, усиленная подошва', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 8);

SELECT * FROM product_info;


-- Заполнение таблицы user (пользователи)
-- INSERT INTO "user" (id, email, "createdAt", "updatedAt")
-- VALUES
--   (1, 'user1@example.com', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
--   (2, 'user2@example.com', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
--   (3, 'user3@example.com', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
--   (4, 'user4@example.com', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- 	SELECT * FROM "user"


	-- Заполнение таблицы basket (корзины пользователей)
-- INSERT INTO basket (id, "createdAt", "updatedAt", "userId")
-- VALUES
--   (1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1),
--   (2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2),
--   (3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 3),
--   (4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 4);

-- SELECT * FROM basket


-- Заполнение таблицы basket_device (связь корзины и устройств)
-- INSERT INTO basket_device (id, quantity, "createdAt", "updatedAt", "basketId", "deviceId")
-- VALUES
--   (1, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1, 1),  -- Корзина 1, iPhone 12
--   (2, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1, 2),  -- Корзина 1, Samsung Galaxy S21
--   (3, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2, 3),  -- Корзина 2, Xiaomi Mi 11
--   (4, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2, 4),  -- Корзина 2, Oppo Reno 6
--   (5, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 3, 1),  -- Корзина 3, iPhone 12
--   (6, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 3, 5),  -- Корзина 3, Huawei P40
--   (7, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 4, 6);  -- Корзина 4, OnePlus 9

-- SELECT * FROM basket_device



-- SELECT device.name AS device_name, sale_price, rating
-- FROM device
-- JOIN brand ON device."brandId" = brand.id
-- WHERE brand.name = 'Apple';


-- select * from device

-- Добавляем заказ в таблицу заказов для спортивных товаров
INSERT INTO "order" ("userId", "productId", "quantity", "createdAt", "updatedAt")
VALUES
(1, 2, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),  -- заказ для Adidas UltraBoost 21
(2, 3, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),  -- заказ для Puma RS-X3
(3, 4, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),  -- заказ для Reebok Nano X1
(1, 5, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),  -- заказ для Under Armour HOVR Phantom
(2, 6, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);  -- заказ для New Balance Fresh Foam 1080v11

SELECT * FROM "order";

-- Получаем количество пользователей
SELECT COUNT(*) FROM "user";

-- Получаем количество заказов
SELECT COUNT(*) FROM "order";

-- Получаем сумму всех заказанных товаров (по количеству)
SELECT SUM("quantity") FROM "order";


-- Добавляем колонку дата рождения для пользователей
ALTER TABLE "user"
ADD COLUMN date_of_birth DATE NOT NULL DEFAULT '2000-01-01';

SELECT * FROM "user";


-- Добавляем колонку скидка для товара
ALTER TABLE product
ADD COLUMN discount NUMERIC(12, 2) DEFAULT 0 NOT NULL;

-- Добавляем комиссию для товара (например, для партнёрских товаров)
ALTER TABLE product
ADD COLUMN commission DECIMAL(10, 2) DEFAULT 0;

-- Добавляем номер телефона для пользователей
ALTER TABLE "user"
ADD COLUMN phone VARCHAR(20);

-- Добавляем колонку commission для товаров
ALTER TABLE product
ADD COLUMN commission DECIMAL(10, 2) DEFAULT 0;

-- Добавляем имя и фамилию пользователя
ALTER TABLE "user"
ADD COLUMN first_name VARCHAR(255),
ADD COLUMN last_name VARCHAR(255);

SELECT * FROM product;
