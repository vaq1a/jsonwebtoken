const userService = require("../services/userService");

class userController {
    async registration(req, res) {
        try {
            const {username, password} = req.body;

            const data = await userService.registration(username, password);

            res.cookie('refreshToken', data.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })
                .status(200).json(data);
        } catch (e) {
            console.error(e);
        }
    }

    async login(req, res) {
        const {username, password} = req.body;

        const data = await userService.login(username, password);

        res.cookie('refreshToken', data.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })

        res.status(200).json(data);
    }

    async logout(req, res) {
        try {
            const {refreshToken} = req.cookies;

            const deleteDocument = await userService.logout(refreshToken);

            res.clearCookie('refreshToken').status(200).json({"message": "success logout", "deleteDocument": deleteDocument});
        } catch (e) {
            console.error(e);
        }
    }

    async refresh(req, res) {
        try {
            const {refreshToken} = req.cookies;

            const user = await userService.refresh(refreshToken);

            res.status(200)
                .cookie('refreshToken', user.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })
                .json({"message": "tokens update success", "data": user});
        } catch (e) {
            console.error(e);
        }
    }
}

module.exports = new userController();