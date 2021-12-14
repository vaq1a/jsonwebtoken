const {Schema, model} = require("mongoose");

const userSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

userSchema.method('toJSON', function() {
    var user = this.toObject();
    delete user.password;
    return user;
});

module.exports = model('User', userSchema);
