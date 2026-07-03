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
        isVerified: {
            type: Boolean,
            default: false,
        },
        verificationOTPHash: {
            type: String,
        },
        verificationOTPExpiry: {
            type: Date,
        },
        verificationResendCount: {
            type: Number,
            default: 0,
        },
        lastVerificationSentAt: {
            type: Date,
        },
        resetOTPHash: {
            type: String,
        },
        resetOTPExpiry: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model('User', userSchema);