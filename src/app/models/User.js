import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

class User extends Model {
    static init(sequelize) {
        super.init(
            {
                name: Sequelize.STRING,
                email: Sequelize.STRING,
                passoword: Sequelize.VIRTUAL,
                passoword_hash: Sequelize.STRING,
            },
            {
                sequelize,
            }
        );

        this.addHook('beforeSave', async (user) => {
            if (user.passoword) {
                user.passoword_hash = await bcrypt.hash(user.passoword, 8);
            }
        });

        return this;
    }

    checkPassword(passoword) {
        return bcrypt.compare(passoword, this.passoword_hash);
    }
}

export default User;
