CREATE DATABASE seafood_restaurant;
USE seafood_restaurant;

DROP TABLE IF EXISTS `user`;
DROP TABLE IF EXISTS `notification`;
DROP TABLE IF EXISTS `role`;
DROP TABLE IF EXISTS `dish`;
DROP TABLE IF EXISTS `category`;
DROP TABLE IF EXISTS `order`;
DROP TABLE IF EXISTS `order_detail`;
DROP TABLE IF EXISTS `order_session`;
DROP TABLE IF EXISTS `order_log`;
DROP TABLE IF EXISTS `table`;
DROP TABLE IF EXISTS `shift`;

-- Create Role table
CREATE TABLE `role` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL
);

-- Create User table
CREATE TABLE `user` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) UNIQUE NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `phone` VARCHAR(20),
    `role_id` BIGINT,
    `is_active` BIT NOT NULL DEFAULT 1,
    `created_at` DATETIME NOT NULL,
    FOREIGN KEY (`role_id`) REFERENCES `role`(`id`)
);

-- Create Notification table
CREATE TABLE `notification` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
    `role_id` BIGINT,
    `message` TEXT NOT NULL,
    `status` BIT NOT NULL DEFAULT 0,
    `notification_type` VARCHAR(50) NOT NULL,
    `created_at` DATETIME NOT NULL,
    FOREIGN KEY (`role_id`) REFERENCES `role`(`id`)
);

-- Create Category table
CREATE TABLE `category` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL
);

-- Create Dish table
CREATE TABLE `dish` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT,
    `price` DECIMAL(10,2) NOT NULL,
    `category_id` BIGINT,
    `image` VARCHAR(255),
    `able` BIT NOT NULL DEFAULT 1,
    FOREIGN KEY (`category_id`) REFERENCES `category`(`id`)
);

-- Create Shift table
CREATE TABLE `shift` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
    `time_start` DATETIME NOT NULL,
    `time_end` DATETIME NOT NULL
);

-- Create Order_Log table
CREATE TABLE `order_log` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
    `message` VARCHAR(255)
);

-- Create Order table
CREATE TABLE `order` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
    `created_at` DATETIME NOT NULL,
    `order_log_id` BIGINT,
    FOREIGN KEY (`order_log_id`) REFERENCES `order_log`(`id`)
);

-- Create Order_Session table
CREATE TABLE `order_session` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
    `order_id` BIGINT,
    `shift_id` BIGINT,
    `created_at` DATETIME NOT NULL,
    `total_price` DECIMAL(10,2) NOT NULL DEFAULT 0,
    `is_paid` BIT NOT NULL DEFAULT 0,
    `status` VARCHAR(255) DEFAULT 'Pending',
    `payment_time` DATETIME,
    FOREIGN KEY (`order_id`) REFERENCES `order`(`id`),
    FOREIGN KEY (`shift_id`) REFERENCES `shift`(`id`)
);

-- Add order_session_id reference back to order table
ALTER TABLE `order` ADD COLUMN `order_session_id` BIGINT;
ALTER TABLE `order` ADD CONSTRAINT `fk_order_session` FOREIGN KEY (`order_session_id`) REFERENCES `order_session`(`id`);

-- Create Table table
CREATE TABLE `table` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
    `table_type` VARCHAR(100) NOT NULL,
    `status` VARCHAR(50) NOT NULL DEFAULT 'Available',
    `capacity` INT NOT NULL,
    `curr_order_session_id` BIGINT,
    FOREIGN KEY (`curr_order_session_id`) REFERENCES `order_session`(`id`)
);

-- Create Order_Detail table
CREATE TABLE `order_detail` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
    `order_id` BIGINT,
    `dish_id` BIGINT,
    `quantity` INT NOT NULL,
    `price` DECIMAL(10,2) NOT NULL,
    `status` VARCHAR(255) DEFAULT 'Ordered',
    `note` TEXT,
    FOREIGN KEY (`order_id`) REFERENCES `order`(`id`),
    FOREIGN KEY (`dish_id`) REFERENCES `dish`(`id`)
);

-- Insert sample data for Role
INSERT INTO `role` (`name`) VALUES
('Manager'),
('Staff'),
('Chef');

-- Insert sample data for User
INSERT INTO `user` (`name`, `email`, `password`, `phone`, `role_id`, `is_active`, `created_at`) VALUES
('Tạ Triết', 'tatriet_tony@1zulieu.com', '123', '0901234567', 1, 1, '2025-03-01 09:15:00'),
('Ngọc Quỳnh', 'quinnkiu@gmail.com', '123', '0907654321', 2, 1, '2025-03-05 11:20:00'),
('Thành Tiến', 'thanhtien.z8436@gmail.com', '123', '0902444888', 3, 1, '2025-03-05 11:20:00'),
('Văn A', 'vana@gmail.com', '123', '0903334444', 2, 1,'2025-03-10 08:45:00'),
('Văn B', 'vabb@gmail.com', '123', '0909876543', 2, 1, '2025-03-12 10:15:00'),
('Tâm Chef', 'tamchef@gmail.com', '123', '0901112222', 3, 1,'2025-03-15 09:00:00'),
('Vũ Chef', 'vustaff@gmail.com', '123', '0909998887', 3, 1, '2025-03-18 11:30:00');

-- Insert sample data for Category
INSERT INTO `category` (`name`) VALUES
('Tôm'),
('Cá'),
('Mực'),
('Nghêu và Sò'),
('Sashimi'),
('Cua'),
('Rau Củ Tổng Hợp'),
('Đồ Uống'),
('Món Khai Vị');

-- Insert sample data for Dish
INSERT INTO `dish` (`name`, `description`, `price`, `category_id`, `image`, `able`) VALUES
('Tôm Hùm Nướng', 'Tôm hùm tươi ngon nướng than hồng', 599000, 1, 'dish1.jpg', 1),
('Cá Hồi Áp Chảo', 'Fillet cá hồi Nauy áp chảo với sốt chanh', 189000, 2, 'dish2.jpg', 1),
('Mực Chiên Giòn', 'Mực tươi chiên giòn, làm nóng ngay', 129000, 3, 'dish3.jpg', 1),
('Nghêu Hấp Sả', 'Nghêu tươi hấp với sả thơm ngon', 99000, 4, 'dish4.jpg', 0),
('Set Sashimi', 'Khay sashimi cá hồi, cá ngừ, bào ngư', 249000, 5, 'dish5.jpg', 1),
('Cua Rang Me', 'Cua biển rang với sốt me chua ngọt', 349000, 6, 'dish6.jpg', 1),
('Salad Rong Biển', 'Rong biển trộn dầu mè Nhật Bản', 79000, 7, 'dish7.jpg', 1),
('Sò Điệp Nướng Mỡ Hành', 'Sò điệp tươi nướng với mỡ hành', 169000, 4, 'dish8.jpg', 1),
('Cá Tuyết Sốt Teriyaki', 'Cá tuyết nhập khẩu với sốt Teriyaki', 259000, 2, 'dish9.jpg', 1),
('Cocktail Biển Xanh', 'Cocktail với rượu rum và blue curaçao', 89000, 8, 'dish10.jpg', 1),
('Súp Hải Sản', 'Súp hải sản với tôm, mực và nghêu', 69000, 9, 'dish11.jpg', 1),
('Tôm Sú Hấp Bia', 'Tôm sú size lớn hấp với bia', 189000, 1, 'dish12.jpg', 1);

-- Insert sample data for Shift
INSERT INTO `shift` (`time_start`, `time_end`) VALUES
('2025-03-26 06:00:00', '2025-03-26 15:59:59'),
('2025-03-26 16:00:00', '2025-03-26 22:00:00'),
('2025-03-27 06:00:00', '2025-03-27 15:59:59'),
('2025-03-27 16:00:00', '2025-03-27 22:00:00'),
('2025-03-28 06:00:00', '2025-03-28 15:59:59'),
('2025-03-28 16:00:00', '2025-03-28 22:00:00');

-- Insert sample data for Order_Log
INSERT INTO `order_log` (`message`) VALUES
('Bàn #1 đã gọi món "Nghêu Hấp Sả".'),
('Bàn #2 đã huỷ gọi món "Cá Hồi Áp Chảo".'),
('Bàn #3 đã yêu cầu thêm "Sốt chanh".'),
('Bàn #1 đã thanh toán.'),
('Bàn #5 đã gọi món "Tôm Hùm Nướng".'),
('Bàn #4 đã yêu cầu gộp bill.'),
('Bàn #2 đã gọi thêm "Cocktail Biển Xanh".'),
('Bàn #6 đã đặt trước cho 20:00.'),
('Bàn #3 yêu cầu hoá đơn.'),
('Bàn #7 đã huỷ đặt bàn.');

-- Insert sample data for Order and Order_Session (need to insert these together due to circular reference)
-- First create orders
INSERT INTO `order` (`created_at`, `order_log_id`, `order_session_id`) VALUES
('2025-03-26 11:30:00', 1, NULL),
('2025-03-26 12:15:00', 2, NULL),
('2025-03-26 18:45:00', 3, NULL),
('2025-03-27 13:20:00', 5, NULL),
('2025-03-27 19:30:00', 7, NULL),
('2025-03-27 20:15:00', 9, NULL);

-- Now create order sessions
INSERT INTO `order_session` (`order_id`, `shift_id`, `created_at`, `total_price`, `is_paid`, `status`, `payment_time`) VALUES
(1, 1, '2025-03-26 11:30:00', 198000, 1, 'Completed', '2025-03-26 12:45:00'),
(2, 1, '2025-03-26 12:15:00', 189000, 1, 'Completed', '2025-03-26 13:30:00'),
(3, 2, '2025-03-26 18:45:00', 378000, 1, 'Completed', '2025-03-26 20:00:00'),
(4, 3, '2025-03-27 13:20:00', 599000, 0, 'In Progress', NULL),
(5, 4, '2025-03-27 19:30:00', 89000, 0, 'In Progress', NULL),
(6, 4, '2025-03-27 20:15:00', 349000, 0, 'In Progress', NULL);

-- Update orders with order_session_id
UPDATE `order` SET `order_session_id` = 1 WHERE `id` = 1;
UPDATE `order` SET `order_session_id` = 2 WHERE `id` = 2;
UPDATE `order` SET `order_session_id` = 3 WHERE `id` = 3;
UPDATE `order` SET `order_session_id` = 4 WHERE `id` = 4;
UPDATE `order` SET `order_session_id` = 5 WHERE `id` = 5;
UPDATE `order` SET `order_session_id` = 6 WHERE `id` = 6;

-- Insert sample data for Table
INSERT INTO `table` (`table_type`, `status`, `capacity`, `curr_order_session_id`) VALUES
('Bàn Đơn 1', 'Occupied', 1, 4),
('Bàn Đôi 1', 'Occupied', 2, 5),
('Bàn Vip 1', 'Occupied', 6, 6),
('Bàn Đơn 2', 'Available', 1, NULL),
('Bàn Đôi 2', 'Available', 2, NULL),
('Bàn Đôi 3', 'Available', 2, NULL),
('Bàn Vip 2', 'Available', 8, NULL),
('Bàn Gia Đình 1', 'Available', 4, NULL),
('Bàn Gia Đình 2', 'Available', 4, NULL),
('Bàn Gia Đình 3', 'Available', 4, NULL);

-- Insert sample data for Order_Detail
INSERT INTO `order_detail` (`order_id`, `dish_id`, `quantity`, `price`, `status`, `note`) VALUES
(1, 4, 2, 99000, 'Finished', 'Thêm chanh'),
(1, 7, 1, 79000, 'Finished', NULL),
(2, 2, 1, 189000, 'Cancelled', 'Không tiêu'),
(3, 2, 2, 189000, 'Finished', NULL),
(3, 11, 1, 69000, 'Finished', 'Không hành'),
(4, 1, 1, 599000, 'Cooking', 'Nướng chín kỹ'),
(5, 10, 1, 89000, 'Ready', 'Ít đá'),
(6, 6, 1, 349000, 'Ordered', NULL);

-- Insert sample data for Notification
INSERT INTO `notification` (`role_id`, `message`, `status`, `notification_type`, `created_at`) VALUES
(1, 'Đơn hàng #1 đã được xác nhận', 1, 'Order', '2025-03-26 11:35:00'),
(3, 'Món ăn "Tôm Hùm Nướng" đang được yêu cầu', 0, 'Food Processing', '2025-03-27 13:25:00'),
(1, 'Bàn #2 yêu cầu gọi nhân viên', 0, 'Service', '2025-03-27 19:35:00'),
(1, 'Có khách hàng VIP đến', 1, 'VIP', '2025-03-27 20:10:00'),
(3, 'Món "Cua Rang Me" cần được ưu tiên', 0, 'Priority', '2025-03-27 20:20:00'),
(1, 'Bàn #1 yêu cầu thanh toán', 0, 'Payment', '2025-03-27 14:45:00'),
(2, 'Đơn đặt bàn mới cho tối nay', 1, 'Reservation', '2025-03-27 10:30:00'),
(2, 'Bàn #3 cần thêm đồ uống', 0, 'Service', '2025-03-27 20:40:00');
