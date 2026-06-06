import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
    {
        tenantId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Tenant',
            required: true,
        },
        
        name: {
            type: String,
            required: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
        },

        password: {
            type: String,
            required: true,
        },

        role: {
            type: String,
            default: 'OWNER',
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model('User', userSchema);