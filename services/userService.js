const userModel = require("../models/userModel");
const tokenService = require("../services/tokenService");
const bcrypt = require("bcrypt");
const UserDto = require("../dtos/user-dto");

class userService {
    async registration (username, password) {
        try {
            const candidat = await userModel.findOne({username});

            if(candidat) {
                console.error('Login busy');

                return;
            }

            const user = {
                username,
                password: bcrypt.hashSync(password, Number(process.env.BCRYPT_SALT))
            }

            const data = await userModel.create(user);

            const payload = new UserDto(data);

            const tokens = await tokenService.generateTokens({...payload});

            await tokenService.saveRefreshToken(data._id, tokens.refreshToken);

            return {
                ...tokens,
                user: data,
            }

        } catch (e) {
            console.error(e);
        }
    }

    async login (username, password) {
        try {
            const user = await userModel.findOne({username});

            if(!user) {
                console.error('Login not found')

                return;
            }

            if (bcrypt.compareSync(password, user.password)) {
                const payload = new UserDto(user);

                const tokens = await tokenService.generateTokens({...payload});

                await tokenService.saveRefreshToken(user._id, tokens.refreshToken);

                return {
                    ...tokens,
                    user,
                };
            } else {
                console.error("Password isn't right");

                return;
            }
        } catch (e) {
            console.error(e);
        }
    }

    async logout (refreshToken) {
        try {
            if (!refreshToken) return console.error("token isn't found");

            const deleteDocument = await tokenService.deleteRefreshToken(refreshToken);

            return deleteDocument;
        } catch (e) {
            console.error(e);
        }
    }

    async refresh(refreshToken) {
        try {
            if(!refreshToken) return console.error("Token empty");

            const dataWithVerify = await tokenService.verifyRefreshToken(refreshToken);

            const dataFromBD = await tokenService.findTokenInBD(refreshToken);

            if(!dataWithVerify || !dataFromBD) return console.error("Token does't verify or doesn't find in BD");

            const user = await userModel.findById(dataWithVerify.id);
            const userDto = new UserDto(user);

            const tokens = await tokenService.generateTokens({
                ...userDto,

            });

            await tokenService.saveRefreshToken(userDto.id, tokens.refreshToken);

            return {
                ...tokens,
                user,

            }

        } catch (e) {
            console.error(e);
        }
    }
}

module.exports = new userService();