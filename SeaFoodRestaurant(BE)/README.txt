CẤU HÌNH DOCKER:
1/ Tải image "mysql:latest" từ dockerhub về.
2/ Build và run container: mở terminal chạy lệnh "docker run --name seafood-restaurant -p 3306:3306 -e MYSQL_ROOT_PASSWORD=root -d mysql:latest".
3/ Từ những lần sau chỉ cần mở docker -> container -> nhấn run.
-------------------------------------------------------------------------------------------------------------
CONNECT MYSQL VỚI DBEAVER:
1/ ctrl+shift+n -> mysql
2/ serverhost: localhost; port: 3306; username: root; password: root
3/ Mở tab Driver properties -> chuyển thuộc tính allowPublicKeyRetrieval thành TRUE -> finish.
4/ Excute file Script.sql.
-------------------------------------------------------------------------------------------------------------
CẤU HÌNH SPRING:
1/ File -> setting -> plugin -> đảm bảo "Lombok" được bật.
2/ File -> setting -> annotation processors -> enable.
3/ Vào file pom.xml -> click phải -> maven -> reload project.