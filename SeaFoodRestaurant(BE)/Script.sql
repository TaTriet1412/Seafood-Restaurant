-- Drop the database if it exists to start fresh
DROP DATABASE IF EXISTS seafood_restaurant;
-- Create the database
CREATE DATABASE seafood_restaurant;
-- Select the database to use
USE seafood_restaurant;

-- Create the role table
CREATE TABLE `role` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL UNIQUE
);

-- Create the user table
CREATE TABLE `user` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) UNIQUE NOT NULL,
    `password` VARCHAR(255) NOT NULL, -- In a real application, store hashed passwords
    `phone` VARCHAR(20) UNIQUE,
    `role_id` BIGINT,
    `is_active` BIT NOT NULL DEFAULT 1,
    `last_login` DATETIME NULL DEFAULT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`role_id`) REFERENCES `role`(`id`) ON DELETE SET NULL
);

-- Create the category table
CREATE TABLE `category` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL UNIQUE
);

-- Create the dish table
CREATE TABLE `dish` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT,
    `price` DECIMAL(10, 2) NOT NULL CHECK (`price` >= 0),
    `category_id` BIGINT,
    `image` VARCHAR(255),
    `able` BIT NOT NULL DEFAULT 1, -- Availability status
    FOREIGN KEY (`category_id`) REFERENCES `category`(`id`) ON DELETE SET NULL
);

-- Create the shift table
CREATE TABLE `shift` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
    `time_start` DATETIME NOT NULL,
    `time_end` DATETIME NOT NULL
);

-- Create the order_session table
CREATE TABLE `order_session` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
    `shift_id` BIGINT,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `total_price` DECIMAL(10, 2) NOT NULL DEFAULT 0 CHECK (`total_price` >= 0),
    `is_paid` BIT NOT NULL DEFAULT 0,
    `status` VARCHAR(50) DEFAULT 'Pending', -- e.g., Pending, In Progress, Completed, Cancelled
    `payment_time` DATETIME NULL DEFAULT NULL,
    FOREIGN KEY (`shift_id`) REFERENCES `shift`(`id`) ON DELETE SET NULL
);

-- Create the table (restaurant table) table
CREATE TABLE `table` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
    `table_number` INT NOT NULL UNIQUE, -- Added table number for clarity
    `curr_order_session_id` BIGINT NULL DEFAULT NULL UNIQUE, -- A table can only have one active session at a time
    FOREIGN KEY (`curr_order_session_id`) REFERENCES `order_session`(`id`) ON DELETE SET NULL -- If session is deleted, table becomes free
);


-- Create the order table
CREATE TABLE `order` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
    `order_session_id` BIGINT NOT NULL, -- Removed UNIQUE constraint here if one session can have multiple order additions, but keeping it based on original structure (1 order record per session)
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`order_session_id`) REFERENCES `order_session`(`id`) ON DELETE CASCADE -- If session is deleted, the main order record is deleted
);

-- Create the order_log table (Corrected Structure)
CREATE TABLE `order_log` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
    `order_id` BIGINT NULL, -- Reference the specific order this log entry belongs to
    `message` VARCHAR(255),
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`order_id`) REFERENCES `order`(`id`) ON DELETE CASCADE -- If the order is deleted, delete its logs too
);


-- Create the order_detail table
CREATE TABLE `order_detail` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
    `order_id` BIGINT NOT NULL,
    `dish_id` BIGINT NOT NULL,
    `quantity` INT NOT NULL CHECK (`quantity` > 0),
    `price` DECIMAL(10, 2) NOT NULL, -- Price at the time of ordering
    `status` VARCHAR(50) DEFAULT 'Ordered', -- e.g., Ordered, Cooking, Ready, Served, Cancelled
    `note` TEXT,
    FOREIGN KEY (`order_id`) REFERENCES `order`(`id`) ON DELETE CASCADE, -- If order is deleted, delete details
    FOREIGN KEY (`dish_id`) REFERENCES `dish`(`id`) ON DELETE RESTRICT -- Prevent deleting a dish if it's in an order detail
);

-- Create the notification table
CREATE TABLE `notification` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
    `role_id` BIGINT NULL,
    `user_id` BIGINT NULL,
    `message` TEXT NOT NULL,
    `status` BIT NOT NULL DEFAULT 0, -- 0: Unread, 1: Read
    `notification_type` VARCHAR(50) NOT NULL, -- e.g., Order, Service, Stock, System
    `related_id` BIGINT NULL, -- Related entity ID (e.g., order_id, table_id)
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`role_id`) REFERENCES `role`(`id`) ON DELETE SET NULL,
    FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE SET NULL
);

-- Insert Data --

-- Insert Roles
INSERT INTO `role` (`name`) VALUES
('Manager'), ('Staff'), ('Chef');

-- Insert Users
INSERT INTO `user` (`name`, `email`, `password`, `phone`, `role_id`, `is_active`, `created_at`, `last_login`) VALUES
('Tạ Triết', 'tatriet_tony@1zulieu.com', 'hashed_pw_1', '0901234567', 1, 1, '2024-01-10 09:00:00', '2024-03-27 10:30:00'),
('Ngọc Quỳnh', 'quinnkiu@gmail.com', 'hashed_pw_2', '0907654321', 2, 1, '2024-01-15 11:00:00', '2024-03-26 14:45:00'),
('Thành Tiến', 'thanhtien.z8436@gmail.com', 'hashed_pw_3', '0902444888', 3, 1, '2024-01-15 11:05:00', '2024-03-26 14:50:00'),
('Văn A', 'vana@gmail.com', 'hashed_pw_4', '0903334444', 2, 1,'2024-02-01 08:00:00', '2024-03-26 09:30:00'),
('Văn B', 'vabb@gmail.com', 'hashed_pw_5', '0909876543', 2, 1, '2024-02-10 10:00:00', '2024-03-27 16:20:00'),
('Tâm Chef', 'tamchef@gmail.com', 'hashed_pw_6', '0901112222', 3, 1,'2024-02-15 09:00:00', '2024-03-27 17:45:00'),
('Vũ Chef', 'vustaff@gmail.com', 'hashed_pw_7', '0909998887', 3, 1, '2024-02-20 11:30:00', '2024-03-27 09:15:00');

-- Insert Categories
INSERT INTO `category` (`name`) VALUES
('Khai vị'),
('Rau củ'),
('Cá - Tôm - Cua'),
('Mực - Nghêu - Sò - Ốc'),
('Thức uống & Tráng miệng');

-- Insert Dishes
-- Category 1: Khai vị (ID: 1)
INSERT INTO `dish` (`name`, `description`, `price`, `category_id`, `image`, `able`) VALUES
('Gỏi cuốn tôm thịt', 'Gỏi cuốn tươi ngon với tôm, thịt, bún và rau sống, nước chấm đặc biệt', 59000, 1, 'dishes/goicuon.jpg', 1),
('Chả giò hải sản Hoàng Kim', 'Chả giò giòn rụm lớp vỏ vàng óng, nhân tôm, cua, mực và rau củ', 85000, 1, 'dishes/chagio_haisan.jpg', 1),
('Súp vi cá cua tóc tiên', 'Súp vi cá giả cua thượng hạng sánh mịn, bổ dưỡng với tóc tiên', 65000, 1, 'dishes/supcua.jpg', 1),
('Hàu sữa Pháp nướng mỡ hành', 'Hàu sữa tươi béo ngậy nướng thơm lừng với mỡ hành, đậu phộng', 120000, 1, 'dishes/hau_nuong_mohanh.jpg', 1),
('Chạo tôm bao mía', 'Tôm tươi quết nhuyễn bọc quanh thân mía, chiên vàng óng', 95000, 1, 'dishes/chaotom.jpg', 1),
('Salad rong biển trứng cua', 'Salad rong biển Nhật Bản giòn mát trộn với trứng cua và sốt mè rang', 75000, 1, 'dishes/salad_rongbien.jpg', 1);
-- Category 2: Rau củ (ID: 2)
INSERT INTO `dish` (`name`, `description`, `price`, `category_id`, `image`, `able`) VALUES
('Rau muống xào tỏi', 'Rau muống ngọn non tươi xanh xào thơm lừng với tỏi phi vàng', 39000, 2, 'dishes/raumuong_xao.jpg', 1),
('Salad Caesar hải sản', 'Salad xà lách romaine, crouton, parmesan, tôm và mực áp chảo', 115000, 2, 'dishes/salad_caesar.jpg', 1),
('Đậu hũ non sốt hải sản', 'Đậu hũ non mềm mịn sốt cùng tôm, mực và nấm đông cô đậm đà', 85000, 2, 'dishes/dauhunon_hs.jpg', 1),
('Bông thiên lý xào thịt bò Mỹ', 'Bông thiên lý ngọt mát xào nhanh cùng thịt bò Mỹ mềm thơm', 125000, 2, 'dishes/thienly_xao_bo.jpg', 1),
('Cải thìa baby sốt dầu hào nấm', 'Cải thìa non xanh mướt sốt dầu hào cùng nấm hải sản', 65000, 2, 'dishes/caithia_nam.jpg', 1),
('Ngọn su su xào tôm tươi', 'Ngọn su su Đà Lạt giòn ngọt xào cùng tôm đất tươi', 80000, 2, 'dishes/susu_xao_tom.jpg', 1);
-- Category 3: Cá - Tôm - Cua (ID: 3)
INSERT INTO `dish` (`name`, `description`, `price`, `category_id`, `image`, `able`) VALUES
('Cá chẽm sốt chanh dây', 'Phi lê cá chẽm tươi áp chảo da giòn, sốt chanh dây chua ngọt thanh mát', 210000, 3, 'dishes/cachem_chanhday.jpg', 1),
('Tôm sú hấp nước dừa xiêm', 'Tôm sú tươi sống size lớn hấp trong nước dừa xiêm Bến Tre ngọt lịm', 280000, 3, 'dishes/tomsu_hapdua.jpg', 1),
('Cua thịt Cà Mau rang muối Hồng Kông', 'Cua thịt Cà Mau chắc ngọt (size 500g+) rang muối ớt kiểu Hồng Kông', 650000, 3, 'dishes/cua_rang_muoi.jpg', 1),
('Cá hồi Na Uy áp chảo sốt bơ tỏi', 'Fillet cá hồi Na Uy béo ngậy áp chảo vàng đều, sốt bơ tỏi thơm lừng', 295000, 3, 'dishes/cahoi_apchao.jpeg', 1),
('Tôm càng xanh nướng muối ớt', 'Tôm càng xanh tươi sống size lớn nướng than hồng với muối ớt cay nồng', 450000, 3, 'dishes/tomcang_nuong.jpg', 1),
('Lẩu riêu cua bắp bò sườn sụn', 'Nồi lẩu riêu cua đồng đậm đà ăn kèm bắp bò Mỹ, sườn sụn non và rau', 380000, 3, 'dishes/lau_rieu_cua.jpeg', 1);
-- Category 4: Mực - Nghêu - Sò - Ốc (ID: 4)
INSERT INTO `dish` (`name`, `description`, `price`, `category_id`, `image`, `able`) VALUES
('Mực ống nhồi thịt chiên giòn', 'Mực ống tươi nhồi thịt heo băm, nấm mèo, miến, chiên vàng giòn', 195000, 4, 'dishes/muc_nhoi_thit.jpg', 1),
('Nghêu hai cồi hấp Thái', 'Nghêu hai cồi tươi mập hấp với lá chanh, sả, ớt kiểu Thái chua cay', 110000, 4, 'dishes/ngheu_hap_thai.png', 1),
('Sò huyết loại 1 rang me', 'Sò huyết tươi sống loại lớn rang với nước sốt me chua ngọt đậm đà', 130000, 4, 'dishes/sohuyet.jpg', 1),
('Bạch tuộc baby nướng sa tế cay', 'Bạch tuộc sữa tươi giòn sần sật nướng than hồng với sốt sa tế cay', 175000, 4, 'dishes/bachtuot_nuong.jpg', 1),
('Sò điệp Nhật nướng phô mai', 'Cồi sò điệp Nhật Bản tươi ngon nướng cùng sốt phô mai béo ngậy', 220000, 4, 'dishes/sodiep_nuong.jpg', 1),
('Ốc hương thiên nhiên cháy tỏi', 'Ốc hương tươi sống size lớn cháy tỏi thơm nức, đậm đà', 350000, 4, 'dishes/ochuong.jpg', 1);
-- Category 5: Thức uống & Tráng miệng (ID: 5)
INSERT INTO `dish` (`name`, `description`, `price`, `category_id`, `image`, `able`) VALUES
('Nước ép cam tươi nguyên chất', 'Nước cam sành vắt tại chỗ, không thêm đường, đá viên riêng', 45000, 5, 'dishes/nuoccam.jpg', 1),
('Trà đào cam sả giải nhiệt', 'Trà đen pha cùng đào ngâm, cam vàng và sả cây tươi mát', 55000, 5, 'dishes/tradaocamsa.jpg', 1),
('Bia Heineken Silver (lon)', 'Bia Heineken Silver lon 330ml ướp lạnh', 40000, 5, 'dishes/bia_ken.jpg', 1),
('Nước suối Lavie 500ml', 'Nước khoáng thiên nhiên Lavie chai 500ml', 20000, 5, 'dishes/nuocsuoi.jpg', 1),
('Chè khúc bạch hạnh nhân', 'Chè khúc bạch mềm mịn từ sữa tươi, hạnh nhân, nhãn nhục', 40000, 5, 'dishes/chekhucbach.jpg', 1),
('Panna Cotta chanh dây', 'Panna Cotta kiểu Ý béo ngậy, mềm mượt với sốt chanh dây chua ngọt', 50000, 5, 'dishes/pannacotta.png', 1);

-- Insert Shifts
INSERT INTO `shift` (`time_start`, `time_end`) VALUES
('2024-04-01 08:00:00', '2024-04-01 16:00:00'),
('2024-04-01 16:00:00', '2024-04-01 23:00:00'),
('2024-04-02 08:00:00', '2024-04-02 16:00:00'),
('2024-04-02 16:00:00', '2024-04-02 23:00:00');

-- Insert Tables
INSERT INTO `table` (`table_number`, `curr_order_session_id`) VALUES
(1, NULL), (2, NULL), (3, NULL),
(4, NULL), (5, NULL), (6, NULL);

-- Sample Order Process --

-- Order 1 (Table 1, Session 1, In Progress)
INSERT INTO `order_session` (`shift_id`, `created_at`, `status`) VALUES
(1, '2024-04-01 10:30:00', 'In Progress');
SET @session1_id = LAST_INSERT_ID();
INSERT INTO `order` (`order_session_id`, `created_at`) VALUES (@session1_id, NOW());
SET @order1_id = LAST_INSERT_ID();
UPDATE `table` SET `curr_order_session_id` = @session1_id WHERE `table_number` = 1;
-- Order 1 Details
INSERT INTO `order_detail` (`order_id`, `dish_id`, `quantity`, `price`, `status`, `note`) VALUES
(@order1_id, 2, 1, 85000, 'Served', NULL),         -- Chả giò hải sản Hoàng Kim (Dish ID: 2)
(@order1_id, 14, 1, 280000, 'Cooking', 'Hấp kỹ'),    -- Tôm sú hấp nước dừa xiêm (Dish ID: 14)
(@order1_id, 7, 1, 39000, 'Ordered', NULL),        -- Rau muống xào tỏi (Dish ID: 7)
(@order1_id, 27, 2, 40000, 'Served', 'Lạnh');      -- Bia Heineken Silver (Dish ID: 27)
-- Order 1 Log Entries
INSERT INTO `order_log` (`order_id`, `message`, `created_at`) VALUES
(@order1_id, 'Order created for session.', '2024-04-01 10:30:05'),
(@order1_id, 'Dish ID 2 status changed to Served.', '2024-04-01 10:40:00'),
(@order1_id, 'Dish ID 14 status changed to Cooking.', '2024-04-01 10:31:00'),
(@order1_id, 'Dish ID 7 status changed to Ordered.', '2024-04-01 10:30:15'),
(@order1_id, 'Dish ID 27 status changed to Served.', '2024-04-01 10:35:00');


-- Order 2 (Table 2, Session 2, In Progress)
INSERT INTO `order_session` (`shift_id`, `created_at`, `status`) VALUES
(1, '2024-04-01 11:15:00', 'In Progress');
SET @session2_id = LAST_INSERT_ID();
INSERT INTO `order` (`order_session_id`, `created_at`) VALUES (@session2_id, NOW());
SET @order2_id = LAST_INSERT_ID();
UPDATE `table` SET `curr_order_session_id` = @session2_id WHERE `table_number` = 2;
-- Order 2 Details
INSERT INTO `order_detail` (`order_id`, `dish_id`, `quantity`, `price`, `status`, `note`) VALUES
(@order2_id, 4, 2, 120000, 'Served', 'Thêm mỡ hành'), -- Hàu sữa Pháp nướng mỡ hành (Dish ID: 4)
(@order2_id, 21, 1, 130000, 'Cooking', 'Ít cay'),      -- Sò huyết loại 1 rang me (Dish ID: 21)
(@order2_id, 25, 1, 45000, 'Served', 'Không đá');     -- Nước ép cam tươi (Dish ID: 25)
-- Order 2 Log Entries
INSERT INTO `order_log` (`order_id`, `message`, `created_at`) VALUES
(@order2_id, 'Order created for session.', '2024-04-01 11:15:05'),
(@order2_id, 'Dish ID 4 status changed to Served.', '2024-04-01 11:35:00'),
(@order2_id, 'Dish ID 21 status changed to Cooking.', '2024-04-01 11:16:00'),
(@order2_id, 'Dish ID 25 status changed to Served.', '2024-04-01 11:20:00');


-- Order 3 (Table 3 initially, Session 3, Completed and Paid)
INSERT INTO `order_session` (`shift_id`, `created_at`, `status`, `is_paid`, `payment_time`) VALUES
(2, '2024-04-01 18:00:00', 'Completed', 1, '2024-04-01 19:30:00');
SET @session3_id = LAST_INSERT_ID();
INSERT INTO `order` (`order_session_id`, `created_at`) VALUES (@session3_id, '2024-04-01 18:00:00');
SET @order3_id = LAST_INSERT_ID();
-- Assume table 3 was occupied by session 3, but now it's free (curr_order_session_id is NULL or updated later)
-- Order 3 Details
INSERT INTO `order_detail` (`order_id`, `dish_id`, `quantity`, `price`, `status`, `note`) VALUES
(@order3_id, 18, 1, 380000, 'Served', 'Thêm rau'),       -- Lẩu riêu cua (Dish ID: 18)
(@order3_id, 22, 1, 175000, 'Served', NULL),         -- Bạch tuộc baby nướng (Dish ID: 22)
(@order3_id, 30, 2, 50000, 'Served', NULL);          -- Panna Cotta (Dish ID: 30)
-- Order 3 Log Entries
INSERT INTO `order_log` (`order_id`, `message`, `created_at`) VALUES
(@order3_id, 'Order created for session.', '2024-04-01 18:00:05'),
(@order3_id, 'All items served.', '2024-04-01 18:45:00'),
(@order3_id, 'Order marked as Completed and Paid.', '2024-04-01 19:30:00');


-- Insert Notifications
INSERT INTO `notification` (`role_id`, `user_id`, `message`, `status`, `notification_type`, `related_id`, `created_at`) VALUES
(3, NULL, CONCAT('Order #', @order1_id, ': Yêu cầu món Tôm sú hấp nước dừa (ID: 14)'), 0, 'Food Processing', @order1_id, '2024-04-01 10:31:00'), -- To Chefs
(2, NULL, 'Bàn 2 yêu cầu phục vụ', 0, 'Service', 2, '2024-04-01 11:20:00'), -- To Staff, related to Table ID 2
(1, NULL, CONCAT('Order #', @order3_id, ' đã thanh toán thành công'), 1, 'Payment', @order3_id, '2024-04-01 19:31:00'), -- To Manager
(NULL, 2, CONCAT('Món Hàu sữa Pháp (ID: 4) của Order #', @order2_id, ' (Bàn 2) đã sẵn sàng'), 0, 'Food Ready', @order2_id, '2024-04-01 11:35:00'); -- To specific user Ngoc Quynh (ID 2)
