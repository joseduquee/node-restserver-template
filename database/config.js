import mongoose from 'mongoose';

export const dbConnection = async() =>{
    debugger;
    try {
        await mongoose.connect( process.env.MONGODB_ATLAS, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })

        console.log('BBDD running');
    } catch (error) {
        throw new Error('Error initializing the database');
    }

}