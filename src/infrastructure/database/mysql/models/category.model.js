import { DataTypes } from "sequelize";
import sequelize from "../connection.js";

const CategoryModel = sequelize.define("Category", {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    userId: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, { timestamps: true });

export default CategoryModel;