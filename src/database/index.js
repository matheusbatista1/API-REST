import Sequelize from 'sequelize';
import databaseConfig from '../config/database';

import User from '../app/models/User';
import Task from '../app/models/Tasks';

const models = [User, Task];

class Database {
    constructor() {
        this.init();
    }

    init() {
        // conexão do banco de dados com os Models
        this.connection = new Sequelize(databaseConfig);

        models
            .map((model) => model.init(this.connection))
            .map(
                (model) =>
                    model.associate && model.associate(this.connection.models)
            );
    }
}

export default new Database();
