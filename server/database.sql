-- 使用数据库
USE wallpaper;

-- 创建壁纸表
CREATE TABLE IF NOT EXISTS wallpapers (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  url VARCHAR(500) NOT NULL,
  thumbnail VARCHAR(500) NOT NULL,
  width INT NOT NULL,
  height INT NOT NULL,
  category_id INT DEFAULT NULL,
  views INT DEFAULT 0,
  downloads INT DEFAULT 0,
  likes INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 插入测试数据
INSERT INTO wallpapers (title, url, thumbnail, width, height, category_id) VALUES
('山水风景', 'https://example.com/wallpaper1.jpg', 'https://example.com/thumbnail1.jpg', 1920, 1080, 1),
('城市夜景', 'https://example.com/wallpaper2.jpg', 'https://example.com/thumbnail2.jpg', 1920, 1080, 1),
('花卉植物', 'https://example.com/wallpaper3.jpg', 'https://example.com/thumbnail3.jpg', 1920, 1080, 2),
('动物萌宠', 'https://example.com/wallpaper4.jpg', 'https://example.com/thumbnail4.jpg', 1920, 1080, 2),
('抽象艺术', 'https://example.com/wallpaper5.jpg', 'https://example.com/thumbnail5.jpg', 1920, 1080, 3); 