import jwt from 'jsonwebtoken';

export const generateJWT = ( uid = '' ) => {

    return new Promise((resolve, reject) => {

        const payload = { uid };

        jwt.sign( payload, process.env.SECRETKEY, {
            expiresIn: '4h'
        }, (err, token) => {
            if(err){
                console.log(err);
                reject('It could not generate the token');
            } else {
                resolve(token);
            }
        });

    });

}