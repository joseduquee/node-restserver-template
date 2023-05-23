import { response } from "express";
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
import { v4 as uuidv4 } from 'uuid';


export const uploadFile = (req, res = response) => {

    if (!req.files || Object.keys(req.files).length === 0) {
        res.status(400).json({ msg: 'No files were uploaded.'});
        return;
    }

    const { file } = req.files;
    const shortName = file.name.split('.');
    const extension = shortName[shortName.length - 1];

    //Validate extensions
    const allowedExtensions = ['png', 'jpg', 'jpeg', 'gif'];
    if(!allowedExtensions.includes(extension)){
        return res.status(400).json({
            msg: `Extension ${ extension } is not allow, allowed extensions; ${allowedExtensions}`,
        })
    }
    
    const fileNameTemp = uuidv4() + '.' + extension;
    const uploadPath = path.join( __dirname, '../uploads/', fileNameTemp );

    file.mv(uploadPath, (err) => {
        if (err) {
            return res.status(500).json({err});
        }

        res.json({ msg:'File uploaded to ' + uploadPath });
    });
}