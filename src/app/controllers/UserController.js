import * as Yup from 'yup';
import User from '../models/User';

class UserController {
    async store(req, res) {
        const schema = Yup.object().shape({
            name: Yup.string().required(),
            email: Yup.string().email().required(),
            passoword: Yup.string().required().min(6),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Falha na verificação.' });
        }

        const userExists = await User.findOne({
            where: { email: req.body.email },
        });

        if (userExists) {
            return res.status(400).json({ error: 'Usuario já existe.' });
        }
        const { id, name, email } = await User.create(req.body);

        return res.json({
            id,
            name,
            email,
        });
    }

    async update(req, res) {
        const schema = Yup.object().shape({
            name: Yup.string(),
            email: Yup.string().email(),
            oldPassoword: Yup.string().min(6),
            passoword: Yup.string()
                .min(6)
                .when('oldPassoword', (oldPassoword, field) =>
                    oldPassoword ? field.required() : field
                ),
            confirmPassoword: Yup.string().when(
                'passoword',
                (passoword, field) =>
                    passoword
                        ? field.required().oneOf([Yup.ref('passoword')])
                        : field
            ),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Falha na verificação.' });
        }

        const { email, oldPassoword } = req.body;

        const user = await User.findByPk(req.userId);

        if (email !== user.email) {
            const userExists = await User.findOne({
                where: { email },
            });

            if (userExists) {
                return res.status(400).json({ error: 'Usuario já existe.' });
            }
        }

        if (oldPassoword && !(await user.checkPassword(oldPassoword))) {
            return res.status(401).json({ error: 'Senha incorreta.' });
        }

        const { id, name } = await user.update(req.body);
        return res.json({
            id,
            name,
            email,
        });
    }
}

export default new UserController();
