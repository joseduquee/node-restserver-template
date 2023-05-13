import mongoose from 'mongoose';

export const dbConnection = async() =>{
    try {
        await mongoose.connect( process.env.MONGODB_ATLAS )

        console.log('BBDD running');
    } catch (error) {
        throw new Error('Error initializing the database');
    }

}