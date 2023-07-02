import jwt from 'jsonwebtoken';
import User from '../models/User';
import authConfig from '../../config/auth';

class SessionController {
    async store(req, res) {
        const { email, passoword } = req.body;

        // Verificando se esse email existe
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ error: 'Usuario não existe.' });
        }

        // Verificar se a senha não bate
        if (!(await user.checkPassword(passoword))) {
            return res.status(401).json({ error: 'Senha incorreta.' });
        }

        const { id, name } = user;

        return res.json({
            user: {
                id,
                name,
                email,
            },
            token: jwt.sign({ id }, authConfig.secret, {
                expiresIn: authConfig.expiresIn,
            }),
        });
    }
}

export default new SessionController();
