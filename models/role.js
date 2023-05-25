import { Schema, model } from 'mongoose';

const RoleSchema = Schema({
    role: {
        type: String,
        required: [true, 'Role is require']
    }
});

export const Role = model('Roles', RoleSchema);