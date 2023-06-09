import { Schema, model } from 'mongoose';

const categorySchema = Schema({
    name: {
        type: String,
        required: [true, 'Name is require'],
        unique: true,
    },
    status: {
        type: Boolean,
        default: true,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
})

categorySchema.methods.toJSON = function() {
    const { __v, status, ...category } = this.toObject();
    return category;
}

export const Category = model('Category', categorySchema);