-- Используем базу данных store_db
USE store_db;

-- 1. Представление 1: Список спортивных товаров с их брендами
CREATE VIEW SportsDevicesWithBrands AS
SELECT 
    p.product_ID AS product_id,
    p.name_product AS product_name,
    p.price AS sale_price,
    b.name_brand AS brand_name
FROM 
    Product p
JOIN 
    Brand b ON p.brand_ID = b.brand_ID;

-- 2. Представление 2: Список пользователей (клиентов) и товаров в их корзинах
-- Здесь мы используем таблицу "Order" для отображения товаров в корзине.

CREATE OR REPLACE VIEW UserBasketSportsDevices AS
SELECT 
    c.client_ID AS client_id,
    c.email,
    p.product_ID AS product_id,
    p.name_product AS product_name,
    p.price AS sale_price,
    b.name_brand AS brand_name
FROM 
    "Order" o
JOIN 
    Client c ON o.client_ID = c.client_ID
JOIN 
    Order_detail od ON o.check_ID = od.check_ID
JOIN 
    Product p ON od.product_ID = p.product_ID
JOIN 
    Brand b ON p.brand_ID = b.brand_ID;

-- 3. Представление 3: Список товаров с их ценой и характеристиками
-- Здесь мы предполагаем, что описание товара (характеристики) хранится в поле description таблицы Product.

CREATE VIEW SportsDevicesWithInfo AS
SELECT 
    p.product_ID,
    p.name_product,
    p.price AS sale_price,
    p.description AS product_info_description
FROM 
    Product p;

-- 4. Представление 4: Список клиентов с общей суммой, потраченной на спортивные товары
CREATE VIEW CustomersTotalSpentOnSports AS
SELECT 
    c.client_ID AS client_id,
    c.email,
    SUM(od.price * od.quantity) AS total_spent
FROM 
    Client c
JOIN 
    "Order" o ON c.client_ID = o.client_ID
JOIN 
    Order_detail od ON o.check_ID = od.check_ID
GROUP BY 
    c.client_ID, c.email;

-- 5. Представление 5: Список товаров с их ценой и средней ценой по бренду
CREATE VIEW SportsDevicesWithAvgBrandPrice AS
SELECT 
    p.product_ID AS product_id,
    p.name_product AS product_name,
    b.name_brand AS brand_name,
    p.price AS sale_price,
    (
        SELECT AVG(price)
        FROM Product
        WHERE brand_ID = p.brand_ID
    ) AS avg_brand_price
FROM 
    Product p
JOIN 
    Brand b ON p.brand_ID = b.brand_ID;

-- 2. Запросы к представлениям
SELECT * FROM SportsDevicesWithBrands;
SELECT * FROM UserBasketSportsDevices;
SELECT * FROM SportsDevicesWithInfo;
SELECT * FROM CustomersTotalSpentOnSports;
SELECT * FROM SportsDevicesWithAvgBrandPrice;

-- 3. Обновление цены товара
UPDATE SportsDevicesWithInfo
SET sale_price = 70000
WHERE product_ID = 1;

-- 4. Удаление представлений
DROP VIEW SportsDevicesWithBrands;
DROP VIEW UserBasketSportsDevices;
DROP VIEW SportsDevicesWithInfo;
DROP VIEW CustomersTotalSpentOnSports;
DROP VIEW SportsDevicesWithAvgBrandPrice;


-- Лаб 7
-- 1
-- Объявление переменных и вывод
DO $$ 
DECLARE 
    product_id INT := 101;  -- ID товара
    product_name TEXT := 'Nike Air Zoom';  -- Название товара
    sale_price NUMERIC := 199.99;  -- Цена товара
BEGIN
    -- Вывод значений переменных через RAISE NOTICE
    RAISE NOTICE 'Product ID: %, Product Name: %, Sale Price: %', product_id, product_name, sale_price;
END $$;


-- 2
-- Создаем процедуру, которая принимает ID товара и увеличивает его цену:
-- если текущая цена меньше 50 000, она увеличивается на 10%;
-- в противном случае цена увеличивается на 5%.
CREATE OR REPLACE PROCEDURE update_sport_product_price(p_product_id INT)
LANGUAGE plpgsql
AS $$ 
DECLARE
    v_price NUMERIC;
BEGIN
    -- Получаем текущую цену товара
    SELECT price INTO v_price FROM Sport_Product WHERE product_ID = p_product_id;

    -- Увеличиваем цену на 10% если меньше 50000, иначе на 5%
    IF v_price < 50000 THEN
        UPDATE Sport_Product SET price = price * 1.10 WHERE product_ID = p_product_id;
    ELSE
        UPDATE Sport_Product SET price = price * 1.05 WHERE product_ID = p_product_id;
    END IF;
END;
$$;

CALL update_sport_product_price(1);  -- обновит цену для товара с product_ID = 1

SELECT * FROM Sport_Product WHERE product_ID = 1;




-- 3
-- Увеличиваем цену всех товаров бренда, пока средняя цена не превысит 70 000
DO $$ 
DECLARE
    avg_price NUMERIC;
BEGIN
    -- Получаем начальное среднее значение цены
    SELECT AVG(price) INTO avg_price FROM Sport_Product WHERE brand_ID = 1;

    -- Цикл: увеличиваем цены на 5%, пока среднее значение не станет выше 70000
    WHILE avg_price <= 70000 LOOP
        UPDATE Sport_Product
        SET price = price * 1.05
        WHERE brand_ID = 1;

        -- Пересчитываем среднюю цену
        SELECT AVG(price) INTO avg_price FROM Sport_Product WHERE brand_ID = 1;
    END LOOP;
END $$;

SELECT product_ID, name_product, price FROM Sport_Product WHERE brand_ID = 1;


-- 4
-- Процедура уменьшает скидку на 1% от текущей величины скидки до тех пор, 
-- пока средняя скидка не станет меньше 5% от средней цены товара.
CREATE OR REPLACE PROCEDURE DecreaseSportProductDiscounts()
AS
$$
DECLARE
    v_avg_discount DECIMAL(10,2);
    v_avg_price DECIMAL(10,2);
    v_maxiterations INT DEFAULT 100;  -- Максимальное количество итераций
    v_counter INT DEFAULT 0;  -- Счётчик итераций
BEGIN
    -- Вычисляем среднюю скидку и среднюю цену
    SELECT AVG(price * discount / 100), AVG(price) INTO v_avg_discount, v_avg_price FROM Sport_Product;
    
    -- Начинаем цикл, который будет работать до тех пор, пока средняя скидка не станет меньше 5% от средней цены или не достигнем максимального количества итераций
    LOOP
        -- Уменьшаем цену со скидкой на 1%
        UPDATE Sport_Product 
        SET price = price - (price * discount / 100 * 0.01)
        WHERE discount > 0;
        
        -- Пересчитываем среднюю скидку и среднюю цену
        SELECT AVG(price * discount / 100), AVG(price) INTO v_avg_discount, v_avg_price FROM Sport_Product;
        
        -- Увеличиваем счётчик итераций
        v_counter := v_counter + 1;
        
        -- Проверяем условия выхода из цикла
        EXIT WHEN (v_avg_discount / v_avg_price * 100) < 5 OR v_counter >= v_maxiterations;
    END LOOP;
    
    -- Вывод количества итераций в журнал
    RAISE NOTICE 'Iterations: %', v_counter;
END;
$$
LANGUAGE plpgsql;

CALL DecreaseSportProductDiscounts();

SELECT AVG(price * discount / 100), AVG(price) FROM Sport_Product;

-- 5
-- Процедура увеличивает цену продажи всех товаров бренда 'Nike' на 5%, 
-- пока средняя наценка не превысит 7000.
CREATE OR REPLACE PROCEDURE IncreaseNikeMarkupUntilThreshold()
AS
$$
DECLARE
    v_avg_markup DECIMAL(10,2);
    v_max_iterations INT DEFAULT 100;
    v_counter INT DEFAULT 0;
BEGIN
    -- Получаем начальную среднюю наценку для бренда Nike
    SELECT AVG(p.price - p.purchase_price)
    INTO v_avg_markup
    FROM Sport_Product p
    JOIN Brand b ON p.brand_ID = b.brand_ID
    WHERE b.name_brand = 'Nike';

    -- Цикл увеличения цены продажи, пока средняя наценка < 7000 или не превышен лимит итераций
    LOOP
        EXIT WHEN v_avg_markup >= 7000 OR v_counter >= v_max_iterations;

        -- Увеличиваем цену продажи на 5%
        UPDATE Sport_Product
        SET price = price * 1.05
        FROM Brand
        WHERE Sport_Product.brand_ID = Brand.brand_ID
          AND Brand.name_brand = 'Nike';

        -- Пересчитываем среднюю наценку
        SELECT AVG(p.price - p.purchase_price)
        INTO v_avg_markup
        FROM Sport_Product p
        JOIN Brand b ON p.brand_ID = b.brand_ID
        WHERE b.name_brand = 'Nike';

        -- Увеличиваем счётчик
        v_counter := v_counter + 1;
    END LOOP;

    -- Выводим в журнал количество итераций
    RAISE NOTICE 'Iterations: %', v_counter;
END;
$$
LANGUAGE plpgsql;

-- До вызова:
SELECT AVG(p.price - p.purchase_price) AS avg_markup
FROM Sport_Product p
JOIN Brand b ON p.brand_ID = b.brand_ID
WHERE b.name_brand = 'Nike';

-- Вызов процедуры:
CALL IncreaseNikeMarkupUntilThreshold();

-- После вызова:
SELECT AVG(p.price - p.purchase_price) AS avg_markup
FROM Sport_Product p
JOIN Brand b ON p.brand_ID = b.brand_ID
WHERE b.name_brand = 'Nike';



-- 1. Триггер: При обнулении количества товара на складе автоматически удаляются все записи этого устройства из корзин пользователей

CREATE OR REPLACE FUNCTION delete_from_basket_when_stock_empty()
RETURNS TRIGGER AS $$ 
BEGIN
    IF NEW.quantity_in_stock = 0 THEN
        DELETE FROM "basket_product"
        WHERE "productId" = NEW.id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_delete_from_basket_when_stock_empty
AFTER UPDATE ON "product"
FOR EACH ROW
EXECUTE FUNCTION delete_from_basket_when_stock_empty();

-- Уменьшаем количество товара до 0
UPDATE "product"    
SET quantity_in_stock = 0
WHERE id = 5;

-- Проверяем, остались ли такие товары в корзинах
SELECT * FROM "basket_product" WHERE "productId" = 5;

-- Удаляем триггер и функцию
DROP TRIGGER IF EXISTS trg_delete_from_basket_when_stock_empty ON "product";
DROP FUNCTION IF EXISTS delete_from_basket_when_stock_empty;


-- 2. Триггер на проверку возраста пользователя при добавлении нового пользователя
CREATE OR REPLACE FUNCTION check_user_age()
RETURNS TRIGGER AS $$ 
BEGIN
  -- Проверяем возраст
  IF (DATE_PART('year', AGE(NEW.date_of_birth)) < 18) THEN
    RAISE EXCEPTION 'Пользователь должен быть старше 18 лет';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_check_user_age
BEFORE INSERT ON "customer"
FOR EACH ROW
EXECUTE FUNCTION check_user_age();

-- Попытка добавить пользователя младше 18 лет (будет ошибка)
INSERT INTO "customer" (email, password, role, "createdAt", "updatedAt", date_of_birth) 
VALUES ('younguser@example.com', 'password123', 'USER', NOW(), NOW(), '2010-01-01');

-- Попытка добавить взрослого пользователя (будет успех)
INSERT INTO "customer" (email, password, role, "createdAt", "updatedAt", date_of_birth) 
VALUES ('adultuser@example.com', 'password123', 'USER', NOW(), NOW(), '1990-01-01');


-- 3. Триггер для автоматического расчета скидки при добавлении нового товара
CREATE OR REPLACE FUNCTION calculate_product_discount()
RETURNS TRIGGER AS $$ 
BEGIN
  NEW.discount = NEW.sale_price * 0.05;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_calculate_product_discount
BEFORE INSERT ON "product"
FOR EACH ROW
EXECUTE FUNCTION calculate_product_discount();

-- Добавляем новый товар
INSERT INTO "product" (id, name, purchase_price, sale_price, rating, img, discount, "brandId", "categoryId", "createdAt", "updatedAt")
VALUES (100, 'Football', 500, 1500, 5, 'football.jpg', 0, 1, 1, NOW(), NOW());


-- 4. Триггер для автоматического расчета комиссии при добавлении товара
CREATE OR REPLACE FUNCTION calculate_product_commission()
RETURNS TRIGGER AS $$ 
BEGIN
  -- Предположим, комиссия всегда 5%
  NEW.commission = NEW.sale_price * 0.05;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_calculate_product_commission
BEFORE INSERT ON "product"
FOR EACH ROW
EXECUTE FUNCTION calculate_product_commission();

-- Добавляем новый товар
INSERT INTO "product" (id, name, purchase_price, sale_price, rating, img, discount, commission, "brandId", "categoryId", "createdAt", "updatedAt")
VALUES (16, 'Tennis Racket', 800, 1200, 5, 'tennis_racket.jpg', 0, 0, 1, 1, NOW(), NOW());


-- 5. Триггер на проверку уникальности номера телефона в таблице "customer"
CREATE OR REPLACE FUNCTION check_unique_customer_phone()
RETURNS TRIGGER AS $$ 
BEGIN
  -- Проверка: если существует другой клиент с таким же номером
  IF EXISTS (SELECT 1 FROM "customer" WHERE phone = NEW.phone) THEN
    RAISE EXCEPTION 'Номер телефона не уникален';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_check_unique_customer_phone
BEFORE INSERT ON "customer"
FOR EACH ROW
EXECUTE FUNCTION check_unique_customer_phone();

-- Успешная вставка клиента с уникальным номером
INSERT INTO "customer" (email, password, role, phone, "createdAt", "updatedAt")
VALUES ('ivanov1@example.com', 'password123', 'USER', '1234567891', NOW(), NOW());

-- Попытка вставить другого клиента с таким же номером телефона
INSERT INTO "customer" (email, password, role, phone, "createdAt", "updatedAt")
VALUES ('petrova@example.com', 'password123', 'USER', '1234567891', NOW(), NOW());


-- 8. Триггер для обновления города сотрудника, если он изменился у поставщика
CREATE TABLE Supplier_phone_log (
    log_ID SERIAL PRIMARY KEY,
    supplier_ID INT,
    old_phone VARCHAR(20),
    new_phone VARCHAR(20),
    change_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (supplier_ID) REFERENCES Supplier(supplier_ID)
);

DELIMITER $$

CREATE TRIGGER log_supplier_phone_change
AFTER UPDATE ON Supplier
FOR EACH ROW
BEGIN
    IF OLD.phone_number <> NEW.phone_number THEN
        INSERT INTO Supplier_phone_log (supplier_ID, old_phone, new_phone)
        VALUES (NEW.supplier_ID, OLD.phone_number, NEW.phone_number);
    END IF;
END$$

DELIMITER ;

-- 9. Триггер для проверки возраста клиента при добавлении
ALTER TABLE "client"
ADD COLUMN date_of_birth DATE;

DELIMITER //

CREATE TRIGGER check_client_age
BEFORE INSERT ON "client"
FOR EACH ROW
BEGIN
    IF (YEAR(CURDATE()) - YEAR(NEW.date_of_birth)) < 18 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Client must be at least 18 years old';
    END IF;
END //

DELIMITER ;

-- 10. Триггер для расчета комиссии на заказ
ALTER TABLE "order" ADD COLUMN commission DECIMAL(10,2);

DELIMITER //
CREATE TRIGGER calculate_order_commission
BEFORE INSERT ON "order"
FOR EACH ROW
BEGIN
    SET NEW.commission = NEW.total_sum * 0.05;
END //
DELIMITER ;

-- 11. Триггер на уникальность телефона сотрудника
DELIMITER //
CREATE TRIGGER check_unique_employee_phone
BEFORE INSERT ON "employees"
FOR EACH ROW
BEGIN
    IF EXISTS (SELECT 1 FROM "employees" WHERE phone_number = NEW.phone_number) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Phone number must be unique among employees';
    END IF;
END //
DELIMITER ;

-- 12. Триггер на автоматическое добавление бренда в таблицу Brand, если при добавлении нового товара указан новый бренд
DELIMITER //
CREATE TRIGGER add_brand_if_not_exists
BEFORE INSERT ON "product"
FOR EACH ROW
BEGIN
    IF NOT EXISTS (SELECT 1 FROM "brand" WHERE brand_ID = NEW.brand_ID) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Brand does not exist. Please add it to Brand table first.';
    END IF;
END //
DELIMITER ;


-- 1. Генерация электронной почты для клиентов
SELECT
  client_ID,
  login,
  CONCAT(login, '@example.com') AS generated_email
FROM Client;

-- 2. Найти клиентов старше 30 лет и показать их возраст
SELECT
  client_ID,
  login,
  TIMESTAMPDIFF(YEAR, date_of_birth, CURDATE()) AS age
FROM Client
WHERE TIMESTAMPDIFF(YEAR, date_of_birth, CURDATE()) > 30;

-- 3. Объединение имени и фамилии риелтора
SELECT
  employees_ID,
  CONCAT(name, ' ', surname) AS full_name
FROM Employees;

-- 4. Преобразование телефона клиента в единый формат
SELECT
  employees_ID,
  phone_number,
  CONCAT('+7', REPLACE(REPLACE(REPLACE(phone_number, '-', ''), '+7', ''), ' ', '')) AS formatted_phone
FROM Employees;

-- 5. Формирование имени клиента в формате "И.Фамилия"
SELECT
  employees_ID,
  CONCAT(LEFT(name, 1), '. ', surname) AS formatted_name
FROM Employees;

-- 1. Расчет стоимости товара с учетом скидки
DROP FUNCTION IF EXISTS CalculateDiscountedPrice;

DELIMITER $$

CREATE FUNCTION CalculateDiscountedPrice(
    price DECIMAL(18, 2),
    discount DECIMAL(5, 2)
)
RETURNS DECIMAL(18, 2)
DETERMINISTIC
BEGIN
    RETURN price * (1 - discount);
END$$

DELIMITER ;

SELECT 
    product_ID, 
    name_product, 
    price, 
    0.15 AS discount, 
    CalculateDiscountedPrice(price, 0.15) AS discounted_price
FROM Product;

-- 2. Определение категории сотрудника по зарплате
DELIMITER $$

CREATE FUNCTION GetEmployeeCategory(
    salary DECIMAL(18,2)
)
RETURNS VARCHAR(10)
DETERMINISTIC
BEGIN
    DECLARE category VARCHAR(10);
    
    IF salary < 50000 THEN
        SET category = 'Junior';
    ELSEIF salary BETWEEN 50000 AND 70000 THEN
        SET category = 'Middle';
    ELSE
        SET category = 'Senior';
    END IF;
    
    RETURN category;
END$$

DELIMITER ;

SELECT 
    employees_ID, 
    name, 
    surname, 
    salary, 
    GetEmployeeCategory(salary) AS category
FROM Employees;

-- 3. Вычисление возраста клиента
ALTER TABLE Client ADD COLUMN birth_date DATE;

DELIMITER $$

CREATE FUNCTION CalculateAge(
    birth_date DATE
)
RETURNS INT
DETERMINISTIC
BEGIN
    RETURN TIMESTAMPDIFF(YEAR, birth_date, CURDATE());
END$$

DELIMITER ;

SELECT 
    client_ID, 
    login, 
    email, 
    birth_date, 
    CalculateAge(birth_date) AS age
FROM Client;

-- 4. Расчет комиссии магазина за заказ
DELIMITER $$

CREATE FUNCTION CalculateCommission(
    total_sum DECIMAL(18,2),
    commission_rate DECIMAL(5,2)
)
RETURNS DECIMAL(18,2)
DETERMINISTIC
BEGIN
    RETURN total_sum * commission_rate;
END$$

DELIMITER ;

SELECT 
    check_ID, 
    total_sum, 
    0.05 AS commission_rate, 
    CalculateCommission(total_sum, 0.05) AS commission_amount
FROM `Order`;

-- 5. Расчет средней цены товаров по категории
DELIMITER $$

CREATE FUNCTION GetAverageProductPrice(
    category_name VARCHAR(50)
)
RETURNS DECIMAL(18,2)
DETERMINISTIC
BEGIN
    DECLARE avg_price DECIMAL(18,2);
    
    SELECT AVG(p.price) INTO avg_price
    FROM Product p
    JOIN Product_category pc ON p.product_category_ID = pc.product_category_ID
    WHERE pc.name_category = category_name;
    
    RETURN avg_price;
END$$

DELIMITER ;

SELECT GetAverageProductPrice('Обувь') AS average_price_for_shoes;

