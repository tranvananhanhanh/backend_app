const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req, res, next) {
    // Kiểm tra xem có session.authorization không
    if (req.session.authorization) {
        let token = req.session.authorization['accessToken']; // Lấy Access Token từ session

        // Xác minh JWT token để xác thực khách hàng
        jwt.verify(token, "access", (err, customer) => {
            if (!err) {
                req.customer = customer; // Đặt thông tin khách hàng đã xác thực vào đối tượng req
                next(); // Tiếp tục tới middleware tiếp theo
            } else {
                return res.status(403).json({ message: "Customer not authenticated" }); // Trả lỗi nếu xác thực token thất bại
            }
        });
    } else {
        return res.status(403).json({ message: "Customer not logged in" }); // Trả lỗi nếu không có access token trong session
    }
});




const PORT =4900;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

// Start the server and log the port number
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});