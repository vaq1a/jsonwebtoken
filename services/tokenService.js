const jwt = require("jsonwebtoken");
const tokenModel = require("../models/tokenModel");

class tokenService {
    async generateTokens(payload) {
        const token = jwt.sign(payload, process.env.SECRET_KEY_TOKEN, { expiresIn: '15m' });
        const refreshToken = jwt.sign(payload, process.env.SECRET_KEY_REFRESH_TOKEN, { expiresIn: '30d' });

        return {
            token,
            refreshToken,

        }
    }

    async saveRefreshToken(userId, refreshToken) {
        const data = await tokenModel.findOne({ userId });

        if (data) {
            data.refreshToken = refreshToken;
            data.save();
            return;
        }

        const payload = {
            userId,
            refreshToken,

        }

        const newToken = await tokenModel.create(payload);

        return newToken;
    }

    async deleteRefreshToken(refreshToken) {
        const findDocument = await tokenModel.findOne({refreshToken});

        if(!findDocument) return console.error("token isn't found");

        await tokenModel.deleteOne({refreshToken});

        return findDocument;
    }

    async verifyRefreshToken(refreshToken) {
        try {
            const decoded = jwt.verify(refreshToken, process.env.SECRET_KEY_REFRESH_TOKEN);

            return decoded;
        } catch (e) {
            console.error(e);
        }
    }

    async verifyAccessToken(accesToken) {
        try {
            const decoded = jwt.verify(accesToken, process.env.SECRET_KEY_TOKEN);

            return decoded;
        } catch (e) {
            console.error(e);
        }
    }

    async findTokenInBD(refreshToken) {
        try {
            const findDocument = await tokenModel.findOne({refreshToken});

            return findDocument;
        } catch (e) {
            console.error(e);
        }
    }
}

module.exports = new tokenService();